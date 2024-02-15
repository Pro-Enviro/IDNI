import { Component } from '@angular/core';
import {TopPageImgTplComponent} from "../../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {RegisterComponent} from "../register.component";

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [
    RegisterComponent,
    TopPageImgTplComponent
  ],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss'
})
export class RegistrationFormComponent {

}
