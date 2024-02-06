import { Component } from '@angular/core';
import {DbService} from "../../_services/db.service";
import {MegaMenuItem} from "primeng/api";
import {MegaMenuModule} from "primeng/megamenu";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-header-top',
  standalone: true,
  imports: [
    MegaMenuModule,
    ButtonModule
  ],
  templateUrl: './header-top.component.html',
  styleUrl: './header-top.component.scss'
})
export class HeaderTopComponent {
  menuItems: MegaMenuItem[] = [{
    label: 'Home',
    routerLink: '/'
  },{
    label: 'Project Information',
    routerLink: 'coming-soon'
  },{
    label: 'News',
    routerLink: 'coming-soon'
  },{
    label: 'Events',
    routerLink: 'coming-soon'
  },{
    label: 'COSI\'s',
    routerLink: 'coming-soon'
  }, {
    label: 'Funding',
    routerLink: 'coming-soon'
  }
  // },{
  //   label: 'Login',
  //   url: 'https://my.proenviro.co.uk'
  // }
  ];
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
