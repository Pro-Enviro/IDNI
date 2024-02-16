import { Component } from '@angular/core';
import {PanelModule} from "primeng/panel";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {LiveChatTplComponent} from "./live-chat-tpl/live-chat-tpl.component";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../_services/users/auth.service";
import {Router, RouterLink} from "@angular/router";


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
    RouterLink
  ],
  templateUrl: './chat-dialog-tpl.component.html',
  styleUrl: './chat-dialog-tpl.component.scss'
})
export class ChatDialogTplComponent {



  name?: string;
  company_name?: string;
  email?: string;

  form: formChat[] = [];

  startChat() {
    if (!this.name || !this.company_name || !this.email) {
      this.form.push({
        name: '',
        email: '',
        company_name: '',
      })
      return;
    }
    this.name = '';
    this.company_name = '';
    this.email = '';


  }
}
