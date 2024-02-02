import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DbService {
  url: string = 'http://192.168.1.173:8055';
  constructor(
    private http: HttpClient
  ) {}

  getMenu = () => {
    return this.http.get(`${this.url}/items/pages?fields=id,title`).pipe(
      map((x:any) => x.data)
    )
  }
}
