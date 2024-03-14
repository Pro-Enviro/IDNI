import { Component } from '@angular/core';
import {TopPageImgTplComponent} from "../../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {DbService} from "../../../_services/db.service";

@Component({
  selector: 'app-climate-change-committe',
  standalone: true,
    imports: [
        TopPageImgTplComponent
    ],
  templateUrl: './climate-change-committe.component.html',
  styleUrl: './climate-change-committe.component.scss'
})
export class ClimateChangeCommitteComponent {
  content:any;

  constructor(private db: DbService) {
    this.db.getContentFromCollection('news_pages/10', `
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
