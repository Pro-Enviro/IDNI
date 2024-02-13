import { Component } from '@angular/core';
import {RegistrationFormTplComponent} from "../../_partials/registration-form-tpl/registration-form-tpl.component";
import {TopPageImgTplComponent} from "../../_partials/top-page-img-tpl/top-page-img-tpl.component";

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [
    RegistrationFormTplComponent,
    TopPageImgTplComponent
  ],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss'
})
export class RegistrationFormComponent {

}
