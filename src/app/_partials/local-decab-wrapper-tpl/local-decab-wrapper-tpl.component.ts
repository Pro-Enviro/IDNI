import {Component, Input} from '@angular/core';
import {LocalDecabSingleTplComponent} from "../local-decab-single-tpl/local-decab-single-tpl.component";
import {DbService} from "../../_services/db.service";

@Component({
  selector: 'app-local-decab-wrapper-tpl',
  standalone: true,
  imports: [
    LocalDecabSingleTplComponent
  ],
  templateUrl: './local-decab-wrapper-tpl.component.html',
  styleUrl: './local-decab-wrapper-tpl.component.scss'
})
export class LocalDecabWrapperTplComponent {
  @Input('content') content: any
  localDecab: any;
  constructor(private db: DbService) {
    this.db.getContent(8, `
?fields=title,
description,
alias,
items.item.*,
items.item.items.content_with_image_type_id.image,
items.item.items.content_with_image_type_id.title,
items.item.items.content_with_image_type_id.content,
items.item.items.content_type_id.title,
items.item.items.content_type_id.content
`).subscribe({
      next: (res: any) => {
        this.content = res.data
      },
      error: (err:any) => console.error(err)
    })
  }
}
