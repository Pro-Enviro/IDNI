
import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from "@angular/common/http";
import {catchError, from, Observable, switchMap, throwError} from "rxjs";
import {StorageService} from "../_services/storage.service";
import {inject} from '@angular/core';
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {AuthService} from "../_services/users/auth.service";

let refreshTokenPromise: Promise<string> | null = null;


export const HttpInterceptorService: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const auth = inject(AuthService)
  const storage = inject(StorageService)
  const router = inject(Router)
  const msg = inject(MessageService)



  // If refresh is happening just continue on
  if (req.url.includes('refresh') ||req.url.includes('login') ) {
    return next(req);
  }

  // Helper function to add the bearer token to the request
  const addTokenHeader = (request: HttpRequest<any>, token: string | null) => {
    return request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token!),
    });
  }

  const handleLogout = () => {
    storage.clearAll();
    refreshTokenPromise = null;
    router.navigate(['login']);
    msg.add({
      severity: 'info',
      summary: 'Session Expired',
      detail: 'Please login again to continue.'
    });
  };

  const validateTokens = () => {
    const accessToken = storage.get('access_token');
    const refreshToken = storage.get('refresh_token');

    if (!accessToken || !refreshToken) {
      handleLogout()
      return false;
    }

    return true;

  }

  const handleRequest = (token: string | null): Observable<any> => {


    if (!validateTokens()) {
      return throwError(() => new Error('Unauthorized'))
    }


    const authRequest = token ? addTokenHeader(req, token) : req;

    // If the token is not refreshing, start the refresh
    return next(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          if (!refreshTokenPromise) {
            refreshTokenPromise = auth.refreshToken().then((newToken) => {
              refreshTokenPromise = null;
              return newToken;
            }).catch((err) => {
              refreshTokenPromise = null;
              handleLogout();
              throw err;
            })
          }

          // Once refresh is received, retry the original request
          return from(refreshTokenPromise).pipe(
            switchMap(newToken => {
              const newRequest = addTokenHeader(req, newToken);
              return next(newRequest);
            }),
            catchError(refreshError => {
              console.error('Token refresh failed: ' , refreshError);
              handleLogout();
              return throwError(() => refreshError)
            })
          )
        }
        if (error.status === 403) {
          handleLogout();
          return throwError(() => error);
        }

        return throwError(() => error);
      })
    )
  }

  const token = storage.get('access_token');
  return handleRequest(token)

};
