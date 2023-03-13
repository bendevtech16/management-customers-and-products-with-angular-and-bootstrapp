import { Injectable } from '@angular/core';
import {AppUser} from "../model/User.model";
import {UUID} from "angular2-uuid";
import {Observable, of, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
 users: AppUser[] =[];
 authenticatedUser : AppUser | undefined;
  constructor() {
    this.users.push({userId : UUID.UUID(),username:"user1",password : "1234", roles:["user"]});
    this.users.push({userId : UUID.UUID(),username:"user2",password : "1234", roles:["user"]});
    this.users.push({userId : UUID.UUID(),username:"admin",password : "1234", roles:["ADMIN"]});
  }

  public login(username: string, password : string) :  Observable<AppUser>{
    let appUser = this.users.find(u => u.username ==username);
  if(!appUser) return throwError(()=> new Error("user  not found"));
    if (appUser.password!=password){
      return throwError(()=> new Error("Bad credentials"));
    }
    return  of(appUser);

  }

  public  authenticateUser(appUser : AppUser) : Observable<boolean>{
    this.authenticatedUser = appUser;
    localStorage.setItem("authUser", JSON.stringify({username :appUser, role:appUser.roles, jwt : "JWT_TOKEN"}));
  return of(true);
  }
  public logout() : Observable<boolean>{
    this.authenticatedUser= undefined;
    localStorage.removeItem("authUser");
    return of(true);
  }
  public isAuthenticated():boolean{
    return  this.authenticatedUser !=undefined;
  }

  // to know if user is admin: methode below
  public  hasRole(role : string) : boolean{
    return  this.authenticatedUser!.roles.includes(role);
  }


}
