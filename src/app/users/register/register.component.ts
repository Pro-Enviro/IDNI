import { Component } from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CheckboxModule} from "primeng/checkbox";
import {ChipsModule} from "primeng/chips";
import {FormsModule} from "@angular/forms";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputGroupModule} from "primeng/inputgroup";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {PanelModule} from "primeng/panel";
import {PasswordModule} from "primeng/password";

@Component({
  selector: 'app-register',
  standalone: true,
    imports: [
        ButtonModule,
        CalendarModule,
        CheckboxModule,
        ChipsModule,
        FormsModule,
        InputGroupAddonModule,
        InputGroupModule,
        InputNumberModule,
        InputTextModule,
        InputTextareaModule,
        PanelModule,
        PasswordModule
    ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  name?:string;
  email?:string;
  phone_number?:string;
  password?:string;
  confirm_password?:string;
  company_name?:string;
  address?:string;
  postcode?:string;
  uprn?:string;
  local_auth?:string;
  est_year?: Date;
  employees?:string;
  turnover?:string;
  sector?:string;
  sic_code?:string;
  website_url?:string;
  company_description?:string;
  policy?:boolean;
}
