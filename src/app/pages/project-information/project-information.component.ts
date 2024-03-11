import { Component } from '@angular/core';
import {ButtonModule} from "primeng/button";
import {TopPageImgTplComponent} from "../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {DbService} from "../../_services/db.service";

@Component({
  selector: 'app-project-information',
  standalone: true,
    imports: [
        ButtonModule,
        TopPageImgTplComponent
    ],
  templateUrl: './project-information.component.html',
  styleUrl: './project-information.component.scss'
})
export class ProjectInformationComponent {
  content:any;

  constructor(private db: DbService) {
    this.db.getContentFromCollection('project_info/1', `
?fields=title,
content,
top_image,
id,
project_list.project_list_id.title,
project_list.project_list_id.content,
project_list.project_list_id.image
`).subscribe({
      next: (res: any) => {
        this.content = res
        this.content.project_list = this.content.project_list.map((item:any) => item.project_list_id)

      },
      error: (err: any) => {
        console.error(err)
      }
    })
  }
}
