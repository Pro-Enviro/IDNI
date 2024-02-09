import { Component } from '@angular/core';
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-log-in-tpl',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    RippleModule,
    RouterLink
  ],
  templateUrl: './log-in-tpl.component.html',
  styleUrl: './log-in-tpl.component.scss'
})
export class LogInTplComponent {

}
