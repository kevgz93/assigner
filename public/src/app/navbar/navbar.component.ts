import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private router:Router) { }

  // redirect(url){
  //   if(url === 'login')
  //   this.router.navigate(['/'+url]);
  //   else if(url === 'home'){
      
  //     this.router.navigate([url]);
  //   }
  //   return
  // }


  ngOnInit() {
  }

}
