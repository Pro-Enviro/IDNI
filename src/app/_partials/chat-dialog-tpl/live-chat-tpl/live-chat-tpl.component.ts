import {Component, ElementRef, ViewChild} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DatePipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {elementAt, tap} from "rxjs";
import {FormsModule} from "@angular/forms";


export interface chat{
  name?: string;
  email?: string;
  company?: string;
  dateTime?: Date;
  message?: string;
  status?: string; //send or received
  userId?:string;
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
  private userId: any;

  constructor() {
    this.messages = [
      { name: 'Assistant', company: 'IDNI', message: 'Hello! How can I help you?', dateTime:this.getCurrentTime(),status: 'send', userId:'0' },
      { name: 'User', company: 'User Company', message: 'Hi there! I have a question.', dateTime:this.getCurrentTime(),status: 'received',userId:'1'},
    ];
  }

  sendMessage= () => {
    //Rian's Code Don't delete
    // this.messages.push({
    //   message: this.text,
    //   dateTime: this.getCurrentTime(),
    //   name: 'User\'s Name',
    //   email: 'User\'s Email',
    //   company: 'User\'s Company',
    //   status: 'send',
    // })
    // this.text = '';


    //Scroll Top
    this.chat = document.querySelector(".chat");
    setTimeout(() => {
      this.chat.scrollTop += 500;
    },500)


    //USERS FUNCTION
    const userMessage = {
      name: 'User',
      company: 'User Company',
      message: this.text,
      dateTime: this.getCurrentTime(),
      status: 'send',
      userId:'1'
    };

    // const assistantReply = {
    //   name: 'Assistant',
    //   company: 'IDNI',
    //   message: this.text,
    //   dateTime: this.getCurrentTime(),
    //   status: 'received',
    //   userId:'0'
    // };
    //this.messages.push(userMessage,assistantReply)
    this.messages.push(userMessage)
    this.text = '';
    this.changeUser();
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

  changeUser(){
    const assistantReply = {
      name: 'Assistant',
      company: 'IDNI',
      message: 'Hello! How can I help you?',
      dateTime: this.getCurrentTime(),
      status: 'received',
      userId:'0'
    };
    this.messages.push(assistantReply)
    this.text = '';
  }



}
