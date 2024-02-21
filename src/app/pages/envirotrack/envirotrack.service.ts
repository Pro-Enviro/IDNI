import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EnvirotrackService {
  url: any = `https://app.idni.eco`
  selectedCompany: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(
    private http: HttpClient,
  ) {}

  updateSelectedCompany = (company: number) => this.selectedCompany.next(company)

  getCompanies = () => {
    return this.http.get(`${this.url}/items/companies`)
  }

  getCompanyDetails(id: any, fields: string[]) {
    return this.http.get(`${this.url}/items/companies/${id}?fields=${fields.toString()}`)
      .pipe(
        map((res: any) => res.data)
      )
  }

  getFuelData = (id: number) => {
    return this.http.get(`${this.url}/items/companies/${id}?fields=fuel_data`)
  }

  saveFuelData = (id: number, data: { fuel_data: string }) => {
    return this.http.patch(`${this.url}/items/companies/${id}?fields=fuel_data`, data)
  }

  uploadData = (data: any, company: number) => {
    return this.http.post(`${this.url}/items/envirotrack`, data)
    //return this.http.patch(`${this.url}/items/companies/${company}`, {envirotrack: data})
  }

  getData = (id: number) => {
    return this.http.get(`${this.url}/items/envirotrack?filter[company][_eq]=${id}&limit=-1&fields=date,mpan,hhd`).pipe(
      map((res: any) => res.data)
    )
  }

  lookup = (mpan: string, date: string, id: number) => {
    return this.http.get(`${this.url}/items/envirotrack?filter[mpan][_eq]=${mpan}&filter[date][_eq]=${date}&filter[company][_eq]=${id}`)
  }
}
