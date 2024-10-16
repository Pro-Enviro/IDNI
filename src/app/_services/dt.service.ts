import { Injectable } from '@angular/core';
import {DbService} from "./db.service";
import {MessageService} from "primeng/api";
import {BehaviorSubject} from "rxjs";

export interface ClusterObject{
  id?:number
  name: string
  companies: number[]
}

export interface Companies{
  id: number,
  name: string
}

export interface Solutions{
  name: string
}

export interface Totals{
  tco2e: number
  kwh: number
}

export interface Cluster{
  id?:number,
  name: string
  companies: Companies[]
  solutions?: Solutions[]
  totals?: Totals[]
}

@Injectable({
  providedIn: 'root'
})
export class DtService {
  companies: BehaviorSubject<Companies[]> = new BehaviorSubject<Companies[]>([]);
  recommendations: BehaviorSubject<Solutions[]> = new BehaviorSubject<Solutions[]>([]);
  clusters: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  constructor(
    private db:DbService,
    private msg: MessageService
  ) {
    this.getCompanies()
    this.getClusters()
  }

  getCompanies = ()=>{
    this.db.getContentFromCollection('companies','?limit=-1').subscribe({
      next: (res:any) => {
        this.companies.next(res.map((x:any)=> {
          return {
            id: x.id,
            name: x.name,
            address: x.address,
            postcode: x.postcode,
            sector: x.sector,
            sic_code: x.sic_code,
            description: x.description,
          }
        }));

        this.recommendations.next(res.map((x:any) => x.recommendations))

      },
      error: (err:any) => this.msg.add({
        severity: 'error',
        summary: 'Companies not found!',
        detail: err.error.errors[0].message
      })
    })
  }

  saveCluster = (cluster: ClusterObject) => {
    console.log(cluster)
    if(cluster.id){
      console.log('edit')
      this.db.fnEditCluster(cluster, cluster.id).subscribe({
        next:() => this.msg.add({
          severity: 'success',
          detail: 'Cluster Saved'
        }),
        error: (err: any) => this.msg.add({
          severity: 'error',
          summary: 'Something went wrong',
          detail: err.error.errors[0].message
        })
      })
    }else {
      console.log('save')
      this.db.fnAddCluster(cluster).subscribe({
        next:() => this.msg.add({
          severity: 'success',
          detail: 'Cluster Saved'
        }),
        error: (err: any) => this.msg.add({
          severity: 'error',
          summary: 'Something went wrong',
          detail: err.error.errors[0].message
        })
      })
    }

  }

  getClusters = () => {
    this.db.fnGetClusters().subscribe({
      next: ((res:any) => this.clusters.next(res.data)),
      error: (err: any) => this.msg.add({
        severity: 'error',
        summary: 'Something went wrong',
        detail: err.error.errors[0].message
      })
    })
  }
}
