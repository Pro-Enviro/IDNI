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
    this.db.getContentFromCollection('news_pages/1', `
?fields=title,
content,
alias,
news_articles.related_news_pages_id.title,
news_articles.related_news_pages_id.date,
news_articles.related_news_pages_id.content,
news_articles.related_news_pages_id.image,
news_articles.related_news_pages_id.alias
`).subscribe({
      next: (res: any) => {
        this.newsArticles = res
        this.newsArticles.news_articles = this.newsArticles.news_articles.map((article:any) =>  article.related_news_pages_id)
        this.newsArticles.news_articles = this.newsArticles.news_articles.sort((a:any,b:any) => moment(a.date, "DD/MM/YYYY").toDate().getTime() - moment(b.date,"DD/MM/YYYY").toDate().getTime())
      },
      error: (err: any) => {
        console.error(err)
      }
    })
  }

}
