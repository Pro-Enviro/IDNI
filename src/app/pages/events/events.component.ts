import { Component } from '@angular/core';
import {TopPageImgTplComponent} from "../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {ButtonModule} from "primeng/button";
import {DbService} from "../../_services/db.service";
import {EventCardsTplComponent} from "../../_partials/event-cards-tpl/event-cards-tpl.component";
import {JsonPipe} from "@angular/common";
import {DropdownModule} from "primeng/dropdown";
import {SharedModules} from "../../shared-module";
import moment from "moment";

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    TopPageImgTplComponent,
    ButtonModule,
    EventCardsTplComponent,
    JsonPipe,
    DropdownModule,
    SharedModules
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {
  content:any;
  selectedDate: any;
  eventOptions:any =[
    {
      name:'Past Events'
    },
    {
      name:'Future Events'
    }
  ]

  constructor(private db: DbService) {
    this.db.getContentFromCollection('events_pages/3', `
?fields=title,
content,
id,
top_image,
event_items.event_items_id.title,
event_items.event_items_id.content,
event_items.event_items_id.image,
event_items.event_items_id.date,
event_items.event_items_id.venue,
event_items.event_items_id.time

`).subscribe({
      next: (res: any) => {
        this.content = res
        this.content.event_items = this.content.event_items.map((item:any) => item.event_items_id)
        this.content.event_items = this.content.event_items.sort((a:any,b:any) => moment(a.date, "DD/MM/YYYY").toDate().getTime() - moment(b.date,"DD/MM/YYYY").toDate().getTime())
        console.log(this.content.event_items)
      },
      error: (err: any) => {
        console.error(err)
      }
    })
  }

}
