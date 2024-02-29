import {Component, Input} from '@angular/core';
import {LocalDecabSingleTplComponent} from "../local-decab-single-tpl/local-decab-single-tpl.component";
import {DbService} from "../../_services/db.service";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-local-decab-wrapper-tpl',
  standalone: true,
  imports: [
    LocalDecabSingleTplComponent,
    JsonPipe
  ],
  templateUrl: './local-decab-wrapper-tpl.component.html',
  styleUrl: './local-decab-wrapper-tpl.component.scss'
})
export class LocalDecabWrapperTplComponent {
  content:any;
  constructor(private db: DbService) {
    this.db.getContentFromCollection('news_pages/2', `
?fields=title,
description,
alias,
items.item.*,
items.item.items.content_with_image_type_id.image,
items.item.items.content_with_image_type_id.title,
items.item.items.content_with_image_type_id.content,
items.item.items.content_type_id.title,
items.item.items.content_type_id.content
`).subscribe({
      next: (res: any) => this.content = res,
      error: (err: any) => {
        console.error(err)
      }
    })
  }
}
