import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {ApiService} from '../api.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  public showReportCase:boolean = false;
  public showtotalCase:boolean = false;
  public showtableCase:boolean = false;
  private users;
  private myform: FormGroup;
  private cases;
  private displayedColumns: string[] = ['name', 'action', 'time', 'date', 'user'];
  public months: any = [
    {value: 'all', viewValue: 'All'},
    {value: 1, viewValue: 'January'},
    {value: 2, viewValue: 'February'},
    {value: 3, viewValue: 'March'},
    {value: 4, viewValue: 'Abril'},
    {value: 5, viewValue: 'May'},
    {value: 6, viewValue: 'June'},
    {value: 7, viewValue: 'July'},
    {value: 8, viewValue: 'August'},
    {value: 9, viewValue: 'September'},
    {value: 10, viewValue: 'October'},
    {value: 11, viewValue: 'November'},
    {value: 12, viewValue: 'December'},
  ];
  public status: any = [
    {value: 'all', viewValue: 'All'},
    {value: 'added', viewValue: 'Added'},
    {value: 'deleted', viewValue: 'Deleted'}
  ];


  constructor(private service: ApiService, private router:Router, private fb: FormBuilder) { }

  getUsers(){
    let all = {name:'All', last_name:'Engineers', _id:'all'};
    this.service.getAllUsers()
    .subscribe(data => {
      data.push(all);
      this.users = data;
      console.log(data);
      this.showReportCase = true;
    })
    return;
  }


  //*************** moethods for cases */

  
  getTickets(form){
    
    this.service.getReportCase(form)
      .subscribe(data => {
        
        this.cases = data;
        this.cases.total = Object.keys(data).length;
        this.cases.sort(function(a, b)
        {
          return b.date.month - a.date.month || a.date.date - b.date.date;
        });
        this.showtotalCase = true;
        this.showtableCase = true;

      }) 
  }


  ngOnInit() {

    this.getUsers();
    this.myform= this.fb.group({
      user: 'all',
      month: 'all',
      case_status: 'added',

    });
  }

}
