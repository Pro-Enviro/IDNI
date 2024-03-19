import { Component } from '@angular/core';
import {TopPageImgTplComponent} from "../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {ButtonModule} from "primeng/button";
import {DbService} from "../../_services/db.service";
import {EventCardsTplComponent} from "../../_partials/event-cards-tpl/event-cards-tpl.component";
import {JsonPipe} from "@angular/common";
import {DropdownModule} from "primeng/dropdown";
import {SharedModules} from "../../shared-module";
import moment from "moment";
import {RouterLink} from "@angular/router";
import {DialogModule} from "primeng/dialog";
import {CardModule} from "primeng/card";

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    TopPageImgTplComponent,
    ButtonModule,
    EventCardsTplComponent,
    JsonPipe,
    DropdownModule,
    SharedModules,
    RouterLink,
    DialogModule,
    CardModule
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {
  visible: boolean = false;
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
event_items.event_items_id.time,
past_events.related_events_pages_id.title,
past_events.related_events_pages_id.content,
past_events.related_events_pages_id.image,
past_events.related_events_pages_id.date,
past_events.related_events_pages_id.venue,
past_events.related_events_pages_id.time,
past_events.related_events_pages_id.link
`).subscribe({
      next: (res: any) => {
        this.content = res
        this.content.event_items = this.content.event_items.map((item:any) => item.event_items_id)
        this.content.event_items = this.content.event_items.sort((a:any,b:any) => moment(a.date, "DD/MM/YYYY").toDate().getTime() - moment(b.date,"DD/MM/YYYY").toDate().getTime())

        this.content.past_events = this.content.past_events.map((event:any) => event.related_events_pages_id)
        this.content.past_events = this.content.past_events.sort((a:any,b:any) => moment(a.date, "DD/MM/YYYY").toDate().getTime() - moment(b.date,"DD/MM/YYYY").toDate().getTime())
      },
      error: (err: any) => {
        console.error(err)
      }
    })
  }

  showDialog() {
    this.visible = true;
  }
}
