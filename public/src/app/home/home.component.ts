import { Component, OnInit } from '@angular/core';
import { Observable, timer } from 'rxjs';
import {ApiService} from '../api.service';
import {Router} from '@angular/router';
import {IsAvailable} from '../lib/isAvailable';
import * as moment from 'moment-timezone';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  private engineer;
  private displayedColumns: string[] = ['name', 'timeZone', 'max', 'schedule', 'email','day','week', 'month','action'];
  private condition;
  private IsAvailable = new IsAvailable();
  private showTable = false;
  private qm;
  public interval;



  
  constructor(private service: ApiService, private router:Router) {
    let time = timer(30000, 30000);
    this.interval = time.subscribe(t=> {
      this.refreshHome();
    });
   }

  private countCases = (cases,month,monday):any=>{
    let count = {day:0, week:0, month:0}
    let date=new Date();
    let current_month = monday.getMonth() + 1;
    let next_month = monday.getMonth() + 2;

    cases.forEach(element => {
      if (date.getDate() == element.date.date && month == element.date.month){
        count.day++;
      }
      if (month == element.date.month ){
        count.month++;
      }
      if (element.date.date >= monday.getDate()  && element.date.month == current_month){
        count.week++;
      }
      else if(element.date.month == next_month && element.date.date < 5){
        count.week++;
      }
    });
    return count;
  }


  filterDay(engi): any{
    let date = new Date();
    let count = {};
    let monday;
    let month = date.getMonth() + 1;
    let month2 = date.getMonth();
    if(month == 0)
    {
      month2 == 12
    }
    
    let cases = engi.cases_loaded;
    monday = this.getMonday(new Date())

    count = this.countCases(cases,month,monday);
    
    return count

  }

  getMonday(d):Date {
        
    let day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  disableAddButton(max, countday): boolean{
    if (countday >= max && max !== 0){
      return true;
    }
    return false;
  }

  disableLessButton(): boolean{
    if (this.condition){
      return true;
    }

    return false;
  }

  private covertStringTimeZone = (timezone) => {
    
    if(timezone === 'cat'){
      return 'Central America';
    }
    else if(timezone === 'mt'){
      return 'Mountain Time Zone';
    }
    else if(timezone === 'pt'){
      return 'Pacific Time Zone';
    }
    else if(timezone === 'ct'){
      return 'Central Time Zone';
    }
    else {
      return 'Eastern Time Zone';
    }

  }


  //Get all the engineer and render to the html
  getEngineer():void{
    this.service.getAllEngineers()
    .subscribe(data => {
      data.forEach(item => {
        item.cases = this.filterDay(item);
        item.disableAddButton = this.disableAddButton(item.max_case, item.cases.day);
        item.disableLessButton = this.disableLessButton();
        item.today = this.IsAvailable.filterScheduleTodayDay(item);
        item.timezone = this.covertStringTimeZone(item.schedule_loaded[0].time_zone);
      });
      this.engineer = data;
      this.engineer.sort(function(a, b)
        {
          return a.today.morning - b.today.morning;
        });
      this.showTable = true;
    })
  }

  addTicket(id):void{
    
    this.service.getUserBySessionId().subscribe(user => {
      this.service.getOneEngineer(id)
      .subscribe(engi => {
        const body = JSON.stringify({"engi_id": id,"engi_name":engi.body.name,"engi_last_name":engi.body.last_name,
         "user_id": user.body._id,"user_name":user.body.name,"user_last_name":user.body.last_name});
        this.service.addTicket(body)
        .subscribe(response =>{
          if(response.action != "added"){
            alert("cases not added");
          }
          this.getEngineer();
        })
    })
    });
  }

  deleteTicket(id): Observable<any>{
    this.condition = id;
    this.service.deleteTickets(id)
    .subscribe(msj => {
      if(msj.status != 200)
      {
        console.log(msj);
      }
      else{
        console.log(msj)
      }
      this.getEngineer();
    })
   
    return;
  }

  //get qm 
  currentQmAms(rotation):string{
    let date = new Date();
    let day = date.getDay();
    let dateCA = moment(date).tz( "America/Tegucigalpa");
    let time = date.getHours();
    if(day ===1 && time <12){
      return rotation.monday.morning;
    }
    else if(day ===1){
      return rotation.monday.afternoon;
    }
    else if(day ===2 && time < 12){
      return rotation.tuesday.morning;
    }
    else if(day ===2){
      return rotation.tuesday.afternoon;
    }
    else if(day ===3 && time <12){
      return rotation.wednesday.morning;
    }
    else if(day ===3){
      return rotation.wednesday.afternoon;
    }
    else if(day ===4 && time <12){
      return rotation.thursday.morning;
    }
    else if(day ===4){
      return rotation.thursday.afternoon;
    }
    else if(day ===5 && time <12){
      return rotation.friday.morning;
    }
    else if(day ===5){
      return rotation.friday.afternoon;
    }

  }

  //Get the current QM
  getQM():void{
    let rotation;
    this.service.getRotation().subscribe(data =>{
      rotation = data.body[0];
      if(data.status === 200){
        let id = this.currentQmAms(rotation);
        this.service.getOneEngineer(id)
        .subscribe(user => {
          this.qm = `${user.body.name} ${user.body.last_name}`;   
          this.getEngineer();
          //this.showtable = true;
    })
      }
      else {
        this.qm = "Error";
      }
        })

    }

    //refres home
    refreshHome(){
      this.getEngineer();
        //this.data = this.sortable(this.data);

    }

  ngOnDestroy() {
    this.interval.unsubscribe();
  }


  ngOnInit() {
  
    this.getQM();
    
  }

}
