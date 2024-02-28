import {Component, Input} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-news-cards-tpl',
  standalone: true,
  imports: [
    ButtonModule,
    JsonPipe
  ],
  templateUrl: './news-cards-tpl.component.html',
  styleUrl: './news-cards-tpl.component.scss'
})
export class NewsCardsTplComponent {
  @Input('articles') articles: any;
  getArticle = (id: number) => {
    //TODO add model box for news article to open up into using the id to fetch from database.

    //this.db.getContent('id', 'args').subscribe....
  }
}
