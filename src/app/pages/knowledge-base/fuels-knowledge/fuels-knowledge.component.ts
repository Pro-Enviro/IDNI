import { Component } from '@angular/core';
import {TopPageImgTplComponent} from "../../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-fuels-knowledge',
  standalone: true,
  imports: [
    TopPageImgTplComponent,
    ButtonModule
  ],
  templateUrl: './fuels-knowledge.component.html',
  styleUrl: './fuels-knowledge.component.scss'
})
export class FuelsKnowledgeComponent {

}
