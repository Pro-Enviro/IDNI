import { Injectable } from '@angular/core';
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import Encryption from "encrypt-decrypt-library";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  config = {
    algorithm: '',
    encryptionKey: '',
    salt: ''
  }

  encryption = new Encryption(this.config);

  constructor(
    private msg: MessageService,
    private route: Router
  ) { }

  save = (name: string, token: string) => {
    localStorage.setItem(name,this.encryption.encrypt(JSON.stringify(token)));
  }

  get = (name: string) => {
    const item: string | null = localStorage.getItem(name);
    if(!item){
      this.msg.add({
        severity: 'error',
        summary: 'Oops something went wrong',
        detail: 'The requested information could not be received. Please login again'
      })

      this.route.navigate(['login']);
      return
    }
    return this.encryption.decrypt(item)
  }
}
