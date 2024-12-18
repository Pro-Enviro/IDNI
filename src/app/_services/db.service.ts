import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";
import {PetToolData} from "../pages/pet-login-protected/pet-tool-types";
import {uploadFiles} from "@directus/sdk";
import {ASCProps} from "../pages/envirotrack/import/supply/supply.component";
import {DigitalTwinRows} from "../pages/reports/generate-report/generate-report.component";

import {Cluster, ClusterObject} from "./dt.service";

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

  fnAddCluster = (cluster: ClusterObject) => {
    return this.http.post(`${this.url}/items/digital_twin_cluster`, cluster)
  }
  fnEditCluster = (cluster: ClusterObject, id:number) => {
    return this.http.patch(`${this.url}/items/digital_twin_cluster/${id}`, cluster)
  }


  fnGetClusters = () => {
    return this.http.get(`${this.url}/items/digital_twin_cluster?fields=id,name,companies.id,companies.name,companies.address,companies.postcode,companies.sector,companies.sic`)
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

  getASCData = (id: number) => {
    return this.http.get(`${this.url}/items/asc_data?filter[companyId][_eq]=${id}`)
  }

  createASCData = (data: ASCProps) => {
    return this.http.post(`${this.url}/items/asc_data`, data)
  }

  patchASCData = (id: number, data: ASCProps) => {
    return this.http.patch(`${this.url}/items/asc_data/${id}`, data)
  }

  deleteASCData = (id: number) => {
    return this.http.delete(`${this.url}/items/asc_data/${id}`)
  }

  getRecommendations = (companyId: number) => {
    return this.http.get(`${this.url}/items/companies/${companyId}?fields=recommendations`)
  }

  saveRecommendations = (companyId: number, data: {recommendations: string}) => {
    return this.http.patch(`${this.url}/items/companies/${companyId}?fields=recommendations`, data)
  }

  getDigitalTwinData = (companyId: number) => {
    return this.http.get(`${this.url}/items/company_digital_twin_data?filter[company][_eq]=${companyId}`)
  }

  saveDigitalTwinRow = (data: Partial<DigitalTwinRows> ) => {
    return this.http.post(`${this.url}/items/company_digital_twin_data`, data)
  }

  patchDigitalTwinRow = (id: number, data: Partial<DigitalTwinRows>) => {
    return this.http.patch(`${this.url}/items/company_digital_twin_data/${id}`, data)
  }

  deleteDigitalTwinRow = (id: number) => {
    return this.http.delete(`${this.url}/items/company_digital_twin_data/${id}`)
  }
  getFiles = (id:number) => {
    return this.http.get(`${this.url}/items/companies/${id}?fields=uploaded_files.directus_files_id.id,uploaded_files.directus_files_id.title,uploaded_files.directus_files_id.type,uploaded_files.directus_files_id.uploaded_on, uploaded_reports.directus_files_id.id,uploaded_reports.directus_files_id.type,uploaded_reports.directus_files_id.title, uploaded_reports.directus_files_id.uploaded_on`).pipe(
      map((x: any) => x.data)
    )
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

  checkUsersFiles = (id: number) => {
    return this.http.get(`${this.url}/items/companies/${id}?fields=uploaded_files.*`)

  }

  uploadBugReport = (bugReport: any) => {
    return this.http.post(`${this.url}/items/bug_reports`, bugReport)
  }

  uploadReportDataForCompany = (id:number) => {
    return this.http.get(`${this.url}/items/companies/${id}?fields=uploaded_reports.*`)
  }

  saveReportFiles = (id: number, data: string[]) => {
    const formattedData = data.map(fileId => ({ directus_files_id: fileId }));
    return this.http.patch(`${this.url}/items/companies/${id}?fields=uploaded_reports`, {uploaded_reports: formattedData});
  };

  saveDataFiles = (id: number, data: string[]) => {
    const formattedData = data.map(fileId => ({ directus_files_id: fileId }));
    return this.http.patch(`${this.url}/items/companies/${id}?fields=uploaded_files`, {uploaded_files: formattedData});
  };

}
