import { Component } from '@angular/core';
import {ButtonModule} from "primeng/button";
import {TopPageImgTplComponent} from "../../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {DbService} from "../../../_services/db.service";

@Component({
  selector: 'app-stakeholders',
  standalone: true,
  imports: [
    ButtonModule,
    TopPageImgTplComponent
  ],
  templateUrl: './stakeholders.component.html',
  styleUrl: './stakeholders.component.scss'
})
export class StakeholdersComponent {
  content:any;

  constructor(private db: DbService) {
    this.db.getContentFromCollection('stakeholders/1', `
?fields=title,
content,
top_image,
id,
items.stakeholder_items_id.title,
items.stakeholder_items_id.image,
items.stakeholder_items_id.content
`).subscribe({
      next: (res: any) => {
        this.content = res
        this.content.items = this.content.items.map((item:any) => item.stakeholder_items_id)

      },
      error: (err: any) => {
        console.error(err)
      }
    })
  }
}
