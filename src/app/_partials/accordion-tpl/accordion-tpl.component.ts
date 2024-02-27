import {AfterViewInit, Component, Input} from '@angular/core';
import {AccordionModule} from "primeng/accordion";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-accordion-tpl',
  standalone: true,
  imports: [
    AccordionModule,
    JsonPipe
  ],
  templateUrl: './accordion-tpl.component.html',
  styleUrl: './accordion-tpl.component.scss'
})
export class AccordionTplComponent implements AfterViewInit{
  accordionItems: any;
  @Input('content') content: any;

  ngAfterViewInit() {
    this.accordionItems = this.content.items.map((x:any) => x.content_type_id)
  }
}
