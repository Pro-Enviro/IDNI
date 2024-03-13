import { Component } from '@angular/core';
import {TopPageImgTplComponent} from "../../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {DbService} from "../../../_services/db.service";

@Component({
  selector: 'app-net-zero-business',
  standalone: true,
  imports: [
    TopPageImgTplComponent
  ],
  templateUrl: './net-zero-business.component.html',
  styleUrl: './net-zero-business.component.scss'
})
export class NetZeroBusinessComponent {
  content:any;

  constructor(private db: DbService) {
    this.db.getContentFromCollection('news_pages/9', `
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
