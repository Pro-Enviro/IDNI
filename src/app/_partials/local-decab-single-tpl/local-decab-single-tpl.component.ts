import {Component, Input} from '@angular/core';
import {TopPageImgTplComponent} from "../top-page-img-tpl/top-page-img-tpl.component";
import {DbService} from "../../_services/db.service";
import {findInputsOnElementWithTag} from "@angular/cdk/schematics";

@Component({
  selector: 'app-local-decab-single-tpl',
  standalone: true,
  imports: [
    TopPageImgTplComponent
  ],
  templateUrl: './local-decab-single-tpl.component.html',
  styleUrl: './local-decab-single-tpl.component.scss'
})
export class LocalDecabSingleTplComponent {
  @Input('content') content: any
  decabItems: any;


}
