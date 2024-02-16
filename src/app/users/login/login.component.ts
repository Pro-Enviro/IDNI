import { Component } from '@angular/core';
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import { Router, RouterLink} from "@angular/router";
import {AuthService, Credentials} from "../../_services/users/auth.service";
import {FormsModule} from "@angular/forms";
import {StorageService} from "../../_services/storage.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    RippleModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  credentials: Credentials = {
    email: '',
    password: ''
  };

  constructor(
    private  auth: AuthService,
    private storage: StorageService,
    private route: Router,
  ) {
  }

  login = () => {
    if(this.credentials)
    this.auth.login(this.credentials).subscribe({
      next: (res:any) => {
        this.storage.save('access_token', res.access_token);
        this.storage.save('expires', res.expires);
        this.storage.save('refresh_token', res.refresh_token);

        this.route.navigate(['dashboard'])
      }
    })
  }

}
