import { Component } from '@angular/core';
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-news-cards-tpl',
  standalone: true,
  imports: [
    ButtonModule
  ],
  templateUrl: './news-cards-tpl.component.html',
  styleUrl: './news-cards-tpl.component.scss'
})
export class NewsCardsTplComponent {

}
