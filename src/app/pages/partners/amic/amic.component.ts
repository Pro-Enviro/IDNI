import { Component } from '@angular/core';
import {TopPageImgTplComponent} from "../../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {DbService} from "../../../_services/db.service";

@Component({
  selector: 'app-amic',
  standalone: true,
  imports: [
    TopPageImgTplComponent
  ],
  templateUrl: './amic.component.html',
  styleUrl: './amic.component.scss'
})
export class AmicComponent {
  content:any;

  constructor(private db: DbService) {
    this.db.getContentFromCollection('partners/7', `
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
