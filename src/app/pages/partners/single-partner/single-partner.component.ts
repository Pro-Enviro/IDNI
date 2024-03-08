import { Component } from '@angular/core';
import {TopPageImgTplComponent} from "../../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {DbService} from "../../../_services/db.service";

@Component({
  selector: 'app-single-partner',
  standalone: true,
    imports: [
        TopPageImgTplComponent
    ],
  templateUrl: './single-partner.component.html',
  styleUrl: './single-partner.component.scss'
})
export class SinglePartnerComponent {
content:any;

  constructor(private db: DbService) {
    this.db.getContentFromCollection('partners/2', `
?fields=title,
content,
top_image,
image,
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
