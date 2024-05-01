import { Component } from '@angular/core';
// import {TopPageImgTplComponent} from "../../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {RegisterComponent} from "../register.component";
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CheckboxModule} from "primeng/checkbox";
import {ChipsModule} from "primeng/chips";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputGroupModule} from "primeng/inputgroup";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {PaginatorModule} from "primeng/paginator";
import {PanelModule} from "primeng/panel";
import {PasswordModule} from "primeng/password";
import {DbService} from "../../../_services/db.service";

@Component({
  selector: 'app-registration-form',
  standalone: true,
    imports: [
        RegisterComponent,
        ButtonModule,
        CalendarModule,
        CheckboxModule,
        ChipsModule,
        InputGroupAddonModule,
        InputGroupModule,
        InputNumberModule,
        InputTextModule,
        InputTextareaModule,
        PaginatorModule,
        PanelModule,
        PasswordModule
    ],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss'
})
export class RegistrationFormComponent {

}
