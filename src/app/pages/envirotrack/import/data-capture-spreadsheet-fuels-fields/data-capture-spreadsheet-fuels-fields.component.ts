import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {
    Columns,
    ElectricityRequired,
    GasOptional,
    GasRequired, GenericOptional, GenericRequired,
    OptionalElectric, PropaneOptional, PropaneRequired
} from "../../fuel-data";
import {AutoCompleteCompleteEvent} from "primeng/autocomplete";
import {MessageService} from "primeng/api";
import {SharedModules} from "../../../../shared-module";
import {SharedComponents} from "../../shared-components";



@Component({
    selector: 'app-data-capture-spreadsheet-fuels-fields',
    standalone: true,
    templateUrl: './data-capture-spreadsheet-fuels-fields.component.html',
    styleUrls: ['./data-capture-spreadsheet-fuels-fields.component.scss'],
  imports: [
    SharedModules,
    SharedComponents,
  ]
})


export class DataCaptureSpreadsheetFuelsFieldsComponent implements OnInit {
    draggedCol: Columns | undefined | null;
    mathOptions: string[] = ['plus', 'times']
    requiredCols: any;
    optionalCols: any;
    selectedType = new ElectricityRequired();
    fuelTypes: any[] = ['Electricity', 'Gas', 'Propane', 'Burning oil (Kerosene)', 'Diesel (avg biofuel blend)', 'Petrol (avg biofuel blend)', 'Gas oil (Red diesel)', 'LPG', 'Propane', 'Butane', 'Biogas', 'Biomethane (compressed)', 'Wood Chips']
    selectedFuelType: any = null;
    filteredFuelTypes!: any[];
    editMode: boolean = false;
    newColumn: string = ''
    customConversionFactor: string = ''


    constructor(
        private dialog: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private msg: MessageService
    ) {
        // If editing
        if (this.config.data) {
            this.editMode = true;
            this.selectedType = this.config.data
            this.selectedFuelType = this.config.data.type
            this.requiredCols = this.config.data.cols
            this.customConversionFactor = this.config.data.customConversionFactor


            // Optional Cols
            switch (this.selectedFuelType) {
                case 'Electricity':
                    this.optionalCols = new OptionalElectric().cols
                    break;
                case 'Gas':
                    this.optionalCols = new GasOptional().cols
                    break
                case 'Propane':
                    this.optionalCols = new PropaneOptional().cols
                    break;
                default:
                    this.optionalCols = new OptionalElectric().cols
                    break;
            }
            // remove all optional columns that are already selected
            this.optionalCols = this.optionalCols.filter((col: any) => {
                return !this.requiredCols.find((c: any) => c.name === col.name)
            })
        }
    }

    drop = () => {
        if (this.draggedCol) {
            if (this.requiredCols.filter((x: any) => x.name === this.draggedCol?.name).length < 1) {
                let index: number = this.findIndex(this.draggedCol);
                this.requiredCols = [...(this.requiredCols as Columns[]), this.draggedCol]
                this.optionalCols = this.optionalCols.filter((val: Columns, i: number): boolean => i != index)
                this.draggedCol = null;
            }
        }
    }

    dragStart = (col: Columns) => {
        this.draggedCol = col;
    }
    dragEnd = () => {
        this.draggedCol = null;
    }

    dropB = () => {
        if (this.draggedCol) {
            if (this.optionalCols.filter((x: any) => x.name === this.draggedCol?.name).length < 1) {
                let index: number = this.findIndexB(this.draggedCol);
                this.optionalCols = [...(this.optionalCols as Columns[]), this.draggedCol]
                this.requiredCols = this.requiredCols.filter((val: Columns, i: number): boolean => i != index)
                this.draggedCol = null;
            }
        }
    }

    dragBStart = (col: Columns) => {
        this.draggedCol = col;
    }
    dragBEnd = () => {
        this.draggedCol = null;
    }

    findIndex(col: Columns) {
        let index = -1;
        for (let i = 0; i < (this.optionalCols as Columns[]).length; i++) {
            if (col.name === (this.optionalCols as Columns[])[i].name) {
                index = i;
                break;
            }
        }
        return index;
    }

    findIndexB(col: Columns) {
        let index = -1;
        for (let i = 0; i < (this.requiredCols as Columns[]).length; i++) {
            if (col.name === (this.requiredCols as Columns[])[i].name) {
                index = i;
                break;
            }
        }
        return index;
    }

    close() {
        if (!this.requiredCols) return this.msg.add({
            severity: 'warn',
            detail: 'Please select a fuel type'

        })
        this.selectedType.cols = [...this.requiredCols]
        this.selectedType.customConversionFactor = this.customConversionFactor;
        this.dialog.close(this.selectedType)
    }

    searchFuelTypes = (event: AutoCompleteCompleteEvent) => {
        let filtered: any[] = [];
        let query = event.query;

        for (let i = 0; i < (this.fuelTypes as any[]).length; i++) {
            let fuel = (this.fuelTypes as any[])[i];
            if (fuel.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(fuel);
            }
        }

        this.filteredFuelTypes = filtered;
    }

    changeSelectedFuelType = () => {
        switch (this.selectedFuelType) {
            case 'Electricity':
                this.selectedType = new ElectricityRequired()
                this.requiredCols = new ElectricityRequired().cols
                this.optionalCols = new OptionalElectric().cols
                break;
            case 'Gas':
                this.selectedType = new GasRequired()
                this.requiredCols = new GasRequired().cols
                this.optionalCols = new GasOptional().cols
                break;
            case 'Propane':
              this.selectedType = new PropaneRequired()
                this.requiredCols = new PropaneRequired().cols
                this.optionalCols = new PropaneOptional().cols
                break;
            default:
                this.selectedType = new GenericRequired()
                this.selectedType.type = this.selectedFuelType
                this.requiredCols = new GenericRequired().cols
                this.optionalCols = new GenericOptional().cols
                break;
        }
      this.customConversionFactor = this.selectedType.type

    }

    addToOptionalColumns = () => {
        this.optionalCols.push({
            name: this.newColumn,
            type: 'number',
            draggable: true,
            math: true,
        })
        this.newColumn = ''
    }




    ngOnInit() {
    }
}
