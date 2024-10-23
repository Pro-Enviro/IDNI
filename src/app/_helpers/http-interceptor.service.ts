
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
import {refresh} from "@directus/sdk";


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
  if (req.url.includes('refresh')) {
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

  const handleRequest = (token: string | null): Observable<any> => {
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


// if (token){
//   const authRequest = addTokenHeader(req, token)
//
//   return next(authRequest).pipe(
//     catchError((error: HttpErrorResponse) => {
//       if (error.status === 401) {
//         console.log('401 - Access token expired, attempting refresh.');
//
//         // Check if we have a refresh token before attempting refresh
//         const refreshToken = storage.get('refresh_token');
//         if (!refreshToken) {
//           console.log('No refresh token available');
//           // storage.clear();
//           // router.navigate(['login']);
//           return throwError(() => error);
//         }
//
//         // Attempt to refresh the token
//         return from(auth.refreshToken()).pipe(
//           switchMap((newToken: any) => {
//             if (newToken) {
//               console.log('Refresh token successful, retrying request with new token.');
//               const newRequest = addTokenHeader(req, newToken);
//               return next(newRequest);
//             } else {
//               // If refresh token is invalid or fails, navigate to login
//               console.log('Refresh token failed, redirecting to login.');
//
//               // localStorage.clear();
//               // router.navigate(['login']);
//               return throwError(() => error);
//             }
//           }),
//           catchError(refreshError => {
//             console.log('Refresh token error:', refreshError);
//             // If refresh token also fails (e.g., expired), logout and redirect
//             localStorage.clear();
//             router.navigate(['login']);
//             return throwError(() => refreshError);
//           })
//         );
//       } else if (error.status === 403) {
//         console.log('403 - Forbidden. Logging out.');
//         localStorage.clear();
//         router.navigate(['login']);
//       } else {
//         console.log('Other error', error);
//         router.navigate(['login']);
//       }
//
//       msg.add({
//         severity: 'warning',
//         detail: 'You are unauthorized.'
//       })
//       return throwError(() => error);
//     }))
// } else {
//   // If the user has no token (not logged in)
//   return next(req).pipe(
//     catchError((error: HttpErrorResponse) => {
//       // console.log('ERROR 2: ', error)
//       if ([401, 403].includes(error.status)) {
//         // auto logout if 401 or 403 response returned from api
//         if (error.status === 401) {
//           console.log('401 Error')
//           // handle 401
//
//         } else if (error.status === 403) {
//           console.log('403 Error')
//           // handle 403
//           localStorage.clear()
//           router.navigate([''])
//         } else {
//           localStorage.clear()
//           router.navigate(['login'])
//         }
//         router.navigate(['login'])
//       }
//       msg.add({
//         severity: 'warning',
//         detail: 'You are unauthorized.'
//       })
//
//
//       return throwError(() => error);
//     }))
// }
