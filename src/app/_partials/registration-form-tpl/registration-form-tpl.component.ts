import { Component } from '@angular/core';
import {CheckboxModule} from "primeng/checkbox";
import {PanelModule} from "primeng/panel";
import {ButtonModule} from "primeng/button";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputGroupModule} from "primeng/inputgroup";
import {FormsModule} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {PasswordModule} from "primeng/password";
import {CalendarModule} from "primeng/calendar";
import {ChipsModule} from "primeng/chips";


@Component({
  selector: 'app-registration-form-tpl',
  standalone: true,
  imports: [
    CheckboxModule,
    PanelModule,
    ButtonModule,
    RadioButtonModule,
    InputNumberModule,
    InputTextModule,
    InputGroupAddonModule,
    InputGroupModule,
    FormsModule,
    FormsModule,
    InputTextareaModule,
    PasswordModule,
    CalendarModule,
    ChipsModule
  ],
  templateUrl: './registration-form-tpl.component.html',
  styleUrl: './registration-form-tpl.component.scss'
})
export class RegistrationFormTplComponent {
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
