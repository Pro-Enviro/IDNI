import { Component, Input, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import {FilterService, MessageService} from 'primeng/api';
import {SharedComponents} from "../../shared-components";
import {MultiSelectModule} from "primeng/multiselect";
import {SharedModules} from "../../../../shared-module";
import {EnvirotrackService} from "../../envirotrack.service";
import {GlobalService} from "../../../../_services/global.service";
import {SidebarModule} from "primeng/sidebar";
import {DbService} from "../../../../_services/db.service";

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
  @Input('selectedCompany') companySelected: number | undefined;

  filteredData: any;
  companies: any;
  selectedCompany!: number;
  fuels: any[] = []
  emissionGuide: boolean = false;
  envirotrackData: any = {}
  chartOption!: EChartsOption;
  chartData: boolean = false;
  dataArray: any;
  isConsultant: boolean = false;

  constructor(
    private db: DbService,
    private global: GlobalService,
    private msg: MessageService,
    private track: EnvirotrackService
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
    this.dataArray = []
    this.envirotrackData = {}
    this.chartData = false;
    this.global.updateCompanyId(this.selectedCompany)
    this.track.updateSelectedCompany(this.selectedCompany)
    this.getData();
  }

  getData = () => {
    this.db.getPetData(this.selectedCompany).subscribe({
      next: (res:any) => {
        let data = res.data.map(({cost_of_energy}:any) => JSON.parse(cost_of_energy))
        this.dataArray = data.map((data:any) => {
          return  [{
            value:  (data.filter(({name}:any) => name === 'Electricity')[0].totalUnits * 0.20705 / 1000).toFixed(2),
            name: 'Electricity'
          },{
            value:  (data.filter(({name}:any) => name === 'Natural Gas (Grid)')[0].totalUnits * 0.18290 / 1000).toFixed(2),
            name: 'Natural Gas (Grid)'
          },{
            value:  (data.filter(({name}:any) => name === 'Natural Gas off Grid')[0].totalUnits * 0.18290 / 1000).toFixed(2),
            name: 'Natural Gas off Grid'
          },{
            value:  (data.filter(({name}:any) => name === 'Bio Gas Off Grid')[0].totalUnits * 0.18449 / 1000).toFixed(2),
            name: 'Bio Gas Off Grid'
          },{
            value:  (data.filter(({name}:any) => name === 'LPG')[0].totalUnits * 0.21450 / 1000).toFixed(2),
            name: 'LPG'
          },{
            value:  (data.filter(({name}:any) => name === 'Oil')[0].totalUnits * 0.24677 / 1000).toFixed(2),
            name: 'Oil'
          },{
            value:  (data.filter(({name}:any) => name === 'Kerosene')[0].totalUnits * 0.25 / 1000).toFixed(2),
            name: 'Kerosene'
          },{
            value:  (data.filter(({name}:any) => name === 'Bio Fuels')[0].totalUnits * 0.04562 / 1000).toFixed(2),
            name: 'Bio Fuels'
          },{
            value:  (data.filter(({name}:any) => name === 'Bio Mass')[0].totalUnits * 0.01132 / 1000).toFixed(2),
            name: 'Bio Mass'
          },{
            value:  (data.filter(({name}:any) => name === 'Coal for Industrial use')[0].totalUnits * 0.32302 / 1000).toFixed(2),
            name: 'Coal for Industrial use'
          }]
        })
        this.initChart()
      },
      error: (err: any)=> this.msg.add({
        severity: 'error',
        detail: err.error.errors[0].message
      })
    })
  }


  initChart(){
    // console.log(this.dataArray[0])
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

  ngOnInit(): void {
    this.companySelected ? this.selectedCompany = this.companySelected: null;
    this.getCompanies()
    this.selectedCompany ? this.getData() : null;
  }

}
