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
    this.db.getContentFromCollection('local_decarb/1', `
?fields=title,
summary,
content,
id,
las,
las.local_decarb_id,
las.id,
las.related_local_decarb_id.title,
las.related_local_decarb_id.content,
las.related_local_decarb_id.image,
las.related_local_decarb_id.items.item.title,
las.related_local_decarb_id.items.item.content,
las.related_local_decarb_id.items.item.image


`).subscribe({
      next: (res: any) => {
        this.content = res
        this.content.las = this.content.las.map((news:any) => {
          return {
            id: news.id,
            ...news.related_local_decarb_id
          }
        })
      },
      error: (err: any) => {
        console.error(err)
      }
    })
  }

}
