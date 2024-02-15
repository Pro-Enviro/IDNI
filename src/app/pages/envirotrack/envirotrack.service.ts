import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class EnvirotrackService {
  url: any = `https://ecp.proenviro.co.uk` // TODO: .env this?
  companyId: number = 773 // TODO: Get correct company ID
  constructor(
    private http: HttpClient,
  ) {

  }

  getCompanies = () => {
    return this.http.get(`${this.url}/items/organisation/${this.companyId}?fields=companies.companies_id.id,companies.companies_id.name,companies.companies_id.friday_end_time,companies.companies_id.friday_start_time,companies.companies_id.monday_end_time,companies.companies_id.monday_start_time,companies.companies_id.saturday_end_time,companies.companies_id.saturday_start_time,companies.companies_id.sunday_end_time,companies.companies_id.sunday_start_time,companies.companies_id.thursday_end_time,companies.companies_id.thursday_start_time,companies.companies_id.tuesday_end_time,companies.companies_id.tuesday_start_time,companies.companies_id.wednesday_end_time,companies.companies_id.wednesday_start_time`).pipe(
      map((res: any)=> res.data.companies.map((x:any)=> x.companies_id)))
  }

  uploadData = (data: any, company: number) => {
    return this.http.post(`${this.url}/items/envirotrack`, data)
    //return this.http.patch(`${this.url}/items/companies/${company}`, {envirotrack: data})
  }

  getData = (id: number) => {
    return this.http.get(`${this.url}/items/envirotrack?filter[company][_eq]=${id}&limit=-1&fields=date,mpan,hdd`).pipe(
      map((res: any) => res.data)
    )
  }

  lookup = (mpan: string, date: string, id: number) => {
    return this.http.get(`${this.url}/items/envirotrack?filter[mpan][_eq]=${mpan}&filter[date][_eq]=${date}&filter[company][_eq]=${id}`)
  }
}
