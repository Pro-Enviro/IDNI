import {Component, Input, OnInit} from '@angular/core';
import {EChartsOption} from 'echarts';
import {FilterService, MessageService} from 'primeng/api';
import moment from "moment";
import {SharedComponents} from "../../shared-components";
import {SharedModules} from "../../../../shared-module";
import {MultiSelectModule} from "primeng/multiselect";
import {EnvirotrackService} from "../../envirotrack.service";
import {GlobalService} from "../../../../_services/global.service";
import {SidebarModule} from "primeng/sidebar";
import {DbService} from "../../../../_services/db.service";
import _ from "lodash";
import {FuelDataType, TableTotals} from "../envirotrack-report-fields/envirotrack-report-fields.component";
import {type} from "node:os";


interface ScopeData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-scope-chart',
  templateUrl: './scope-chart.component.html',
  styleUrls: ['./scope-chart.component.scss'],
  standalone: true,
  imports: [
    SharedComponents,
    SharedModules,
    MultiSelectModule,
    SidebarModule
  ]
})



export class ScopeChartComponent implements OnInit {

  @Input() data: any;
  @Input() yearFilter: any;
  @Input() scopes: any;
  @Input() companyList: any;
  @Input() types: any;
  @Input() dash?: boolean;
  @Input('selectedCompany') companySelected: number | undefined;

  filteredData: any;
  companies: any;
  selectedCompany!: number;
  scopeGuide: boolean = false;
  fuels: any[] = []
  envirotrackData: any = {}
  chartOption!: EChartsOption;
  chartData: boolean = false;
  dataArray: any;
  isConsultant: boolean = false;
  fuelData: ScopeData[] | null = null;
  hhData: ScopeData | null = null;

  constructor(
    private db: DbService,
    private global: GlobalService,
    private msg: MessageService,
    private track: EnvirotrackService
  ) {
  }

  getCompanies = () => {

    this.global.getCurrentUser().subscribe({
      next: (res: any) => {
        if (res.role.name === 'user') {
          this.track.getUsersCompany(res.email).subscribe({
            next: (res: any) => {
              if (res.data) {
                this.companies = res.data

                if (this.global.companyAssignedId.value) {
                  this.selectedCompany = this.global.companyAssignedId.value
                } else {
                  this.selectedCompany = res.data[0].id
                }


                this.onSelectCompany()
              }
            }
          })
        } else if (res.role.name === 'consultant') {

          this.track.getUsersCompany(res.email).subscribe({
            next: (res: any) => {
              if (res.data) {
                this.companies = res.data


                if (this.global.companyAssignedId.value) {
                  this.selectedCompany = this.global.companyAssignedId.value
                } else {
                  this.selectedCompany = this.companies[0].id
                }


                this.isConsultant = true
                this.onSelectCompany()
              }
            }
          })
        } else {
          this.track.getCompanies().subscribe({
            next: (res: any) => {
              this.companies = res.data;
              this.isConsultant = true;
            }
          })
        }
      },
      complete: () => {
        if (this.global.companyAssignedId.value) {
          this.selectedCompany = this.global.companyAssignedId.value;
          this.onSelectCompany()
        }
      }
    })

  }

  onSelectCompany = () => {
    this.clear();
    this.dataArray = []
    this.envirotrackData = {}
    this.chartData = false;
    this.track.updateSelectedCompany(this.selectedCompany)
    this.global.updateCompanyId(this.selectedCompany)
    this.getData();

  }

  getData = () => {
    this.db.getPetData(this.selectedCompany).subscribe({
      next: (res: any) => {
        let data = res.data.map(({cost_of_energy}: any) => JSON.parse(cost_of_energy))
        this.dataArray = data.map((data: any) => {
          let values: any[] = [{
            value: (data.filter(({name}: any) => name === 'Electricity')[0].totalUnits * 0.20705 / 1000).toFixed(2),
            name: 'Electricity'
          }, {
            value: (data.filter(({name}: any) => name === 'Natural Gas (Grid)')[0].totalUnits * 0.18290 / 1000).toFixed(2),
            name: 'Natural Gas (Grid)'
          }, {
            value: (data.filter(({name}: any) => name === 'Natural Gas off Grid')[0].totalUnits * 0.18290 / 1000).toFixed(2),
            name: 'Natural Gas off Grid'
          }, {
            value: (data.filter(({name}: any) => name === 'Bio Gas Off Grid')[0].totalUnits * 0.18449 / 1000).toFixed(2),
            name: 'Bio Gas Off Grid'
          }, {
            value: (data.filter(({name}: any) => name === 'LPG')[0].totalUnits * 0.21450 / 1000).toFixed(2),
            name: 'LPG'
          }, {
            value: (data.filter(({name}: any) => name === 'Oil')[0].totalUnits * 0.24677 / 1000).toFixed(2),
            name: 'Oil'
          }, {
            value: (data.filter(({name}: any) => name === 'Kerosene')[0].totalUnits * 0.25 / 1000).toFixed(2),
            name: 'Kerosene'
          }, {
            value: (data.filter(({name}: any) => name === 'Bio Fuels')[0].totalUnits * 0.04562 / 1000).toFixed(2),
            name: 'Bio Fuels'
          }, {
            value: (data.filter(({name}: any) => name === 'Bio Mass')[0].totalUnits * 0.01132 / 1000).toFixed(2),
            name: 'Bio Mass'
          }, {
            value: (data.filter(({name}: any) => name === 'Coal for Industrial use')[0].totalUnits * 0.32302 / 1000).toFixed(2),
            name: 'Coal for Industrial use'
          }]

          let scope2 = values.filter(({name}: any) => name != 'Electricity').map(({value}: any) => value).reduce((x: any, y: any) => parseFloat(x) + parseFloat(y))

          return [{
            name: 'Scope 1',
            value: scope2
          }, {
            name: 'Scope 2',
            value: values.filter(({name}: any) => name === 'Electricity')[0].value
          }]
        })

        // If no data from PET tool then try find in fuel Data
        if (this.dataArray.length) {
          this.initChart()
        } else {
          this.getFuelData(this.selectedCompany);
          this.getHHData(this.selectedCompany);
          console.log(this.dataArray)
          this.initChart();
        }

      },
      error: (err: any) => this.msg.add({
        severity: 'error',
        detail: err.error.errors[0].message
      })
    })
  }

  getFuelData = (selectedCompany: number) => {
    this.fuels = []
    this.dataArray = []


    if (selectedCompany) {
      this.track.getFuelData(selectedCompany).subscribe({
        next: (res: any) => {

          if (res?.data?.fuel_data) {
            this.fuels = JSON.parse(res.data?.fuel_data)

          } else {
            this.fuels = []
            this.dataArray = []

          }

        },
        error: (err) => console.log(err),
        complete: () =>  {
          const scopes = this.transformToScopes(this.calculateTotals(this.fuels.slice(0)));
          this.dataArray = [this.setFuelData(scopes)];
          this.initChart();
        }
      })
    }
  }


  calculateTotals = (data: FuelDataType[], dateFilter?: number) => {

    // Reset totals
    let typeTotals: any[] = []
    let totalConsumption = 0;


    let reducedData: any[] = []

    data.forEach((fuelType: FuelDataType) => {

      fuelType.rows.forEach((row: any) => {
        const endDateRaw = row.findIndex((c: any) => c.name.toLowerCase() === 'start date')
        const findTotal = row.findIndex((c: any) => c.name.toLowerCase() === 'total')
        const findUOM = row.findIndex((c: any) => c.name.toLowerCase() === 'unit')
        let findValue = row.findIndex((c: any) => c.name.toLowerCase() === 'value')

        if (findValue === -1) {
          findValue = row.findIndex((c: any) => c.name.toLowerCase() === 'kwh')
        }

        const endDateValue = row[endDateRaw].value ? row[endDateRaw].value : 0;

        const endDate = moment(endDateValue).startOf('month');

        if (dateFilter && !isNaN(dateFilter)) {
          const monthsAgo = moment(new Date()).subtract(dateFilter, 'months')
          if (endDate.isBefore(monthsAgo)) return;
        }


        // If no value found, use anything that includes name value
        if (findValue === -1) {
          findValue = row.findIndex((c: any) => c.name.toLowerCase().includes('total value'))
        }


        const total = row[findTotal]?.value ? row[findTotal].value : 0
        // const cost = row[findCost].value ? row[findCost].value : 0
        let consumption = row[findValue]?.value ? row[findValue].value : 0


        let uom = row[findUOM]?.value ? row[findUOM].value : 'kWh'

        if (typeof uom !== 'string') uom = 'kWh'

        // If not in kWh - convert (Numbers above taken from Bill data Template - Bianca)
        if (uom !== 'kWh') {
          // const newValue = this.convertToKwh(fuelType, uom, consumption)
          row.converted = true;
          // consumption = newValue;
        }

        totalConsumption += parseFloat(consumption);

        reducedData.push({
          type: fuelType.type,
          cost: total,
          converted: row.converted,
          consumption,
        })
      })
    })


    const grouped = _.groupBy(reducedData, 'type')
    const groupedKeys = Object.keys(grouped);

    groupedKeys.map((fuelType: any) => {

      const reduced = _.reduce(grouped[fuelType], (result, value, key) => {
        return {
          type: result.type,
          converted: result.converted,
          consumption: Number(result.consumption) + Number(value.consumption),
          cost: Number(result.cost) + Number(value.cost),
          conversionFactor: result.conversionFactor
        }
      })

      typeTotals.push(reduced)
    })

    return typeTotals


  }

   transformToScopes = (energyData:any[]) => {
    const electricityValue = energyData
      .filter(data => data.type === 'Electricity')
      .reduce((sum, data) => sum + data.consumption, 0);

    const nonElectricityValue = energyData
      .filter(data => data.type !== 'Electricity')
      .reduce((sum, data) => sum + data.consumption, 0);

    return [
      {
        name: 'Scope 1',
        value: electricityValue
      },
      {
        name: 'Scope 2',
        value: nonElectricityValue
      }
    ];
  };

  // Get HH data
  getHHData = (id: number) => {
    this.track.getData(id).subscribe({
        next: (res) => {
          res.forEach((row: any) => {
            row.hhd = JSON.parse(row.hhd.replaceAll('"','').replaceAll("'",'')).map((x:number) => x ? x : 0)
          })
          const hhData = this.filterData(res);
          this.dataArray = [this.setHHData(hhData)]
          this.initChart();
        }
      }
    )
  }

  filterData = (res:any) =>{
    let chartData: any[] = [];

    res.forEach((row: any) => {
      row.hhd.forEach((hh: any, i:number) => {
        hh = hh ? hh : 0;
        row.hhd[i] = !isNaN(parseInt(hh.toString())) ? hh : 0
      })
      if(row.hhd.length){
        chartData.push([row.date, row.hhd.reduce((x:number, y:number) => (x ? x : 0) + (y ? y : 0) )])
      }

    })
    const totalValue = chartData.reduce((sum, [_, value]) => sum + Number(value), 0);

    return {
      name: 'Scope 1',
      value: Number(totalValue)
    };

  }

  initChart() {
    this.chartOption = {
      title: {
        text: 'Breakdown of CO2e (tonnes) by emissions source',
        left: 'center',
        top: 30,

      },
      legend: {
        height: 120,
        bottom: '5',
        orient: 'vertical',
        show: false
      },
      tooltip: {
        extraCssText: 'text-transform: capitalize',
        trigger: 'item',
        formatter: '{a} <br />{b}: {c} ({d}%)'
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true
          }
        }
      },
      series: [
        {
          name: 'tCO2e By emissions source',
          data: this.dataArray[0],
          type: 'pie',
          radius: [20, 180],
          itemStyle: {
            borderRadius: 5
          },
          emphasis: {
            label: {
              show: true,

            }
          }
        },
      ],
      color: [
        '#006633',
        '#72ac3f',
        '#bed8a5',
        '#3fa8ac',
        '#5470c6',
        '#91cc75',
        '#fac858',
        '#ee6666',
        '#73c0de',
        '#3ba272',
        '#fc8452',
        '#9a60b4',
        '#ea7ccc',
        '#753d3d',
        '#922e9b',
        '#9f7c3b',
        '#29724d',
        '#68e5d3',
        '#ff6c00',
        '#00f196',
        '#3627fa',
        '#d8ff33',
        '#ffb683',
        '#9a017d',
        '#3592c5',
        '#c45a5a',
        '#8aa1e8',
        '#accc9d',
        '#efd59e',
        '#fdbaba',
        '#b5e4fa',
        '#a6f6d0',
        '#faba9f',
        '#e6bafc',
      ]
    };
  }

  mergeScopeData(): ScopeData[] {
    if (!this.fuelData && !this.hhData) {
      return [];
    }

    const scope1Value = (this.fuelData?.[0]?.value || 0) + (this.hhData?.value || 0);
    const scope2Value = this.fuelData?.[1]?.value || 0;

    return [
      { name: 'Scope 1', value: scope1Value },
      { name: 'Scope 2', value: scope2Value }
    ];
  }

  setFuelData(data: ScopeData[]) {
    this.fuelData = data;
    return this.mergeScopeData();
  }

  setHHData(data: ScopeData) {
    this.hhData = data;
    return this.mergeScopeData();
  }

  clear() {
    this.fuelData = null;
    this.hhData = null;
  }


  ngOnInit(): void {
    this.companySelected ? this.selectedCompany = this.companySelected : null;
    this.getCompanies()
    this.selectedCompany ? this.getData() : null;
  }

}
