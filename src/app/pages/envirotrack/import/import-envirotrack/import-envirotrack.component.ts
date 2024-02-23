import { Component } from '@angular/core';
import * as XLSX from "xlsx";
import {MenuItem, MessageService} from "primeng/api";
import { Papa } from "ngx-papaparse";
import moment from "moment";
import 'moment/locale/en-gb';
import {lastValueFrom} from "rxjs";
import {EnvirotrackService} from "../../envirotrack.service";
import {SharedModules} from "../../../../shared-module";
import {SharedComponents} from "../../shared-components";
import {TopPageImgTplComponent} from "../../../../_partials/top-page-img-tpl/top-page-img-tpl.component";


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
  styleUrl: './import-envirotrack.component.scss',
  imports: [
    SharedModules,
    SharedComponents,
    TopPageImgTplComponent
  ]
})

export class ImportEnvirotrackComponent {
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

  constructor(
    private track: EnvirotrackService,
    private msg: MessageService,
    private papa: Papa,
  ) {
    moment.locale('en-gb')
    moment().format('L')

    if (this.track.selectedCompany.value) {
      this.selectedCompany = this.track.selectedCompany.value
    }

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

  onUpload = async (event: any) => {
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
    this.msg.add({
      severity: 'success',
      detail: 'File Uploaded',
    });
  }

  resultSet = (data: any, type: string) => {
    if (type === 'csv') {
      this.fileContent = data;
    }
  }

  getSheetData = () => {
    const sheet = this.sheetData.find((x: any) => x.name === this.selectedSheet);
    this.fileContent = sheet?.data;
    console.log(this.fileContent);
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
    this.companies = []
    this.track.getCompanies().subscribe({
      next: (res: any) => {
        if (res?.data?.length) {
          this.companies = res.data
        }

      },
      error: (err) => console.log(err)
    })
  }

  processData = async () => {
    if (!this.selectedMpan) {
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
            mpan: parseInt(this.selectedMpan.name).toString(),
            date: date,
            hhd: row.slice(this.selectedDataStart.col, (this.selectedDataStart.col + 1 + 47)).map((x: number | string) => typeof x === 'string' ? parseFloat(x) : x),
            reactive_data: this.reactiveData
          })
        }
      }
    }
    //TODO change Post request to be bulk
    let newHhd: any[] = [];
    let skippedRows: number = 0;
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
          return;
        }
      }
    }
    try {
      await lastValueFrom(this.track.uploadData(newHhd, this.selectedCompany!));
      this.msg.add({
        severity: 'success',
        detail: 'Data saved to database'
      });
      console.log(skippedRows)
      if(skippedRows){
        this.msg.add({
          severity: 'warn',
          detail: `${skippedRows}`
        })
      }
      //window.location.reload();
    } catch (err: any) {
      this.msg.add({
        severity: 'error',
        summary: 'Oops upload failed!',
        detail: err.error.errors[0]
      });
    }
  }
}
export function omit(key: any, obj: any) {
  const { [key]: omitted, ...rest } = obj;
  return rest;
}
