import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {ApiService} from '../api.service';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public user;
  private showMaintenance = false;
  public shownav:boolean = false;
  private cookie;
  id: string;

  constructor(private service: ApiService, private router:Router, private cookieService: CookieService,public authService: AuthService) { }

  

  redirect(url){
    if(url === 'login')
    this.router.navigate(['/'+url]);
    else if(url === 'home'){
      
      this.router.navigate([url]);
    }
    return
  }

  checkAdmin(){
    if (this.user.role === 'admin'){
      this.showMaintenance = true;
    }
  }

  checkSessionId(){
    let cookie = this.cookieService.get('SessionId');
    let url = "login";
    if(!cookie){
      this.shownav = false;
      this.redirect(url);
    }
    else{
      this.service.getUserBySessionId().subscribe(response =>{
        if(response.status != 201) {
          this.shownav = false;
          this.redirect(url);
        }
        else{
          this.user = response.body;
          this.shownav = true;
          this.checkAdmin();
        }
      });
    }
  }

  logout(): void {
    this.service.logout()
    .subscribe(response =>{
      console.log(response);
      
      let status: any = response.status;
      if(status === 'success'){
        this.authService.logout();
        window.location.replace('/login');

    }

  });
  }


  ngOnInit() {
    //this.id = localStorage.getItem('token');
    this.checkSessionId();
  }

}
