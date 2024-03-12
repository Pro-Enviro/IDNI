import { Component } from '@angular/core';
import {DbService} from "../../../../../_services/db.service";
import {TopPageImgTplComponent} from "../../../../../_partials/top-page-img-tpl/top-page-img-tpl.component";

@Component({
  selector: 'app-floating',
  standalone: true,
  imports: [
    TopPageImgTplComponent
  ],
  templateUrl: './floating.component.html',
  styleUrl: './floating.component.scss'
})
export class FloatingComponent {
  content:any;
  constructor(private db: DbService) {
    this.db.getContentFromCollection('technologies_single/8', `
?fields=title,
content,
top_image,
image,
alias,
id,
summary
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
