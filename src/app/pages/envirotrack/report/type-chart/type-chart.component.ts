import { Component, Input, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { FilterService } from 'primeng/api';
import * as _ from 'lodash-es';
import {SharedComponents} from "../../shared-components";
import {MultiSelectModule} from "primeng/multiselect";
import {CommonModule} from "@angular/common";
import {SharedModules} from "../../../../shared-module";
import {EnvirotrackService} from "../../envirotrack.service";
import {GlobalService} from "../../../../_services/global.service";
import {SidebarModule} from "primeng/sidebar";

@Component({
  selector: 'app-type-chart',
  templateUrl: './type-chart.component.html',
  standalone: true,
  styleUrls: ['./type-chart.component.scss'],
  imports: [
    SharedComponents,
    SharedModules,
    MultiSelectModule,
    SidebarModule
  ]
})
export class TypeChartComponent implements OnInit {

  @Input() data: any;
  @Input() yearFilter: any;
  @Input() scopes: any;
  @Input() companyList: any;
  @Input() types: any;
  @Input() dash?: boolean;

  selectedYears: any = [{name: 2022, value: 2022}];
  filteredData: any;
  selectedScope:any = [];
  companies: any;
  selectedCompany!: number;
  fuels: any[] = []
  emissionGuide: boolean = false;
  envirotrackData: any = {}

  fltr1: any = [];

  chartOption!: EChartsOption;
  chartData: boolean = false;

  datas: any;
  dataArray: any;
  isConsultant: boolean = false;

  constructor(
    private fltr: FilterService,
    private track: EnvirotrackService,
    private global: GlobalService
  ) { }

  getCompanies = () =>{

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
                this.selectedCompany = this.companies[0].id
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

      }
    })

    // this.track.getCompanies().subscribe({
    //   next: (res: any) => {
    //     this.companies = res.data;
    //     this.selectedCompany = res.data[0].id
    //     this.onSelectCompany()
    //   }
    // })
  }

  onSelectCompany = () => {
    // this.global.updateSelectedMpan(this.selectedMpan)
    this.dataArray = []
    this.envirotrackData = {}
    // this.chartData = false;

    this.track.updateSelectedCompany(this.selectedCompany)
    this.getData(this.selectedCompany)
    this.getFuelData(this.selectedCompany)
  }

  resetDataArray(){
    this.dataArray = []
    this.types = this.types.filter((value:any, index:any, self:any) =>
        index === self.findIndex((t:any) => (
          t.place === value.place && t.name === value.name
        ))
    )
    this.types.forEach((x:any)=> this.dataArray.push({
      name: x.name,
      value: 0
    }));
  }

  initChart(){
    this.dataArray.push(this.envirotrackData)

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
          data: this.dataArray.filter((x:any) => x.value),
          type: 'pie',
          radius: [20,180],
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

  onYearFilter(){
    let filterArr:any = [...this.selectedScope.map((x:any)=>x.value),...this.selectedYears.map((x:any)=>x.value)]
    this.filteredData = this.data.filter((x:any)=> this.fltr.filters['in'](x.year, filterArr));
    this.resetDataArray();
    this.getDataArray(this.filteredData);
    // this.initChart();
  }

  onScopeFilter(){
    let filterArr:any = [...this.selectedScope.map((x:any)=>x.value),...this.selectedYears.map((x:any)=>x.value)]
    this.filteredData = this.data.filter((x:any)=> this.fltr.filters['in'](x.scope, filterArr))
    this.resetDataArray();
    this.getDataArray(this.filteredData);
    // this.initChart();
  }
  getDataArray(data:any[]){
    this.dataArray.forEach((x:any)=> data.filter((y:any) => x.name === `${y.level_1} - ${y.level_2} - ${y.level_3}`).map((y:any)=> y.endDate.year() > 2018 ? x.value += y.kgCO2e/1000 : null))
    this.dataArray.forEach((x:any) => x.value = x.value.toFixed(2))
  }


  getFuelData = (selectedCompanyId: number) => {
    this.fuels = []
    this.dataArray = []

    if (selectedCompanyId) {

      this.track.getFuelData(selectedCompanyId).subscribe({
        next: (res:any) => {
          if (res?.data?.fuel_data) {
            this.fuels = JSON.parse(res.data?.fuel_data)
          }
        },
        error: (err) => console.log(err),
        complete: () => this.formatDataCorrectly()
      })
    }
  }

  formatDataCorrectly = () => {
    if (!this.fuels.length) this.chartData = false
    if (!this.fuels.length) return;
    // loop through fuel types and just get total of all values/units/ total cost/

    let extractedData = this.fuels.map((fuel: any) => {

      let totalValue = 0
      let totalCost = 0
      let unit: string = ''

      fuel.rows.forEach((row: any) => {
        const findValue = row.findIndex((cell: any) => cell.name === 'Value')
        const findUnit = row.findIndex((cell: any) => cell.name === 'Unit')
        const findCost = row.findIndex((cell: any) => cell.name === 'Total')

        // Check if not available
        if (findValue !== -1) totalValue += parseFloat(row[findValue].value)
        if (findCost !== -1) totalCost += parseFloat(row[findCost].value)
        if (findUnit !== -1) unit = row[findUnit].value

      })

      return {
        type: fuel.type,
        totalValue,
        totalCost,
        unit: unit ? unit : 'kWh',

      }
    })

    this.dataArray = extractedData.map((y:any) => {
      return {
        name: y.type,
        value: (y.totalValue / 1000).toFixed(2)
      }
    })



    this.chartData = true;

    this.initChart()

  }


  // Envirotrack data
  getData = (id: number) => {

    this.track.getData(id).subscribe({
        next: (res) => {
          if (res){
            let grandTotal = 0;
            res.forEach((row: any) => {
              row.hhd = JSON.parse(row.hhd.replaceAll('"','').replaceAll("'",'')).map((x:number) => x ? x : 0)
              // Sort the envirotrack data
              grandTotal += row.hhd.reduce((acc: number, curr: number) => acc + curr, 0)
            })
            this.envirotrackData = {
              name: 'Electricity',
              value:( grandTotal/1000).toFixed(2)
            }
          }

        },
        complete: () => this.getFuelData(id)
      }
    )
  }


  ngOnInit(): void {
    this.dataArray = []
    this.getCompanies()
    // this.resetDataArray();
    // this.getDataArray(this.data)
    // this.initChart()
  }

}
