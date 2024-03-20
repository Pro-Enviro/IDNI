import {Component} from '@angular/core';
import moment from "moment";
import * as echarts from "echarts";
import _ from 'lodash';
import FileSaver from "file-saver";
import {GlobalService} from "../../../../_services/global.service";
import {SharedComponents} from "../../shared-components";
import {SharedModules} from "../../../../shared-module";
import {EnvirotrackService} from "../../envirotrack.service";


export class TableTotals {
  consumption: number = 0
  cost: number = 0
  type!: string
  conversionFactor: number = 0;
}


@Component({
  selector: 'app-envirotrack-report-fields',
  templateUrl: './envirotrack-report-fields.component.html',
  styleUrls: ['./envirotrack-report-fields.component.scss'],
  standalone: true,
  imports: [
    SharedComponents,
    SharedModules
  ]
})
export class EnvirotrackReportFieldsComponent {
  data: any;
  months: string[] = [];
  filteredData: any = [];
  companies: any;
  selectedCompany!: number;
  selectedCompanyName?: string = ''
  chartData: any = [];
  chartX: string[] = [];
  chartY: string[] = [];
  chartOptions!: echarts.EChartsOption;
  max: number = 0;
  dateFilter: number = 0;
  defaultFilters: object[] = [{
    name: 'All Data',
    value: 0
  }, {
    name: 'Past 12 months',
    value: 12
  }, {
    name: 'Past 6 months',
    value: 6
  }, {
    name: 'Past 3 months',
    value: 3
  },
  ];
  filteredField: string = ''
  fieldFilters!: any
  dateRange: any;
  minDate!: Date;
  maxDate!: Date;
  mpan: string[] = [];
  selectedMpan!: string;
  typeTotals: TableTotals[] = []
  mappedTotals: any[] = []
  totalConsumption: number = 0;
  totalCost: number = 0;
  totalEmissions: number = 0;
  series: any[] = []
  screenWidth: any;
  strOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }
  fuels: any[] = []
  dataArray: any[] = []

  conversionFactors: any = {
    'Electricity': 0.22499,
    'Gas': 0.18293,
    'Burning oil (Kerosene)': 0.24677,
    'Diesel (avg biofuel blend)': 0.23908,
    'Petrol (avg biofuel blend)': 0.22166,
    "Gas oil (Red diesel)": 0.25650,
    'LPG': 0.21449,
    'Propane': 0.21410,
    'Butane': 0.22241,
    'Biogas': 0.00022,
    'Biomethane (compressed)': 0.00038,
    'Wood Chips': 0.01074
  }


  constructor(
    private global: GlobalService,
    private track: EnvirotrackService
  ) {
    this.getCompanies()
  }



  initChart = () => {

    this.chartData.sort((a: any, b: any) => moment(a[0], 'YYYY-MM-DD') > moment(b[0], 'YYYY-MM-DD'));

    this.chartOptions = {
      legend: {
        show: true,
        top: 40
      },
      grid: {
        top: '100',
        right: '70',
        bottom: '40',
        left: '140'
      },
      title: {
        text: 'Fuel Usage',
        left: 'center',
        textStyle:{
          fontSize: this.screenWidth >= 1441 ? 16: 12
        }
      },
      graphic: {
        type: 'image',
        left: 10,
        top: 0,
        z: 100,
        style: {
          image: '/assets/img/pro-enviro-logo-email.png',
          x: 0,
          y: 0,
          width: this.screenWidth >= 1441 ? 200 : 120,
          height: this.screenWidth >= 1441 ? 50: 30
        }
      },
      xAxis: {
        type: 'category',
        data: this.chartX,
        name: 'Date',
        nameLocation: "middle",
        nameTextStyle: {
          fontSize: 16,
          fontWeight: "bold"
        },
        nameGap: 40
      },
      tooltip: {
        extraCssText: 'text-transform: capitalize',
        trigger: 'item',
        formatter: function (params: any) {
          return `${params.seriesName}: ${params.data[1].toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`
        },
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true
          }
        }
      },
      yAxis: {
        type: 'value',
        name: 'Usage (kWh)',
        nameLocation: "middle",
        nameTextStyle: {
          fontSize: 16,
          fontWeight: "bold"
        },
        nameGap: 70
      },
      series: this.series
    }
  }

  getCompanies = () =>{
    this.track.getCompanies().subscribe({
      next: (res: any) => {
        this.companies = res.data;
        this.selectedCompany = res.data[0].id
        this.onSelectCompany()
      }
    })
  }

  onSelectCompany = () => {
    this.chartOptions = {}
    this.series = []
    this.chartData = [];
    this.data = []
    this.chartY = []
    this.filteredData = [];
    this.fieldFilters = []
    this.filteredField = ''
    // this.global.updateSelectedMpan(this.selectedMpan)
    this.track.updateSelectedCompany(this.selectedCompany)
    this.getData(this.selectedCompany)
  }


  filterData = () => {
    this.splitByMonth(this.data, this.dateFilter)
    this.calculateTotals(this.data.slice(0), this.dateFilter)
  }

  getTimes = () => {
    for (let i = 0; i < 48; i++) {
      this.chartY.push(moment('00:00', 'HH:mm').add(i * 30, 'minutes').format('HH:mm'))
    }
  }

  getData = (id: number) => {
    this.months = [];
    this.chartData = [];
    this.chartX = [];
    this.chartY = [];

    this.fuels = []
    this.dataArray = []

    if (this.selectedCompany) {
      this.track.getFuelData(this.selectedCompany).subscribe({
        next: (res:any) => {
          if (res?.data?.fuel_data) {
            this.fuels = JSON.parse(res.data?.fuel_data)
            this.organiseData(this.fuels)
          }
        },
        error: (err) => console.log(err),
      })
    }
  }




  exportExcel(){
    interface TypeTotalsProps {
      type: string,
      consumption: number,
      cost: number,
      conversionFactor: number,
      converted?: boolean
    }

    let exportObject = this.typeTotals.map((fuelType: TypeTotalsProps) => {
      return {
        utility: fuelType.type,
        consumption: fuelType.consumption,
        convertedToKwh: fuelType.converted ? 'Yes' : 'No',
        consumption_percent: (fuelType.consumption / this.totalConsumption) * 100,
        cost: fuelType.cost,
        cost_percent: (fuelType.cost / this.totalCost) * 100,
        carbon_emissions: fuelType.consumption * fuelType.conversionFactor,
        carbon_emissions_percent: ((fuelType.consumption * fuelType.conversionFactor) / this.totalEmissions) * 100
      }
    })

    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(exportObject);
      const workbook = { Sheets: {data:worksheet}, SheetNames:['data']};
      const excelBuffer : any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
      this.saveAsExcelFile(excelBuffer, `${this.selectedCompanyName}_fuel_breakdown`);

    })
  }

  saveAsExcelFile (buffer:any, fileName:string){
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer],{
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION)
  }

  organiseData = (data: any) => {
    this.fieldFilters = data.map(({type}: any) => {
      return type
    });
    // Remove null / undefined entries
    this.fieldFilters = this.fieldFilters.filter((i: any) => i !== null && typeof i !== 'undefined');
    // Remove Duplicates
    this.fieldFilters = new Set<string>(this.fieldFilters)

    this.splitByMonth(data)
    this.calculateTotals(data.slice(0));
  }

  splitByMonth = (data: any, dateFilter?:number) => {
    let months = new Set()
    let allocations: any[] = []
    let dataToMap: any[] = []

    if (!this.filteredField) {
      dataToMap = data;
    } else {
      dataToMap = data.filter((fuelType: any) => fuelType.type === this.filteredField)
    }

    const seriesPerType: any[] = []

    dataToMap.map((fuelType: any) => {
      const rows = fuelType.rows;

      rows.map((row: any) => {
        const rawStartDate = row.filter((col: any) => col.name === 'Start Date')[0].value;
        const rawEndDate = row.filter((col: any) => col.name === 'End Date')[0].value
        const rawUOM = row.findIndex((col: any) => col.name === 'Unit');

        if (!rawStartDate && !rawEndDate) return;

        const startDate: moment.Moment = moment(rawStartDate, ['YYYY-MM-DD']);
        const endDate: moment.Moment = moment(rawEndDate, ['YYYY-MM-DD'])


        let value = row.filter((col: any) => col.name === 'Value')[0]?.value;


        const totalDays= endDate.diff(startDate, 'days')

        let uom = row[rawUOM].value ? row[rawUOM].value : 'kWh'
        if (typeof uom !== 'string') uom = 'kWh'


        if (uom !== 'kWh') {
          value = this.convertToKwh(fuelType, uom, value)
        }



        let currentMonth: moment.Moment = startDate.clone().startOf('month')

        while (currentMonth.isBefore(endDate) || currentMonth.isSame(endDate, 'month')) {
          let monthDays = currentMonth.daysInMonth()
          let valuePerDay = value / totalDays
          let daysAllocated = 0;

          if (currentMonth.isSame(startDate, 'month')) {
            // Partial start month
            daysAllocated = currentMonth.isSame(endDate, 'month') ? totalDays : monthDays - startDate.date() + 1
          } else if (currentMonth.isSame(endDate, 'month')) {
            // Partial end month
            daysAllocated = endDate.date();
          } else {
            // Full month
            daysAllocated = monthDays;
          }

          if (this.dateFilter && !isNaN(this.dateFilter)) {
            const monthsAgo = moment(new Date()).subtract(this.dateFilter, 'months')
            if (currentMonth.isBefore(monthsAgo)) return;
          }

          let allocationValue = daysAllocated * valuePerDay;
          months.add(currentMonth.format('MMMM-YYYY'));
          const monthlyTotal = [currentMonth.format('MMMM-YYYY'), allocationValue];
          allocations.push(monthlyTotal);
          currentMonth.add(1, 'month').startOf('month');
        }
      })

      allocations.sort((a: any, b: any) => moment(a[0], ['MMMM-YYYY']).diff(moment(b[0], ['MMMM-YYYY'])));

      const colours = ['#c2dea3', "#84a649", '#6a7c58', '#aec98f', '#465933', "#4c6b22"]

      seriesPerType.push({
        type: 'bar',
        name: fuelType.type,
        data: allocations,
        stack: 'x',
        itemStyle: {
          color: colours[seriesPerType?.length] || '#c2dea3'
        },
        emphasis: {
          focus: 'series'
        }
      });

      allocations = [];

    })

    this.series = seriesPerType



    const monthArr: any[] = Array.from(months);
    monthArr.sort((a: any, b: any) => moment(a, ['MMMM-YYYY']).diff(moment(b, ['MMMM-YYYY'])))
    this.chartX = monthArr

    this.initChart()
  }




  filterField = (data: any) => {
    this.chartData = [];


    if (!this.filteredField) {
      // Show all types
      this.filteredData = data;
      // Sort data in order of date

      const allRows = this.filteredData.map((fuelType: any) => fuelType.rows)
      const finalData: any[] = []

      allRows.map((row: any) => {

        row.map((col: any) => {
          const findEndDate = col.findIndex((c: any) => c.name === 'graphDate')
          let findConsumption = col.findIndex((c: any) => c.name === 'Value')


          if (findConsumption === -1) {
            findConsumption = col.findIndex((c: any) => c.name.toLowerCase().includes('total value'))
          }


          if (!findConsumption) return;
          if (!col[findEndDate]) return;


          finalData.push([
            moment(col[findEndDate].value).format('YYYY-MM-DD'),
            col[findConsumption]?.value ? col[findConsumption].value : 0
          ])
        })
      })

      this.filteredData = finalData;
      this.filteredData = this.filteredData.sort((a: any, b: any) => new Date(a[0]).getTime() - new Date(b[0]).getTime())

      // Reduce the months for X axis
      this.months = finalData.reduce((acc: any, curr: any) => [...acc, moment(curr[0]).format('YYYY-MM-DD')], [])
      this.chartX = this.months



    } else {
      // Show only 1 type
      this.filteredData = data;
      const filtered = this.filteredData.filter((fuel: any) => fuel.type === this.filteredField)
      const rowsTogether = filtered[0].rows

      const finalData: any[] = []

      rowsTogether.map((col: any) => {
        const findEndDate = col.findIndex((c: any) => c.name === 'graphDate')
        let findConsumption = col.findIndex((c: any) => c.name === 'Value')

        if (findConsumption === -1) {
          findConsumption = col.findIndex((c: any) => c.name.toLowerCase().includes('total value'))
        }

        if (!col[findEndDate]) return;

        finalData.push([
          moment(col[findEndDate].value).format('YYYY-MM-DD'),
          col[findConsumption]?.value ? col[findConsumption].value : 0
        ])
      })


      finalData.sort((a: any, b: any) => a.graphDate - b.graphDate)

      this.filteredData = finalData;
      this.filteredData = this.filteredData.sort((a: any, b: any) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      this.chartX = this.filteredData.map((data: any) => moment(data[0]).format('YYYY-MM-DD'))

    }


    this.chartData.push(...this.filteredData)


    this.initChart()
  }

  convertToKwh = (fuelType: any, unitFrom: string, consumption: number) => {
    const convertLitresTokWh: any = {
      'LPG litres': 1.5571,
      'LPG kWh': 0.2145,
      'Gas Oil (Red diesel) litres': 2.7554,
      'Gas Oil (Red diesel) kWh': 0.2565,
      'Diesel (avg biofuel blend) litres': 2.5121,
      'Diesel (avg biofuel blend) kWh': 0.2391,
      'Burning oil (Kerosene) litres': 2.5402,
      'Burning oil (Kerosene) kWh': 0.2468,
      'Propane litres': 1.5436,
      'Propane kWh': 0.2326,
      'Petrol (avg biofuel blend) litres': 2.0975,
      'Petrol (avg biofuel blend) kWh': 0.2217
    }

    const litres = `${fuelType.type} ${unitFrom}`
    const kwh = `${fuelType.type} kWh`
    const convertNumber = consumption * convertLitresTokWh[litres]/convertLitresTokWh[kwh]
    // console.log('Converting: ', consumption, ' to - ', convertNumber)
    return convertNumber
  }

  calculateTotals = (data: any, dateFilter?: number) => {

    // Reset totals
    this.typeTotals = []
    this.totalConsumption = 0;
    this.totalCost = 0
    this.totalEmissions = 0


    let reducedData: any[] = []

    data.forEach((fuelType: any) => {

      fuelType.rows.forEach((row: any) => {
        const endDateRaw = row.findIndex((c: any) => c.name === 'Start Date')
        const findTotal = row.findIndex((c: any) => c.name === 'Total')
        const findCost = row.findIndex((c: any) => c.name === 'Cost')
        const findUOM = row.findIndex((c: any) => c.name === 'Unit')
        let findValue = row.findIndex((c: any) => c.name === 'Value')


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



        const total = row[findTotal].value ? row[findTotal].value : 0
        const cost = row[findCost].value ? row[findCost].value : 0
        let consumption = row[findValue]?.value ? row[findValue].value : 0

        let uom = row[findUOM].value ? row[findUOM].value : 'kWh'

        if (typeof uom !== 'string') uom = 'kWh'

        // If not in kWh - convert (Numbers above taken from Bill data Template - Bianca)
        if (uom !== 'kWh'){
          const newValue = this.convertToKwh(fuelType, uom, consumption)
          row.converted = true;
          consumption = newValue;
        }


        this.totalConsumption += parseFloat(consumption);
        this.totalCost += parseFloat(total);
        this.conversionFactors[fuelType.type] ? this.totalEmissions += parseFloat(consumption) * parseFloat(this.conversionFactors[fuelType.type]) : 0

        reducedData.push({
          type: fuelType.type,
          cost: total,
          converted: row.converted,
          consumption,
          conversionFactor: parseFloat(this.conversionFactors[fuelType.type]) || 0
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

      this.typeTotals.push(reduced)
    })

    this.typeTotals.sort((a: TableTotals, b: TableTotals) => b.consumption - a.consumption)
  }


  ngOnInit() {
    this.getCompanies();
    this.screenWidth = window.innerWidth
  }

  protected readonly parseFloat = parseFloat;
  protected readonly Object = Object;
}
