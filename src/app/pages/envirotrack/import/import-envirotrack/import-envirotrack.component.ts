import { Component } from '@angular/core';
import * as XLSX from "xlsx";
import {MenuItem, MessageService} from "primeng/api";
import { Papa } from "ngx-papaparse";
import moment from "moment";
import 'moment/locale/en-gb';
import {from, lastValueFrom} from "rxjs";
import {EnvirotrackService} from "../../envirotrack.service";
import {SharedModules} from "../../../../shared-module";
import {SharedComponents} from "../../shared-components";
import {HttpClient} from "@angular/common/http";
import {GlobalService} from "../../../../_services/global.service";
import {SidebarModule} from "primeng/sidebar";
import {DividerModule} from "primeng/divider";
import {FileUpload} from "primeng/fileupload";
import {DbService} from "../../../../_services/db.service";
import {SupplyComponent} from "../supply/supply.component";
import {Router} from "@angular/router";


interface Sheet {
    name: string;
    data: any[];
}

interface DraggedCell {
    name: any;
    row: number;
    col: number;
}

interface HHDData {
    company_id: number;
    mpan: string;
    date: moment.Moment;
    hh: (number | string)[];
    reactive_data: boolean;
}

@Component({
  selector: 'app-import-envirotrack',
  standalone: true,
  templateUrl: './import-envirotrack.component.html',
  styleUrls: ['./import-envirotrack.component.scss'],
  imports: [
    SharedModules,
    SharedComponents,
    SidebarModule,
    DividerModule,
    SupplyComponent
  ]
})

export class ImportEnvirotrackComponent {

  url: string = 'https://app.idni.eco';
  draggedCell: any | null;
  companies: object[] = [];
  selectedCompany: number | undefined;
  selectedMpan: any;
  selectedStartDate: any;
  selectedDataStart: any;
  uploadedFiles: any[] = [];
  fileContent: any;
  hhd: any[] = [];
  dates: any[] = [];
  mpan: string | undefined;
  isXlsx = false;
  items: MenuItem[] = [{
    label: 'Mpan Number',
  }, {
    label: 'Date Column'
  }, {
    label: 'HHD Start'
  }]
  reactiveData = false;
  selectedSheet: string | undefined;
  availableSheets: string[] = [];
  sheetData: any;
  userLevel: number = 2
  selectedName: string = ''
  selectedEmail: string = ''
  isConsultant: boolean = false;
  uploadingData: boolean = false;
  accessData: boolean = false;
  dataGuide:boolean = false;
  fileIds: string[] = []
  selectedCompanyName: any;
  hourlyData: boolean = false;
  dataValue?:any;
  customMpanNumber: string = ''
  energyType:any;
  displayValue: string = '';

  dataOptions = [
    {name:'Half-Hourly Data',value:'half hourly data'},
  ]

  hourlyDataOptions = [
    {name:'Hourly Data',value:'hourly data'}
  ]

  energyTypeOptions = [
    {name:'Electricity',value:'electricity'},
    {name:'Gas',value:'gas'}
  ]


  constructor(
    private track: EnvirotrackService,
    private global: GlobalService,
    private msg: MessageService,
    private papa: Papa,
    private http: HttpClient,
    private db: DbService,
    private route: Router
  ) {
    moment.locale('en-gb')
    moment().format('L')

    // if (this.global.companyAssignedId.value) {
    //   this.selectedCompany = this.global.companyAssignedId.value
    //   this.selectedName = this.global.companyName.value || ''
    // }
      this.getCompanies();
  }

    openXlsx = async (data: any) => {
        const reader = new FileReader();
        reader.onload = () => {
            this.availableSheets = [];
            const fileData = reader.result;
            if (typeof fileData === 'string') {
                const workbook: XLSX.WorkBook = XLSX.read(fileData, { type: "binary" });
                const sheets: Sheet[] = workbook.SheetNames.map((name: string) => ({
                    name,
                    data: XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1 })
                }));
                this.availableSheets = sheets.map((sheet: Sheet) => sheet.name);
                this.sheetData = sheets;
            }
        };
        reader.readAsBinaryString(data);
    };

  openCsv = (data: any) => {
    return new Promise<void>((resolve, reject) => {
      this.papa.parse(data, {
        skipEmptyLines: true,
        transform: (res: any) => res.toLowerCase(),
        complete: (res:any) => {
          this.resultSet(res.data, 'csv');
          resolve();
        },
        error: (err:any) => {
          reject(err);
        }
      });
    });
  }

  customMpanNumberHandler = () => {
    this.selectedMpan = {
      col: 0,
      row: 1,
      name: this.customMpanNumber
    }
  }

  onTypeChange(event: any) {
    const selectedOption = this.energyTypeOptions.find((option:any) => option.value === event.value);
    if (selectedOption) {
      this.displayValue = `${selectedOption.name}`;

    }
  }

  onUpload = async (event: any, fileUploadComponent: FileUpload) => {
    if (!this.selectedCompany) {
      this.msg.add({
        severity: 'error',
        summary: 'No Company Selected',
        detail: 'Please select a company before upload'
      });
      return;
    }
    if (event.files[0].name.split('.').pop().toLowerCase() === 'csv') {
      await this.openCsv(event.files[0]);
    } else {
      await this.openXlsx(event.files[0]);
    }
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.uploadHandler(event, fileUploadComponent)
    this.msg.add({
      severity: 'success',
      detail: 'File Uploaded',
    });
  }


  uploadHandler = (event: any, fileUploadComponent: FileUpload) => {
    this.uploadedFiles = []
    event.files.forEach((file: any) => this.uploadedFiles.push(file))
    if (this.uploadedFiles.length > 0) {
      const formData = new FormData();
      this.uploadedFiles.forEach((file: any) => {
        formData.append('folder', '0956c625-8a2c-4a0e-8567-c1de4ac2258b');
        formData.append('file[]', file)
      });


      from(this.global.uploadDataForCompany(formData)).subscribe({
        next: (res: any) => {
          if (res.length > 1 ) {
            this.fileIds = res.map((file: any) => file.id);
          } else if (res.id) {
            this.fileIds = res.id
          }

          fileUploadComponent.clear()
        }
      })
    }
  }


  resultSet = (data: any, type: string) => {
    if (type === 'csv') {
      this.fileContent = data;
    }
  }

  getSheetData = () => {
    const sheet = this.sheetData.find((x: any) => x.name === this.selectedSheet);
    this.fileContent = sheet?.data || [];

    function excelDateToDateTime(excelSerial: number): Date {
      const utcDays = Math.floor(excelSerial) - 25569; 1
      const utcValue = utcDays * 86400
      const fractionalDay = excelSerial - Math.floor(excelSerial);
      const secondsInDay = Math.round(86400 * fractionalDay);
      return new Date((utcValue + secondsInDay) * 1000);
    }



    if (this.hourlyData) {
      const formattedDates = this.fileContent.map((row: any[], index: number) => {
        if (index === 0) return row;
        const timestamp = excelDateToDateTime(row[0]);
        row[0] = timestamp;
        return row;
      });

      this.fileContent = [...formattedDates]

    } else {
      this.fileContent = sheet?.data;
    }
    // console.log(this.fileContent);
  }

  getFileType = (event: any) => {
    this.isXlsx = event.files[0].name.split('.').pop().toLowerCase() != 'csv';
  }

  dragStart(cell: any, row: number, col: number) {
    this.draggedCell = {
      name: cell,
      row,
      col
    };
  }

  dropMpan() {
    if (this.draggedCell) {
      this.selectedMpan = this.draggedCell;
      this.draggedCell = null;
    }
  }

  dropStartDate() {
    if (this.draggedCell) {
      this.selectedStartDate = this.draggedCell;
      this.draggedCell = null;
    }
  }

  dropFirstData() {
    if (this.draggedCell) {
      this.selectedDataStart = this.draggedCell;
      this.draggedCell = null;
    }
  }

  dragEnd() {
    this.draggedCell = null;
  }

  getCompanies = () => {
    this.global.getCurrentUser().subscribe({
      next: (res: any) => {
        if (res.role.name === 'user'){
          this.selectedEmail = res.email
          this.track.getUsersCompany(res.email).subscribe({
            next: (res: any) => {
              if (res.data){
                this.companies = res.data
                this.selectedCompany = res.data[0].id
                this.selectedCompanyName = res.data[0].name
              }
            }
          }) }
        else if (res.role.name === 'consultant'){
          this.track.getUsersCompany(res.email).subscribe({
            next: (res: any) => {
              if (res.data) {
                this.companies = res.data
                this.isConsultant = true
              }
            }
          })

        } else {
          this.track.getCompanies().subscribe({
            next:(res: any) => {
              this.companies = res.data;
              this.isConsultant = true;
            }
          })
        }

      }
    })
  }

  sendDataToProEnviro(){

    // Upload data to database and link to company
    if (!this.selectedCompany || !this.uploadedFiles.length) return;

    let fileUUIDS : {directus_files_id: any}[] = [];
    if (this.uploadedFiles.length === 1 ) {
      fileUUIDS = [{directus_files_id: this.fileIds}]
    } else if (this.uploadedFiles.length > 1 && this.uploadedFiles.length <= 10) {
      let mappedIds = this.fileIds.map((fileId: string) => {
            return {
              directus_files_id: fileId
            }
          })
      fileUUIDS = mappedIds
    }

    try {
      // Check if existing files, if so add to current uuid array
      this.db.checkUsersFiles(this.selectedCompany).subscribe({

        next: (res: any) => {
          if (res.data){
            res.data.uploaded_files.forEach((file: any) => {
              fileUUIDS.push({
                directus_files_id: file.directus_files_id,
              })
            })
          }
        },

        error: (err: any) => console.log(err),
        complete: () => {

          // Add the saved files to the company table in Directus
          if (!this.selectedCompany) return;

          this.track.saveFilesData(this.selectedCompany, {uploaded_files: fileUUIDS}).subscribe({
            next: (res:any) => {
              this.uploadedFiles = []
            },
            error: (err:any) => {
              console.log(err)
            },
          })
        }
      })
    } catch {
      this.msg.add({
        severity: 'warn',
        detail:'You have already uploaded files'
      })
    }


     // Send an email to pro enviro to alert about uploaded data
    return this.http.post(`${this.url}/Mailer`,{
      subject: `${this.selectedCompanyName} has data for upload`,
      to: ['it@proenviro.co.uk', 'data@proenviro.co.uk','richard.pelan@investni.com'],
      template: {
        name: "data_uploaded",
        data: {
          "company": this.selectedCompanyName,
          "user": this.selectedEmail
        }
      },
      "files": typeof this.fileIds === 'string' ? [this.fileIds] : [...this.fileIds]
    },{responseType: "text"}).subscribe({
      next:(res) => {
        this.msg.add({
          severity: 'success',
          detail: 'Data sent'
        })
      },
      error: (error: any) =>console.log(error),
      complete: () => {
        this.uploadedFiles = []
        this.fileContent = null;
      }
    })
  }


  processData = async () => {
    if(!this.energyType){
      this.msg.add({
        severity: 'error',
        summary: 'No energy type selected',
        detail: 'Please select energy type and try again !'
      });
      return;
    }

    if (!this.selectedMpan && this.hourlyData){
      this.selectedMpan = {
        name: 'No Provided MPAN'
      }
    }


    if (!this.selectedMpan || !this.selectedMpan?.name.toString().length  ) {
      this.msg.add({
        severity: 'error',
        summary: 'No mpan number selected',
        detail: 'Please select mpan number and try again'
      });
      return;
    }
    if (!this.selectedStartDate) {
      this.msg.add({
        severity: 'error',
        summary: 'No start date selected',
        detail: 'Please select start date and try again'
      });
      return;
    }
    if (!this.selectedDataStart) {
      this.msg.add({
        severity: 'error',
        summary: 'No data start point selected',
        detail: 'Please select data start point and try again'
      });
      return;
    }


    if (this.hourlyData) {
      // Temp object to store data for each date
      const groupedData: { [key: string]: any } = {};

      for (const [index, row] of this.fileContent.entries()) {
        if (index >= this.selectedDataStart.row) {

          const originalDate = moment.utc(row[0]);

          // handles date + time in one cell
          if (originalDate.isValid()) {
            const dayKey = originalDate.format('DD/MM/YYYY');

            // Initialize the day object if it doesn't exist
            if (!groupedData[dayKey]) {
              groupedData[dayKey] = {
                company_id: this.selectedCompany,
                mpan: this.selectedMpan.name.toString(),
                date: originalDate.clone().startOf('day'),
                hhd: Array(48).fill(0),
                reactive_data: this.reactiveData
              };
            }

            // Calculate the position in the hhd array - 00:00 should go in position 0, 00:30 in position 1 etc.
            // e.g. if time is 03:00, hour = 3, position is 6 to take into account half hours in between
            const hour = originalDate.hour();
            const position = hour * 2;

            // Half the data for on the hour and half hour
            const halfHHDAmount = row[1] / 2;

            groupedData[dayKey].hhd[position] = halfHHDAmount;
            groupedData[dayKey].hhd[position + 1] = halfHHDAmount;
          }
        }
      }

      // Convert the grouped data object to an array
      this.hhd = Object.values(groupedData);

  } else {
      for (const [index, row] of this.fileContent.entries()) {
        if (index >= this.selectedDataStart.row) {
          let date;
          if (row[this.selectedStartDate.col.toString().substring(0, 2)] != 20) {
            let tmp = row[this.selectedStartDate.col]
            if (isNaN(tmp)) {
              date = moment(tmp, 'DD/MM/YYYY')
            } else {
              let unix = ((tmp - 25569) * 86400000)
              row[this.selectedStartDate.col] = moment(new Date(unix), 'DD/MM/YYYY')
              date = moment(new Date(unix), 'DD/MM/YYYY')
            }
          } else {
            date = moment(row[this.selectedStartDate.col], 'DD/MM/YYYY')
          }
          if (date.isValid()) {
            this.hhd.push({
              company_id: this.selectedCompany,
              //mpan: this.selectedMpan.name.toString(),
              mpan: this.customMpanNumber.length ? this.displayValue + "-" + this.customMpanNumber :  this.displayValue + "-" + parseInt(this.selectedMpan.name).toString(),
              date: date,
              hhd: row.slice(this.selectedDataStart.col, (this.selectedDataStart.col + 1 + 47)).map((x: number | string) => typeof x === 'string' ? parseFloat(x) : x),
              reactive_data: this.reactiveData
            })
          }
        }
      }
    }


    //TODO change Post request to be bulk
    let newHhd: any[] = [];
    let skippedRows: number = 0;
    this.uploadingData = true;
    for (const [index, row] of this.hhd.entries()) {
      try {
        row.hhd = JSON.stringify(row.hhd)
        let newRow = omit('company_id', row)
        newRow.company = this.selectedCompany;

        const res:any = await lastValueFrom(this.track.lookup(row.mpan, row.date.format('YYYY-MM-DD'), newRow.company));
        if(!res || !res.data.length){
          await lastValueFrom(this.track.uploadData([newRow], this.selectedCompany!));
        }else if(res.data.length > 0 && row.reactive_data != res.data[0].reactive_data) {
          await lastValueFrom(this.track.uploadData([newRow], this.selectedCompany!));
        } else if (res.length > 1) {
          console.error('Too many results found! Please check database', row, res.data)
        } else {
          skippedRows++;
          console.error('request',row)
          console.error('result',res.data)
        }
      } catch (err: any) {
        this.msg.add({
          severity: 'error',
          summary: 'Oops! something went wrong',
          detail: err.error.errors[0].message
        });
      }
      if (index === this.hhd.length - 1) {
        if (!newHhd.length) {
          /*this.msg.add({
            severity: 'error',
            summary: 'No Data to add',
            detail: 'Data already in database'
          });*/
          // return;
        }
      }
    }

    try {
      await lastValueFrom(this.track.uploadData(newHhd, this.selectedCompany!));
      this.msg.add({
        severity: 'success',
        detail: 'Data saved to database'
      });
      this.uploadingData = false;
      this.uploadedFiles = []
      this.fileContent = null
      if(skippedRows){
        // this.msg.add({
        //   severity: 'warn',
        //   detail: `${skippedRows}`
        // })
      }
      //window.location.reload();
    } catch (err: any) {
      this.msg.add({
        severity: 'error',
        summary: 'Oops upload failed!',
        detail: err.error.errors[0]
      });
    }


    this.uploadingData = false;
    this.uploadedFiles = []
    this.fileContent = null
    this.selectedMpan = null;
    this.draggedCell = null;
    this.selectedDataStart = null;
    //DO I NEED THIS VALUES HERE ?
    this.energyType = []
    this.customMpanNumber = ""

  }

  resetUploader = () => {
    this.uploadingData = false;
    this.uploadedFiles = []
    this.fileContent = null
    this.selectedMpan = null;
    this.draggedCell = null;
    this.selectedStartDate = null;
    this.selectedDataStart = null;
    this.hhd = [];

    //DO I NEED THIS VALUES HERE ?
    this.energyType = []
    this.customMpanNumber = ""


  }

}




export function omit(key: any, obj: any) {
  const { [key]: omitted, ...rest } = obj;
  return rest;
}
