import { Component, Input, OnInit} from '@angular/core';
import { EChartsOption } from 'echarts';
import { FilterService } from 'primeng/api';
import moment from "moment";
import {SharedComponents} from "../../shared-components";
import {SharedModules} from "../../../../shared-module";
import {MultiSelectModule} from "primeng/multiselect";
import {EnvirotrackService} from "../../envirotrack.service";
import {GlobalService} from "../../../../_services/global.service";

@Component({
  selector: 'app-scope-chart',
  templateUrl: './scope-chart.component.html',
  styleUrls: ['./scope-chart.component.scss'],
  standalone: true,
  imports: [
    SharedComponents,
    SharedModules,
    MultiSelectModule
  ]
})
export class ScopeChartComponent implements OnInit {

  @Input() data: any;
  @Input() yearFilter: any;
  @Input() scopes: any;
  @Input() companyList: any;
  @Input() dash?: boolean;
  companies: any;
  selectedCompany!: number;
  selectedYears: any;
  filteredData: any;
  selectedTypes:any;
  envirotrackData: any = {}
  chartOption!: EChartsOption;
  fuels: any[] = []
  datas: any;
  dataArray: any;
  isConsultant: boolean = false;


  constructor(
    private fltr: FilterService,
    private track: EnvirotrackService,
    private global: GlobalService
  ) { }

  resetDataArray(){
    this.dataArray = [{
      name: 'Scope 1',
      value: 0
    },{
      name: 'Scope 2',
      value: 0
    },{
      name: 'Scope 3',
      value: 0
    },{
      name: 'Outside of Scopes',
      value: 0
    }];
  }

  initChart(){

    this.dataArray.push(this.envirotrackData)

    this.chartOption = {
      legend: {
        left: 'left',
        orient: 'horizontal',
        show: this.dash
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
          name: 'Scope Data',
          data: this.dataArray.filter((x:any) => x.value),
          type: 'pie',
          radius: [20,150],
          itemStyle: {
            borderRadius: 5
          },
          emphasis: {
            label: {
              show: true
            }
          }
        },
      ],
      color: ['#006633',
        '#72ac3f',
        '#bed8a5',
        '#3fa8ac',]
    };
  }

  onYearFilter(event:any){
    let filterArr: any[] = [];
    // event.map((x:any)=> filterArr.push(x.value))
    // this.filteredData = this.data.filter((x:any)=> this.fltr.filters['in'](x.year, filterArr));
    // this.resetDataArray();
    // this.getDataArray(this.filteredData);
    // this.initChart();
  }

  getDataArray(data:any){
    data.filter((x:any) => x.scope === 'Scope 1').map((x:any) => moment(x.endDate).year() > 2018 ? this.dataArray[0].value += x.kgCO2e : null);
    data.filter((x:any) => x.scope === 'Scope 2').map((x:any) => moment(x.endDate).year() > 2018 ? this.dataArray[1].value += x.kgCO2e: null);
    data.filter((x:any) => x.scope === 'Scope 3').map((x:any) => moment(x.endDate).year() > 2018 ? this.dataArray[2].value += x.kgCO2e: null);
    data.filter((x:any) => x.scope === 'Outside of Scopes').map((x:any) => moment(x.endDate).year() > 2018 ? this.dataArray[3].value += x.kgCO2e: null);
    this.dataArray.forEach((x:any)=>x.value = (x.value/1000).toFixed(2))
  }

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
    this.track.updateSelectedCompany(this.selectedCompany)
    this.getFuelData(this.selectedCompany)
    this.getData(this.selectedCompany)
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
    this.dataArray = []
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
        if (findCost !== -1 ) totalCost += parseFloat(row[findCost].value)
        if (findUnit !== -1) unit = row[findUnit].value

      })

      return {
        type: fuel.type,
        totalValue,
        totalCost,
        unit: unit ? unit : 'kWh',
        scope: 'Scope 1'
      }
    })

    this.dataArray = extractedData.map((y:any) => {
      return {
        name: y.scope,
        value: (y.totalValue / 1000).toFixed(2)
      }
    })

    const total = this.dataArray.reduce((acc: any, curr: any) => {
      return acc + parseFloat(curr.value)
    }, 0)

    this.dataArray = [{
      name: 'Scope 1',
      value: total.toFixed(2)
    }]

    this.initChart()
  }

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
              name: 'Scope 2',
              value:( grandTotal/1000).toFixed(2)
            }
          }
        },
      }
    )
  }

  ngOnInit(): void {
    this.getCompanies()
    this.resetDataArray();
    this.getDataArray(this.data);
    // this.initChart();
  }
}
