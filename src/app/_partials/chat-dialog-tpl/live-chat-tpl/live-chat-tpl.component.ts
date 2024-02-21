import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DatePipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AvatarModule} from "primeng/avatar";
import {ChipModule} from "primeng/chip";
import {Router, RouterLink} from "@angular/router";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";
import {Message, PrimeNGConfig} from "primeng/api";
import {ConfirmationService,MessageService,ConfirmEventType} from "primeng/api";
import {ChatService} from "../../../_services/chat.service";
import {formChat} from "../chat-dialog-tpl.component";
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

  sendMessage= () => {
    //Scroll Top
    setTimeout(() => {
      let chatScroll = this.chatBoxRef?.nativeElement;
      chatScroll.scrollTop +=500;
    },500)

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

  confirm(event: Event) {
    this.confirmationService.confirm({
      header: 'Are you sure you want to close the chat?',
      message: 'Please confirm to proceed.',
      accept: () => {
        this.messageService.add({ severity: 'success', summary: 'Agree', detail: 'To start a new chat, please fill the form again !', life: 3000 });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Cancel', detail: 'You have rejected to close the chat !', life: 3000 });
      }
    });
  }

  // CLEAR THE CHAT AFTER ONE DAY
  ngOnInit(): void {
    !this.user.email ? this.router.navigate(['chat']) : null

    setInterval(this.getMessages, 1000)
  }


}
