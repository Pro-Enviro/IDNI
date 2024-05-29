import {Component, OnInit} from '@angular/core';
import {SharedModules} from "../../shared-module";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../_services/users/auth.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    SharedModules,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  form!: FormGroup;
  token?: string;
  valid: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private auth: AuthService, private _fb: FormBuilder, private msg: MessageService) {

    this.form = this._fb.group({
        password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(50)])],
        confirm: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(50)])]
      }
  )

    this.token = this.route.snapshot.queryParams['token'];

  }


  checkMatch = () => {
    this.valid = this.form.value.password != this.form.value.confirm ? false: true;
  }

  resetPassword = () => {
    if (this.valid) {
      if (!this.token) return;

      this.auth.resetPassword({token: this.token, password: this.form.value.password}).subscribe({
        next: (res: any) => {
          this.msg.add({
            severity: 'success',
            detail: 'Password reset'
          })
        },
        error: (error: any) => console.log(error)
      })
    } else {
      return this.msg.add({
        severity: 'error',
        detail: 'Password does not match criteria'
      })
    }

    this.router.navigate(['/login'])
  }
}
