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
  
  constructor(private service: ApiService, private router:Router) { }


  getEngineer():void {
    this.service.getAllEngineers()
    .subscribe(data => {
      console.log(data);
      this.engineer = data;
    })
  }
  

  ngOnInit() {
    this.getEngineer();
  }

}
