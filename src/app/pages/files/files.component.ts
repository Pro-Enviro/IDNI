import { Component } from '@angular/core';
import {DbService} from "../../_services/db.service";
import {MessageService} from "primeng/api";
import {GlobalService} from "../../_services/global.service";
import {EnvirotrackService} from "../envirotrack/envirotrack.service";
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {JsonPipe} from "@angular/common";

export interface Files{
  id: number;
  title: string;
}

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [
    CardModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
    JsonPipe
  ],
  templateUrl: './files.component.html',
  styleUrl: './files.component.scss'
})
export class FilesComponent {
  companies: any;
  selectedCompany: number | undefined;
  isConsultant: boolean = true;
  dataFiles: Files[] | undefined;
  reportFiles: Files[] | undefined;

  constructor(
    private db: DbService,
    private global: GlobalService,
    private msg: MessageService,
    private track: EnvirotrackService,
  ) {
    this.getCompanies()
  }

  onSelectCompany = () => {
    if (!this.selectedCompany) this.selectedCompany = this.companies[0].id
    delete this.dataFiles;
    delete this.reportFiles;

    this.getFiles(this.selectedCompany || this.companies[0].id)
  }

  getCompanies = () => {
    // Fetch all companies
    this.global.getCurrentUser().subscribe({
      next: (res: any) => {
        if (res.role.name === 'user') {
          this.track.getUsersCompany(res.email).subscribe({
            next: (res: any) => {
              if (res.data) {
                this.companies = res.data
                this.selectedCompany = res.data[0].id
                this.onSelectCompany()
              }
            }
          })
        } else if (res.role.name === 'consultant') {
          this.track.getUsersCompany(res.email).subscribe({
            next: (res: any) => {
              if (res.data) {
                this.companies = res.data
                this.selectedCompany = res.data[0].id
                this.isConsultant = true
              }
            }
          })
        } else {
          this.track.getCompanies().subscribe({
            next: (res: any) => {
              this.companies = res.data;
              this.selectedCompany = res.data[0].id
              this.isConsultant = true;
            }
          })
        }
      }
    })
  }

  getFiles(id: number | undefined) {
    if (!id) {
      this.msg.add({
        severity: 'warn',
        detail: 'Please select a company to continue'
      })
      return;
    }
    this.db.getFiles(id).subscribe({
      next: (res: any) => {
        this.dataFiles = res.uploaded_files.map((x:any) => x.directus_files_id)
        this.reportFiles = res.uploaded_reports.map((x:any) => x.directus_files_id)
      },
      error: (err:any) => {
        this.msg.add({
          severity: 'error',
          summary: 'Files not found!',
          detail: err.error.errors[0].message
        })
      }
    })

  }
}
