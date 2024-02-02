import { Component } from '@angular/core';
import {AccordionModule} from "primeng/accordion";

@Component({
  selector: 'app-accordion-tpl',
  standalone: true,
  imports: [
    AccordionModule
  ],
  templateUrl: './accordion-tpl.component.html',
  styleUrl: './accordion-tpl.component.scss'
})
export class AccordionTplComponent {

}
