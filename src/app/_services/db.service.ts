import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";
import {PetToolData} from "../pages/pet-login-protected/pet-tool-types";
import {uploadFiles} from "@directus/sdk";

@Injectable({
  providedIn: 'root'
})
export class DbService {
  url: string = 'https://app.idni.eco';

  constructor(
    private http: HttpClient
  ) {
  }

  getContent = (id: number, args?: any) => {
    return this.http.get(`${this.url}/items/page/${id}${args ? args : ''}`).pipe(
      map((x: any) => x.data)
    )
  }

  getContentFromCollection(collection: string, args?: any) {
    return this.http.get(`${this.url}/items/${collection}${args ? args : ''}`).pipe(
      map((x: any) => x.data)
    )
  }

  getPetData = (id: number) =>{
    return this.http.get(`${this.url}/items/pet_data?filter[company_id][_eq]=${id}`)
  }

  savePetData = (data: PetToolData) => {
    return this.http.post(`${this.url}/items/pet_data`, data)
  }

  patchPetData = (id: number, data: PetToolData) => {
    return this.http.patch(`${this.url}/items/pet_data/${id}`, data)
  }

  getRecommendations = (companyId: number) => {
    return this.http.get(`${this.url}/items/companies/${companyId}?fields=recommendations`)
  }

  saveRecommendations = (companyId: number, data: {recommendations: string}) => {
    return this.http.patch(`${this.url}/items/companies/${companyId}?fields=recommendations`, data)
  }


  addCompany(
    fields: string[],
    data: any,
    userData?: any
  ) {
    return this.http.post(`${this.url}/items/companies/?fields=${fields.map((field) => field).toString()}.*`, {
      ...data,
      "users": {
        "create": [
          {
            "directus_users_id": {...userData, role: '3aade202-9caf-4869-b876-eef6b79119c6'}
          }
        ]
      }
    }).pipe(
      map((res: any) => res.data)
    )

  }

  uploadBugReport = (bugReport: any) => {
    console.log(bugReport)
    return this.http.post(`${this.url}/items/bug_reports`, bugReport)
  }



}
