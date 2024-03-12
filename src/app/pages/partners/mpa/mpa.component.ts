import { Component } from '@angular/core';
import {TopPageImgTplComponent} from "../../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {DbService} from "../../../_services/db.service";

@Component({
  selector: 'app-mpa',
  standalone: true,
  imports: [
    TopPageImgTplComponent
  ],
  templateUrl: './mpa.component.html',
  styleUrl: './mpa.component.scss'
})
export class MpaComponent {
  content:any;

  constructor(private db: DbService) {
    this.db.getContentFromCollection('partners/10', `
?fields=title,
content,
summary,
top_image,
image,
alias,
id
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
