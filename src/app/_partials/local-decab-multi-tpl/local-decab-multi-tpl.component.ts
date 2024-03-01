import {Component, Input} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {RouterLink} from "@angular/router";
import {JsonPipe} from "@angular/common";
import {DialogModule} from "primeng/dialog";
import {LocalDecabSingleTplComponent} from "../local-decab-single-tpl/local-decab-single-tpl.component";
import {DbService} from "../../_services/db.service";

@Component({
  selector: 'app-local-decab-multi-tpl',
  standalone: true,
  imports: [
    ButtonModule,
    RouterLink,
    JsonPipe,
    DialogModule,
    LocalDecabSingleTplComponent
  ],
  templateUrl: './local-decab-multi-tpl.component.html',
  styleUrl: './local-decab-multi-tpl.component.scss'
})
export class LocalDecabMultiTplComponent {
  @Input('content') content: any;
  visible: boolean = false;


  getArticle = (id: number) => {
    this.visible = true;

  }


}
