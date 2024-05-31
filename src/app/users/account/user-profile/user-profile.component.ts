import { Component } from '@angular/core';
import {CardModule} from "primeng/card";
import {InplaceModule} from "primeng/inplace";
import {InputTextModule} from "primeng/inputtext";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputGroupModule} from "primeng/inputgroup";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {AvatarModule} from "primeng/avatar";
import {UserService} from "../../../_services/users/user.service";
import {from} from "rxjs";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CardModule,
    InplaceModule,
    InputTextModule,
    FormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    AvatarModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  userEditForm!: FormGroup;

  constructor(private userService: UserService, private fb: FormBuilder) {

    this.userEditForm = this.fb.group({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      contact_number: new FormControl('', [Validators.required]),
    })

    this.getCurrentUser()
  }

  // Fetch Users Data and preload inputs
  getCurrentUser = () => {
    from(this.userService.getCurrentUserData()).subscribe({
      next: (res: any) => {
        console.log(res)
        this.userEditForm.patchValue({
          first_name: res.first_name,
          last_name: res.last_name,
          email: res.email,
          contact_number: res.phone_number,
        })
      }
    })
  }

  // Functionality to edit account details

}
