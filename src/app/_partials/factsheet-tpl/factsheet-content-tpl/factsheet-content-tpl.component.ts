import {Component, Input} from '@angular/core';
import {DbService} from "../../../_services/db.service";

@Component({
  selector: 'app-factsheet-content-tpl',
  standalone: true,
  imports: [],
  templateUrl: './factsheet-content-tpl.component.html',
  styleUrl: './factsheet-content-tpl.component.scss'
})
export class FactsheetContentTplComponent {
  @Input('content') content: any;

  constructor(private db: DbService) {
    this.db.getContentFromCollection('factsheet_items/1', `
?fields=title,
content,
image,
address,
email,
file_size,
website,
name,
phone_number,
date_published,
date_range
`).subscribe({
      next: (res: any) => {
        this.content = res

      },
      error: (err: any) => {
        console.error(err)
      }
    })
  }
}
