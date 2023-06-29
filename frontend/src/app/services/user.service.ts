import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../shared/models/User';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { HttpClient } from '@angular/common/http';
import { USER_LOGIN_URL, USER_REGISTER_URL } from '../shared/constants/urls';
import { ToastrService } from 'ngx-toastr';
import { IUserRegister } from '../shared/interfaces/IUserRegister';

const USER_KEY = 'User';
@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {

  //private userSubject = new BehaviorSubject<User>(new User());
  userSubject$ = new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable!: Observable<User>;

  constructor(private http: HttpClient, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.userObservable = this.userSubject$.asObservable();
  }

  //main difference between interface and class i cannot create new instance like class
  login(userLogin: IUserLogin): Observable<User> {
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) => {
          this.userSubject$.next(user);
          this.toastrService.success(
            `Welcome to Food Order Website ${user.name}!`,
            'Login Successfull'
          );
          this.setUserToLocalStorage(user)

        },
        error: (errorRes) => {
          this.toastrService.error(
            errorRes.error,
            'Login Failed'
          )
        }
      })
    )
  }

  logout() {
    this.userSubject$.next(new User());
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  }

  register(userRegister: IUserRegister): Observable<User> {
    return this.http.post<User>(USER_REGISTER_URL, userRegister).pipe(
      tap({
        next: (user) => {
          this.userSubject$.next(user);//notify all observables
          this.toastrService.success(
            `Welcome to Food Order Website ${user.name}!`,
            'Register Successfull'
          );
          this.setUserToLocalStorage(user)

        },
        error: (errorRes) => {
          this.toastrService.error(
            errorRes.error,
            'Register Failed'
          )
        }
      })
    )
  }

  private setUserToLocalStorage(user: User): User {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userSubject$.next(user);
    return user;
  }

  private getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem(USER_KEY);
    if (userJson) {
      const user: User = JSON.parse(userJson);
      return user;
    } else {
      return new User();
    }

  }

}
