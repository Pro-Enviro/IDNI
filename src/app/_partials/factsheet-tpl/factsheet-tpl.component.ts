import { Component } from '@angular/core';
import {DbService} from "../../_services/db.service";
import {FactsheetContentTplComponent} from "./factsheet-content-tpl/factsheet-content-tpl.component";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-factsheet-tpl',
  standalone: true,
    imports: [
        FactsheetContentTplComponent,
        JsonPipe
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
address,
email,
website,
phone_number,
fact_items.factsheet_items_id.title,
fact_items.factsheet_items_id.content,
fact_items.factsheet_items_id.image,
fact_files.factsheet_files_id.name,
fact_files.factsheet_files_id.date_published,
fact_files.factsheet_files_id.date_range,
fact_files.factsheet_files_id.file_size

`).subscribe({
      next: (res: any) => {
        this.content = res
        this.content.fact_items = this.content.fact_items.map((items:any) => items.factsheet_items_id)
          this.content.fact_files = this.content.fact_files.map((files:any) => files.factsheet_files_id)
      },
      error: (err: any) => {
        console.error(err)
      }
    })
  }

}
