import {Component, Input} from '@angular/core';
import {ButtonModule} from "primeng/button";


@Component({
  selector: 'app-event-cards-tpl',
  standalone: true,
  imports: [
    ButtonModule
  ],
  templateUrl: './event-cards-tpl.component.html',
  styleUrl: './event-cards-tpl.component.scss'
})
export class EventCardsTplComponent {
  @Input('content') content: any;

}
