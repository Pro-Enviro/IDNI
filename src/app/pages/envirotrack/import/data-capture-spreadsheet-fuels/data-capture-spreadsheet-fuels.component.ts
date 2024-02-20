import {Component} from '@angular/core';
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {
  DataCaptureSpreadsheetFuelsFieldsComponent
} from "../data-capture-spreadsheet-fuels-fields/data-capture-spreadsheet-fuels-fields.component";
import {ConfirmationService, MessageService} from "primeng/api";
import moment from "moment/moment";
import _ from 'lodash'
import {
  DataCaptureImportSpreadsheetComponent
} from "../data-capture-import-spreadsheet/data-capture-import-spreadsheet.component";
import FileSaver from "file-saver";

import {SharedModules} from "../../../../shared-module";
import {SharedComponents} from "../../shared-components";

export class Fields {
  type: string = '';
  cols!: any[];
  rows: any[] = []
}


@Component({
  selector: 'app-data-capture-spreadsheet-fuels',
  standalone: true,
  templateUrl: './data-capture-spreadsheet-fuels.component.html',
  styleUrl: './data-capture-spreadsheet-fuels.component.scss',
  providers: [DialogService, ConfirmationService],
  imports: [
    SharedModules,
    SharedComponents,
  ]
})
export class DataCaptureSpreadsheetFuelsComponent {
  selectedCompany: any;
  ref: DynamicDialogRef | undefined;
  fuels: Fields[] = [];
  activeTab: number = 0;
  uomOptions: string[] = []
  fetchedFuelData: any[] = []
  display: boolean = false;
  selectedItem: any = {}
  nameChange: string = ''


  constructor(
    private dialog: DialogService,
    private msg: MessageService,
    // private global: GlobalService,
    // private admin: AdminService,
    private confirmationService: ConfirmationService,
  ) {
    // this.uomOptions = this.global.supplyUnit
  }


  getCompany = (id: any) => {
    if (!id) return;
    // this.admin.fnGetCompanyDetails(id, ['*']).subscribe({
    //   next: (res: any) => {
    //     this.selectedCompany = res;
    //     this.getFuelData()
    //   }
    // })
  }

  showDialog = (fuel: any) => {
    this.selectedItem = fuel;
    this.display = true;
  }

  saveName = (newName: string, fuel: any) => {

    const nameExists = this.fuels.findIndex((fuel: any) => fuel.type === newName)
    if (nameExists !== -1) newName = newName + '-copy'

    fuel.type = newName;
    // Reset state
    this.selectedItem = {}
    this.display = false;
    this.nameChange = ''
  }

  cancelNameChange = () => {
    this.selectedItem = {}
    this.display = false;
  }

  onKeyDown = (event: KeyboardEvent) => event.stopPropagation()

  deleteFuelType = (event: any, fuel: any) => {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Do you want to delete this fuel type?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.fuels = this.fuels.filter((f: any) => fuel.type !== f.type)
        this.activeTab = 0;
        this.msg.add({
          severity: 'warn',
          detail: 'Fuel Type Deleted',
        })
        this.confirmationService.close()
      },
      reject: () => {
        this.msg.add({
          severity: 'info',
          detail: 'Fuel Type not deleted',
        })
        this.confirmationService.close()
      }
    });
  }

  addFuelType = () => {
    this.ref = this.dialog.open(DataCaptureSpreadsheetFuelsFieldsComponent, {
      header: 'Add Fuel Type',
      width: '90vw',
      height: '90vh',
    })

    this.ref.onClose.subscribe({
      next: (fuel: any) => {
        if (fuel) {
          // If the type of fuel already exists, add a label to show its a duplicate
          const index = this.fuels.findIndex((f: any) => f.type === fuel.type)
          if (index !== -1) {
            fuel.rows = []
            fuel.type = fuel.type + ` copy (${this.fuels.length})`
            this.fuels.push(fuel)
            this.addNewRow(fuel)
          } else {
            fuel.rows = []
            this.fuels.push(fuel)
            this.addNewRow(fuel)
          }

          // Set current tab to the newly created fuel type
          setTimeout(() => {
            this.activeTab = this.fuels.length - 1
          }, 0);
        }
      }
    })
  }
  getCols = (cols: any) => {
    return cols.map((col: any) => {
      return {
        field: col.name,
        header: col.name
      }
    })
  }

  exportExcel(fuel: any) {

    // Format data for export
    let fuelRows = fuel.rows.map((row: any) => row.reduce((current: any, next: any) => {
      return {...current, [next.name]: next.value ? next.value : ''}
    }))

    // Remove unnecessary columns
    fuelRows = fuelRows.map(({name, math, type, draggedCell, ...row}: any) => row)

    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(fuelRows);
      const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
      const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
      this.saveAsExcelFile(excelBuffer, `${this.selectedCompany.name} ${fuel.type} ${moment(new Date()).format('DD-MM-YYYY')}`);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  editFuelType = (fuel: Fields) => {
    this.ref = this.dialog.open(DataCaptureSpreadsheetFuelsFieldsComponent, {
      header: fuel.type,
      width: '90vw',
      height: '90vh',
      data: fuel,
      closeOnEscape: false,
      closable: false
    })

    this.ref.onClose.subscribe({
      next: (fuel: any) => {
        if (fuel) {
          const index = this.fuels.findIndex((f: any) => f.type === fuel.type)
          const currentCols = this.fuels[index].cols


          // Update rows to reflect new cols / reordered etc
          const newRows = this.fuels[index].rows.map((row: any) => {

            // Add in newly added columns missing from table
            currentCols.forEach((col: any) => {
              const rowIndex = row.findIndex((cell: any) => cell.name === col.name)
              if (rowIndex === -1) {
                const copiedCol = _.cloneDeep(col)
                row.push(copiedCol)
              }
            })


            // If columns are removed, check all rows and remove
            row = row.filter((col: any) => {
              const colIndex = currentCols.findIndex((cell: any) => cell.name === col.name)
              return colIndex !== -1
            })

            currentCols.forEach((col: any) => {
              const rowIndex = row.findIndex((cell: any) => cell.name === col.name)
              // Check operators and picked columns to calculate with
              if (rowIndex === -1) return;

              // Not applying correctly?
              if (col.math) {
                row[rowIndex].checked = col.checked
                row[rowIndex].selectedMath = col.selectedMath
                row[rowIndex].option1 = col.option1
                row[rowIndex].option2 = col.option2
              }

              // If total is checked or not
              if (col.hasOwnProperty('total')) {
                col.total ? row[rowIndex].total = true : row[rowIndex].total = false
              }
            })


            this.calculateCellValue(row)

            // Sort row according to column order
            return row.sort((a: any, b: any) => {
              return currentCols.findIndex((x: any) => x.name === a.name) - currentCols.findIndex((x: any) => x.name === b.name)
            })
          })

          // Update fuels object with correct columns
          this.fuels[index].cols = fuel.cols;
          this.fuels[index].rows = newRows
        }
      }
    })
  }

  addNewRow = (fuel: any) => {
    const prevRow = fuel.rows[fuel.rows.length - 1] || null;
    const newRow = _.cloneDeep(fuel.cols)

    // Carry over previous rates
    if (prevRow) {
      newRow.map((newColumn: any) => {
        //TODO: Confirm these are the ones to carry over
        const carryover = ['Rate', 'Unit', 'Standard Rate', 'CCL Rate']
        if (carryover.includes(newColumn.name)) {
          const val = prevRow.find((col: any) => newColumn.name === col.name)
          newColumn.value = val.value;
        }
      })
    }

    // Insert row at correct fuel index
    const index = this.fuels.findIndex((fuelToFind: Fields) => fuelToFind.type === fuel.type)
    if (index !== -1) {
      this.fuels[index].rows.push(newRow)
    }
  }


  tooltipText = (row: any) => {
    let operator = 'X'
    switch (row.selectedMath) {
      case 'times':
        operator = 'x';
        break;
      case 'plus':
        operator = '+'
        break;
      default:
        break;
    }

    return `${row.option1} ${operator} ${row.option2}`
  }


  calculateCellValue = (fuelRow: any) => {
    let grandTotal = 0;

    const calculatedFuelRow = fuelRow.map((col: any) => {
      // If the column requires a calculation

      if (col.checked) {
        // Find the two columns to use the operator on
        const col1 = fuelRow.filter((c: any) => c.name === col.option1)
        const col2 = fuelRow.filter((c: any) => c.name === col.option2)

        let col1Value = col1[0].value
        let col2Value = col2[0].value

        // Set values to 0 if no value found (undefined/null)
        if (!col1Value) col1Value = 0;
        if (!col2Value) col2Value = 0;


        switch (col.selectedMath) {
          case 'times':
            col.value = (Number(col1Value) * Number(col2Value)).toFixed(2)
            break;
          case 'plus':
            col.value = (Number(col1Value) + Number(col2Value)).toFixed(2)
            break;
          case 'subtract':
            col.value = (Number(col1Value) - Number(col2Value)).toFixed(2)
            break;
          case 'divide':
            col.value = (Number(col1Value) / Number(col2Value)).toFixed(2)
            break;
          default:
            break;
        }
      }


      if (col.total) {
        parseFloat(col.value) ? grandTotal += parseFloat(col.value) : grandTotal += 0
      }


      return col
    })


    // Update total column value
    calculatedFuelRow.forEach((col: any) => {
      if (col.name === 'Total') col.value = grandTotal;
    })
  }

  calculateDays = (fuelRow: any) => {
    const startDate = fuelRow.filter((col: any) => col.name === 'Start Date')[0].value
    const endDate = fuelRow.filter((col: any) => col.name === 'End Date')[0].value

    if (!startDate || !endDate) return 0;
    const rowIndex = fuelRow.findIndex((col: any) => col.name === 'Days')
    return fuelRow[rowIndex].value = moment(endDate).diff(moment(startDate), 'days', false)
  }

  deleteRow = (fuelRow: any, index: number) => {
    fuelRow.rows.splice(index, 1)
  }


  getFuelData = () => {

    this.fuels = []

    if (this.selectedCompany) {
      // this.admin.fnGetCompanyDetails(this.selectedCompany.id, [
      //   'fuel_data.*'
      // ]).subscribe({
      //   next: (res: any) => {
      //     this.fetchedFuelData = res.fuel_data;
      //     // If saved data is found
      //
      //     // take the longest all_other_fields
      //     const all = res.fuel_data.map((row: any) => row.all_other_fields)
      //     // const longest = all.reduce((acc: any, curr: any) => acc?.length > curr?.length ? acc : curr)
      //
      //     // Take earliest created
      //     const earliestCreated = all.reduce((acc: any, curr: any) => acc?.date_created > curr?.date_created ? acc : curr, [])
      //
      //     // Latest updated (attempt at fixing duplicate bug)
      //     // const latestUpdated = res.fuel_data.reduce((a:any, b:any) => a.date_updated > b.date_updated ? a : b)
      //
      //     if (earliestCreated.length) {
      //       this.fuels = []
      //       this.fuels = JSON.parse(earliestCreated)
      //
      //       this.fuels.map((fuelType: any) => {
      //         fuelType.rows.map((col: any) => {
      //
      //           // Change  DB string to Date for Primeng Calendar
      //           const findStartDate = col.findIndex((col: any) => col.name === 'Start Date')
      //           const findEndDate = col.findIndex((col: any) => col.name === 'End Date')
      //           col[findStartDate].value ? col[findStartDate].value = new Date(col[findStartDate].value) : new Date()
      //           col[findEndDate].value ? col[findEndDate].value = new Date(col[findEndDate].value) : new Date()
      //         })
      //       })
      //     } else {
      //       this.fuels = []
      //     }
      //   }
      // })
    }
  }

  saveFuel = () => {
    let stringifiedData: any;
    if (this.fetchedFuelData.length) {
      stringifiedData = _.cloneDeep(this.fetchedFuelData[0]);
      stringifiedData.all_other_fields = JSON.stringify(this.fuels)
    } else {
      stringifiedData = {
        all_other_fields: JSON.stringify(this.fuels),
      }
    }

    let createNew = []
    let updateExisting = []

    // Check if an update is required rather than a new push
    if (this?.fetchedFuelData?.[0]?.id) {
      stringifiedData.id = this.fetchedFuelData[0].id
      updateExisting.push(stringifiedData)
    } else if (this.selectedCompany?.fuel_data.length === 0) {
      createNew.push(stringifiedData)
    } else {
      this.msg.add({
        severity: 'warn',
        detail: 'Something went wrong. Try again'
      })
    }

    // this.admin.updateCompanyM2ORow('fuel_data', this.selectedCompany.id, createNew, updateExisting, []).subscribe({
    //   next: (res: any) => {
    //     if (res.fuel_data.length) {
    //       // Latest updated (attempt at fixing duplicate bug)
    //       // const latestUpdated = res.fuel_data.reduce((a:any, b:any) => a.date_updated > b.date_updated ? a : b)
    //
    //       // take the longest all_other_fields - Attempt at fixing missing data
    //       const all = res.fuel_data.map((row: any) => row.all_other_fields)
    //       const longest = all.reduce((acc: any, curr: any) => acc.length > curr.length ? acc : curr)
    //
    //       // Take earliest created
    //       const earliestCreated = all.reduce((acc: any, curr: any) => acc?.date_created > curr?.date_created ? acc : curr)
    //
    //       if (earliestCreated) {
    //         this.fuels = []
    //
    //         this.fuels = JSON.parse(earliestCreated)
    //
    //         this.fuels.map((fuelType: any) => {
    //           fuelType.rows.map((col: any) => {
    //             // Change  DB string to Date for Primeng Calendar
    //             const findStartDate = col.findIndex((col: any) => col.name === 'Start Date')
    //             const findEndDate = col.findIndex((col: any) => col.name === 'End Date')
    //             col[findStartDate].value ? col[findStartDate].value = new Date(col[findStartDate].value) : new Date()
    //             col[findEndDate].value ? col[findEndDate].value = new Date(col[findEndDate].value) : new Date()
    //           })
    //         })
    //       }
    //     }
    //
    //     return this.msg.add({
    //       severity: 'success',
    //       detail: 'Saved Data'
    //     })
    //   },
    //   error: (err: any) => console.log(err),
    // })
  }


  importSpreadsheet = (fuel: any) => {

    const copiedFuel = _.cloneDeep(fuel)

    this.ref = this.dialog.open(DataCaptureImportSpreadsheetComponent, {
      header: 'Spreadsheet Data Import',
      width: '90vw',
      height: '90vh',
      maximizable: true,
      data: {fuel: copiedFuel, company: this.selectedCompany},
    })

    this.ref.onClose.subscribe({
      next: (spreadsheetData: any) => {
        if (spreadsheetData) {

          this.fuels = this.fuels.map((fuelType: any) => {
            if (fuelType.type === spreadsheetData.newFuelData.type) {
              fuelType.rows = spreadsheetData.newFuelData.rows
            }
            return fuelType;
          })

          this.msg.add({
            severity: 'success',
            detail: 'New data added from spreadsheet'
          })
        }
      }
    })
  }
}
