import { Component } from '@angular/core';
import {ButtonModule} from "primeng/button";
import {TopPageImgTplComponent} from "../../../_partials/top-page-img-tpl/top-page-img-tpl.component";

@Component({
  selector: 'app-insulation-knowledge',
  standalone: true,
    imports: [
        ButtonModule,
        TopPageImgTplComponent
    ],
  templateUrl: './insulation-knowledge.component.html',
  styleUrl: './insulation-knowledge.component.scss'
})
export class InsulationKnowledgeComponent {

}
