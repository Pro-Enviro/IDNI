import { Injectable } from '@angular/core';
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";

export interface menu{
  id: number,
  pagetitle: string,
  alias: string,
  parents: number[]
}
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  menu: BehaviorSubject<menu[]> = new BehaviorSubject<menu[]>([])

  updateMenu = (value: menu[]) => this.menu.next(value);

  constructor(
    private msg: MessageService,
    private route: Router
  ) {}



  public get getMenu(){
    return this.menu.value
  }

  set = (name: string, token: string) => {
    if (name === 'directus_items') {
      localStorage.setItem(name, JSON.stringify(token));
    } else {

      localStorage.setItem(name, token);
    }
  }

  get = (name: string) => {
    const item: string | null = localStorage.getItem(name);

    if(!item){
      this.msg.add({
        severity: 'error',
        summary: 'Oops something went wrong',
        detail: 'The requested information could not be received. Please login again'
      })

      this.route.navigate(['login']).then(r => console.log('Navigating'));
      return
    }
    return item
  }

}
