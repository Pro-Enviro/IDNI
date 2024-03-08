import { Component } from '@angular/core';
import {PartnersContentTplComponent} from "./partners-content-tpl/partners-content-tpl.component";
import {TopPageImgTplComponent} from "../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {DbService} from "../../_services/db.service";
import {SinglePartnerComponent} from "./single-partner/single-partner.component";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [
    PartnersContentTplComponent,
    TopPageImgTplComponent,
    SinglePartnerComponent,
    JsonPipe
  ],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss'
})
export class PartnersComponent {
partners:any;

  constructor(private db: DbService) {
    this.db.getContentFromCollection('partners/1', `
?fields=title,
content,
top_image,
id,
items.partner_items_id.id,
items.partner_items_id.title,
items.partner_items_id.content,
items.partner_items_id.image,
partner_single.related_partners_id.title,
partner_single.related_partners_id.content,
partner_single.related_partners_id.image,
partner_single.related_partners_id.top_image
`).subscribe({
      next: (res: any) => {
        this.partners = res
        this.partners.items = this.partners.items.map((item:any) => item.partner_items_id)
        this.partners.partner_single = this.partners.partner_single.map((article:any) => article.related_partners_id)
      },
      error: (err: any) => {
        console.error(err)
      }
    })
  }
}
