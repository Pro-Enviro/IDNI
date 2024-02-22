import { Component } from '@angular/core';
import {DbService} from "../../_services/db.service";
import {MegaMenuItem, MenuItem} from "primeng/api";
import {MegaMenuModule} from "primeng/megamenu";
import {ButtonModule} from "primeng/button";
import {MenubarModule} from "primeng/menubar";

@Component({
  selector: 'app-header-top',
  standalone: true,
  imports: [
    MegaMenuModule,
    ButtonModule,
    MenubarModule
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
    label: 'Local Decarbonisation',
    routerLink: 'local-decarbonisation'
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

  envirotrackPage: MenuItem[] = [
    {
      label:'<span class="material-symbols-outlined">stacked_line_chart</span> Envirotrack Import',
      routerLink:'envirotrack/import'
    },
    {
      label:'<span class="material-symbols-outlined">monitoring</span> Envirotrack Report',
      routerLink:'envirotrack/report/heatmap'
    },
    {
      label:'<span class="material-symbols-outlined">flowsheet</span> Fuel Data',
      routerLink:'envirotrack/fuel-data',
    }
  ]
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
  ngOnInit() {
    this.burgerMenuClick();
  }

  burgerMenuClick() {

  }
}
