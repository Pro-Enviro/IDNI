import { Component } from '@angular/core';
import {TopPageImgTplComponent} from "../../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {DbService} from "../../../_services/db.service";

@Component({
  selector: 'app-queen-uni-belfast',
  standalone: true,
  imports: [
    TopPageImgTplComponent
  ],
  templateUrl: './queen-uni-belfast.component.html',
  styleUrl: './queen-uni-belfast.component.scss'
})
export class QueenUniBelfastComponent {
  content:any;
  constructor(private db: DbService) {
    this.db.getContentFromCollection('partners/6', `
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
