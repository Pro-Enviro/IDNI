import { Component } from '@angular/core';
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {MenuItem} from "primeng/api";
import {PanelMenuModule} from "primeng/panelmenu";
import {MenuModule} from "primeng/menu";
import {MenubarModule} from "primeng/menubar";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    PanelMenuModule,
    MenuModule,
    MenubarModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  items: MenuItem[] = [
    {
      label: 'Home',
      routerLink: '/home'
    },
    {
      label: 'Project Information',
      routerLink:'/project-information'
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
