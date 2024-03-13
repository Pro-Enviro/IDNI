import { Component } from '@angular/core';
import {TopPageImgTplComponent} from "../../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {DbService} from "../../../_services/db.service";

@Component({
  selector: 'app-energy-efficiency',
  standalone: true,
    imports: [
        TopPageImgTplComponent
    ],
  templateUrl: './energy-efficiency.component.html',
  styleUrl: './energy-efficiency.component.scss'
})
export class EnergyEfficiencyComponent {
  content:any;

  constructor(private db: DbService) {
    this.db.getContentFromCollection('news_pages/11', `
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
