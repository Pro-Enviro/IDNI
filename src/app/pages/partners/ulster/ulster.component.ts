import { Component } from '@angular/core';
import {TopPageImgTplComponent} from "../../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {DbService} from "../../../_services/db.service";

@Component({
  selector: 'app-ulster',
  standalone: true,
  imports: [
    TopPageImgTplComponent
  ],
  templateUrl: './ulster.component.html',
  styleUrl: './ulster.component.scss'
})
export class UlsterComponent {
  content:any;

  constructor(private db: DbService) {
    this.db.getContentFromCollection('partners/9', `
?fields=title,
content,
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
