import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {TopPageImgTplComponent} from "../top-page-img-tpl/top-page-img-tpl.component";
import {DbService} from "../../_services/db.service";
import {findInputsOnElementWithTag} from "@angular/cdk/schematics";
import {JsonPipe} from "@angular/common";
import {LocalBecabSingleContentComponent} from "../local-becab-single-content/local-becab-single-content.component";

@Component({
  selector: 'app-local-decab-single-tpl',
  standalone: true,
  imports: [
    TopPageImgTplComponent,
    JsonPipe,
    LocalBecabSingleContentComponent
  ],
  templateUrl: './local-decab-single-tpl.component.html',
  styleUrl: './local-decab-single-tpl.component.scss'
})
export class LocalDecabSingleTplComponent implements OnInit, OnChanges{
  @Input('content') content: any;
  id: any = '3';
  pageItems:any;
  constructor(private db: DbService) {

  }

  fetchNews = () => {
    this.db.getContentFromCollection(`news_pages/${this.id}`, `
?fields=title,
content,
id,
news_articles.content_with_image_type_id.title,news_articles.content_with_image_type_id.content,news_articles.content_with_image_type_id.image
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

ngOnInit = () =>{
    // this.fetchNews()

}

ngOnChanges = (e: any) => {
  console.log(e)
}
}
