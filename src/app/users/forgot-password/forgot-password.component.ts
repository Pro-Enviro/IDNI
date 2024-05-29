import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../_services/users/auth.service";
import {from} from "rxjs";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
    email: string = ''

  constructor(private auth: AuthService) {}

  resetPassword =() => {

      console.log('Resetting password')


      // from(this.auth.resetPassword(this.email)).subscribe({
      //   next:(res: any) => {
      //     console.log(res)
      //   },
      //   error: (err: any) => console.log(err)
      // })
  }
}
