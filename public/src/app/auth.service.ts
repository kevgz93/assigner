import { Injectable } from '@angular/core';
import { ILogin } from './login';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService) { }

  logout(): void {
    this.cookieService.delete('SessionId');
    // aqui va el llamado al api para borrar el token de la base de datos
  } 

}