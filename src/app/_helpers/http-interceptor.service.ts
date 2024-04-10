
import {
  HttpErrorResponse, HttpHandler,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from "@angular/common/http";
import {catchError, from, map, switchMap, throwError} from "rxjs";
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

  const addTokenHeader = (request: HttpRequest<any>, token: string | null) => {
    return request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token!),
    });
  }

  if (token){
    const authRequest = addTokenHeader(req, token)

    return next(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('ERROR 1: ', error)
        if ([401, 403].includes(error.status)) {
          // auto logout if 401 or 403 response returned from api
          if (error.status === 401) {
            // console.log('401 Error')
            // handle 401
            return from(auth.refreshToken()).pipe(
              switchMap((token: any) => {
                const newRequest = addTokenHeader(req, token)
                return next(newRequest)
              })
            )
          } else if (error.status === 403) {
            // console.log('403 Error')
            localStorage.clear()
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
    console.log('ERROR INTERCEPTOR NOT LOGGED IN')
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('ERROR 2: ', error)
        if ([401, 403].includes(error.status)) {
          console.log('rerouting to login')
          // auto logout if 401 or 403 response returned from api
          if (error.status === 401) {
            console.log('401 Error')
            // handle 401

          } else if (error.status === 403) {
            console.log('403 Error')
            // handle 403
            localStorage.clear()
            router.navigate([''])
          } else {
            localStorage.clear()
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

