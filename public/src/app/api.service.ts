import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import {Router} from '@angular/router';


const API_URL = environment.apiUrl;



@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient, private cookieService: CookieService, private router:Router) {
  }
  public cookie;
  //private user_id;
  private user = new BehaviorSubject<object>({});
  currentObject = this.user.asObservable();
  private id = new BehaviorSubject<String>('');
  currentId = this.id.asObservable();

  //share user Id
  changeObject(message: Object) {
    console.log("aqui va el mensaje", message);
    this.user.next(message);
 
  }

  changeUserId(message: String) {
    this.id.next(message);
 
  }

  checkCookie():Observable<boolean>{
  let cookie;
   cookie = this.cookieService.get("SessionId");
   return cookie;
  }

  


  // API: GET /todos
  public getAllEngineers(): Observable<any> {
    //this.cookie = this.checkCookie();
    //let params = new HttpParams().set("sessionid",this.cookie);
    return this.http
    .get(API_URL + '/api/ticket/')//, { params: params }
    .pipe(map(response => {
      console.log(response);
      return response
    }),
    catchError(error => {
      return throwError(error)
    }));
  }

  public getUserBySessionId(): Observable<any> {
    this.cookie = this.checkCookie();
    let parameter = new HttpParams().set("sessionid",this.cookie);
    return this.http
    .get(API_URL + '/api/check/', { params: parameter })
    .pipe(map(response => {
      return response
    }),
    catchError(error => {
      return throwError(error)
    }));
  }

  public getAllUsers(): Observable<any> {
    return this.http
    .get(API_URL + '/api/getusers')
    .pipe(map(response => {
      return response
    }),
    catchError(error => {
      return throwError(error)
    }));
  }

  
  // API: GET one engineer
  public getOneEngineer(id): Observable<any> {
    let params = new HttpParams().set("id",id);    
    return this.http
    .get(API_URL + '/api/user/', { params: params })
    .pipe(map(response => {
      return response
    }),
    catchError(error => {
      return throwError(error)
    }));
  }
  
  public getSchedule(id): Observable<any> {
    let params = new HttpParams().set("id",id);    
    return this.http
    .get(API_URL + '/api/schedule/', { params: params })
    .pipe(map(response => {
      return response
    }),
    catchError(error => {
      return throwError(error)
    }));
  }

  public addTickets(body): Observable<any>{
    console.log('post....');
    return this.http.post(API_URL + '/api/ticket', body,{headers: new HttpHeaders().set('Content-Type','application/json')})
    .pipe(map(response => {
      return response
    }),
    catchError(error => {
      return throwError(error)
    }));
  }

  public deleteTickets(id): Observable<any> {
    let body = JSON.stringify({"engi_id": id});
    return this.http
    .put(API_URL + '/api/ticket', body,
     {headers: new HttpHeaders().set('Content-Type','application/json')}) //{headers: new HttpHeaders().set('Content-Type','application/json')}
     .pipe(map(response => {
      return response
    }),
    catchError(error => {
      return throwError(error)
    }));
  }
  

  public addUser(data): Observable<any> {
    let body = JSON.stringify(data);
    return this.http
    .post(API_URL + '/api/login/register', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .pipe(map(response => {
      return response
    }),
    catchError(error => {
      return throwError(error)
    }));
  }

  public updateUser(data): Observable<any> {
    let body = JSON.stringify(data);
    return this.http
    .put(API_URL + '/api/user', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .pipe(map(response => {
      return response
    }),
    catchError(error => {
      return throwError(error)
    }));
  }

  public addSchedule(data): Observable<any> {
    let body = JSON.stringify(data);
    return this.http
    .post(API_URL + '/api/schedule', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .pipe(map(response => {
      return response
    }),
    catchError(error => {
      return throwError(error)
    }));
  }
  public updateSchedule(data): Observable<any> {
    let body = JSON.stringify(data);
    return this.http
    .put(API_URL + '/api/schedule', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .pipe(map(response => {
      return response
    }),
    catchError(error => {
      return throwError(error)
    }));
  }

  public getReport(values): Observable<any> {
    let body = JSON.stringify(values);
    return this.http
    .post(API_URL + '/api/reports', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .pipe(map(response => {
      return response
    }),
    catchError(error => {
      return throwError(error)
    }));
  }

  //get current week
  public getWeek(week): Observable<any> {
    let params = new HttpParams().set("week",week);    
    return this.http
    .get(API_URL + '/api/rotation/', {params:params})
    .pipe(map(response => {
      return response
    }),
    catchError(error => {
      return throwError(error)
    }));
  }

    //get rotation table
    public getRotation(): Observable<any> {
      //let params = new HttpParams().set("week",week);    
      return this.http
      .get(API_URL + '/api/rotations/')
      .pipe(map(response => {
        return response
      }),
      catchError(error => {
        return throwError(error)
      }));
    }

  //Get week with status active
  public getWeekByStatus(): Observable<any> {
    //let params = new HttpParams().set("id",id);    
    return this.http
    .get(API_URL + '/api/checkrotation/')
    .pipe(map(response => {
      return response
    }),
    catchError(error => {
      return throwError(error)
    }));
  }


  //update date on week 
  public updateDayOnWeek(day, week): Observable<any> {
    let body = JSON.stringify({"day":day, "week":week});
    return this.http
    .put(API_URL + '/api/updateday/', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .pipe(map(response => {
      return response
    }),
    catchError(error => {
      return throwError(error)
    }));
  }

  public login(data): Observable<any> {
    let body = JSON.stringify(data);
    return this.http
    .post(API_URL + '/api/login', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .pipe(map(response => {
      return response
    }),
    catchError(error => {
      return throwError(error)
    }));
  }

  public logout(): Observable<any> {
    let data =  this.cookieService.get("SessionId");
    let body = JSON.stringify({"SessionId": data})
    console.log("cuerpo", body);
    return this.http
    .post(API_URL + '/api/logout', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .pipe(map(response => {
      return response
    }),
    catchError(error => {
      return throwError(error)
    }));
  }

  //send the time off to add it
  public addTimeOff(data): Observable<any> {
    let body = JSON.stringify(data)
    console.log("cuerpo", body);
    return this.http
    .put(API_URL + '/api/timeoff', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .pipe(map(response => {
      return response
    }),
    catchError(error => {
      return throwError(error)
    }));
  }

  private handleError (error: Response | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }

}