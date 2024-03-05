import { Component } from '@angular/core';
import {HeroComponent} from "../../_partials/hero/hero.component";
import {InfoComponent} from "../../_partials/info/info.component";
import {DbService} from "../../_services/db.service";
import {JsonPipe} from "@angular/common";
import {ContentTplComponent} from "../../_partials/content-tpl/content-tpl.component";
import {TwoColTplComponent} from "../../_partials/two-col-tpl/two-col-tpl.component";
import {CarouselTplComponent} from "../../_partials/carousel-tpl/carousel-tpl.component";
import {AccordionTplComponent} from "../../_partials/accordion-tpl/accordion-tpl.component";
import {HomeTechnologyTplComponent} from "../../_partials/home-technology-tpl/home-technology-tpl.component";
import {NewsCardsTplComponent} from "../../_partials/news-cards-tpl/news-cards-tpl.component";
import {HomeNewsTplComponent} from "../../_partials/home-news-tpl/home-news-tpl.component";



@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    HeroComponent,
    InfoComponent,
    JsonPipe,
    ContentTplComponent,
    TwoColTplComponent,
    CarouselTplComponent,
    AccordionTplComponent,
    HomeTechnologyTplComponent,
    NewsCardsTplComponent,
    HomeNewsTplComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  content: any;
  tpl: string = 'app-content-tpl';
  constructor(private db: DbService) {
    this.db.getContent(1,`
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
      next: (res: any) => this.content = res,
      error: (err: any) => {
        console.error(err)
      }
    })
  }

}
