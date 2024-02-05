import { Component } from '@angular/core';
import {HeroComponent} from "../../_partials/hero/hero.component";
import {InfoComponent} from "../../_partials/info/info.component";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    HeroComponent,
    InfoComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

}
