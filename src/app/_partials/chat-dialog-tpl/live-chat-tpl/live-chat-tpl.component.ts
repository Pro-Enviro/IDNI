import {Component, ElementRef, ViewChild} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DatePipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {tap} from "rxjs";
import {FormsModule} from "@angular/forms";

export interface chat{
  name?: string;
  email?: string;
  company?: string;
  dateTime?: Date;
  message?: string;
  status?: string; //send or recieve
}

@Component({
  selector: 'app-live-chat-tpl',
  standalone: true,
  imports: [
    ButtonModule,
    NgIf,
    NgForOf,
    FormsModule,
    JsonPipe
  ],
  templateUrl: './live-chat-tpl.component.html',
  styleUrl: './live-chat-tpl.component.scss'
})
export class LiveChatTplComponent {
  //NEW CODE
  messages: chat[] = [];
  text: string | undefined;
  private chat: any;
  message: any;

  sendMessage= () => {
    this.messages.push({
      message: this.text,
      dateTime: this.getCurrentTime(),
      name: 'User\'s Name',
      email: 'User\'s Email',
      company: 'User\'s Company',
      status: 'send',
    })
    this.text = '';
  }

  getCurrentTime(): any {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    return `${hours}:${minutes}`;
  }

  onKey = (event:any) => {
    this.sendMessage()
  }



}
