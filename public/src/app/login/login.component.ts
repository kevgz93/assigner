import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ILogin } from '../login';
import { AuthService } from '../auth.service';
import { CookieService } from 'ngx-cookie-service';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs';
import * as sjcl from 'sjcl';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    model: ILogin = { user: "admin", password: "admin123" };
  loginForm: FormGroup;
  message: string;
  returnUrl: string;

  constructor(private formBuilder: FormBuilder,private router: Router, public authService: AuthService
    ,private cookieService: CookieService,private service: ApiService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.returnUrl = '/';
    this.authService.logout();
  }

  //create cookie
  createCookie(sessionid): Observable<String>{
    this.cookieService.set( 'SessionId', sessionid.sessionid, 1);
    return;
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  
  login() {

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }
    else{
        let user = {user: this.f.user.value, password: this.f.password.value}
        let password = user.password;
        var out = sjcl.hash.sha256.hash(password);
        user.password = sjcl.codec.hex.fromBits(out);
        this.service.login(user)
        .subscribe(response =>{
            
            let status: any = response.status;
            if(status === 'success'){
            this.createCookie(response);
            this.service.changeUserId("login");
            //this.router.navigate(['./navbar']);
            window.location.replace('/home');
            }
            else {
                this.message = "Please check your user and password";
            }

        });
    }    
}

}