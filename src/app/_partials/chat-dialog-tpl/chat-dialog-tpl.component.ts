import { Component } from '@angular/core';
import {PanelModule} from "primeng/panel";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {LiveChatTplComponent} from "./live-chat-tpl/live-chat-tpl.component";

@Component({
  selector: 'app-chat-dialog-tpl',
  standalone: true,
  imports: [
    PanelModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    LiveChatTplComponent
  ],
  templateUrl: './chat-dialog-tpl.component.html',
  styleUrl: './chat-dialog-tpl.component.scss'
})
export class ChatDialogTplComponent {

}
