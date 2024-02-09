import { Component } from '@angular/core';
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";

@Component({
  selector: 'app-log-in-tpl',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    RippleModule
  ],
  templateUrl: './log-in-tpl.component.html',
  styleUrl: './log-in-tpl.component.scss'
})
export class LogInTplComponent {

}
