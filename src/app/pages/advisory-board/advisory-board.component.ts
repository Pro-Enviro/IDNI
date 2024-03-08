import { Component } from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DbService} from "../../_services/db.service";
import {TopPageImgTplComponent} from "../../_partials/top-page-img-tpl/top-page-img-tpl.component";

@Component({
  selector: 'app-advisory-board',
  standalone: true,
  imports: [
    ButtonModule,
    TopPageImgTplComponent
  ],
  templateUrl: './advisory-board.component.html',
  styleUrl: './advisory-board.component.scss'
})
export class AdvisoryBoardComponent {
content:any;

  constructor(private db: DbService) {
    this.db.getContentFromCollection('board/1', `
?fields=title,
content,
top_image,
id,
advisory_board_items.board_items_id.title,
advisory_board_items.board_items_id.content,
advisory_board_items.board_items_id.image
`).subscribe({
      next: (res: any) => {
        this.content = res
        this.content.advisory_board_items = this.content.advisory_board_items.map((item:any) => item.board_items_id)

      },
      error: (err: any) => {
        console.error(err)
      }
    })
  }
}
