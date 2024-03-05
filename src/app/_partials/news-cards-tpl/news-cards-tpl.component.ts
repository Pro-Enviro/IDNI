import {Component, Input} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {JsonPipe} from "@angular/common";
import {DbService} from "../../_services/db.service";
import {AfterViewInit, Component, Input} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {RouterLink} from "@angular/router";



export interface newsCard {
  title: string,
  image: string,
  content: string,
  link:string
}
@Component({
  selector: 'app-news-cards-tpl',
  standalone: true,
  imports: [
    ButtonModule,
    JsonPipe
    RouterLink
  ],
  templateUrl: './news-cards-tpl.component.html',
  styleUrl: './news-cards-tpl.component.scss'
})
export class NewsCardsTplComponent {
  @Input('articles') articles: any;

  constructor(private db: DbService) {}
  getArticle = (id: number) => {
    //TODO add model box for news article to open up into using the id to fetch from database.

    // this.db.getContent(30, '?fields=title,news_articles.content_with_image_type_id,news_page_id,id').subscribe({
    //   next: (res:any) => {
    //     console.log(res)
    //     this.articles = res.data
    //   }
    // })
  }
}
