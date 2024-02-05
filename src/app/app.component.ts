import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';
import {DbService} from "./_services/db.service";
import {HttpClient} from "@angular/common/http";
import {LandingTemplateComponent} from "./_templates/landing-template/landing-template.component";
import {HeaderTopComponent} from "./_partials/header-top/header-top.component";
import {HeroComponent} from "./_partials/hero/hero.component";
import {InfoComponent} from "./_partials/info/info.component";
import {LandingPageComponent} from "./pages/landing-page/landing-page.component";
import {PetComponent} from "./pages/pet/pet.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderTopComponent, HeroComponent, InfoComponent, LandingPageComponent, PetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ID-NI';

 /* constructor(router: Router, db: DbService) {
    db.getMenu().subscribe({
      next: (res: any) => router.resetConfig(res.map((route: any) => {
        return { path: route.title.replaceAll(' ', '').toLowerCase(), component:  LandingTemplateComponent}
      }))
    })
  }*/
}
