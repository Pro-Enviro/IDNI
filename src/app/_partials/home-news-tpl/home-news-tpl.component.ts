import { Component } from '@angular/core';
import {DbService} from "../../_services/db.service";
import {NewsCardsTplComponent} from "../news-cards-tpl/news-cards-tpl.component";

@Component({
  selector: 'app-home-news-tpl',
  standalone: true,
  imports: [
    NewsCardsTplComponent
  ],
  templateUrl: './home-news-tpl.component.html',
  styleUrl: './home-news-tpl.component.scss'
})
export class HomeNewsTplComponent {
  newsArticles: any;
  constructor(private db: DbService) {
    this.db.getContentFromCollection(`news_pages`, '?fields=title,news_articles.content_with_image_type_id.*').subscribe({
      next: (res: any) => {
        this.newsArticles = res[0]
        this.newsArticles.news_articles = this.newsArticles.news_articles.map((article:any) =>  article.content_with_image_type_id)
      },
      error: (err:any) => console.error(err)
    })
  }


}
