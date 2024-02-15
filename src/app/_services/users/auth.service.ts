import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
export interface Credentials {
  email: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }
  url:string = 'https://app.idni.eco/'
  login = (credentials: Credentials) => {
    return this.http.post(`${this.url}auth/login`, credentials)
  }

}
