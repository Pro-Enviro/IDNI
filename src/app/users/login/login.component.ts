import { Component } from '@angular/core';
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import { Router, RouterLink} from "@angular/router";
import {AuthService, Credentials} from "../../_services/users/auth.service";
import {FormsModule} from "@angular/forms";
import {GlobalService} from "../../_services/global.service";
import {from, of} from "rxjs";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    RippleModule,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  client: any;
  credentials: Credentials = {
    email: '',
    password: ''
  };

  constructor(
    private  auth: AuthService,
    private msg: MessageService
  ) {
  }

  login = () => {
    //if(this.credentials)

    if (/Edg/.test(navigator.userAgent)) {
      return this.msg.add({
        severity:'warn',
        detail: 'Please use another browser. Microsoft Edge is not supported.'
      })
    }

    from(this.auth.login({...this.credentials, ...{mode: 'cookie'}})).subscribe({
      error: (err) => {
        return this.msg.add({
          severity: 'warn',
          detail: 'Invalid credentials'
        })
      }
    })

  }

}
