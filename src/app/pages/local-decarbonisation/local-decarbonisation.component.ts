import { Component } from '@angular/core';
import {TopPageImgTplComponent} from "../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-local-decarbonisation',
  standalone: true,
  imports: [
    TopPageImgTplComponent,
    ButtonModule
  ],
  templateUrl: './local-decarbonisation.component.html',
  styleUrl: './local-decarbonisation.component.scss'
})
export class LocalDecarbonisationComponent {

}
