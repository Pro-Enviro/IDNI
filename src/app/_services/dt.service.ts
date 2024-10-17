import {Injectable} from '@angular/core';
import {DbService} from "./db.service";
import {MessageService} from "primeng/api";
import {BehaviorSubject} from "rxjs";

export interface ClusterObject {
  id?: number
  name: string
  companies: number[]
}

export interface Companies {
  id: number,
  name: string
}

export interface Solutions {
  name: string
}

export interface Totals {
  tco2e: number
  kwh: number
}

export interface Cluster {
  id?: number,
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
  clusters: BehaviorSubject<any[]> = new BehaviorSubject<any>(null)
  digitalTwinRecommendations: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])

  constructor(
    private db: DbService,
    private msg: MessageService
  ) {
    this.getCompanies()
    this.getClusters()
  }

  getCompanies = () => {
    this.db.getContentFromCollection('companies', '?limit=-1').subscribe({
      next: (res: any) => {
        this.companies.next(res.map((x: any) => {
          let recommendations = JSON.parse(x?.recommendations) ||[]

          return {
            id: x.id,
            name: x.name,
            address: x.address,
            postcode: x.postcode,
            sector: x.sector,
            sic_code: x.sic_code,
            description: x.description,
            recommendations: recommendations
          }
        }));



        this.recommendations.next(res.map((x: any) => x.recommendations))

      },
      error: (err: any) => this.msg.add({
        severity: 'error',
        summary: 'Companies not found!',
        detail: err.error.errors[0].message
      })
    })
  }

  saveCluster = (cluster: ClusterObject) => {
    console.log(cluster)
    if (cluster.id) {
      console.log('edit')
      this.db.fnEditCluster(cluster, cluster.id).subscribe({
        next: () => this.msg.add({
          severity: 'success',
          detail: 'Cluster Saved'
        }),
        error: (err: any) => this.msg.add({
          severity: 'error',
          summary: 'Something went wrong',
          detail: err.error.errors[0].message
        })
      })
    } else {
      console.log('save')
      this.db.fnAddCluster(cluster).subscribe({
        next: () => this.msg.add({
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
      next: ((res: any) => {
        this.clusters.next(res.data)
      }),
      error: (err: any) => this.msg.add({
        severity: 'error',
        summary: 'Something went wrong',
        detail: err.error.errors[0].message
      })
    })
  }

  getDigitalTwinData = (selectedCluster: ClusterObject) => {
    if (!selectedCluster || !selectedCluster.companies.length) return;

    // console.log(selectedCluster)

    const companies = selectedCluster.companies

    companies.forEach((company: any) => {

      this.db.getDigitalTwinData(company.id).subscribe({
        next: (res: any) => {
          company.digital_twin_data = res;
        }
      })
    })

    console.log(companies)

    // this.db.getDigitalTwinData()
  }
}
