import { Component } from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {LocalDecabSingleTplComponent} from "../../_partials/local-decab-single-tpl/local-decab-single-tpl.component";
import {DbService} from "../../_services/db.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    LocalDecabSingleTplComponent,
    DatePipe
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent {
  content:any;


  constructor(private db: DbService) {
    this.db.getContentFromCollection('page/4', `
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
        this.content = this.content.map((items:any) =>  items.content_with_image_type_id)
      },

      error: (err: any) => {
        console.error(err)
      }
    })
  }

  getArticle = (id:any) =>{
    console.log('')
  }
}
