import { Component } from '@angular/core';
import {TopPageImgTplComponent} from "../../../../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {DbService} from "../../../../../_services/db.service";

@Component({
  selector: 'app-utilization',
  standalone: true,
    imports: [
        TopPageImgTplComponent
    ],
  templateUrl: './utilization.component.html',
  styleUrl: './utilization.component.scss'
})
export class UtilizationComponent {
  content:any;
  constructor(private db: DbService) {
    this.db.getContentFromCollection('technologies_single/4', `
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
