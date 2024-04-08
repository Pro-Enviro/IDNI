import { Injectable } from '@angular/core';
import {authentication, createDirectus, graphql, rest, readMe} from "@directus/sdk";
import {BehaviorSubject, from} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',

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
  companyAssignedId: BehaviorSubject<number | null> = new BehaviorSubject<any>(null)
  companyName: BehaviorSubject<string | null> = new BehaviorSubject<any>(null)
  client: any;
  url: any = `https://app.idni.eco`

  constructor() {
    this.initSession();
  }

  getCurrentUser = () => {
    return from(this.client.request(readMe({fields: ['email', 'role.name']})))
  }


  updateRole = (value: string) => this.role.next(value);
  updateCompanyId = (value: number) => this.companyAssignedId.next(value)
  updateCompanyName = (value: string) => this.companyName.next(value)

  initSession = () => {
    const storage: Storage = new Storage()
    this.client = createDirectus('https://app.idni.eco').with(authentication('json', {storage})).with(rest()).with(graphql())
  }
}
