import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalService} from "../global.service";
import {DirectusClient, DirectusUser, readMe} from "@directus/sdk";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url: string = 'https://app.idni.eco/'
  client: any

  constructor(private http: HttpClient, private global: GlobalService,) {
    this.client = this.global.client
  }

  getCurrentUserData = async () =>{
    const result = await this.client.request(readMe({fields: ['first_name', 'last_name', 'email','phone_number']}))
    return result
  }

}
