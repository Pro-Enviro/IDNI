import { Component } from '@angular/core';
import {CheckboxModule} from "primeng/checkbox";
import {PanelModule} from "primeng/panel";
import {ButtonModule} from "primeng/button";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";

@Component({
  selector: 'app-registration-form-tpl',
  standalone: true,
  imports: [
    CheckboxModule,
    PanelModule,
    ButtonModule,
    RadioButtonModule,
    InputNumberModule,
    InputTextModule
  ],
  templateUrl: './registration-form-tpl.component.html',
  styleUrl: './registration-form-tpl.component.scss'
})
export class RegistrationFormTplComponent {

}
