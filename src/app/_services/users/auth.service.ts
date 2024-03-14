import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {BehaviorSubject, map} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../storage.service";
import {authentication, createDirectus, graphql, rest} from "@directus/sdk";
import {GlobalService} from "../global.service";
export interface Credentials {
  email: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  client: any;


  constructor(
    private global: GlobalService,
    private http: HttpClient,
    private storage: StorageService,
    private route: Router
  ) {
    this.client = this.global.client//createDirectus('https://app.idni.eco/').with(rest()).with(graphql()).with(authentication('json'));
    /*this.client.auth.token = this.storage.get('access_token');
    this.isLoggedIn.next(!!this.storage.get('access_token'));
    this.client.auth.on('token_changed', (token:any) => {
        this.storage.save('access_token', token);
        this.isLoggedIn.next(!!token);
    })*/
  }
  url:string = 'https://app.idni.eco/'
  login = async (credentials: Credentials) => {
    // credentials = {
    //   email: 'rian.jacobs@proenviro.co.uk',
    //   password: 'Kinibay100%'
    // }
    const result = await this.client.login(credentials.email, credentials.password)

    const token = await this.client.getToken()

    this.storage.set('access_token', token)
    this.storage.set('expires', result.expires)
    this.storage.set('refresh_token', result.refresh_token)
    this.route.navigate(['dashboard'])
     // this.http.post(`${this.url}auth/login`, credentials).pipe(
     //   map((x:any) => x.data),
     // ).subscribe({
     //   next: (res:any) => {
     //     this.storage.set('access_token', res.access_token);
     //     this.storage.set('expires', res.expires);
     //     this.storage.set('refresh_token', res.refresh_token);
     //     this.route.navigate(['dashboard'])
     //   }
     // })
  }

  refresh = () => {
    this.client.refresh()
  }

  logout = () =>{
    this.client.logout()
  }

}
