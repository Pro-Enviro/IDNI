import { Component } from '@angular/core';
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {TopPageImgTplComponent} from "../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {ToolbarModule} from "primeng/toolbar";
import {InputTextModule} from "primeng/inputtext";
import {CardModule} from "primeng/card";
import {RouterLink} from "@angular/router";


@Component({
  selector: 'app-knowledge-base',
  standalone: true,
  imports: [
    ButtonModule,
    RippleModule,
    TopPageImgTplComponent,
    ToolbarModule,
    InputTextModule,
    CardModule,
    RouterLink
  ],
  templateUrl: './knowledge-base.component.html',
  styleUrl: './knowledge-base.component.scss'
})
export class KnowledgeBaseComponent {

}
