import {Component, OnInit} from '@angular/core';
import {SharedModules} from "../../shared-module";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../_services/users/auth.service";

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
export class ResetPasswordComponent implements OnInit {

  form!: FormGroup;
  token?: string;
  valid: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private auth: AuthService, private _fb: FormBuilder) {

    this.form = this._fb.group({
        password: ['', Validators.required],
        confirm: ['', Validators.required]
      }
    )

  }


  checkMatch = ($event: KeyboardEvent) => {
    this.valid = this.form.value.password != this.form.value.confirm ? false: true;
  }

  resetPassword = () => {
    console.log('Resetting password')

    if (this.valid) {
      // this.auth.resetPassword({token: this.token, password: this.form.value.password}).subscribe({})
    }

    // this.router.navigate(['/auth/login'])
  }

  ngOnInit = () => {
    console.log('NG ON INIT')
    this.token = this.route.snapshot.queryParams['token'];
    console.log('token', this.token)
  }
}
