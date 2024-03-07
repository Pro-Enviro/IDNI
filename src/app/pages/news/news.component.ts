import { Component } from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {LocalDecabSingleTplComponent} from "../../_partials/local-decab-single-tpl/local-decab-single-tpl.component";
import {DbService} from "../../_services/db.service";
import {DatePipe} from "@angular/common";
import {TopPageImgTplComponent} from "../../_partials/top-page-img-tpl/top-page-img-tpl.component";


@Component({
  selector: 'app-news',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    LocalDecabSingleTplComponent,
    DatePipe,
    TopPageImgTplComponent
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent {



}
