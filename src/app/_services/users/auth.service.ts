import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {BehaviorSubject, map, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../storage.service";
import {GlobalService} from "../global.service";
import {passwordRequest, readRole, readRoles} from "@directus/sdk";
import {MessageService} from "primeng/api";

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
    private route: Router,
  ) {
    this.client = this.global.client

    //createDirectus('https://app.idni.eco/').with(rest()).with(graphql()).with(authentication('json'));
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


    // Reset tokens if re logging in
    localStorage.clear()
    this.global.updateRole('')
    this.global.updateCompanyId(0)

    const result = await this.client.login(credentials.email, credentials.password)


    const token = await this.client.getToken()

    this.storage.set('access_token', token)
    this.storage.set('expires', result.expires)
    this.storage.set('refresh_token', result.refresh_token)

      // Get users role
    this.http.get(`${this.url}users/me?fields=email,role.name`).subscribe({
      next: (res: any)=>{
        // Adjust user permissions
        if (res.data.role.name === 'Administrator') {
          this.global.updateRole('Admin')
        } else if (res.data.role.name === 'consultant') {
          this.global.updateRole('Consultant')
        } else if (res.data.role.name === 'user') {
          this.global.updateRole('User')

          // Only show the company that the user is attached to
          this.http.get(`${this.url}items/companies?filter[users][directus_users_id][email][_eq]=${credentials.email}`).subscribe({
            next: (res:any) => {
              if (res?.data.length ){
                this.global.updateCompanyId(res.data[0].id)
                this.global.updateCompanyName(res.data[0].name)
              }
            },
            error: (error: any) => {
              console.log(error)
            }
          })
        }
      },
      error: (err: any) => {
        console.log(err)
      }
    })

    this.global.isSignedIn.next(true);


    setTimeout(() => {
      this.route.navigate(['dashboard'])
    }, 400)

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
    this.isLoggedIn.next(false)
    localStorage.clear()
    this.route.navigate(['/'])
  }

  refreshToken =  async () => {
    const result =  await this.client.refresh()

    this.storage.set('access_token', result.access_token)
    this.storage.set('expires', result.expires)
    this.storage.set('refresh_token', result.refresh_token)

    return result.access_token;
  }

  resetPassword = async (email: string) => {
    // Dont't use - This sends a generic directus email, not an IDNI one
    // const result = await this.client.request(passwordRequest(email))
    // return result
  }

  getUserRoles = () => {
    return this.http.get(`${this.url}roles?filter[name]=user`);
  }

}
