import { Component } from '@angular/core';
import {TopPageImgTplComponent} from "../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {DbService} from "../../_services/db.service";
import {ButtonModule} from "primeng/button";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-case-studies',
  standalone: true,
  imports: [
    TopPageImgTplComponent,
    ButtonModule,
    RouterLink
  ],
  templateUrl: './case-studies.component.html',
  styleUrl: './case-studies.component.scss'
})
export class CaseStudiesComponent {
  content:any;

  constructor(private db: DbService) {
    this.db.getContentFromCollection('case_studies/1', `
?fields=title,
content,
top_image,
studies.case_studies_items_id.title,
studies.case_studies_items_id.content,
studies.case_studies_items_id.image
`).subscribe({
      next: (res: any) => {
        this.content = res
        this.content.studies = this.content.studies.map((item:any) => item.case_studies_items_id)
      },
      error: (err: any) => {
        console.error(err)
      }
    })
  }
}
