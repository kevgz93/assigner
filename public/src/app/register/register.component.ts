import { Component, OnInit, OnDestroy } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import * as moment from 'moment-timezone';
import * as sjcl from 'sjcl';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public data;
  public mjs;
  user: FormGroup;
  schedule: FormGroup;
  private showUserFrom = true;
  private showScheduleFrom = false;
  private id;
  public submitted = false;
  private isCompleted = false;
  private defaultSchedule = {monday:{startHour:8,startMinute:0,endHour:17,endMinute:0},tuesday:{startHour:8,startMinute:0,endHour:17,endMinute:0},
  wednesday:{startHour:8,startMinute:0,endHour:17,endMinute:0},thursday:{startHour:8,startMinute:0,endHour:17,endMinute:0},friday:{startHour:8,startMinute:0,endHour:17,endMinute:0},
  time:"ct",user_id:'',difference:{}};

  //message:Object;
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

  constructor(private service: ApiService, private fb: FormBuilder, private router:Router,private cookieService: CookieService) { }

  checkAdmin(session){
    if (session.role != 'admin'){
      this.router.navigate(['/home']);    
    }
 
  }

  checkSessionId(){
    let cookie = this.cookieService.get('SessionId');
    if(!cookie){
      this.router.navigate(['/login']);
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

  addUser(data){

    this.submitted = true;
    if (this.user.invalid) {
      return;
  }
  
    data.max = +data.max;
    this.showUserFrom= false;
        this.showScheduleFrom = true;
    
    let password = data.password;
    var out = sjcl.hash.sha256.hash(password);
    data.password = sjcl.codec.hex.fromBits(out);
    this.service.addUser(data)
    .subscribe(msj => {
      if(msj.status == 201){
        alert('User Added');
        this.id = msj.body._id;
        this.showUserFrom= false;
        this.showScheduleFrom = true;

      }
      else{
        alert('User Failed');
        this.router.navigate(['./login/register']);
      }
    })

  }

  //**************************** Schedule functions block **************
  isDaylight():Boolean {
    //let moment = require('moment-timezone');
    let date = new Date();
    let NYDate = moment(date).tz("America/New_York");
    let offset:number = NYDate._offset;
    if(offset != -300){
      return true;
    }
    
  }

  getDifference(timezone){
    let difference={"hour":0, "minutes":0};
    let dayL:number;

    //var today = new Date();
    if (this.isDaylight()) { 
      dayL = 1;
    }

    if(timezone === "cat"){
      difference.hour = 6;
    }
    else if(timezone === "pt"){
      difference.hour = 8 - dayL;
    }
    else if(timezone === "mt"){
      difference.hour = 6 - dayL;
    }
    else if(timezone === "ct"){
      difference.hour = 6 - dayL;
    }
    else if(timezone === "et"){
      difference.hour = 5 - dayL;
    }
    else if(timezone === "uk"){
      difference.hour = 0 - dayL;
    }
    else if(timezone === "cet"){
      difference.hour = -1 - dayL;
    }
    else if(timezone === "ist"){
      difference.hour = -5;
      difference.minutes = 30;
    }
    else if(timezone === "ict"){
      difference.hour = -7;
    }
    else if(timezone === "sgt"){
      difference.hour = -8;
    }
    else if(timezone === "jst"){
      difference.hour = -9;
    }
    return difference;
  }

  addSchedule(data){
    this.isCompleted = true;
    let difference = this.getDifference(data.time)
    data.user_id = this.id;
    data.difference = difference;
    //console.log(data);
    //data.day_off = data.day_off.formatted;
    //data.day_on = data.day_on.formatted;

    this.service.addSchedule(data)
    .subscribe(msj => {
      if(msj.status == 201){
        alert('Schedule Added');
        this.router.navigate(['./home']);
        
      }
      else{
        alert('schedule Failed');
        this.router.navigate(['./schedule']);
      }
    })
    
  }

  // click on cancel button
  skipSchedule(){
    this.isCompleted = true;
    let difference = this.getDifference(this.defaultSchedule.time)
    this.defaultSchedule.user_id = this.id;
    this.defaultSchedule.difference = difference;
    this.service.addSchedule(this.defaultSchedule)
    .subscribe(msj => {
      if(msj.status == 201){
        alert('Schedule Added');
        this.router.navigate(['./home']);
        
      }
      else{
        alert('schedule Failed');
        this.router.navigate(['./schedule']);
      }
    })
    this.router.navigate(['./']);
  }

  // convenience getter for easy access to form fields
  get f() {return this.user.controls; }

  ngOnInit() {
    this.checkSessionId();
    
    this.user= this.fb.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      city : ['', Validators.required],
      sta_dyn: ['', Validators.required],
      max: '0',
      status: ['', Validators.required],
      role: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.schedule= new FormGroup({
      monday: new FormGroup({
        startHour: new FormControl(8),
        startMinute:new FormControl(0),
        endHour:new FormControl(17),
        endMinute:new FormControl(0)
      }),
      tuesday: new FormGroup({
        startHour: new FormControl(8),
        startMinute:new FormControl(0),
        endHour:new FormControl(17),
        endMinute:new FormControl(0)
      }),
      wednesday: new FormGroup({
      startHour: new FormControl(8),
        startMinute:new FormControl(0),
        endHour:new FormControl(17),
        endMinute:new FormControl(0)
      }),
      thursday: new FormGroup({
        startHour: new FormControl(8),
        startMinute:new FormControl(0),
        endHour:new FormControl(17),
        endMinute:new FormControl(0)
      }),
      friday: new FormGroup({
        startHour: new FormControl(8),
        startMinute:new FormControl(0),
        endHour:new FormControl(17),
        endMinute:new FormControl(0)
      }),
      time: new FormControl()
    });
  }
  async ngOnDestroy () {
    if(this.isCompleted != true && this.id){
      await this.skipSchedule()
    }
    
  }


}
