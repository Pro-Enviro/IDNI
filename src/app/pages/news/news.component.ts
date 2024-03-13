import { Component } from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {LocalDecabSingleTplComponent} from "../../_partials/local-decab-single-tpl/local-decab-single-tpl.component";
import {DbService} from "../../_services/db.service";
import {DatePipe} from "@angular/common";
import {TopPageImgTplComponent} from "../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {RouterLink} from "@angular/router";
import moment from "moment";


@Component({
  selector: 'app-news',
  standalone: true,
    imports: [
        ButtonModule,
        DialogModule,
        LocalDecabSingleTplComponent,
        DatePipe,
        TopPageImgTplComponent,
        RouterLink
    ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent {
  content: any;
  constructor(private db: DbService) {
    this.db.getContentFromCollection('news_pages/1', `
?fields=title,
content,
alias,
top_image,
news_page_items.related_news_pages_id.title,
news_page_items.related_news_pages_id.date,
news_page_items.related_news_pages_id.content,
news_page_items.related_news_pages_id.image,
news_page_items.related_news_pages_id.alias
`).subscribe({
      next: (res: any) => {
        this.content = res
        this.content.news_page_items = this.content.news_page_items.map((article:any) =>  article.related_news_pages_id)
        this.content.news_page_items = this.content.news_page_items.sort((a:any,b:any) => moment(a.date, "DD/MM/YYYY").toDate().getTime() - moment(b.date,"DD/MM/YYYY").toDate().getTime())
      },
      error: (err: any) => {
        console.error(err)
      }
    })
  }


}
