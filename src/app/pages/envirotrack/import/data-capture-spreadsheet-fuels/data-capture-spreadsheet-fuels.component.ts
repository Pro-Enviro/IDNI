import {Component, OnInit} from '@angular/core';
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
import {EnvirotrackService} from "../../envirotrack.service";
import {GlobalService} from "../../../../_services/global.service";
import {SidebarModule} from "primeng/sidebar";
import {DividerModule} from "primeng/divider";
import {DropdownChangeEvent} from "primeng/dropdown";
import {MessagesModule} from "primeng/messages";
import {Message} from "primeng/api";

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
    SidebarModule,
    DividerModule,
    MessagesModule
  ]
})
export class DataCaptureSpreadsheetFuelsComponent implements OnInit {
  selectedCompany: any;
  companies: any[] = []
  ref: DynamicDialogRef | undefined;
  fuels: Fields[] = [];
  activeTab: number = 0;
  uomOptions: string[] = []
  fetchedFuelData: any[] = []
  display: boolean = false;
  selectedItem: any = {}
  nameChange: string = ''
  fuelGuide:boolean = false;
  isConsultantLevel = false
  displayFuelMsg: Message[] = []

  showMessage:boolean = false
  constructor(
    private dialog: DialogService,
    private msg: MessageService,
    private track: EnvirotrackService,
    private confirmationService: ConfirmationService,
    private global: GlobalService

  ) {
    this.uomOptions = this.track.supplyUnit
    if (this.track.selectedCompany.value) {
      this.selectedCompany = this.global.companyAssignedId.value
      this.getFuelData()
    }
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

  onInputMessageShow() {
    this.showMessage = true
    this.displayFuelMsg = [
      { severity: 'info',
        detail: 'To change the fuel type name, please include the fuel type, followed by a dash, and then the new name that you\'d like to use.'
      }
    ]
  }

  getCompanies = () => {

    // if (!this.isConsultantLevel) {
    //   return this.onSelectCompany()
    // }

    this.global.getCurrentUser().subscribe({
      next: (res: any) => {
        if (res.role.name === 'user'){
          this.track.getUsersCompany(res.email).subscribe({
            next: (res: any) => {
              if (res.data){
                this.companies = res.data
                this.selectedCompany = res.data[0].id
              }
            }
          }) }
        else if (res.role.name === 'consultant'){

          this.track.getUsersCompany(res.email).subscribe({
            next: (res: any) => {
              if (res.data) {
                this.companies = res.data
                this.selectedCompany = this.companies[0].id
                this.isConsultantLevel = true
                this.onSelectCompany()
              }
            }
          })

        } else {
          this.track.getCompanies().subscribe({
            next:(res: any) => {
              this.companies = res.data;
            }
          })
        }

      }
    })

    // this.track.getCompanies().subscribe({
    //   next: (res: any) => {
    //     this.companies = res.data;
    //   }
    // })
  }

  onSelectCompany = () => {
    this.fetchedFuelData = []
    this.track.updateSelectedCompany(this.selectedCompany)
    this.getFuelData()
  }

  changeAllUom = (event: DropdownChangeEvent, fuel: any) => {
    this.confirmationService.confirm({
      target: event.originalEvent.target as EventTarget,
      message: `Do you want to change all units to ${event.value}?`,
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {

        fuel.rows = fuel.rows.map((row: any, index: number) => {
          const findUom = row.findIndex((r: any) => r.name === 'Unit')

          setTimeout(() => {
            row[findUom].value = event.value;
          }, 100 * index)

          return row;
        })
        this.confirmationService.close()
      },
      reject: () => {
        this.confirmationService.close()
      }
    });
  }

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
    }, {}))

    // Remove unnecessary columns
    fuelRows = fuelRows.map(({name, math, type, draggedCell, ...row}: any) => row)


    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(fuelRows);
      const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
      const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
      this.saveAsExcelFile(excelBuffer, `Fuel Data - ${fuel.type} - ${moment(new Date()).format('DD-MM-YYYY')}`);
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
      this.track.getFuelData(this.selectedCompany).subscribe({
        next: (res:any) => {
          if (res?.data?.fuel_data) {

            this.fuels = JSON.parse(res.data?.fuel_data)


              // Change DB string for primeng calendar
              this.fuels.map((fuelType: any) => {
                fuelType.rows.map((col: any) => {
                  const findStartDate = col.findIndex((col: any) => col.name === 'Start Date')
                  const findEndDate = col.findIndex((col: any) => col.name === 'End Date')
                  const units = col.findIndex((col: any) => col.name === 'Unit')
                  col[findStartDate].value ? col[findStartDate].value = new Date(col[findStartDate].value) : new Date()
                  col[findEndDate].value ? col[findEndDate].value = new Date(col[findEndDate].value) : new Date()
                  col[units].value === '' ? col[units].value = 'kWh' : col[units].value
                })
              })

          }
        },
        error: (err) => console.log(err),

      })

    }
  }

  saveFuel = () => {
    const stringifyFuels = JSON.stringify(this.fuels)
    const dataObject = {fuel_data: stringifyFuels}


    this.track.saveFuelData(this.selectedCompany, dataObject).subscribe({
      next: (res: any) => {
        if (res?.data?.fuel_data) {
          this.fuels = JSON.parse(res.data?.fuel_data)
          // Change DB string for primeng calendar
          this.fuels.map((fuelType: any) => {
            fuelType.rows.map((col: any) => {
              const findStartDate = col.findIndex((col: any) => col.name === 'Start Date')
              const findEndDate = col.findIndex((col: any) => col.name === 'End Date')
              col[findStartDate].value ? col[findStartDate].value = new Date(col[findStartDate].value) : new Date()
              col[findEndDate].value ? col[findEndDate].value = new Date(col[findEndDate].value) : new Date()
            })
          })
        }
      },
      error: (err) => console.log(err),
      complete: () => {
        this.msg.add({
          severity: 'success',
          detail: 'Saved'
        })
      }
    })
  }


  importSpreadsheet = (fuel: any) => {

    const copiedFuel = _.cloneDeep(fuel)

    this.ref = this.dialog.open(DataCaptureImportSpreadsheetComponent, {
      header: '',
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
              fuelType.rows = fuelType.rows.map((row:any) => {
              const unitRow = row.find((col:any)=> col.name === 'Unit')
                unitRow.value = 'kWh'

                return row
              })
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

  ngOnInit() {
    this.getCompanies()
    if (this.global.companyAssignedId.value) {
      this.selectedCompany = this.global.companyAssignedId.value
      this.onSelectCompany()
    }
  }
}
