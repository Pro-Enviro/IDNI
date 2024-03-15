import { Component } from '@angular/core';
import {DbService} from "../../_services/db.service";
import {CardModule} from "primeng/card";
import {TopPageImgTplComponent} from "../../_partials/top-page-img-tpl/top-page-img-tpl.component";

@Component({
  selector: 'app-virtual-tour',
  standalone: true,
  imports: [
    CardModule,
    TopPageImgTplComponent
  ],
  templateUrl: './virtual-tour.component.html',
  styleUrl: './virtual-tour.component.scss'
})
export class VirtualTourComponent {
  content:any;

  constructor(private db: DbService) {
    this.db.getContentFromCollection('virtual_tour/1', `
?fields=title,
content,
top_image,
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
