import { Component } from '@angular/core';
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import { Router, RouterLink} from "@angular/router";
import {AuthService, Credentials} from "../../_services/users/auth.service";
import {FormsModule} from "@angular/forms";
import {GlobalService} from "../../_services/global.service";

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
    private  auth: AuthService
  ) {
  }

  login = () => {
    //if(this.credentials)
    this.auth.login({...this.credentials, ...{mode: 'cookie'}})
  }

}
