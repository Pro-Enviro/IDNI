import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DbService {
  url: string = 'https://app.idni.eco';
  constructor(
    private http: HttpClient
  ) {}

  getContent = (id: number, args?: any) => {
    return this.http.get(`${this.url}/items/page/${id}${args ? args : ''}`).pipe(
      map((x:any)=> x.data)
    )
  }
}
