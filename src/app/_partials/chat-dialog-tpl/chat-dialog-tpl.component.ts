import { Component } from '@angular/core';
import {PanelModule} from "primeng/panel";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {LiveChatTplComponent} from "./live-chat-tpl/live-chat-tpl.component";
import {FormControl, FormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../_services/users/auth.service";
import {Router, RouterLink} from "@angular/router";
import {NgClass, NgIf} from "@angular/common";
import {ChatService} from "../../_services/chat.service";
import {MessageModule} from "primeng/message";


export interface formChat{
  name?: string;
  company_name?: string;
  email?: string;
}


@Component({
  selector: 'app-chat-dialog-tpl',
  standalone: true,
  imports: [
    PanelModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    LiveChatTplComponent,
    FormsModule,
    RouterLink,
    NgClass,
    NgIf,
    MessageModule
  ],
  templateUrl: './chat-dialog-tpl.component.html',
  styleUrl: './chat-dialog-tpl.component.scss'
})


export class ChatDialogTplComponent {

  name?: string;
  company_name?: string;
  email?:string;

  constructor(
    private chat: ChatService,
    private router: Router
  ) {

  }


  startChat() {
    this.chat.updateChatUser({
      name: this.name,
      email: this.email,
      company_name: this.company_name
    })

    this.router.navigate(['live-chat'])
  }
}
