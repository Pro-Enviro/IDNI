import { Component } from '@angular/core';
import {MegaMenuItem, MenuItem} from "primeng/api";
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
  menuItems: MegaMenuItem[] = this.storage.getMenu.map((x:any) => {
    return {
      label: x.pagetitle,
      routerLink: x.alias
    }
  });
  constructor(private storage: StorageService) {

  }
  ngOnInit() {
    this.burgerMenuClick();
  }

  burgerMenuClick() {

  }
}
