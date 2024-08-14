import {Component} from '@angular/core';
import moment, {Moment} from "moment";
import * as echarts from "echarts";
import _ from 'lodash';
import FileSaver from "file-saver";
import {GlobalService} from "../../../../_services/global.service";
import {MessageService} from "primeng/api";
import {SharedComponents} from "../../shared-components";
import {SharedModules} from "../../../../shared-module";
import {EnvirotrackService} from "../../envirotrack.service";
import {SidebarModule} from "primeng/sidebar";


export class TableTotals {
  consumption: number = 0
  cost: number = 0
  type!: string
  conversionFactor: number = 0;
}

type SingleChartAllocation = [string, number]



interface RowOrCol extends Record<string, any> {
  name: string,
  type: string,
  value: any
}

interface FuelDataType {
  cols: RowOrCol[][]
  rows: RowOrCol[][]
  customConversionFactor: string
  type: string
}


interface ExtractedRowProps {
  startDate: Moment
  endDate: Moment
  totalDays: number
  currentMonth: Moment
  value: number
  dayValue: number
  nightValue: number
  uom: string
}

@Component({
  selector: 'app-envirotrack-report-fields',
  standalone: true,
  templateUrl: './envirotrack-report-fields.component.html',
  imports: [
    SharedComponents,
    SharedModules,
    SidebarModule
  ],
  styleUrls: ['./envirotrack-report-fields.component.scss']
})
export class EnvirotrackReportFieldsComponent {
  data: FuelDataType[] = [];
  filteredData: FuelDataType[] = [];
  months: string[] = [];
  companies: any = [];
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
  fuelUsageGuide:boolean = false;
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
  showDayAndNightButton: boolean = true;
  dayAndNightFilter: boolean = false;
  dailyFilter: boolean = false
  hhFilter: boolean = false

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
  halfHourlyData: any[] = [];
  isConsultant: boolean = false;
  fuels: any[] = []
  dataArray: any[] = [];
  showChart: boolean = false;


  constructor(
    private global: GlobalService,
    private msg: MessageService,
    private track: EnvirotrackService
  ) {
    this.getCompanies()
  }


  saveChartAsBase64 = () => {
    if (!this.chartOptions) return;

    // Create temporary chart that uses echarts.instanceOf
    const div = document.createElement('div')
    div.style.width = '1200px'
    div.style.height = '1200px'

    const temporaryChart = echarts.init(div)

    temporaryChart.setOption({...this.chartOptions, animation: false})

    const data = temporaryChart.getDataURL({
      backgroundColor: '#fff',
      pixelRatio: 4
    })
    return data;
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
        textStyle: {
          fontSize: this.screenWidth >= 1441 ? 16 : 12
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
          height: this.screenWidth >= 1441 ? 50 : 30
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
          return `${params.seriesName}: ${params?.data[1] ? params?.data[1].toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }) : params?.data.toLocaleString('en-us', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
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
    this.chartOptions = {}
    this.series = []
    this.chartData = [];
    this.data = []
    this.chartY = []
    this.filteredData = [];
    this.fieldFilters = []
    this.filteredField = ''
    this.halfHourlyData = []
    this.typeTotals = []
    this.totalConsumption = 0;
    this.totalCost = 0
    this.totalEmissions = 0
    this.showDayAndNightButton = false

    // this.getData(this.selectedCompany)
    this.getHHData(this.selectedCompany)
    // this.global.updateSelectedCompany(this.selectedCompany)
    this.selectedCompanyName = this.companies?.find((comp: any) => comp.id === this.selectedCompany)?.['name'] || ''
    this.global.updateCompanyId(this.selectedCompany)
    this.global.updateSelectedMpan(this.selectedMpan)
    this.getFuelData(this.selectedCompany);
  }

  filterData = () => {
    this.splitByMonth(this.fuels)
    this.calculateTotals(this.fuels.slice(0), this.dateFilter)
  }

  getTimes = () => {
    for (let i = 0; i < 48; i++) {
      this.chartY.push(moment('00:00', 'HH:mm').add(i * 30, 'minutes').format('HH:mm'))
    }
  }


  getFuelData = (selectedCompanyId: number) => {
    this.fuels = []
    this.dataArray = []


    if (selectedCompanyId) {
      this.track.getFuelData(selectedCompanyId).subscribe({
        next: (res:any) => {

          if (res?.data?.fuel_data) {
            this.fuels = JSON.parse(res.data?.fuel_data)

          } else {
            this.fuels = []
            this.dataArray = []

          }
        },
        error: (err) => console.log(err),
        complete: () => this.organiseData()
      })
    }
  }

  organiseData = () => {
    this.fieldFilters = this.fuels.map(({type}: any) => {
      return type
    });
    // Remove null / undefined entries
    this.fieldFilters = this.fieldFilters.filter((i: any) => i !== null && typeof i !== 'undefined');


    if (this.halfHourlyData.length) {
      this.fieldFilters.push('Electricity HH')
    }

    // Remove Duplicates
    this.fieldFilters = new Set<string>(this.fieldFilters)


    this.splitByMonth(this.fuels)
    this.calculateTotals(this.fuels.slice(0));
  }





  exportExcel() {
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
      const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
      const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
      this.saveAsExcelFile(excelBuffer, `${this.selectedCompanyName}_fuel_breakdown`);

    })
  }

  saveAsExcelFile(buffer: any, fileName: string) {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION)
  }



  // CHART BUILDING FUNCTIONS
  splitByMonth = (data: FuelDataType[]) => {

    let months = new Set()
    let allDays: string[] = []
    let allocations: SingleChartAllocation[] = []
    let dayAllocationsForSeries:  SingleChartAllocation[] = []
    let nightAllocationsForSeries:  SingleChartAllocation[] = []
    let dataToMap: FuelDataType[] = []
    let seriesPerType: any[] = []

    // Filter by selected fuel type
    if (!this.filteredField) {
      dataToMap = data;
    } else {
      dataToMap = data.filter((fuelType: FuelDataType) => fuelType.type === this.filteredField)
    }

    // Loop over fuel types, and rows for each fuel type
    dataToMap.map((fuelType: FuelDataType) => {
      const rows = fuelType.rows;

      rows.map((row: RowOrCol[], index: number) => {
        // Extract all standard data, start date, end date, values etc
        let extractedRowValues: ExtractedRowProps | void = this.extractRowValues(row, fuelType, index)

        if (!extractedRowValues?.startDate) return;

        // If the daily average filter is chosen, extract relevant data
        if (this.dailyFilter) {
          let calculatedDailyData = this.calculateDailyChart(extractedRowValues)

          if (!calculatedDailyData) return;

          if (this.dayAndNightFilter) {
            dayAllocationsForSeries.push(...calculatedDailyData.dayAllocationsForSeries)
            nightAllocationsForSeries.push(...calculatedDailyData.nightAllocationsForSeries)
          }

          allocations.push(...calculatedDailyData.allocations)
          allDays = [...allDays, ...calculatedDailyData.allDays]

          // If the monthly average filter is chosen
        } else {
          let calculatedMonthlyData = this.calculateMonthlyChart(extractedRowValues, months)
          if (!calculatedMonthlyData) return;
          //
          //
          // if (fuelType.type === 'Electricity HH') {
          //   console.log(calculatedMonthlyData)
          // }

          if (this.dayAndNightFilter) {
            dayAllocationsForSeries.push(...calculatedMonthlyData.dayAllocationsForSeries)
            nightAllocationsForSeries.push(...calculatedMonthlyData.nightAllocationsForSeries)
          }

          allocations.push(...calculatedMonthlyData.allocations)
        }
      })

      // Reduce duplicate months to a total per month/day (For future maintenance: doing this inside the two loops was seriously impacting performance)
      // 1) For loop for Fuel Type, 2) For loop for each row of fuel data, 3) While loop to assess all days avg etc.
      const mergedAllocations = this.mergeAllocatedMonths(allocations)

      let mergedDay: SingleChartAllocation[] = []
      let mergedNight: SingleChartAllocation[] = []

      if (this.dayAndNightFilter) {
        mergedDay = this.mergeAllocatedMonths(dayAllocationsForSeries)
        mergedNight = this.mergeAllocatedMonths(nightAllocationsForSeries)
      }

      let newSeries = this.buildSeriesForCharts(mergedAllocations, mergedDay, mergedNight, fuelType, seriesPerType.length)
      if (newSeries) {
        seriesPerType.push(...newSeries)
      }

      // Reset for next loop
      allocations = [];
      dayAllocationsForSeries = []
      nightAllocationsForSeries = []
    })


    // Initialise axis, data and chart
    this.series = seriesPerType
    const monthArr: any[] = Array.from(months);
    monthArr.sort((a: any, b: any) => moment(a, ['MMMM-YYYY']).diff(moment(b, ['MMMM-YYYY'])))
    allDays.sort((a: any, b: any) => moment(a, ['DD-MMMM-YYYY']).diff(moment(b, ['DD-MMMM-YYYY'])))

    if (this.dailyFilter) {
      this.chartX = allDays
    } else {
      this.chartX = monthArr
    }

    // Sort day/night
    if (this.dayAndNightFilter) {
      this.series.sort((a: any, b: any) => {
        if (a.name.includes(' Day')) {
          return -1
        } else if (a.name.includes(' Night')) {
          return 1
        }
        return 1
      })
    }

    this.initChart()
  }


  // Merge allocations if the same month or date
  mergeAllocatedMonths = (allocations: SingleChartAllocation[]) => {
    let mergedAllocations: SingleChartAllocation[] = []

    allocations.forEach((allocation: SingleChartAllocation) => {

      const check = mergedAllocations.findIndex((merged: any) => merged[0] == allocation[0])
      if (check === -1) {
        mergedAllocations.push(allocation)
      } else {
        mergedAllocations[check][1] += allocation[1]
      }
    })

    return mergedAllocations
  }


  // Helper function for splitByMonth function - extracts key values to display chart
  extractRowValues = (row: RowOrCol[], fuelType: FuelDataType, index: number) => {

    const rawStartDate = row.filter((col: any) => col.name === 'Start Date')[0].value;
    const rawEndDate = row.filter((col: any) => col.name === 'End Date')[0].value
    const rawUOM = row.findIndex((col: any) => col.name === 'Unit');

    if (!rawStartDate && !rawEndDate) return

    const startDate: moment.Moment = moment(rawStartDate, ['YYYY-MM-DD']);
    const endDate: moment.Moment = moment(rawEndDate, ['YYYY-MM-DD'])


    if (!startDate.isValid() || !endDate.isValid()) {
      this.msg.clear()
      return this.msg.add({
        severity: 'warn',
        summary: 'Cannot generate chart',
        detail: 'Start date or End date is missing'
      })
    }


    let value = row.filter((col: any) => col.name.toLowerCase() === 'kwh')[0]?.value

    // If kwh not found, try 'Value'
    if (value === undefined || !value || value === '') {
      value = row.filter((col: any) => col.name.toLowerCase() === 'value')[0]?.value;
    }


    let totalDays = endDate.diff(startDate, 'days')

    let dayValue = row.filter((col: any) => col.name.toLowerCase() === 'day kwh')[0]?.value
    let nightValue = row.filter((col: any) => col.name.toLowerCase() === 'night kwh')[0]?.value

    // Check for Day & Night or Total
    if (dayValue && nightValue) {
      this.showDayAndNightButton = true;
    }


    let uom = row[rawUOM]?.value ? row[rawUOM].value : 'kWh'

    if (uom !== 'kWh') {
      value = this.convertToKwh(fuelType, uom, value)
    }

    let currentMonth: moment.Moment = startDate.clone().startOf('month')


    totalDays === 0 ? totalDays = 1 : totalDays

    return {
      startDate,
      endDate,
      totalDays,
      currentMonth,
      value,
      dayValue,
      nightValue,
      uom
    }
  }


  // Helper function for splitByMonth function - if daily average filter is clicked
  calculateDailyChart = (extractedRowValues: any) => {
    let currentDay: moment.Moment = extractedRowValues.startDate.clone().startOf('day')
    let currentEnd: moment.Moment = extractedRowValues.endDate.clone().startOf('day')
    let daysBetween = currentEnd.diff(currentDay, 'days')
    let valuePerDay = extractedRowValues.value / (daysBetween === 0 ? 1 : daysBetween)

    let allDays = []
    let dayAllocationsForSeries: SingleChartAllocation[] = []
    let nightAllocationsForSeries: SingleChartAllocation[] = []
    let allocations: SingleChartAllocation[] = []


    if (currentDay.isSame(currentEnd)) {
      currentEnd.add(1, 'days')
      currentEnd.startOf('day')
    }



    // const endMinusOneDay = currentEnd.subtract(1, 'day')
    // || currentDay.isSame(currentEnd, 'day')

    while (currentDay.isBefore(currentEnd)) {

      if (this.dateFilter && !isNaN(this.dateFilter)) {
        const monthsAgo = moment(new Date()).subtract(this.dateFilter + 1, 'months')
        if (extractedRowValues.currentMonth.isBefore(monthsAgo, 'month')) return;
      }
      // Add day/night split if applicable
      if (this.dayAndNightFilter) {
        let nightKwhPerDay = extractedRowValues.nightValue / extractedRowValues.totalDays;
        let dayKwhPerDay = extractedRowValues.dayValue / extractedRowValues.totalDays;

        allDays.push(currentDay.format('DD-MMMM-YYYY'));
        dayAllocationsForSeries.push([currentDay.format('DD-MMMM-YYYY'), dayKwhPerDay])
        nightAllocationsForSeries.push([currentDay.format('DD-MMMM-YYYY'), nightKwhPerDay])
        currentDay.add(1, 'day')
      } else {
        allDays.push(currentDay.format('DD-MMMM-YYYY'));
        allocations.push([currentDay.format('DD-MMMM-YYYY'), valuePerDay])
        currentDay.add(1, 'day')
      }
    }

    return {
      allDays,
      dayAllocationsForSeries,
      nightAllocationsForSeries,
      allocations
    }
  }

  // Helper function for splitByMonth function - calculates monthly average
   calculateMonthlyChart = (extractedRowValues: any, months: any) => {

    let dayAllocationsForSeries: SingleChartAllocation[] = []
    let nightAllocationsForSeries:  SingleChartAllocation[] = []
    let allocations: SingleChartAllocation[] = []

    while (extractedRowValues.currentMonth.isBefore(extractedRowValues.endDate) || extractedRowValues.currentMonth.isSame(extractedRowValues.endDate, 'month')) {
      let monthDays = extractedRowValues.currentMonth.daysInMonth()

      let totalDays = extractedRowValues.totalDays === 0 ? 1 : extractedRowValues.totalDays
      let valuePerDay = Number(extractedRowValues.value) / totalDays
      let daysAllocated = 0;

      if (extractedRowValues.currentMonth.isSame(extractedRowValues.startDate, 'month')) {
        // Partial start month
        daysAllocated = extractedRowValues.currentMonth.isSame(extractedRowValues.endDate, 'month') ? extractedRowValues.totalDays : monthDays - extractedRowValues.startDate.date() + 1
      } else if (extractedRowValues.currentMonth.isSame(extractedRowValues.endDate, 'month')) {
        // Partial end month
        daysAllocated = extractedRowValues.endDate.date();
      } else {
        // Full month
        daysAllocated = monthDays;
      }

      if (this.dateFilter && !isNaN(this.dateFilter)) {
        const monthsAgo = moment(new Date()).subtract(this.dateFilter + 1, 'months')
        if (extractedRowValues.currentMonth.isBefore(monthsAgo, 'month')) return;
      }


      // Optional filter for day and night chart
      if (this.dayAndNightFilter) {


        let nightKwhPerDay = extractedRowValues.nightValue / extractedRowValues.totalDays;
        let dayKwhPerDay = extractedRowValues.dayValue / extractedRowValues.totalDays;


        let allocationDay = (daysAllocated === 0 ? 1 : daysAllocated) * dayKwhPerDay;
        let allocationNight = (daysAllocated === 0 ? 1 : daysAllocated) * nightKwhPerDay;



        months.add(extractedRowValues.currentMonth.format('MMMM-YYYY'));
        dayAllocationsForSeries.push([extractedRowValues.currentMonth.format('MMMM-YYYY'), allocationDay]);
        nightAllocationsForSeries.push([extractedRowValues.currentMonth.format('MMMM-YYYY'), allocationNight])
        extractedRowValues.currentMonth.add(1, 'month').startOf('month');

      } else {
        let allocationValue = (daysAllocated === 0 ? 1 : daysAllocated) * valuePerDay;
        months.add(extractedRowValues.currentMonth.format('MMMM-YYYY'));
        allocations.push([extractedRowValues.currentMonth.format('MMMM-YYYY'), allocationValue]);
        extractedRowValues.currentMonth.add(1, 'month').startOf('month');
      }
    }

    return {
      allocations,
      dayAllocationsForSeries,
      nightAllocationsForSeries,
    }
  }

  // Helper function for splitByMonth function - Creates the series for stacked bar charts
  buildSeriesForCharts = (allocations: any, dayAllocationsForSeries: any, nightAllocationsForSeries: any, fuelType: any, seriesLength: number) => {

    // If the fuel type doesn't have day or night data available ignore it
    if (isNaN(dayAllocationsForSeries.length && nightAllocationsForSeries.length && dayAllocationsForSeries[0][1]) && isNaN(nightAllocationsForSeries[0][1])) {
      return null;
    }


    if (this.dailyFilter) {
      allocations.sort((a: any, b: any) => moment(a[0], ['DD-MMMM-YYYY']).diff(moment(b[0], ['DD-MMMM-YYYY'])));
      dayAllocationsForSeries.sort((a: any, b: any) => moment(a[0], ['DD-MMMM-YYYY']).diff(moment(b[0], ['DD-MMMM-YYYY'])));
      nightAllocationsForSeries.sort((a: any, b: any) => moment(a[0], ['DD-MMMM-YYYY']).diff(moment(b[0], ['DD-MMMM-YYYY'])));
    } else {
      allocations.sort((a: any, b: any) => moment(a[0], ['MMMM-YYYY']).diff(moment(b[0], ['MMMM-YYYY'])));
      dayAllocationsForSeries.sort((a: any, b: any) => moment(a[0], ['MMMM-YYYY']).diff(moment(b[0], ['MMMM-YYYY'])));
      nightAllocationsForSeries.sort((a: any, b: any) => moment(a[0], ['MMMM-YYYY']).diff(moment(b[0], ['MMMM-YYYY'])));
    }

    let newSeries = []
    const colours = ['#c2dea3', "#84a649", '#6a7c58', '#aec98f', '#465933', "#4c6b22"]

    if (this.dayAndNightFilter) {
      newSeries.push({
        type: 'bar',
        name: fuelType.type + ' Day',
        stack: 'total',
        data: dayAllocationsForSeries,
        itemStyle: {
          color: '#4472C4',
        },
        emphasis: {
          focus: 'series'
        }
      })

      newSeries.push({
        type: 'bar',
        name: fuelType.type + ' Night',
        stack: 'total',
        data: nightAllocationsForSeries,
        itemStyle: {
          color: 'orange',
        },
        emphasis: {
          focus: 'series'
        }
      })

    } else {
      newSeries.push({
        type: 'bar',
        name: fuelType.type,
        data: allocations,
        stack: 'x',
        itemStyle: {
          color: colours[seriesLength] || '#c2dea3'
        },
        emphasis: {
          focus: 'series'
        }
      });
    }



    return newSeries
  }





  filterField = (data: FuelDataType[]) => {
    this.chartData = [];

    if (!this.filteredField) {
      // Show all types
      this.filteredData = data;
      // Sort data in order of date

      const allRows = this.filteredData.map((fuelType: FuelDataType) => fuelType.rows)
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

  convertToKwh = (fuelType: FuelDataType, unitFrom: string, consumption: number) => {
    const convertUnitsTokWh: any = {
      'LPG litres': 1.5571,
      'LPG kWh': 0.2145,
      'Gas oil (Red diesel) litres': 2.7554,
      'Gas oil (Red diesel) kWh': 0.2565,
      'Diesel (avg biofuel blend) litres': 2.5121,
      'Diesel (avg biofuel blend) kWh': 0.2391,
      'Burning oil (Kerosene) litres': 2.5402,
      'Burning oil (Kerosene) kWh': 0.2468,
      'Propane litres': 1.5436,
      'Propane kWh': 0.2326,
      'Petrol (avg biofuel blend) litres': 2.0975,
      'Petrol (avg biofuel blend) kWh': 0.2217,
      'Wood logs tonnes': 43.89327,
      'Wood logs kWh': 0.01074,
      'Wood Chips tonnes': 40.58114,
      'Wood Chips kWh': 0.01074,
      'Wood pellets tonnes': 51.56192,
      'Wood pallets kWh': 0.01074,
      'Propane tonnes': 2997.63,
      'Propane kg': 2.99763,
    }

    const unitToConvert = `${fuelType.customConversionFactor} ${unitFrom}`
    const kwh = `${fuelType.customConversionFactor} kWh`
    const convertNumber = consumption * convertUnitsTokWh[unitToConvert] / convertUnitsTokWh[kwh]
    return convertNumber
  }

  calculateTotals = (data: FuelDataType[], dateFilter?: number) => {

    // Reset totals
    this.typeTotals = []
    this.totalConsumption = 0;
    this.totalCost = 0
    this.totalEmissions = 0


    let reducedData: any[] = []

    data.forEach((fuelType: FuelDataType) => {

      fuelType.rows.forEach((row: any) => {
        const endDateRaw = row.findIndex((c: any) => c.name.toLowerCase() === 'start date')
        const findTotal = row.findIndex((c: any) => c.name.toLowerCase() === 'total')
        const findCost = row.findIndex((c: any) => c.name.toLowerCase() === 'cost')
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
          const newValue = this.convertToKwh(fuelType, uom, consumption)
          row.converted = true;
          consumption = newValue;
        }


        this.totalConsumption += parseFloat(consumption);
        this.totalCost += parseFloat(total);
        this.conversionFactors[fuelType.customConversionFactor] ? this.totalEmissions += parseFloat(consumption) * parseFloat(this.conversionFactors[fuelType.customConversionFactor]) : 0


        reducedData.push({
          type: fuelType.type,
          cost: total,
          converted: row.converted,
          consumption,
          conversionFactor: parseFloat(this.conversionFactors[fuelType.customConversionFactor]) || 0
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

  getHHData = (id: number) => {
    if (!id) return;

    let mpan: any[] = [];
    this.chartData = [];
    this.halfHourlyData = []
    // // Remove HH from totals

    this.typeTotals = this.typeTotals.map((fuelType: any, index: number) => {
      fuelType.id = index + 1;
      return fuelType;
    })


    // this.track.getData(id).subscribe({
    //     next: (res) => {
    //       if (!res.length) return;
    //
    //       res.forEach((row: any) => {
    //         row.hdd = JSON.parse(row.hdd.replaceAll('"', '').replaceAll("'", '')).map((x: number) => x ? x : 0)
    //         !~mpan.indexOf(row.mpan) ? mpan.push(row.mpan) : null;
    //       })
    //
    //
    //       res.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    //       const latestDate = res[res.length - 1].date
    //       const twelveMonthsAgo = moment(latestDate).subtract(12, 'months').subtract(1, 'days').format('YYYY-MM-DD')
    //
    //       const filteredDates = res.filter((row: any) => {
    //         if (!row.hdd.length) return null;
    //         return moment(row.date, ['YYYY-MM-DD']).isAfter(twelveMonthsAgo)
    //       })
    //
    //       this.halfHourlyData = filteredDates
    //     },
    //     error: (err: any) => console.log(err),
    //     complete: () => {
    //         if (this.halfHourlyData.length){
    //           this.mergeHHData()
    //           this.getData(this.selectedCompany)
    //         } else {
    //           this.getData(this.selectedCompany)
    //         }
    //     }
    //   }
    // )
  }

  mergeHHData = () => {
    // Get totals for every hour

    this.halfHourlyData = this.halfHourlyData.map((day: any) => {
      const totalKWH = day.hdd.reduce((acc: any, curr: any) => {
        return acc + curr
      }, 0)

      // Calculate Day/Night for HH data
      // Day taken as middle 24
      let dayTotal = day.hdd.reduce((acc: any, curr: any, index: number) => {
        if (index > 11 && index < 36){
          return acc + curr;
        } else {
          return acc;
        }
      }, 0)

      // Night taken as first 12 and last 12
      let nightTotal = day.hdd.reduce((acc: any, curr: any, index: number) => {
        if (index <= 11 || index >= 36) {
          return acc + curr;
        } else {
          return acc;
        }
      }, 0)

      day.total = totalKWH;
      day.dayTotal = dayTotal
      day.nightTotal = nightTotal

      return day;
    })

    // Format and add to data array for filtering etc
    let electricityHHObject: any = {
      type: 'Electricity HH',
      rows: [],
      customConversionFactor: 'Electricity',
      cols: []
    }

    const dayHH = this.halfHourlyData.map((day: any) => {
      const rowItem = []
      rowItem.push({name:'Start Date', value: new Date(day.date) })
      rowItem.push({name:'End Date', value: new Date(day.date) })
      rowItem.push({name:'Day kwh', value: day.dayTotal})
      rowItem.push({name:'Night kwh', value: day.nightTotal })
      rowItem.push({name:'Value', value: day.total })
      rowItem.push({name:'Unit', value: 'kWh' })
      rowItem.push({name:'Days', value: 1 })

      return rowItem
    })


    electricityHHObject.rows.push(...dayHH);
    this.data.push(electricityHHObject)

  }


  // ngOnInit() {
  //   this.getCompanies();
  //   this.screenWidth = window.innerWidth
  // }

  protected readonly parseFloat = parseFloat;
  protected readonly Object = Object;

}
