import {Injectable} from '@angular/core';
import {DbService} from "./db.service";
import {MessageService} from "primeng/api";
import {BehaviorSubject, catchError, forkJoin, map, mergeMap, Observable, of, switchMap} from "rxjs";
import {EnvirotrackService} from "../pages/envirotrack/envirotrack.service";
import {group} from "@angular/animations";

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
    private msg: MessageService,
    private track: EnvirotrackService
  ) {
    this.getCompanies()
    this.getClusters()
  }

  getCompanies = () => {
    this.db.getContentFromCollection('companies', '?limit=-1&fields=*,digital_twin_data.*').subscribe({
      next: (res: any) => {
        this.companies.next(res.map((x: any) => {
          let recommendations = JSON.parse(x?.recommendations) || []
          let fuel_data = JSON.parse(x?.fuel_data) || []

          return {
            id: x.id,
            name: x.name,
            address: x.address,
            postcode: x.postcode,
            sector: x.sector,
            sic_code: x.sic_code,
            description: x.description,
            recommendations: recommendations,
            fuel_data: fuel_data,
            digital_twin_data: x.digital_twin_data
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
    // console.log(cluster)
    if (cluster.id) {
      console.log('edit')
      this.db.fnEditCluster(cluster, cluster.id).subscribe({
        next: () => {
          this.msg.add({
            severity: 'success',
            detail: 'Cluster Saved'
          })
          this.getClusters()
        },
        error: (err: any) => this.msg.add({
          severity: 'error',
          summary: 'Something went wrong',
          detail: err.error.errors[0].message
        })
      })
    } else {
      // console.log('save')
      this.db.fnAddCluster(cluster).subscribe({
        next: () => {
          this.msg.add({
            severity: 'success',
            detail: 'Cluster Saved'
          })
          this.getClusters()
        },
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
    let companies = selectedCluster.companies


    companies = companies.map((company: any) => {
      this.db.getDigitalTwinData(company.id).subscribe({
        next: (res: any) => {
          company.digital_twin_data = res;
        }
      })
      return company;
    })

    selectedCluster.companies = companies;
  }

  getHHData = (ids: number[]): Observable<any[]> => {
    if (!ids.length) return of([]);

    // Create an array of observables (to handle multiple company ids) - [ob1, ob2, ob3, ...] - This is to return all at the same time once all async is complete
    const observables = ids.map(id =>
      this.track.getData(id).pipe(
        map(res => this.processData(res)),
        catchError(() => of(null))
      )
    );

    // Combine all observables into 1 to subscribe to from the frontend and return observables all at once from above.
    return forkJoin(observables).pipe(
      map(results => results.filter(Boolean).flat())
    );
  }


  // Get all available envirotrack data and group together to get total consumption etc. (this is the same function as in generate report / and simplified from ecp)
  processData = (res: any[]): any[] => {
    if (!res || res.length === 0) return []


    const groupedData = new Map();

    res.forEach((row: any) => {
      row.hhd = JSON.parse(row.hhd.replaceAll('"', '').replaceAll("'", '')).map((x: number) => x ? x : 0);

      // Group by mpan
      if (!groupedData.has(row.mpan)) {
        groupedData.set(row.mpan, []);
      }
      groupedData.get(row.mpan).push(row);
    });

    const envirotrackSummary: any[] = []

    groupedData.forEach((rows, mpan) => {
      let grandTotal = 0;

      // Calculate total consumption for the current mpan
      rows.forEach((row: any) => {
        grandTotal += row.hhd.reduce((acc: number, curr: number) => acc + curr, 0);
      });

      // Store the result for the current mpan
      const envirotrackData = {
        type: `Electricity HH - ${mpan}`,
        consumption: grandTotal,
        cost: 0,
        emissions: (grandTotal * 0.22499) / 1000
      };
      envirotrackSummary.push(envirotrackData)
    });



    return envirotrackSummary
  }


}
