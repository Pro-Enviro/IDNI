import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {BehaviorSubject, from, Observable} from "rxjs";
import {AuthService} from "../../_services/users/auth.service";
import {GlobalService} from "../../_services/global.service";

@Injectable({
  providedIn: 'root'
})
export class EnvirotrackService {
  public supplyUnit: string[] = ['kWh', 'tonnes', 'litres', 'kg']
  url: any = `https://app.idni.eco`
  selectedCompany: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(
    private http: HttpClient,
    private global: GlobalService
  ) {
  }

  updateSelectedCompany = (company: number) => this.selectedCompany.next(company)

  getCompanies = (uuReview?:boolean) => {
      return this.http.get(`${this.url}/items/companies?filter[uu_review][_eq]=true`)
  }

  // getCompanyByUser = () => {
  //   this.global.getCurrentUser().subscribe({
  //     next: (res: any) => {
  //       this.http.get(`${this.url}/items/companies?filter[users][directus_users_id][email][_eq]=${res.email}`).subscribe({
  //         next: (res: any) =>{
  //           console.log(res)
  //           return res;
  //         }
  //       })
  //     }
  //   })
  // }

  getCompanyDetails(id: any, fields: string[]) {
    return this.http.get(`${this.url}/items/companies/${id}?fields=${fields.toString()}`)
      .pipe(
        map((res: any) => res.data)
      )
  }

  getUsersCompany(email: string) {
    return this.http.get(`${this.url}/items/companies?filter[users][directus_users_id][email][_eq]=${email}&fields=*`)
  }

  getFuelData = (id: number) => {
    return this.http.get(`${this.url}/items/companies/${id}?fields=fuel_data`)
  }

  saveFuelData = (id: number, data: { fuel_data: string }) => {
    return this.http.patch(`${this.url}/items/companies/${id}?fields=fuel_data`, data)
  }

  saveFilesData = (id: number, data: {uploaded_files: any}) => {
    return this.http.patch(`${this.url}/items/companies/${id}?fields=uploaded_files`, data)
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
