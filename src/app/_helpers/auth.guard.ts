import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../_services/users/auth.service";
import {inject} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../_services/storage.service";
import {GlobalService} from "../_services/global.service";

export const authGuard: CanActivateFn = (route, state) => {

  const storage: StorageService = inject(StorageService)
  const router: Router = inject(Router)



  //if token invalid then
  if(!storage.get('access_token')){

    console.log('NO Access token')

    router.navigate(['login'])
    return false;
  }
  return true;
};
