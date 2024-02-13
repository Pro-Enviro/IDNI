import {Component, ElementRef, ViewChild} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {interval, map} from "rxjs";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-live-chat-tpl',
  standalone: true,
    imports: [
        ButtonModule
    ],
  templateUrl: './live-chat-tpl.component.html',
  styleUrl: './live-chat-tpl.component.scss'
})
export class LiveChatTplComponent {
  @ViewChild('inputBox') inputBoxRef?:ElementRef;
  @ViewChild('timeBox') timeBoxRef?:ElementRef;
  chat?:any;
  inputBox?:any
  date?: Date = new Date();

  assistantPhrases ?:any = [
  "Welcome !",
  "How can I help today ?",
  "IDNI assistant is here to help you",
  "Good afternoon",
  "Chat Intelligence is here to help you !",
  "Call us on +1234 567 890",
  "For more information send us a letter by the post"
  ]

  sendMessage= () => {
    const day = new Date();
    console.log(this.date);
  let randomPhrase = Math.floor(Math.random()* this.assistantPhrases.length);
  let assistantMessageText = this.assistantPhrases[randomPhrase];

  // Creating a DIV
  const userDiv = document.createElement("div");
   userDiv.classList.add("user-container");

   //USER P TAG
   const userP= document.createElement("p");

   //TIME P TAG
   const timeBox = document.createElement('span');
   timeBox.classList.add("time-style");
   //TIME FORMAT
    //timeBox.innerHTML = <string>(new DatePipe('en-US').transform(new Date(), 'dd-MM-yyyy hh:mm:ss'));
    timeBox.innerHTML = <string>(new DatePipe('en-US').transform(new Date(), 'hh:mm:ss'));
    //timeBox.innerHTML = this.date?.toLocaleString("en-US") || '';


   this.chat = document.querySelector(".chat");
   this.inputBox = document.querySelector(".inputText");
   userP.innerHTML = this.inputBox.value;
   userP.classList.add("userMsg");
   userDiv.append(userP);
   userDiv.append(timeBox);
   this.chat.appendChild(userDiv);
   this.inputBox.value = "";
   this.chat.scrollTop = this.chat.scrollHeight;

   let typing = document.createElement("p");
   typing.innerHTML = "Assistant is typing ...";
   typing.classList.add("typing-text");
   this.chat.appendChild(typing);
   setTimeout(()=>{
     let assistDiv = document.createElement("div");
     let assistP = document.createElement("p");
     //TIME P TAG
     const timeBox = document.createElement('span');
     timeBox.classList.add("time-style");
     timeBox.innerHTML = <string>(new DatePipe('en-US').transform(new Date(), 'hh:mm:ss'));
     assistP.innerHTML = assistantMessageText;
     assistP.classList.add("assistantMsg");
     assistDiv.classList.add("assistant-container");
     assistDiv.append(assistP);
     assistDiv.append(timeBox);
     this.chat.appendChild(assistDiv);
     this.chat.scrollTop = this.chat.scrollHeight;
     this.chat.removeChild(typing);
   },2000)
  }


  onKey = (event: any) => {
    if (event === "Enter") {
    let random = Math.floor(Math.random()*this.assistantPhrases.length);
    let assistantTextBox = this.assistantPhrases[random];
    const userDiv2 = document.createElement("div");
    userDiv2.classList.add("user-container");
    let userP2 = document.createElement("p");
    userP2.innerHTML = this.inputBox.value;
    userP2.classList.add("userMsg");
    userDiv2.append(userP2);
    this.chat.appendChild(userDiv2);
    this.inputBox.value = "";
    this.chat.scrollTop = this.chat.scrollHeight;

    let type = document.createElement("p");
    type.innerHTML = "Assistant is typing...";
    type.classList.add("typing-text");
    this.chat.appendChild(type);
    setTimeout(() => {
      let assistantMessage = document.createElement("p");
      assistantMessage.innerHTML = assistantTextBox;
      assistantMessage.classList.add("assistantMsg");
      this.chat.appendChild(assistantMessage);
      this.chat.scrollTop = this.chat.scrollHeight;
      this.chat.remove(type);

    },2000)
  }
  }

}
