import {Component, OnInit} from '@angular/core';
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
import {PanelMenuModule} from "primeng/panelmenu";
import {GlobalService} from "../../_services/global.service";
import {EnvirotrackService} from "../../pages/envirotrack/envirotrack.service";
import {AuthService} from "../../_services/users/auth.service";

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
    MenuModule,
    PanelMenuModule
  ],
  templateUrl: './header-top.component.html',
  styleUrl: './header-top.component.scss'
})
export class HeaderTopComponent implements OnInit {
  sidebarVisible: boolean = false;
  loggedIn: boolean = false;

  constructor(private global: GlobalService, private track: EnvirotrackService, private auth: AuthService) {

  }

  // menuItems!: MegaMenuItem[];
  // constructor(private storage: StorageService) {
  //   this.menuItems = this.storage.getMenu.map((x:any) => {
  //     return {
  //       label: x.pagetitle,
  //       routerLink: x.alias
  //     }
  //   });
  // }

  logout = ()  => {
    this.auth.logout()
  }

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
              },
              {
                label:'Latest Technologies',
                routerLink:'latest-technologies'
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
      label:'Virtual Tour',
      routerLink:'virtual-tour'
    },
    {
      label: 'Events',
      routerLink: 'events'
    },
    {
      label: 'News',
      routerLink: 'news'
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
    label: 'Home',
      routerLink: '/home'
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
        },
        {
          label:'Latest Technologies',
          routerLink:'latest-technologies'
        }
      ]
    },
    {
      label: 'NI Councils',
      routerLink: 'local-decarbonisation'
    },
    {
      label:'Virtual Tour',
      routerLink:'virtual-tour'
    },
    {
      label: 'Events',
      routerLink: 'events'
    },
    {
      label:'Virtual Tour',
      routerLink:'virtual-tour'
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


    ngOnInit() {
      // this.global.getCurrentUser().subscribe({
      //   next: (res: any) => {
      //     this.loggedIn = !!res.email;
      //   }
      // })
    }
}
