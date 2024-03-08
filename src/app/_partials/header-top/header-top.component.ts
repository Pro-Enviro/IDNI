import { Component } from '@angular/core';
import {MegaMenuItem} from "primeng/api";
import {MegaMenuModule} from "primeng/megamenu";
import {ButtonModule} from "primeng/button";
import {MenubarModule} from "primeng/menubar";
import {StorageService} from "../../_services/storage.service";

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
                routerLink:'/coming-soon'
              },
              {
                label: 'Partners'
              },
              {
                label: 'Stakeholders'
              },
              {
                label:'Advisory Board'
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



}
