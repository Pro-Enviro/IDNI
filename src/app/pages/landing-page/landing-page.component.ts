import { Component } from '@angular/core';
import {HeroComponent} from "../../_partials/hero/hero.component";
import {InfoComponent} from "../../_partials/info/info.component";
import {DbService} from "../../_services/db.service";

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
  constructor(private db: DbService) {
    let args = `?fields=title,description,alias,items.item.*`
    this.db.getContent(1,args).subscribe({
      next: (res: any) => {
        console.log(res)
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }
}
