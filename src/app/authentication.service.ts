import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError, Observable, of } from 'rxjs';
import { User } from './user.model';
import { USER_API } from './api.constants';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tap, catchError } from 'rxjs/operators';
//import { config } from './../'

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor( private http: HttpClient ) { }

  public getToken(): string | null{
    return localStorage.getItem('access_token');
  }

  public readToken(): any{
    const token: any = this.getToken();
    return helper.decodeToken(token);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();

    // Note: We can also use helper.isTokenExpired(token) 
    // to see if the token is expired

    if (token) {
      console.log(`token exists: ${token}`);
      return true;
    } else {
      console.log('no token');
      return false;
    }
  }

  login(username:string,password:string): Observable<any> {
    // Attempt to login
    return this.http.post<any>(`${USER_API}/v1/login`, {username,password})
    .pipe(tap(data => console.log(data)) , catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse){
    return observableThrowError(error.message || "Server Error");
  }

  public logout() {
    localStorage.removeItem('access_token');
  }
}
