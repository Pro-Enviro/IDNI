import { Component } from '@angular/core';
import {ButtonModule} from "primeng/button";
import {TopPageImgTplComponent} from "../../../_partials/top-page-img-tpl/top-page-img-tpl.component";

@Component({
  selector: 'app-heating-knowledge',
  standalone: true,
    imports: [
        ButtonModule,
        TopPageImgTplComponent
    ],
  templateUrl: './heating-knowledge.component.html',
  styleUrl: './heating-knowledge.component.scss'
})
export class HeatingKnowledgeComponent {

}
