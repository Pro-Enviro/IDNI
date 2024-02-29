import { Component } from '@angular/core';
import {TopPageImgTplComponent} from "../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {ButtonModule} from "primeng/button";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {LocalDecabSingleTplComponent} from "../../_partials/local-decab-single-tpl/local-decab-single-tpl.component";
import {DbService} from "../../_services/db.service";
import {LocalDecabMultiTplComponent} from "../../_partials/local-decab-multi-tpl/local-decab-multi-tpl.component";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-local-decarbonisation',
  standalone: true,
  imports: [
    TopPageImgTplComponent,
    ButtonModule,
    RouterLink,
    RouterLinkActive,
    LocalDecabSingleTplComponent,
    LocalDecabMultiTplComponent,
    JsonPipe
  ],
  templateUrl: './local-decarbonisation.component.html',
  styleUrl: './local-decarbonisation.component.scss'
})
export class LocalDecarbonisationComponent {
  content:any;
  constructor(private db: DbService) {
    this.db.getContentFromCollection('news_pages/2', `
?fields=title,
content
,news_articles.content_with_image_type_id.title,news_articles.content_with_image_type_id.content,news_articles.content_with_image_type_id.image
`).subscribe({
      next: (res: any) => {
        this.content = res
        this.content.news_articles = this.content.news_articles.map((items:any) =>  items.content_with_image_type_id)
      },

      error: (err: any) => {
        console.error(err)
      }
    })
  }

}
