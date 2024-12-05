
import {APP_INITIALIZER, ApplicationConfig, importProvidersFrom, inject} from '@angular/core';
import {provideRouter, Router, ROUTES} from '@angular/router';
import {provideAnimations} from "@angular/platform-browser/animations";
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {map, Observable, tap} from "rxjs";
import {StorageService} from "./_services/storage.service";
import {routes} from "./app.routes";
import {AuthService} from "./_services/users/auth.service";
import {GlobalService} from "./_services/global.service";
import {HttpInterceptorService} from "./_helpers/http-interceptor.service";
import {NgxEchartsModule} from "ngx-echarts";
import {readMe} from "@directus/sdk";



/*function initializeAppFactory(httpClient: HttpClient, storage: StorageService): () => Observable<any> {
  return () => httpClient.get("https://app.idni.eco/items/page?filter[show_on_menu][_eq]=true&filter[status][_eq]=published&fields=alias,pagetitle,id")
    .pipe(
      map((x:any) => x.data),
      tap((pages:any) => {
        pages.forEach((x:any) => x.alias = x.alias.replaceAll(' ','-').toLowerCase())
        storage.updateMenu(pages)
      })
    );
}*/

// function initializeAppFactory() {
//   const router = inject(Router);
//   const globalService = inject(GlobalService);
//
//   return () => new Promise((resolve) => {
//     try {
//       // Small delay to ensure GlobalService is properly initialized
//       setTimeout(() => {
//         if (globalService.client) {
//           globalService.client.request(readMe())
//             .then(() => {
//               resolve(true);
//             })
//             .catch((error: any) => {
//               console.log('Auth error:', error);
//               if (error.response?.status === 401 || error.response?.status === 403) {
//                 void router.navigate(['/login']);
//               }
//               resolve(false);
//             });
//         } else {
//           console.error('Client not initialized');
//           void router.navigate(['/login']);
//           resolve(false);
//         }
//       }, 100);
//     } catch (err) {
//       console.error('Initialization error:', err);
//       void router.navigate(['/login']);
//       resolve(false);
//     }
//   });
// }

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([HttpInterceptorService])),
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts')
      })
    ),
    GlobalService,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializeAppFactory,
    //   multi: true,
    //   deps: [HttpClient,StorageService, GlobalService]
    // },
    MessageService,
    AuthService,
  ],
};
