import {Component, Injector, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterOutlet} from '@angular/router'
import {PetComponent} from "./pages/pet/pet.component";
import {MessageService} from "primeng/api";
import {MessagesModule} from "primeng/messages";
import {ToastModule} from "primeng/toast";
import {RegisterComponent} from "./users/register/register.component";
import {RegisterSuccessPageComponent} from "./users/register/register-success-page/register-success-page.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {createCustomElement} from "@angular/elements";
import {GlobalService} from "./_services/global.service";
import {StorageService} from "./_services/storage.service";


@Component({
  selector: 'app-root',
  standalone: true,
  providers: [MessageService],
  imports: [CommonModule, RouterOutlet, PetComponent, MessagesModule, ToastModule, RegisterComponent, RegisterSuccessPageComponent, DashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent{
  title = 'ID-NI';


  constructor(private injector: Injector, private global: GlobalService, private route: Router, private storage: StorageService) {
    const NewElement1 = createCustomElement(AppComponent, {injector: this.injector})
    customElements.define('dashboard-app', NewElement1)

    this.global.getCurrentUser().subscribe({
      next: (res: any) => {
        if (res.role.name === 'uu' && this.storage.get('role') !== 'uu') {
          this.global.updateRole('uu')
          this.storage.set('role', 'uu')
        }
      },
    })
  }

}
