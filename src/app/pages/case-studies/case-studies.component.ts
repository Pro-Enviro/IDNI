import { Component } from '@angular/core';
import {TopPageImgTplComponent} from "../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {DbService} from "../../_services/db.service";

@Component({
  selector: 'app-case-studies',
  standalone: true,
  imports: [
    TopPageImgTplComponent
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
top_image
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
