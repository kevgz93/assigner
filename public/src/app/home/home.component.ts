import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {ApiService} from '../api.service';
import {Router} from '@angular/router';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  private engineer;
  private displayedColumns: string[] = ['name', 'timeZone', 'max', 'schedule', 'email','day','week', 'month','action'];
  private condition;


  
  constructor(private service: ApiService, private router:Router) { }

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

  //Get all the engineer and render to the html
  getEngineer():void{
    this.service.getAllEngineers()
    .subscribe(data => {
      data.forEach(item => {
        item.cases = this.filterDay(item);
        item.disableAddButton = this.disableAddButton(item.max_case, item.cases.day);
        item.disableLessButton = this.disableLessButton();
      });
      this.engineer = data;
      console.log(this.engineer);
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
  

  ngOnInit() {
    this.getEngineer();
  }

}
