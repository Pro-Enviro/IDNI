import { Component } from '@angular/core';
import {TopPageImgTplComponent} from "../../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {DbService} from "../../../_services/db.service";

@Component({
  selector: 'app-climate-crisis',
  standalone: true,
    imports: [
        TopPageImgTplComponent
    ],
  templateUrl: './climate-crisis.component.html',
  styleUrl: './climate-crisis.component.scss'
})
export class ClimateCrisisComponent {
  content:any;

  constructor(private db: DbService) {
    this.db.getContentFromCollection('news_pages/5', `
?fields=title,
content,
summary,
top_image,
image,
alias,
id,
date
`).subscribe({
      next: (res: any) => {
        this.content = res
      },
      error: (err: any) => {
        console.error(err)
      }
    })
  }
}
