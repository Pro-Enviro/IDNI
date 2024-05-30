import {Component, Input, OnChanges, OnInit, signal, SimpleChanges, ViewChild} from '@angular/core';
import {MessageService} from "primeng/api";
import {GlobalService} from "../../../../_services/global.service";
import {EditableRow, TableModule} from "primeng/table";

import {SharedComponents} from "../../shared-components";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SharedModules} from "../../../../shared-module";
import {EnvirotrackService} from "../../envirotrack.service";
import {DbService} from "../../../../_services/db.service";
import moment from "moment";


export type ASCProps = {
  companyId: number,
  mpan: string,
  start_date: Date,
  end_date: Date,
  asc: number
}

@Component({
  selector: 'app-supply',
  standalone: true,
  templateUrl: './supply.component.html',
  styleUrls: ['./supply.component.scss'],
  imports: [
    SharedComponents,
    CommonModule,
    SharedModules,
    FormsModule,
    TableModule,
  ],
  providers: [EditableRow]
})
export class SupplyComponent implements OnInit, OnChanges {
  @ViewChild('rowEdit') editingRow: any;
  @Input() companiesFromParent: any;
  companies!: any[];
  selectedCompany!: number;
  mpan: string = '';
  selectedMpan!: string;
  supplyList: any;
  newMpan!: number;
  startDate!: Date;
  endDate!: Date
  asc!: number
  clonedList: { [s: string]: any } = {};
  isConsultant: boolean = false;
  selectedEmail: string = ''
  selectedCompanyName: string = ''

  constructor(private global: GlobalService, private track: EnvirotrackService, private db: DbService, private msg: MessageService) {

  }

  onSelectCompany = () => {
    this.getMpan(this.selectedCompany)

  }

  getCompanies = () => {
    // this.global.getCurrentUser().subscribe({
    //   next: (res: any) => {
    //     if (res.role.name === 'user'){
    //       this.selectedEmail = res.email
    //       this.track.getUsersCompany(res.email).subscribe({
    //         next: (res: any) => {
    //           if (res.data){
    //             this.companies = res.data
    //             this.selectedCompany = res.data[0].id
    //             this.selectedCompanyName = res.data[0].name
    //           }
    //         }
    //       }) }
    //     else if (res.role.name === 'consultant'){
    //       this.track.getUsersCompany(res.email).subscribe({
    //         next: (res: any) => {
    //           if (res.data) {
    //             this.companies = res.data
    //             this.isConsultant = true
    //           }
    //         }
    //       })
    //
    //     } else {
    //       this.track.getCompanies().subscribe({
    //         next:(res: any) => {
    //           this.companies = res.data;
    //           this.isConsultant = true;
    //         }
    //       })
    //     }
    //
    //   }
    // })
  }

  onSelectMpan = (event: string) => {
    this.newMpan = parseInt(event);
    this.getSupplyList()
  }
  getMpan = (id: number) => {
    // this.track.getData(id).subscribe({
    //   next: (res: any) => {
    //     this.mpan = []
    //     res.forEach((row:any) => {
    //       !~this.mpan.indexOf(row.mpan) ? this.mpan.push(row.mpan) : null;
    //     })
    //     this.selectedMpan = this.mpan[0]
    //     this.newMpan = parseInt(this.selectedMpan)
    //     this.getSupplyList();
    //   },
    //   error: (err: any) => this.msg.add({
    //     severity: 'error',
    //     summary: 'Something went wrong',
    //     detail: err.error.errors[0].message
    //   })
    // })
  }

  getSupplyList = () => {

    this.db.getASCData(this.selectedCompany).subscribe({
      next: (res: any) => {
        this.supplyList = res.data;
        this.supplyList.forEach((row: any) => {
          row.start_date = moment(row.start_date);
          row.end_date = moment(row.end_date)
        });
      },
      error: (err) => {
        this.msg.add({
          severity: 'error',
          summary: 'Something went wrong.'
        })
      }
    })
  }

  addSupply = () => {

    if (!this.mpan || !this.startDate || !this.selectedCompany || !this.asc) {
      return
    }

    const data: ASCProps = {
      companyId: this.selectedCompany,
      mpan: this.mpan,
      start_date: this.startDate,
      end_date: this.endDate,
      asc: this.asc
    }


    this.db.createASCData(data).subscribe({
      next: (res: any) => {

        if (res.data) {
          this.msg.add({
            severity: 'success',
            detail: 'Saved'
          })

          res.data.start_date = moment(res.data.start_date)
          res.data.end_date = moment(res.data.end_dates)

          this.supplyList.push(res.data)
        }
      },
      error: (error: any) => {
        console.log(error)
      }
    })
  }
  removeSupply = (id: number) => {

    this.db.deleteASCData(id).subscribe({
      next: (res: any) => {

        this.msg.add({
          severity: 'success',
          detail: 'ASC Removed'
        })
      },
      error: (err) => {
        console.log(err)
      }
    })

    this.supplyList = this.supplyList.filter((asc_data: any) => asc_data.id !== id)

  }


  editSupply = (supply: any) => {
    this.db.patchASCData(supply.id, supply).subscribe({
      next: (res: any) => {
        this.msg.add({
          summary: 'ASC Updated',
          severity: 'success',
        })
      },
      error: (error: any) => {
        this.msg.add({
          summary: 'Something went wrong.',
          severity: 'error',
        })
      }
    })


  }

  onSupplyEditInit = (supply: any) => {
    this.clonedList[supply.id as string] = {...supply};
  }
  onSupplyEditCancel = (supply: any, index: number) => {
    this.supplyList[index] = this.clonedList[supply.id as string];
    delete this.clonedList[supply.id as string];
  }

  ngOnInit(): void {
    if (this.selectedCompany){
      this.selectedCompany = this.companiesFromParent
      this.getSupplyList()
    }
  }

  // For ADMIN level, detect when company id changes to fetch new data
  ngOnChanges(changes: SimpleChanges) {
    if (changes["companiesFromParent"].currentValue === undefined) return;

    this.selectedCompany = changes["companiesFromParent"].currentValue
    this.getSupplyList()
  }


}
