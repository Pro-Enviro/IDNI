import { Injectable } from '@angular/core';
import {authentication, createDirectus, graphql, rest} from "@directus/sdk";
import {StorageService} from "./storage.service";

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
  client: any;

  constructor() {
    this.initSession();
  }

  initSession = () => {
    const storage: Storage = new Storage()
    this.client = createDirectus('https://app.idni.eco').with(authentication('json', {storage})).with(rest()).with(graphql())
  }
}
