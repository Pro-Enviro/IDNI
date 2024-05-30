import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {ButtonModule} from "primeng/button";
import {AccordionModule} from "primeng/accordion";
import {DbService} from "../../../_services/db.service";
import {CardModule} from "primeng/card";

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [
    RouterLink,
    ButtonModule,
    AccordionModule,
    CardModule
  ],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.scss'
})
export class FaqsComponent {
  content:any;
    constructor(private db: DbService) {
      this.db.getContentFromCollection('faqs_dashboard/1', `?fields=title,faqs_items.faqs_dashboard_ites_id.question,faqs_items.faqs_dashboard_ites_id.answer`).subscribe({
        next: (res: any) => {
          this.content = res
          this.content.faqs_items = this.content.faqs_items.map((item:any) => item.faqs_dashboard_ites_id)
        },
        error: (err: any) => {
          console.error(err)
        }
      })
    }
}

