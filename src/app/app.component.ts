import {Component, Injector} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet} from '@angular/router'
import {createCustomElement} from "@angular/elements";
import {ToastModule} from "primeng/toast";
import {MessagesModule} from "primeng/messages";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastModule, MessagesModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent{
  title = 'ID-NI';


  constructor(private injector: Injector) {
    const NewElement1 = createCustomElement(AppComponent, {injector: this.injector})
    customElements.define('dashboard-app', NewElement1)
  }

}
