import { Component, OnInit,TemplateRef } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable,of } from 'rxjs';
import {Router} from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DataSource, isDataSource } from '@angular/cdk/collections';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import {ConvertTimeZero} from './../lib/time_zero';
import * as sjcl from 'sjcl';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class MaintenanceComponent implements OnInit {

  public displayedColumns = ['name','editUser','editSchedule', 'delete'];
  public myform: FormGroup;
  public myform2: FormGroup;
  public engineer;
  public modalRef: BsModalRef;
  public user = {id:'',name:'',last_name : '', password:'', schedule_id:''};
  public showUserFrom = false;
  public showScheduleFrom = false;
  private convertTimeZone = new ConvertTimeZero();
  public submitted = false;

  public roles: any = [
    {value: 'admin', viewValue: 'Admin'},
    {value: 'user', viewValue: 'User'},
  ];
  public support: any = [
    {value: 'static', viewValue: 'Static'},
    {value: 'dynamic', viewValue: 'Dynamic'},
    {value: 'both', viewValue: 'Both'}
  ];
  public status: any = [
    {value: true, viewValue: 'Available'},
    {value: false, viewValue: 'Disable'},
  ];
  public timezone: any = [
    {value: "cat", viewValue: 'Central America Time Zone'},
    {value: "pt", viewValue: 'Pacific Time Zone'},
    {value: "ct", viewValue: 'Central Time Zone'},
    {value: "et", viewValue: 'Eastern Time Zone'},
    {value: "mt", viewValue: 'Mountain Time Zone'}
  ];

  constructor(private service: ApiService, private fb: FormBuilder, private router:Router,private modalService: BsModalService,
    private cookieService: CookieService) { }


  openModalDelete(template: TemplateRef<any>, user) {
    this.user.id = user._id;
    this.user.name = user.name;
    this.user.last_name = user.last_name;
    if(user.schedule_loaded[0]){
      this.user.schedule_id = user.schedule_loaded[0]._id;
      this.modalRef = this.modalService.show(template);

    }
    else{
      this.user.schedule_id = "1";
      this.modalRef = this.modalService.show(template);
    }
  }

  openModalUser(template: TemplateRef<any>, user) {
    this.user.id = user._id;
    this.user.name = user.name;
    this.user.last_name = user.last_name;
    this.user.password = user.password;
    this.fillUserForm(user);
    this.modalRef = this.modalService.show(template,{class: 'modal-lg'});
    this.showUserFrom = true;
  }

  openModalSchedule(template: TemplateRef<any>, user) {
    this.user.id = user._id;
    this.user.name = user.name;
    this.user.last_name = user.last_name;
    user.schedule_loaded[0] = this.convertTimeZone.convertFromTimeZero(user.schedule_loaded[0]);
    this.fillScheduleForm(user);
    this.modalRef = this.modalService.show(template,{class: 'modal-lg'});
    this.showScheduleFrom = true;
  }

  checkAdmin(session){
    if (session.role != 'admin'){
      this.router.navigate(['/home']);    
    }
    else{
      this.getEngineer()
    }
  }

  checkSessionId(){
    let cookie = this.cookieService.get('SessionId');
    if(!cookie){
      this.router.navigate(['/']);
    }
    else{
      this.service.getUserBySessionId().subscribe(response =>{
        if(response.status != 201) {
          this.router.navigate(['/home']);
        }
        else{
          let session = response.body;
          this.checkAdmin(session);
        }
      });
    }
  }

  
    //Get all the engineer and render to the html
    getEngineer():void{
      this.service.getAllUsers()
      .subscribe(users => {
        users.sort(function(a, b)
        {
          var x = a.name.toLowerCase();
          var y = b.name.toLowerCase();
          return x < y ? -1 : x > y ? 1 : 0;
        });
        this.engineer = users;        
        //this.showtable = true;
      })
    }

    //update user
    updateUser(data){
      this.submitted = true;
      if (this.myform.invalid) {
        return;
    }
      data._id = this.user.id;
      data.max = +data.max;
      if (data.password != this.user.password){
        let password = data.password;
        let out = sjcl.hash.sha256.hash(password);
        data.password = sjcl.codec.hex.fromBits(out);
      }
      //console.log(data);
      this.service.updateUser(data)
        .subscribe(response => {
          if(response.status != 204){
            alert("error finding user");
          }
          else{
            alert("User updated");
            this.modalRef.hide();
            this.getEngineer();
          }
        });
  
      return;
    }

    //update schedule
    updateSchedule(data) {
      let difference = this.convertTimeZone.getDifference(data.time)
      data._id = this.user.id;
      data.difference = difference;
      this.service.updateSchedule(data)
        .subscribe(response => {
          if (response.status != 204) {
            alert("error finding user");
          }
          else {
            alert("Schedule updated");
            this.modalRef.hide();
            this.getEngineer();
          }
        })
  
      return;
    }

    //Delete user
    delete(){
      
      this.service.deleteUser(this.user.id, this.user.schedule_id)
        .subscribe(response => {
          if (response.status != 200) {
            alert("error finding user");
          }
          else if (response.status != 204){
            alert("User Deleted without schedule");
            this.modalRef.hide();
            this.getEngineer();
          }
          else {
            alert("User Deleted");
            this.modalRef.hide();
            this.getEngineer();
          }
        });
  
      return;
    }

    private fillUserForm = (user) =>{
      this.myform= this.fb.group({
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        city : user.city,
        sta_dyn: user.sta_dyn,
        max: user.max_case,
        status: user.status,
        role: user.role,
        username: user.username,
        password: user.password,
      });
      
    }

    private fillScheduleForm = (user) =>{
      this.myform2= new FormGroup({
        monday: new FormGroup({
          startHour: new FormControl(user.schedule_loaded[0].monday_morning.hour),
          startMinute:new FormControl(user.schedule_loaded[0].monday_morning.minutes),
          endHour:new FormControl(user.schedule_loaded[0].monday_afternoon.hour),
          endMinute:new FormControl(user.schedule_loaded[0].monday_afternoon.minutes)
        }),
        tuesday: new FormGroup({
          startHour: new FormControl(user.schedule_loaded[0].tuesday_morning.hour),
          startMinute:new FormControl(user.schedule_loaded[0].tuesday_morning.minutes),
          endHour:new FormControl(user.schedule_loaded[0].tuesday_afternoon.hour),
          endMinute:new FormControl(user.schedule_loaded[0].tuesday_afternoon.minutes)
        }),
        wednesday: new FormGroup({
        startHour: new FormControl(user.schedule_loaded[0].wednesday_morning.hour),
          startMinute:new FormControl(user.schedule_loaded[0].wednesday_morning.minutes),
          endHour:new FormControl(user.schedule_loaded[0].wednesday_afternoon.hour),
          endMinute:new FormControl(user.schedule_loaded[0].wednesday_afternoon.minutes)
        }),
        thursday: new FormGroup({
          startHour: new FormControl(user.schedule_loaded[0].thursday_morning.hour),
          startMinute:new FormControl(user.schedule_loaded[0].thursday_morning.minutes),
          endHour:new FormControl(user.schedule_loaded[0].thursday_afternoon.hour),
          endMinute:new FormControl(user.schedule_loaded[0].thursday_afternoon.minutes)
        }),
        friday: new FormGroup({
          startHour: new FormControl(user.schedule_loaded[0].friday_morning.hour),
          startMinute:new FormControl(user.schedule_loaded[0].friday_morning.minutes),
          endHour:new FormControl(user.schedule_loaded[0].friday_afternoon.hour),
          endMinute:new FormControl(user.schedule_loaded[0].friday_afternoon.minutes)
        }),
        time: new FormControl(user.schedule_loaded[0].time_zone)
      });
    }

  // convenience getter for easy access to form fields
  get f() {return this.myform.controls; }

  ngOnInit() {
    this.checkSessionId();
  }

}
