import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {ApiService} from '../api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConvertTimeZero} from './../lib/time_zero';
import * as sjcl from 'sjcl';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  private convertTimeZone = new ConvertTimeZero();
  public myform: FormGroup;
  public user;
  public submitted = false;
  public session;
  public showTemplate = false;
  public showAdminFields = false;
  public schedule = {monday:'',tuesday:'',wednesday:'',thursday:'',friday:''};
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

  constructor(private service: ApiService, private router:Router, private cookieService: CookieService,private fb: FormBuilder) { }

  checkAdmin(){
    if (this.session.role === 'admin'){
      this.showAdminFields = true;
    }
  }

  private getUser = () =>{
    //Get the engineer and render to the html
    this.service.getOneEngineer(this.session._id)
    .subscribe(user => {
      this.fillUserForm(user.body);
      this.user = user.body;
      this.showTemplate = true;        
      //this.showtable = true;
    })
  }

  private checkSessionId= () => {
    this.service.getUserBySessionId().subscribe(response =>{
      if(response.status === 201) {
        this.session = response.body;
        this.checkAdmin();
        this.getUser();
        this.getSchedule();
      }
      else{
        alert('error in the page, contact the administrator');
      }
    });
  }

  updateUser(data){
    this.submitted = true;
    if (this.myform.invalid) {
      return;
  }
    data.max = +data.max;
    if (data.password != this.user.password){
      let password = data.password;
      let out = sjcl.hash.sha256.hash(password);
      data.password = sjcl.codec.hex.fromBits(out);
    }

    this.service.updateUser(data)
      .subscribe(response => {
        if(response.status != 204){
          alert("error finding user");
        }
        else{
          alert("User updated");
          this.getUser();
        }
      });

    return;
  }

  private convertScheduleToString = (morning, afternoon) =>{
    let min_morning='', min_afternoon = '';
    if(morning.minutes <= 9){
      min_morning = `0${morning.minutes}`;
    }
    else{
      min_morning = `${morning.minutes}`
    }
    if(afternoon.minutes <= 9){
      min_afternoon = `0${afternoon.minutes}`;
    }
    else{
      min_afternoon = `${afternoon.minutes}`
    }

    return `${morning.hour}:${min_morning} - ${afternoon.hour}:${min_afternoon}`
  }

  private getSchedule = () =>{
    
    this.service.getSchedule(this.session._id)
    .subscribe(schedule =>{
      console.log(schedule);
      let schedul = schedule.body;
      schedul = this.convertTimeZone.convertFromTimeZero(schedule.body)
      this.schedule.monday = this.convertScheduleToString(schedul.monday_morning, schedul.monday_afternoon);
      this.schedule.tuesday = this.convertScheduleToString(schedul.tuesday_morning, schedul.tuesday_afternoon);
      this.schedule.wednesday = this.convertScheduleToString(schedul.wednesday_morning, schedul.wednesday_afternoon);
      this.schedule.thursday = this.convertScheduleToString(schedul.thursday_morning, schedul.thursday_afternoon);
      this.schedule.friday = this.convertScheduleToString(schedul.friday_morning, schedul.friday_afternoon);
    })
  }

  private fillUserForm = (user) =>{
    this.myform= this.fb.group({
      _id:user._id,
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

    // convenience getter for easy access to form fields
    get f() {return this.myform.controls; }

  ngOnInit() {
    this.checkSessionId();
  }

}
