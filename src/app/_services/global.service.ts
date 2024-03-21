import { Injectable } from '@angular/core';
import {authentication, createDirectus, graphql, rest, refresh} from "@directus/sdk";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class Storage {
  get() {
    return JSON.parse(localStorage.getItem("directus-data") || '');
  }
  set(data: any) {
    localStorage.setItem("directus-data", JSON.stringify(data));
  }
}

export class GlobalService {
  role: BehaviorSubject<string> = new BehaviorSubject<any>('User');
  companyAssignedId: BehaviorSubject<number> = new BehaviorSubject<any>(null)
  client: any;

  constructor() {
    this.initSession();
  }

  updateRole = (value: string) => this.role.next(value);
  updateCompanyId = (value: number) => this.companyAssignedId.next(value)

  initSession = () => {
    const storage: Storage = new Storage()
    this.client = createDirectus('https://app.idni.eco').with(authentication('json', {storage})).with(rest()).with(graphql())
  }


}
