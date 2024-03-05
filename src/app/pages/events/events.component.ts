import { Component } from '@angular/core';
import {TopPageImgTplComponent} from "../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    TopPageImgTplComponent,
    ButtonModule
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {

}
