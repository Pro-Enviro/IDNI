import {Component, OnInit} from '@angular/core';
import {SharedModules} from "../../shared-module";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../_services/users/auth.service";
import {MessageService} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {PasswordModule} from "primeng/password";
import {DividerModule} from "primeng/divider";


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    SharedModules,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    PasswordModule,
    DividerModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  form!: FormGroup;
  token?: string;
  valid: boolean = false;


  constructor(private route: ActivatedRoute, private router: Router, private auth: AuthService, private _fb: FormBuilder, private msg: MessageService) {

    localStorage.clear()

    const match = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    this.form = this._fb.group({
        password: ['',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(50),
            Validators.pattern(match)]
          )],
        confirm:
          ['', Validators.compose([
            Validators.required, Validators.minLength(8),
            Validators.maxLength(50),
            Validators.pattern(match)]
          )]
      }
  )

    this.token = this.route.snapshot.queryParams['token'];


    if (!this.token){
      this.router.navigate(['/forgot-password'])
    }

  }


  checkMatch = () => {
    //this.valid = this.form.value.password != this.form.value.confirm ? false: true;

    if(this.form.controls['password'].value !== this.form.controls['confirm'].value){
      return this.form.controls['confirm'].setErrors({'not_matching':true})
    }else {
      this.form.controls['confirm'].updateValueAndValidity()
    }
    this.form.markAllAsTouched()
  }

  resetPassword = (form: FormGroup) => {
    if (!this.form.valid) {
      this.form.markAllAsTouched()


    if (this.form.controls['password'].value !== this.form.controls['confirm'].value) {
      return this.form.controls['confirm'].setErrors({'not_matching': true})
    }

    return this.msg.add({
      severity:'warn',
      detail: 'Please fill out all fields'
    })

  }


    if(this.form.valid) {
      if (!this.token) {
        return this.msg.add({
          severity:'error',
          detail: 'Unauthorised'
        })
      };

      this.auth.resetPassword({token: this.token, password: this.form.value.password}).subscribe({
        next: (res: any) => {
          this.msg.add({
            severity: 'success',
            detail: 'Password reset'
          })
        },
        error: (error: any) => console.log(error)
      })
    }

    // else {
    //   return this.msg.add({
    //     severity: 'error',
    //     detail: 'Password does not match criteria'
    //   })
    // }

    this.router.navigate(['/login'])
  }
}
