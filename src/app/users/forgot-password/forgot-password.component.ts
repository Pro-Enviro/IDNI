import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../_services/users/auth.service";
import {MessageService} from "primeng/api";
import {Router, RouterLink} from "@angular/router";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, ButtonModule, InputTextModule, RippleModule, RouterLink, NgIf],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
    email: string = ''
  submitted: any = false;

  constructor(private auth: AuthService, private msg: MessageService, private router: Router) {}

  resetPassword =() => {

    if (!this.email.length) return this.msg.add({
      severity: 'warn',
      detail: 'Please enter your email'
    })

   this.auth.requestPassword({email:this.email, passwordResetUrl: 'http://localhost:3000/reset-password'}).subscribe({
      next: (res: any) => {
        this.msg.add({
          severity:'info',
          detail: 'Please check your email.'
        })

        this.submitted = true;
      }

    });


  }

}
