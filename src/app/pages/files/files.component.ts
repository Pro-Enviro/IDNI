import {Component} from '@angular/core';
import {DbService} from "../../_services/db.service";
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import {GlobalService} from "../../_services/global.service";
import {EnvirotrackService} from "../envirotrack/envirotrack.service";
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";
import {FormGroup, FormsModule, FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {PanelModule} from "primeng/panel";
import {TableModule} from "primeng/table";
import {InplaceModule} from "primeng/inplace";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {DialogService} from "primeng/dynamicdialog";
import {DialogModule} from "primeng/dialog";
import {SliderModule} from "primeng/slider";
import {PdfViewerModule} from "ng2-pdf-viewer";
import {StorageService} from "../../_services/storage.service";
import {SlideMenuModule} from "primeng/slidemenu";
import {FileUploadModule,FileUpload} from "primeng/fileupload";
import {from} from "rxjs";
import {SelectButtonModule} from "primeng/selectbutton";


export interface Files {
  id: string;
  title: string;
  type: string;
  uploaded_on: string;
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
    SliderModule,
    SlideMenuModule,
    FileUploadModule,
    NgForOf,
    SelectButtonModule,
    ReactiveFormsModule
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
  menuLinks: MenuItem[]
  selectedMenu: string = 'report'
  reportFileCount: number = 0;
  dataFileCount: number = 0;
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
  uploadedFiles: any[] = [];
  fileIds: string[] = []
  fileTypeUpload: any;

  fileTypeUploadOptions = [
    {label: 'Report', value: 'report'},
    {label: 'Data', value: 'data'}
  ]

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

    this.menuLinks = [
      {
        label: 'Reports',
        icon: 'pi pi-file',
        command: () => {
          this.selectedMenu = 'reports';
        }
      },
      {
        label: 'Data',
        icon: 'pi pi-database',
        command: () => {
          this.selectedMenu = 'data';
        }
      },
    ];
  }

  isPdf(fileType: string): boolean {
    return fileType.toLowerCase().includes('pdf');
  }


  onSelectCompany = () => {
    if (!this.selectedCompany) {
      this.selectedCompany = this.companies[0].id;
    }

    this.selectedMenu = 'reports';
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
        //this.dataFiles = res.uploaded_files.map((x: any) => x.directus_files_id)
        //this.reportFiles = res.uploaded_reports.map((x: any) => x.directus_files_id)

        this.dataFiles = res.uploaded_files.map((dataFile:any) => ({
          id:dataFile.directus_files_id?.id || null,
          title:dataFile.directus_files_id?.title || 'Untitled',
          uploaded_on: dataFile.directus_files_id.uploaded_on || 'N/A',
          type:dataFile.directus_files_id?.type || 'Unknown'
        }));
        this.reportFiles = res.uploaded_reports.map((x: any) => ({
          id: x.directus_files_id?.id || null,
          title: x.directus_files_id?.title || 'Untitled',
          uploaded_on: x.directus_files_id?.uploaded_on || 'N/A',
          type: x.directus_files_id?.type || 'unknown'
        }));

        this.reportFileCount = this.reportFiles?.length ?? 0;
        this.dataFileCount = this.dataFiles?.length ?? 0;
        this.updateMenuBadges();
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

  updateMenuBadges() {
    this.menuLinks = [
      {
        label: `Reports`,
        icon: 'pi pi-file',
        badge: `${this.reportFileCount}`,
        command: () => {
          this.selectedMenu = 'reports'
        },
      },
      {
        label: `Data`,
        icon: 'pi pi-database',
        badge: `${this.dataFileCount}`,
        command: () => {
          this.selectedMenu = 'data'
        },
      },
    ]
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

  uploadHandler = (event: any, fileUpload: FileUpload) => {
    this.uploadedFiles = [];
    event.files.forEach((file: any) => this.uploadedFiles.push(file));

    if (this.uploadedFiles.length > 0) {
      const formData = new FormData();
      this.uploadedFiles.forEach((file: any) => {
        if (this.fileTypeUpload === 'report') {
          formData.append('folder', '839154be-d71f-43ff-88c9-7fdf2a8c3aad');
        } else if (this.fileTypeUpload === 'data') {
          formData.append('folder', '0956c625-8a2c-4a0e-8567-c1de4ac2258b');
        }
        formData.append('file[]', file);
      });

      from(this.global.uploadReportDataForCompany(formData)).subscribe({
        next: (res: any) => {
          console.log(res)
          let newFiles: Files[] = [];

          //uploading multiple files
          if (Array.isArray(res) && res.length > 0) {
            newFiles = res.map((file: any) => ({
              id: file.id,
              title: file.filename_download,
              type: file.type,
              uploaded_on: file.uploaded_on || new Date().toISOString(),
            }));
          } else if (res.id) {
            // uploading single file
            newFiles = [{
              id: res.id,
              title: res.filename_download,
              type: res.type,
              uploaded_on: res.uploaded_on || new Date().toISOString(),
            }];
          }

          if(this.fileTypeUpload === 'report'){
            this.reportFiles = [...(this.reportFiles || []), ...newFiles];
            const allFileIds = this.reportFiles.map((file) => file.id);

            this.db.saveReportFiles(this.selectedCompany!, allFileIds).subscribe({
              next: (res) => {
                this.msg.add({
                  severity: 'success',
                  detail: 'Report uploaded!',
                });
              },
              error: (err: any) => {
                console.error("Error while saving files:", err);
                this.msg.add({
                  severity: 'error',
                  summary: 'Upload failed',
                  detail: err.message || 'An error occurred',
                });
              }
            });
            this.reportFileCount = this.reportFiles?.length ?? 0;
            this.updateMenuBadges();
            this.uploadedFiles = [];
          } else if (this.fileTypeUpload === 'data'){
            this.dataFiles = [...(this.dataFiles || []), ...newFiles];
            const allFileIds = this.dataFiles.map((dataFile) => dataFile.id)

            this.db.saveDataFiles(this.selectedCompany!,allFileIds).subscribe({
              next:() => {
                this.msg.add({
                  severity:'success',
                  detail:'Data uploaded !'
                })
              },
              error:(err:any) => {
                this.msg.add({
                  severity:'error',
                  summary:'Upload failed',
                  detail: err.message || 'An error occurred',
                })
              }
            })
            this.dataFileCount = this.dataFiles?.length ?? 0;
            this.updateMenuBadges();
            this.uploadedFiles = [];
          }
          fileUpload.clear();
        },
        error: (err: any) => {
          console.error("Error uploading file:", err);
          this.msg.add({
            severity: 'error',
            summary: 'Upload Error',
            detail: err.message || 'An error occurred while uploading',
          });
        }
      });
    }
  };
}


