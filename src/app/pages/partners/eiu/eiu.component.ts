import { Component } from '@angular/core';
import {TopPageImgTplComponent} from "../../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {DbService} from "../../../_services/db.service";

@Component({
  selector: 'app-eiu',
  standalone: true,
    imports: [
        TopPageImgTplComponent
    ],
  templateUrl: './eiu.component.html',
  styleUrl: './eiu.component.scss'
})
export class EiuComponent {
  content:any;

  constructor(private db: DbService) {
    this.db.getContentFromCollection('partners/8', `
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
