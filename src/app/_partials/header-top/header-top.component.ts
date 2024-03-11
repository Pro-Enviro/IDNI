import { Component } from '@angular/core';
import {MegaMenuItem, MenuItem} from "primeng/api";
import {MegaMenuModule} from "primeng/megamenu";
import {ButtonModule} from "primeng/button";
import {MenubarModule} from "primeng/menubar";
import {StorageService} from "../../_services/storage.service";
import {SharedModules} from "../../shared-module";
import {RippleModule} from "primeng/ripple";
import {SidebarModule} from "primeng/sidebar";
import {ToastModule} from "primeng/toast";
import {MenuModule} from "primeng/menu";

@Component({
  selector: 'app-header-top',
  standalone: true,
  imports: [
    MegaMenuModule,
    ButtonModule,
    MenubarModule,
    SharedModules,
    RippleModule,
    SidebarModule,
    ToastModule,
    MenuModule
  ],
  templateUrl: './header-top.component.html',
  styleUrl: './header-top.component.scss'
})
export class HeaderTopComponent {
  sidebarVisible: boolean = false;

  // menuItems!: MegaMenuItem[];
  // constructor(private storage: StorageService) {
  //   this.menuItems = this.storage.getMenu.map((x:any) => {
  //     return {
  //       label: x.pagetitle,
  //       routerLink: x.alias
  //     }
  //   });
  // }
  menuItems: MegaMenuItem[] = [
    {
      label: 'Home',
      routerLink: 'home'
    },
    {
      label: 'Project Information',
      items: [
        [
          {
            items: [
              {
                label:'Project Information',
                routerLink:'project-information'
              },
              {
                label: 'Partners',
                routerLink:'partners'
              },
              {
                label: 'Stakeholders',
                routerLink:'stakeholders'
              },
              {
                label:'Advisory Board',
                routerLink:'advisory-board'
              }
            ]
          }
        ]
      ]
    },
    {
      label: 'NI Councils',
      routerLink: 'local-decarbonisation'
    },
    {
      label: 'Events',
      routerLink: 'events'
    },
    {
      label: 'News',
      routerLink: 'coming-soon'
    },
    {
      label: 'COSI\'s',
      routerLink: 'coming-soon'
    },
    {
      label: 'Funding',
      routerLink: 'coming-soon'
    }
  ]

  items: MenuItem[] = [
    {
      items:[
        { label: 'Home',
          routerLink: '/home'}
      ]
    },
    {
      label: 'Project Information',
      items:[
        {
          label:'Project Information',
          routerLink:'/project-information'
        },
        {
          label: 'Partners',
          routerLink:'/partners'
        },
        {
          label: 'Stakeholders',
          routerLink:'/stakeholders'
        },
        {
          label:'Advisory Board',
          routerLink:'/advisory-board'
        }
      ]
    },
    {
      label: 'NI Councils',
      routerLink: 'local-decarbonisation'
    },
    {
      label: 'Events',
      routerLink: 'events'
    },
    {
      label: 'News',
      routerLink: 'coming-soon',
    },
    {
      label: 'COSI\'s',
      routerLink: 'coming-soon',
    },
    {
      label: 'Funding',
      routerLink: 'coming-soon',
    }
  ];

}
