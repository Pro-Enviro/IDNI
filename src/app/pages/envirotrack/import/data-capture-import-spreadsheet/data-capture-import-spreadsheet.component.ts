import {Component, OnInit} from '@angular/core';
import {EnvirotrackService} from "../../envirotrack.service";
import * as XLSX from "xlsx";
import {MenuItem, MessageService} from "primeng/api";
import {Papa} from "ngx-papaparse";
import moment from "moment";
import 'moment/locale/en-gb';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import _ from 'lodash'
import {SharedModules} from "../../../../shared-module";
import {SharedComponents} from "../../shared-components";

interface Sheet {
  name: string;
  data: any[];
}

interface DraggedCell {
  name: any;
  row: number;
  col: number;
}


@Component({
  selector: 'app-data-capture-import-spreadsheet',
  standalone: true,
  templateUrl: './data-capture-import-spreadsheet.component.html',
  styleUrls: ['./data-capture-import-spreadsheet.component.scss'],
  imports: [
    SharedModules,
    SharedComponents
  ]
})
export class DataCaptureImportSpreadsheetComponent implements OnInit {
  draggedCell: any | null;
  companies: object[] = [];
  selectedCompany: number | undefined;
  selectedMpan: any;
  uploadedFiles: any[] = [];
  fileContent: any;
  hdd: any[] = [];
  dates: any[] = [];
  mpan: string | undefined;
  isXlsx = false;
  items: MenuItem[] = [{
    label: 'Mpan Number',
  }, {
    label: 'Date Column'
  }, {
    label: 'HDD Start'
  }]
  selectedSheet: string | undefined;
  availableSheets: string[] = [];
  sheetData: any;
  fuelColumns: any[] = []
  fuelData: any;
  spreadsheetDataToAdd: any[] = [];
  processed: boolean = false;

  constructor(
    private track: EnvirotrackService,
    private msg: MessageService,
    private papa: Papa,
    private dialog: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) {
    moment.locale('en-gb')
    moment().format('L')
    // this.getCompanies();


    if (this?.config?.data) {
      this.selectedCompany = this.config.data.company
      this.fuelData = this.config.data.fuel;
      const cols = this.config.data.fuel.cols;


      this.fuelColumns = cols.map((col: any) => {
        return {
          ...col,
          draggedCell: null
        }
      })

    }
  }

  openXlsx = async (data: any) => {
    const reader = new FileReader();
    reader.onload = () => {
      this.availableSheets = [];
      const fileData = reader.result;
      if (typeof fileData === 'string') {
        const workbook: XLSX.WorkBook = XLSX.read(fileData, {type: "binary"});
        const sheets: Sheet[] = workbook.SheetNames.map((name: string) => ({
          name,
          data: XLSX.utils.sheet_to_json(workbook.Sheets[name], {header: 1})
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
        transform: (res) => res.toLowerCase(),
        complete: (res) => {
          this.resultSet(res.data, 'csv');
          resolve();
        },
        error: (err) => {
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
      console.log(data)
    }
  }

  getSheetData = () => {
    const sheet = this.sheetData.find((x: any) => x.name === this.selectedSheet);
    this.fileContent = sheet?.data;
    const titleRowLength = this.fileContent[0].length;

    // Check for amount of columns in the title row - cut off the rest
    this.fileContent = this.fileContent.map((row: any, index: number) => {
      if (row.length > titleRowLength){

        row = row.slice(0, titleRowLength);
      }

      return row;
    })

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

  dropColumnTitle(column: any) {
    if (this.draggedCell) {
      const findColumn = this.fuelColumns.findIndex((col: any) => col.name === column.name)
      if (findColumn !== -1) {
        this.fuelColumns[findColumn].draggedCell = this.draggedCell;
      }
      this.draggedCell = null;
    }
  }

  removeCell = (column: any) => {
    column.draggedCell = null;
  }

  dragEnd() {
    this.draggedCell = null;
  }

  getCompanies = () => {
    // this.track.getCompanies().subscribe({
    //   next: (res) => {
    //     this.companies = res;
    //   }
    // })
  }

  processData = async () => {
    if (!this.fuelColumns.length) {
      this.msg.add({
        severity: 'error',
        summary: 'No columns',
      });
      return;
    }


    let spreadsheetAddedRows = [];
    // Loop through each line in the csv file
    for (const [index, row] of this.fileContent.entries()) {
      // skip first row (column titles) or empty row
      if (index === 0) continue;
      if (!row.length) break;

      // Checking for <empty slot>
      const rowCopy = row.filter((item: any) => item)
      if (!rowCopy.length) continue;

      // Create a new row (using col as base)
      let columnsToUse = _.cloneDeep(this.fuelColumns)

      // Loop through columns to check if value needs to be appended
      columnsToUse = columnsToUse.map((column: any) => {
        const rowIndexToTake = column?.draggedCell?.col
        if (rowIndexToTake) {
          // Handle date format from CSV

          if (column.type === 'date') {
            if (isNaN(row[rowIndexToTake])) {
              column.value = ''
              return column;
            }

            let tmp = row[rowIndexToTake]
            let unix = ((tmp - 25569) * 86400000)
            const formattedDate = new Date(unix)



            if (!formattedDate) {
              column.value = ''
              return column;
            }

            if (formattedDate) {
              column.value = formattedDate
            } else {
              column.value = ''
            }

          } else if (column.type === 'number') {
            if (isNaN(row[rowIndexToTake])) {
              column.value = ''
              return column;
            }
            column.value = row[rowIndexToTake] ? row[rowIndexToTake].toFixed(5) : 0
          } else {
            column.value = row[rowIndexToTake] ? row[rowIndexToTake] : ''
          }
        } else {
          // Handle empty date when the column is not selected
          if (column.type === 'number') column.value = 0;
          else if (column.type === 'date') column.value = ''
          else column.value = ''
        }
        return column;
      })
      spreadsheetAddedRows.push(columnsToUse)
    }

    this.spreadsheetDataToAdd = spreadsheetAddedRows
    this.fuelData.rows.push(...spreadsheetAddedRows)

    this.processed = true;
    return this.msg.add({
      severity: 'success',
      detail: 'Spreadsheet has been processed'
    })
  }

  close() {
    this.dialog.close({newFuelData: this.fuelData})
  }

  ngOnInit() {

  }
}
