import { Component, OnInit } from '@angular/core';


const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Hydrogen', timeZone: 'MST', max: 0,schedule:'8:00 - 17:00',email:'correo@microfocus.com',case:{day:2,week:4,month:20}},
  {name: 'Helium', timeZone: 'MST', max: 0,schedule:'8:00 - 17:00',email:'correo@microfocus.com',case:{day:2,week:4,month:20}},
  {name: 'Lithium', timeZone: 'MST', max: 0,schedule:'8:00 - 17:00',email:'correo@microfocus.com',case:{day:2,week:4,month:20}},
  {name: 'Beryllium', timeZone: 'MST', max: 0,schedule:'8:00 - 17:00',email:'correo@microfocus.com',case:{day:2,week:4,month:20}},
  {name: 'Boron', timeZone: 'MST', max: 0,schedule:'8:00 - 17:00',email:'correo@microfocus.com',case:{day:2,week:4,month:20}},
  {name: 'Carbon', timeZone: 'MST', max: 0,schedule:'8:00 - 17:00',email:'correo@microfocus.com',case:{day:2,week:4,month:20}},
  {name: 'Nitrogen', timeZone: 'MST', max: 0,schedule:'8:00 - 17:00',email:'correo@microfocus.com',case:{day:2,week:4,month:20}},
  {name: 'Oxygen', timeZone: 'MST', max: 0,schedule:'8:00 - 17:00',email:'correo@microfocus.com',case:{day:2,week:4,month:20}},
  {name: 'Fluorine', timeZone: 'MST', max: 0,schedule:'8:00 - 17:00',email:'correo@microfocus.com',case:{day:2,week:4,month:20}},
  {name: 'Neon', timeZone: 'MST', max: 0,schedule:'8:00 - 17:00',email:'correo@microfocus.com',case:{day:2,week:4,month:20}},
];

interface PeriodicElement {
  name: string;
  timeZone: String;
  max: number;
  schedule: string;
  email:string;
  case:{
    day:number;
    week:number;
    month:number;
  };
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  displayedColumns = ['name', 'timeZone', 'max', 'schedule','email','day', 'week','month','action'];
  dataSource = ELEMENT_DATA;
  
  constructor() { }

  ngOnInit() {
  }

}
