import { Component } from '@angular/core';
import {PartnersContentTplComponent} from "./partners-content-tpl/partners-content-tpl.component";

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [
    PartnersContentTplComponent
  ],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss'
})
export class PartnersComponent {

}
