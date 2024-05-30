import { Component } from '@angular/core';
import {CardModule} from "primeng/card";
import {InplaceModule} from "primeng/inplace";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {InputGroupModule} from "primeng/inputgroup";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {AvatarModule} from "primeng/avatar";

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
    AvatarModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  first_name?:any;
  last_name?:any;
  email?:any;
  contact_number?:any;
}
