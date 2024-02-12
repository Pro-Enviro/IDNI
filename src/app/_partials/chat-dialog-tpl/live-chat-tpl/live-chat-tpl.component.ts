import {Component, ElementRef, ViewChild} from '@angular/core';
import {ButtonModule} from "primeng/button";

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
typing:string ='';
// userText = '';
chat?:any;
inputBox?:any

assistantPhrases ?:any = [
  "Welcome !",
  "How can I help today ?",
  "Good morning",
  "Good afternoon",
  "Thank you",
  "Call us on +1234 567 890",
  "For more information send us a letter by the post"
  ]

  sendMessage= () => {
  let randomPhrase = Math.floor(Math.random()* this.assistantPhrases.length);
  let assistantMessagetext = this.assistantPhrases[randomPhrase];
  const userDiv = document.createElement("div");
   userDiv.classList.add("user-container");
   const userP= document.createElement("p");
   this.chat = document.querySelector(".chat-container");
   this.inputBox = document.querySelector(".inputText");
   userP.innerHTML = this.inputBox.value;
   userP.classList.add("userMsg");
   userDiv.append(userP);
   this.chat.appendChild(userDiv);
   this.inputBox.value = "";
   this.chat.scrollTop = this.chat.scrollHeight;

   let typing = document.createElement("span");
   typing.innerHTML = "Assistant is typing ...";
   typing.classList.add("typing-text");
   setTimeout(()=>{
     let assistP = document.createElement("p");
     assistP.innerHTML = assistantMessagetext;
     assistP.classList.add("assistantMsg");
     this.chat.appendChild(assistP);
     this.chat.scrollTop = this.chat.scrollHeight;
     this.chat.removeChild(typing);

   },2000)
  }
  onKey = (event: any) => {
    // this.userText = event.target.value;
    if (event === "Enter") {
    let random = Math.floor(Math.random()*this.assistantPhrases.length);
    let assistantTextBox = this.assistantPhrases[random];

    let userP2 = document.createElement("p");
    userP2.innerHTML = this.inputBox.value;
    userP2.classList.add("userMsg");
    this.chat.appendChild(userP2);
    this.inputBox.value = "";
    this.chat.scrollTop = this.chat.scrollHeight;

    let type = document.createElement("span");
    type.innerHTML = "Assistant/User is typing";
    type.classList.add("typing-text");
    this.chat.appendChild(type);
    setTimeout(() => {
      let assistantMessage = document.createElement("p");
      assistantMessage.innerHTML = assistantTextBox;
      assistantMessage.classList.add("assistantMsg");
      this.chat.appendChild(assistantMessage);
      this.chat.scrollTop = this.chat.scrollHeight;
      this.chat.removeChild(type);

    },2000)
  }
  }

}
