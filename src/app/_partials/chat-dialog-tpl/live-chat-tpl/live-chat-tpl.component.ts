import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DatePipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AvatarModule} from "primeng/avatar";
import {ChipModule} from "primeng/chip";
import {Router, RouterLink} from "@angular/router";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";
import {ConfirmationService,MessageService} from "primeng/api";
import {ChatService} from "../../../_services/chat.service";
import {TagModule} from "primeng/tag";
import {MessagesModule} from "primeng/messages";
import moment from "moment";


export interface chat{
  name?: string;
  email?: string;
  company?: string;
  dateTime?: Date;
  message?: string;
  status?: string; //send or received
}

@Component({
  selector: 'app-live-chat-tpl',
  standalone: true,
  imports: [
    ButtonModule,
    NgIf,
    NgForOf,
    FormsModule,
    JsonPipe,
    AvatarModule,
    DatePipe,
    ChipModule,
    RouterLink,
    ConfirmDialogModule,
    ToastModule,
    TagModule,
    MessagesModule
  ],
  templateUrl: './live-chat-tpl.component.html',
  styleUrl: './live-chat-tpl.component.scss',
  providers: [ConfirmationService,MessageService]
})
export class LiveChatTplComponent implements OnInit  {
  @ViewChild('chat') chatBoxRef ?: ElementRef;

  //NEW CODE
  messages: chat[] = [];
  text: string | undefined;
  private chat: any;
  message: any;
  currentDate = new Date();
  user!: chat;
  isScrolling: boolean = false;
  scrollButton: boolean = false;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private chatService: ChatService,
    private router: Router
  ) {
    this.user = this.chatService.chatUserDetails
    this.getMessages();
  }

  getMessages = ()=> {
    this.chatService.receive().subscribe({
      next: (res:chat[]) => {
        return this.messages = res.filter((message:chat)=> moment(message.dateTime).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD'));
      }
    })
  }


  scrollToBottom = (event: any) => {
    this.isScrolling = false;
  }

  onScrollEnd = () => {
    let chatScroll = this.chatBoxRef?.nativeElement;
    this.isScrolling = (chatScroll.scrollHeight - chatScroll.clientHeight) != chatScroll.scrollTop
  }
  scrollEffect = () => {
    setTimeout(() => {
      let chatScroll = this.chatBoxRef?.nativeElement;
      this.scrollButton = (chatScroll.scrollHeight - chatScroll.clientHeight) != chatScroll.scrollTop
      if(!this.isScrolling){

        chatScroll.scrollTop = (chatScroll.scrollHeight - chatScroll.clientHeight);
        this.isScrolling = false;
      }
    },1000)
  }

  sendMessage= () => {

    this.chatService.send({
      name: this.user.name,
      company: this.user.company,
      email: this.user.email,
      message: this.message,
      dateTime: new Date(),
      status: 'send',
    }).subscribe({
     next: () => this.getMessages()
   })
    this.message = '';
  }

  onKey = (event:any) => {
    this.sendMessage()
  }

  // CLEAR THE CHAT AFTER ONE DAY
  ngOnInit(): void {
    !this.user.email ? this.router.navigate(['chat']) : null

    setInterval(() =>{
      this.getMessages();
     this.scrollEffect();
    },  1000)
  }


}
