import { Component } from '@angular/core';
import {CardModule} from "primeng/card";
import {InplaceModule} from "primeng/inplace";
import {InputTextModule} from "primeng/inputtext";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputGroupModule} from "primeng/inputgroup";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {AvatarModule} from "primeng/avatar";
import {UserService} from "../../../_services/users/user.service";
import {from} from "rxjs";
import {MessageService} from "primeng/api";
import {CommonModule} from "@angular/common";
import {SharedComponents} from "../../../pages/envirotrack/shared-components";
import {SharedModules} from "../../../shared-module";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    SharedComponents,
    SharedModules,
    CardModule,
    InplaceModule,
    InputTextModule,
    FormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    AvatarModule,
    ReactiveFormsModule,

  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  userEditForm!: FormGroup;
  isLoading: boolean = false
  usersCompanies: string[] = []

  constructor(private userService: UserService, private fb: FormBuilder, private msg: MessageService) {

    this.userEditForm = this.fb.group({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl({value: '', disabled:true}, [Validators.required, Validators.email]),
      contact_number: new FormControl('', [Validators.required]),
    })

    this.getCurrentUser()
  }

  // Fetch Users Data and preload inputs
  getCurrentUser = () => {
    from(this.userService.getCurrentUserData()).subscribe({
      next: (res) => {
        this.userEditForm.patchValue({
          first_name: res.first_name,
          last_name: res.last_name,
          email: res.email,
          contact_number: res.phone_number,
        })
        // Get companies associated with the user
        this.getUsersCompanies()
      }
    })
  }

  getUsersCompanies = () => {
    from(this.userService.getUsersCompany()).subscribe({
      next: (res) => {
        this.usersCompanies = res.map((company: any) => company.name)
      }
    })
  }

  // Functionality to edit account details
  patchUserValues = () => {
    if (!this.userEditForm.valid){
      this.msg.add({
        severity : 'warn',
        detail: 'Please fill in all fields'
      })
    }




    if (this.userEditForm.valid){
      from(this.userService.updateCurrentUserDatails(this.userEditForm.value)).subscribe({
        next: () => {
          this.msg.add({
            severity: 'success',
            detail: 'User details successfully updated'
          })
        },
        error: (error: any) => {
          this.msg.add({
            severity: 'warn',
            detail: 'Error updating user details'
          })
        }
      })
    }

    this.isLoading = false;
  }
}
