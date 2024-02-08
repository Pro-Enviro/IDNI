import { Component } from '@angular/core';
import {TopPageImgTplComponent} from "../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {ButtonModule} from "primeng/button";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {LocalDecabSingleTplComponent} from "../../_partials/local-decab-single-tpl/local-decab-single-tpl.component";

@Component({
  selector: 'app-local-decarbonisation',
  standalone: true,
  imports: [
    TopPageImgTplComponent,
    ButtonModule,
    RouterLink,
    RouterLinkActive,
    LocalDecabSingleTplComponent
  ],
  templateUrl: './local-decarbonisation.component.html',
  styleUrl: './local-decarbonisation.component.scss'
})
export class LocalDecarbonisationComponent {

}
