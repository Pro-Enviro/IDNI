import { Component } from '@angular/core';
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-register-success-page',
  standalone: true,
  imports: [
    ButtonModule
  ],
  templateUrl: './register-success-page.component.html',
  styleUrl: './register-success-page.component.scss'
})
export class RegisterSuccessPageComponent {

}
