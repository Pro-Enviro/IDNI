import {Component, Input} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {RouterLink} from "@angular/router";
import {JsonPipe, NgIf} from "@angular/common";
import {DialogModule} from "primeng/dialog";
import {LocalDecabSingleTplComponent} from "../local-decab-single-tpl/local-decab-single-tpl.component";
import {DbService} from "../../_services/db.service";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";


@Component({
  selector: 'app-local-decab-multi-tpl',
  standalone: true,
  imports: [
    ButtonModule,
    RouterLink,
    JsonPipe,
    DialogModule,
    LocalDecabSingleTplComponent,
    NgIf
  ],
  templateUrl: './local-decab-multi-tpl.component.html',
  styleUrl: './local-decab-multi-tpl.component.scss'
})
export class LocalDecabMultiTplComponent {
  @Input('content') content: any;
  visible: boolean = false;


  constructor(
    private http: HttpClient,

  ) {console.log(this.content)}
  getArticle = (id:string) => {
    this.visible = true;
    // return this.http.get(`${this.url}/items/news_pages/${id}?fields=${content.toString()}`)
  console.log(id)
  }

}
