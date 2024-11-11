import {Component} from '@angular/core';
import {DbService} from "../../_services/db.service";
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import {GlobalService} from "../../_services/global.service";
import {EnvirotrackService} from "../envirotrack/envirotrack.service";
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {JsonPipe, NgIf} from "@angular/common";
import {PanelModule} from "primeng/panel";
import {TableModule} from "primeng/table";
import {InplaceModule} from "primeng/inplace";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {DialogService} from "primeng/dynamicdialog";
import {DialogModule} from "primeng/dialog";
import {SliderModule} from "primeng/slider";
import {PdfViewerModule} from "ng2-pdf-viewer";
import {StorageService} from "../../_services/storage.service";

export interface Files {
  id: number;
  title: string;
}

@Component({
  selector: 'app-files',
  standalone: true,
  providers: [DialogService, ConfirmationService],
  imports: [
    CardModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
    JsonPipe,
    PanelModule,
    TableModule,
    NgIf,
    InplaceModule,
    ConfirmPopupModule,
    DialogModule,
    PdfViewerModule,
    SliderModule
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

  files: any = [];
  items!: MenuItem[];
  docs!: any;
  downloadUrl: string = 'https://app.idni.eco';
  token?: null | string;
  isAdmin?: boolean;
  folders: any[] = ['reports', 'strategies', 'energy_footprint', 'energy_contracts', 'bills', 'projects', 'site_plan', 'other',]
  showPdf: boolean = false;
  pdfId!: string;
  pdfTitle!: string;
  sendEmail: string = 'No'
  contact?: string;
  dates?: string;
  reviewPdf: boolean = false;
  previewFile: any;
  pdfZoom: number = 100;

  constructor(
    private db: DbService,
    private global: GlobalService,
    private msg: MessageService,
    private track: EnvirotrackService,
    private confirmationService: ConfirmationService,
    private store: StorageService
  ) {
    this.getCompanies()
    this.token = this.store.get('access_token');

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


  viewPdf(id: string, title: string) {
    this.pdfZoom = 100;
    this.pdfId = id;
    this.pdfTitle = title;
    this.showPdf = true;
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
        this.dataFiles = res.uploaded_files.map((x: any) => x.directus_files_id)
        this.reportFiles = res.uploaded_reports.map((x: any) => x.directus_files_id)
        console.log(this.dataFiles, this.reportFiles)
      },
      error: (err: any) => {
        this.msg.add({
          severity: 'error',
          summary: 'Files not found!',
          detail: err.error.errors[0].message
        })
      }
    })

  }

  onDelete(id: string, title: string, event: any) {
    this.confirmationService.confirm({
      target: event.target,
      message: `Are you sure you want to remove ${title}? This action cannot be undone.`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

      },
      reject: () => {
        return;
      }
    })
  }

  docName(type: string) {
    switch (type) {
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return '.docx';
      case 'text/csv':
        return '.csv';
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return '.xlsx'
      case 'application/vnd.ms-excel.sheet.macroenabled.12':
        return '.xlsm'
      case 'application/pdf':
        return 'pdf';
      default:
        return type
    }
  }
}
