import {APP_INITIALIZER, ApplicationConfig} from '@angular/core';
import {provideRouter, ROUTES} from '@angular/router';
import {provideAnimations} from "@angular/platform-browser/animations";
import {HttpClient, provideHttpClient} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {map, Observable, tap} from "rxjs";
import {StorageService} from "./_services/storage.service";
import {routes} from "./app.routes";


function initializeAppFactory(httpClient: HttpClient, storage: StorageService): () => Observable<any> {
  return () => httpClient.get("https://app.idni.eco/items/page?filter[show_on_menu][_eq]=true&filter[status][_eq]=published&fields=alias,pagetitle,id")
    .pipe(
      map((x:any) => x.data),
      tap((pages:any) => {
        pages.forEach((x:any) => x.alias = x.alias.replaceAll(' ','-').toLowerCase())
        storage.updateMenu(pages)
      })
    );
}


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideAnimations(),provideHttpClient(),{
    provide: APP_INITIALIZER,
    useFactory: initializeAppFactory,
    multi: true,
    deps: [HttpClient,StorageService]
  },MessageService],
};
