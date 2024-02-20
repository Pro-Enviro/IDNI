import {Component, ElementRef, ViewChild} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DatePipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AvatarModule} from "primeng/avatar";
import {ChipModule} from "primeng/chip";
import {RouterLink} from "@angular/router";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";
import {PrimeNGConfig} from "primeng/api";
import {ConfirmationService,MessageService,ConfirmEventType} from "primeng/api";
import {ChatService} from "../../../_services/chat.service";


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
    ToastModule
  ],
  templateUrl: './live-chat-tpl.component.html',
  styleUrl: './live-chat-tpl.component.scss',
  providers: [ConfirmationService,MessageService]
})
export class LiveChatTplComponent {
  @ViewChild('chat') chatBoxRef ?: ElementRef;
  //NEW CODE
  messages: chat[] = [];
  text: string | undefined;
  private chat: any;
  message: any;
  private userId: any;
  currentDate = new Date();
  user!: chat;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private chatService: ChatService
  ) {
    this.user = this.chatService.chatUserDetails

    console.log(this.user)
    this.getMessages();
  }


  getMessages = ()=> {
    this.chatService.receive().subscribe({
      next: (res:chat[]) => this.messages = res
    })
  }



  sendMessage= () => {
    //Scroll Top
    setTimeout(() => {
      let chatScroll = this.chatBoxRef?.nativeElement;
      chatScroll.scrollTop +=500;
    },500)

   this.chatService.send({
      name: 'Name',
      company: 'Company',
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

  currentDayMessages: any[] = [];
  filterMessagesByDate(date: Date): void {
    this.currentDayMessages = this.messages.filter((message) => {
      const messageDate = new Date(this.currentDate);
      return messageDate.toDateString() === date.toDateString();
    });
  }
  ngOnInit(): void {
    const currentDate = new Date();
    this.filterMessagesByDate(currentDate);
  }
}
