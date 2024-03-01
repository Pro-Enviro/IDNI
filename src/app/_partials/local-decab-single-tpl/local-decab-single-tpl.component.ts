import {Component, Input} from '@angular/core';
import {TopPageImgTplComponent} from "../top-page-img-tpl/top-page-img-tpl.component";
import {DbService} from "../../_services/db.service";
import {findInputsOnElementWithTag} from "@angular/cdk/schematics";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-local-decab-single-tpl',
  standalone: true,
  imports: [
    TopPageImgTplComponent,
    JsonPipe
  ],
  templateUrl: './local-decab-single-tpl.component.html',
  styleUrl: './local-decab-single-tpl.component.scss'
})
export class LocalDecabSingleTplComponent {
  @Input('content') content: any;
  pageItems: any;

  constructor(private db: DbService) {
    this.db.getContent(8, `
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
      next: (res: any) => {
        this.content = res
        this.pageItems = res
      },

      error: (err: any) => {
        console.error(err)
      }
    })
  }


}
