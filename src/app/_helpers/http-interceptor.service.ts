import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpRequest, HttpResponse} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {StorageService} from "../_services/storage.service";
import {Router} from "@angular/router";

@Injectable()
export class HttpInterceptorService {

  constructor(
    private storage: StorageService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.storage.get('access_token');

    if (token) {

      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return next.handle(request).pipe(catchError((err) => {

      if ([401, 403].includes(err.status)) {


        // auto logout if 401 or 403 response returned from api
        this.router.navigate(['login'])
      }

      return err;
    }))
      .pipe(map((evt:any) => {
        if (evt instanceof HttpResponse) {
        }
        return evt;
      }));
  }
}
