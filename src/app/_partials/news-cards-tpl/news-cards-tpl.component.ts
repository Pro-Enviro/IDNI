import {Component, Input} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-news-cards-tpl',
  standalone: true,
  imports: [
    ButtonModule,
    RouterLink
  ],
  templateUrl: './news-cards-tpl.component.html',
  styleUrl: './news-cards-tpl.component.scss'
})
export class NewsCardsTplComponent {
  //@Input('content') content: any;
  @Input('news') newsCard: any;
}
