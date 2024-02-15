import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../_services/users/auth.service";
import {inject} from "@angular/core";
import {HttpClient} from "@angular/common/http";

export const authGuard: CanActivateFn = (route, state) => {

  const auth: AuthService = inject(AuthService);
  const router: Router = inject(Router)

  if(localStorage.getItem('access_token'))
    return false;

  //if token invalid then
  auth.isLoggedIn.subscribe({
    next: (value) => {
      if(!value){
        router.navigate(['login'])
      }
    }
  })
  return true;
};
