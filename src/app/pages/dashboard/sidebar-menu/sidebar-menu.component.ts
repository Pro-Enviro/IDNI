import {Component, OnInit} from '@angular/core';
import {DividerModule} from "primeng/divider";
import {AuthService} from "../../../_services/users/auth.service";
import {GlobalService} from "../../../_services/global.service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {createDirectus, authentication, rest, logout} from '@directus/sdk';
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [
    DividerModule,
    ButtonModule,
    RippleModule,
    NgIf
  ],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss'
})
export class SidebarMenuComponent {
  dropMenu: boolean = false;
  helpMenu: boolean = false;
  accountMenu: boolean = false;
  uuPermissions: boolean = false;

  constructor(private auth: AuthService, private msg: MessageService, private global: GlobalService) {

  }

  handleLogOut = () => {
    this.auth.logout()
    this.msg.add({
      severity: 'warn',
      summary: 'You have been Logged Out !'
    })
  }

}
