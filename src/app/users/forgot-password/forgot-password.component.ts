import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../_services/users/auth.service";
import {from, of} from "rxjs";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
    email: string = ''

  constructor(private auth: AuthService, private msg: MessageService, private router: Router) {}

  resetPassword =() => {
      console.log('Resetting password')

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
        this.router.navigate(['/login'])
      }

    });


  }
}
