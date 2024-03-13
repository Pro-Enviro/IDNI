import { Component } from '@angular/core';
import {DbService} from "../../_services/db.service";
import moment from "moment/moment";
import {ButtonModule} from "primeng/button";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-home-news-tpl',
  standalone: true,
  imports: [
    ButtonModule,
    RouterLink
  ],
  templateUrl: './home-news-tpl.component.html',
  styleUrl: './home-news-tpl.component.scss'
})
export class HomeNewsTplComponent {
  newsArticles: any;

  constructor(private db: DbService) {
    this.db.getContentFromCollection('home_news_section/1', `
?fields=title,
content,
alias,
news_items.related_home_news_section_id.title,
news_items.related_home_news_section_id.date,
news_items.related_home_news_section_id.content,
news_items.related_home_news_section_id.image,
news_items.related_home_news_section_id.alias
`).subscribe({
      next: (res: any) => {
        this.newsArticles = res
        this.newsArticles.news_items = this.newsArticles.news_items.map((article:any) =>  article.related_home_news_section_id)
        this.newsArticles.news_items = this.newsArticles.news_items.sort((a:any,b:any) => moment(a.date, "DD/MM/YYYY").toDate().getTime() - moment(b.date,"DD/MM/YYYY").toDate().getTime())
      },
      error: (err: any) => {
        console.error(err)
      }
    })
  }

}
