import {Component, Input} from '@angular/core';
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-partners-content-tpl',
  standalone: true,
  imports: [
    ButtonModule
  ],
  templateUrl: './partners-content-tpl.component.html',
  styleUrl: './partners-content-tpl.component.scss'
})
export class PartnersContentTplComponent {
  @Input('content') content: any;

  getPage = (id:number) =>{

  }
}
