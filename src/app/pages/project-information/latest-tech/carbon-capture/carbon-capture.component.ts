import { Component } from '@angular/core';
import {ButtonModule} from "primeng/button";
import {RouterLink} from "@angular/router";
import {TopPageImgTplComponent} from "../../../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {DbService} from "../../../../_services/db.service";

@Component({
  selector: 'app-carbon-capture',
  standalone: true,
  imports: [
    ButtonModule,
    RouterLink,
    TopPageImgTplComponent
  ],
  templateUrl: './carbon-capture.component.html',
  styleUrl: './carbon-capture.component.scss'
})
export class CarbonCaptureComponent {
  content:any;

  constructor(private db: DbService) {
    this.db.getContentFromCollection('technologies/4', `
?fields=title,
content,
top_image,
id,
alias,
items.technologies_items_id.title,
items.technologies_items_id.content,
items.technologies_items_id.image,
items.technologies_items_id.alias
`).subscribe({
      next: (res: any) => {
        this.content = res
        this.content.items = this.content.items.map((item:any) => item.technologies_items_id)
      },
      error: (err: any) => {
        console.error(err)
      }
    })
  }
}
