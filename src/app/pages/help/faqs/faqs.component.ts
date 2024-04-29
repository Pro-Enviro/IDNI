import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {ButtonModule} from "primeng/button";
import {AccordionModule} from "primeng/accordion";

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [
    RouterLink,
    ButtonModule,
    AccordionModule
  ],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.scss'
})
export class FaqsComponent {

}
