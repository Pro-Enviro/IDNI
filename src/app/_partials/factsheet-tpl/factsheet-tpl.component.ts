import { Component } from '@angular/core';
import {DbService} from "../../_services/db.service";
import {FactsheetContentTplComponent} from "./factsheet-content-tpl/factsheet-content-tpl.component";

@Component({
  selector: 'app-factsheet-tpl',
  standalone: true,
  imports: [
    FactsheetContentTplComponent
  ],
  templateUrl: './factsheet-tpl.component.html',
  styleUrl: './factsheet-tpl.component.scss'
})
export class FactsheetTplComponent {
content:any;

  constructor(private db: DbService) {
    this.db.getContentFromCollection('factsheet_tpl/1', `
?fields=title,
content,
idni_logo,
partner_logo,
fact_items.factsheet_items_id.title,
fact_items.factsheet_items_id.content,
fact_items.factsheet_items_id.image,
fact_items.factsheet_items_id.address,
fact_items.factsheet_items_id.email,
fact_items.factsheet_items_id.file_size,
fact_items.factsheet_items_id.website,
fact_items.factsheet_items_id.name,
fact_items.factsheet_items_id.phone_number,
fact_items.factsheet_items_id.date_published,
fact_items.factsheet_items_id.date_range
`).subscribe({
      next: (res: any) => {
        this.content = res
        this.content.fact_items = this.content.fact_items.map((items:any) => items.factsheet_items_id)
      },
      error: (err: any) => {
        console.error(err)
      }
    })
  }

}
