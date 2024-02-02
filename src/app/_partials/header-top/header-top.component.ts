import { Component } from '@angular/core';
import {DbService} from "../../_services/db.service";
import {MegaMenuItem} from "primeng/api";
import {MegaMenuModule} from "primeng/megamenu";

@Component({
  selector: 'app-header-top',
  standalone: true,
  imports: [
    MegaMenuModule
  ],
  templateUrl: './header-top.component.html',
  styleUrl: './header-top.component.scss'
})
export class HeaderTopComponent {
  menuItems: MegaMenuItem[] = [{
    label: 'Home',
  },{
    label: 'Project Information'
  },{
    label: 'News'
  },{
    label: 'Events'
  },{
    label: 'COSI\'s'
  },{
    label: 'Funding'
  },{
    label: 'Login',
    url: 'https://my.proenviro.co.uk'
  }];
  constructor(/*db: DbService*/) {
   /* db.getMenu().subscribe({
      next: (res: any) => this.menuItems = res.map((item: any) => {
        return {
          label: item.title,
          routerLink: item.title.replaceAll(' ','').toLowerCase()
        }
      })
    })*/
  }
}
