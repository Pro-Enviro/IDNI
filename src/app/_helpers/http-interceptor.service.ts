
import {
  HttpErrorResponse, HttpHandler,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from "@angular/common/http";
import {catchError, map, throwError} from "rxjs";
import {StorageService} from "../_services/storage.service";
import {inject} from '@angular/core';
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {AuthService} from "../_services/users/auth.service";





export const HttpInterceptorService: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {

  const storage = inject(StorageService)
  const router = inject(Router)
  const msg = inject(MessageService)
  const token = storage.get('access_token');
  const auth = inject(AuthService)



  if (token){
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    })

    return next(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('ERROR: ', error)
        if ([401, 403].includes(error.status)) {
          console.log('rerouting to login')
          console.log(error)
          // auto logout if 401 or 403 response returned from api
          if (error.status === 401) {
            console.log('401 Error')
            // handle 401
            auth.refreshToken().then(() => {
              const clonedRequest = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
              })

              console.log(clonedRequest)
              return next(clonedRequest)
            })


          } else if (error.status === 403) {
            console.log('403 Error')
            // handle 403
            router.navigate([''])
          } else {
            router.navigate(['login'])
          }
        }
        msg.add({
          severity: 'warning',
          detail: 'You are unauthorized.'
        })



        return throwError(() => error);
      }))
  } else {
    console.log('ERROR INTERCEPTOR')
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('ERROR: ', error)
        if ([401, 403].includes(error.status)) {
          console.log('rerouting to login')
          // auto logout if 401 or 403 response returned from api
          if (error.status === 401) {
            console.log('401 Error')
            // handle 401
            auth.refreshToken().then(() => {
              const clonedRequest = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
              })

              return next(clonedRequest)
            })

          } else if (error.status === 403) {
            console.log('403 Error')
            // handle 403
            router.navigate([''])
          } else {
            router.navigate(['login'])
          }
          router.navigate(['login'])
        }
        msg.add({
          severity: 'warning',
          detail: 'You are unauthorized.'
        })

        console.log('HERE')

        return throwError(() => error);
      }))
  }
};




// import { Injectable } from '@angular/core';
// import {HttpEvent, HttpHandler, HttpRequest, HttpResponse} from "@angular/common/http";
// import {catchError, map, Observable} from "rxjs";
// import {StorageService} from "../_services/storage.service";
// import {Router} from "@angular/router";
//
// @Injectable({
//   providedIn: 'root'
// })
// export class HttpInterceptorService {
//
//   constructor(
//     private storage: StorageService,
//     private router: Router
//   ) { }
//
//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//
//     console.log('Running interceptor')
//
//     const token = this.storage.get('access_token');
//
//     if (token) {
//
//       console.log('Token found')
//
//       request = request.clone({
//         setHeaders: { Authorization: `Bearer ${token}` }
//       });
//     }
//
//     return next.handle(request).pipe(catchError((err) => {
//       if ([401, 403].includes(err.status)) {
//         console.log('rerouting to login')
//         // auto logout if 401 or 403 response returned from api
//         this.router.navigate(['login'])
//       }
//
//       return err;
//     }))
//       .pipe(map((evt:any) => {
//         if (evt instanceof HttpResponse) {
//         }
//         return evt;
//       }));
//   }
//

