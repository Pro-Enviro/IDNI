import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {chat} from "../_partials/chat-dialog-tpl/live-chat-tpl/live-chat-tpl.component";
import {BehaviorSubject, map} from "rxjs";
import {formChat} from "../_partials/chat-dialog-tpl/chat-dialog-tpl.component";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  chatUser: BehaviorSubject<formChat> = new BehaviorSubject({});
  constructor(private  http: HttpClient) { }

  updateChatUser = (value: formChat) => {
    this.chatUser.next(value);
  }

  public get chatUserDetails(){
    return this.chatUser.value
  }
  send = (message: chat) => {
      return this.http.post<chat>('https://app.idni.eco/items/chat', message).pipe(
        map((x:any) => {
          return x.data;
      }));
  }

  receive = () => {
    return this.http.get<chat>('https://app.idni.eco/items/chat').pipe(
      map((x:any) => {
        return x.data;
      }));
  }

}
