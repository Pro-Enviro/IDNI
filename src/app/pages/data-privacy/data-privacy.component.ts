import { Component } from '@angular/core';
import {TopPageImgTplComponent} from "../../_partials/top-page-img-tpl/top-page-img-tpl.component";

@Component({
  selector: 'app-data-privacy',
  standalone: true,
    imports: [
        TopPageImgTplComponent
    ],
  templateUrl: './data-privacy.component.html',
  styleUrl: './data-privacy.component.scss'
})
export class DataPrivacyComponent {

}
