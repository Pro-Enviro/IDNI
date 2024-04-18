import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet} from '@angular/router';
import {HeaderTopComponent} from "./_partials/header-top/header-top.component";
import {HeroComponent} from "./_partials/hero/hero.component";
import {InfoComponent} from "./_partials/info/info.component";
import {LandingPageComponent} from "./pages/landing-page/landing-page.component";
import {PetComponent} from "./pages/pet/pet.component";
import {FooterComponent} from "./_partials/footer/footer.component";
import {MessageService} from "primeng/api";
import {MessagesModule} from "primeng/messages";
import {ToastModule} from "primeng/toast";
import {RegisterComponent} from "./users/register/register.component";


@Component({
  selector: 'app-root',
  standalone: true,
  providers: [MessageService],
  imports: [CommonModule, RouterOutlet, HeaderTopComponent, HeroComponent, InfoComponent, LandingPageComponent, PetComponent, FooterComponent, MessagesModule, ToastModule, RegisterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent{
  title = 'ID-NI';




 /* constructor(router: Router, db: DbService) {
    db.getMenu().subscribe({
      next: (res: any) => router.resetConfig(res.map((route: any) => {
        return { path: route.title.replaceAll(' ', '').toLowerCase(), component:  LandingTemplateComponent}
      }))
    })
  }*/
}
