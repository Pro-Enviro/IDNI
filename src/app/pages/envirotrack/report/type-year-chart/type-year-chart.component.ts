import {Component, Input, OnInit} from '@angular/core';
import {EChartsOption} from 'echarts';
import {FilterService} from 'primeng/api';
import tinycolor from 'tinycolor2'
import {SharedComponents} from "../../shared-components";
import {SharedModules} from "../../../../shared-module";

@Component({
  selector: 'app-type-year-chart',
  templateUrl: './type-year-chart.component.html',
  standalone: true,
  styleUrls: ['./type-year-chart.component.scss'],
  imports:[
    SharedComponents,
    SharedModules
  ]
})
export class TypeYearChartComponent implements OnInit {

  @Input() data: any;
  @Input() yearFilter: any;
  @Input() scopes: any;
  @Input() companyList: any;
  @Input() types: any;

  selectedYears: any = [{name: 2022, value: 2022}];
  filteredData: any;
  selectedScope:any = [];
  selectedCompany: any;
  startYear: any;
  months: string[] = [];
  typeArray: any[] = [];

  scope1Index: number = 0;
  scope2Index: number = 0;
  scope3Index: number = 0;
  scopeOIndex: number = 0;
  scope1Colours!: string[];
  scope2Colours!: string[];
  scope3Colours!: string[];
  scopeOColours!: string[];
  colorArray: any[] = [];
  colours: string[] = [
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

  fltr1: any = [];

  chartOption!: EChartsOption;

  datas: any;
  dataArray: any;

  constructor(
    private fltr: FilterService
  ) { }

  initChart(){
    this.colorSetup();
    this.chartOption = {
      legend: {
        height: 150,
        top: 5,
        orient: 'vertical',
        //type: 'scroll',
        data: this.typeArray,
        itemGap: 13,
        textStyle: {
          fontSize: '12'
        }
      },
      grid: {
        top: 250
      },
      tooltip: {
        extraCssText: 'text-transform: capitalize',
        trigger: 'item',
        formatter: `{a} <br />{b}: {c} CO2e`,
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      dataZoom: [{
        type: 'inside'
      }],
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true
          }
        }
      },
      xAxis: [{
        type: 'category',
        data: this.months,
        name: 'Year',
        nameTextStyle: {
          fontSize: 14,
          padding: 15
        },
        nameLocation: 'middle',
      }],
      yAxis: [{
        type: 'value',
        name: 'Kg of CO2e',
        nameTextStyle: {
          fontSize: 14,
          padding: 50
        },
        nameRotate: 90,
        nameLocation: 'middle',
        nameGap: 70
      }],
      series: this.dataArray,
      color: this.colours
    };
  }

  shuffle = (array: string[]) => {
    let currentIndex = array.length , randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor((Math.random() * currentIndex));
      currentIndex --;

      [array[currentIndex],array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }

    return array;
  }



  getMonths = (data: any) =>{
    data.forEach((row:any)=> {
      if(row.endDate.isValid()){
        if(!~this.months.indexOf(row.endDate.format('MM/YYYY'))){
          this.months.push(row.endDate.format('MM/YYYY'));
        }
      }
    })
    this.months.sort();
    this.months.sort((a:string,b:string) => (a.split('/')[1] > b.split('/')[1]) ? 1 : ((b.split('/')[1] > a.split('/')[1]) ? -1 : 0))

  }

  getTypes = () =>{
    this.colorSetup()
    this.typeArray = []
    this.types.forEach((x:any) => {
      let color = this.generateColour(x.scope)
      this.typeArray.push({
        name: x.name,
        /*itemStyle: {
          color
        }*/
      })
      this.colorArray.push({name: x.name, color})
    })

  }

  createArray(data?:any){
    this.dataArray = [];
    if(!data){
      data = this.data;
    }
    this.types.forEach((type:any)=>{

      let totalArr:any = [];
      this.months.forEach((month:any)=>{
        let t = 0;
        let col;
        let total = data.filter((x:any)=> `${x.level_1} - ${x.level_2} - ${x.level_3}${x.level_1 === 'Material use' || x.level_1 === 'Waste disposal' ? ' - ' + x.level_5 : ''}` === type.value && x.endDate.format('MM/YYYY')=== month).map((x:any)=>  {

          t += x.kgCO2e;
          col = this.colorArray.filter((x:any) => x.name === type.value)[0].color
          return {t,col}
        });
        if(total[0]){
          totalArr.push({
            name: month,
            value: [month, total[total.length -1].t],
            /*itemStyle: {
              color: total[0].col
            }*/
          })
        }
      })
      if(totalArr.length){
        this.dataArray.push({
          name: type.value,
          type: 'bar',
          stack: 'stack',
          data: totalArr
        })
      }
    })
  }

  filterData(event:any){
    this.getMonths(this.data.filter((x:any)=> event.includes(parseInt(x.company_id))));

    this.createArray(this.data.filter((x:any)=> event.includes(parseInt(x.company_id))));
    this.initChart();
  }

  ngOnInit(): void {
    this.getTypes()
    this.filterData([
      this.data[0].company_id
    ])
    this.initChart()
  }

  colorSetup = () => {
    this.scope1Index = 0;
    this.scope2Index = 0;
    this.scope3Index = 0;
    this.scopeOIndex = 0;

    this.scope1Colours = this.generateColorShades('#4400d2', this.types.filter((x:any) => x.scope === 'Scope 1').length);
    this.scope2Colours = this.generateColorShades('#006633', this.types.filter((x:any) => x.scope === 'Scope 2').length);
    this.scope3Colours = this.generateColorShades('#ff0000', this.types.filter((x:any) => x.scope === 'Scope 3').length);
    this.scopeOColours = this.generateColorShades('#21a4a8', this.types.filter((x:any) => x.scope === 'Outside of Scopes').length);
  }

  generateColour = (scope: string) => {
    let baseColour: string;

    switch (scope) {
      case 'Scope 1':
        baseColour = this.scope1Colours[this.scope1Index];
        this.scope1Index++;
        break;
      case 'Scope 2':
        baseColour = this.scope2Colours[this.scope2Index];
        this.scope2Index++;
        break;
      case 'Scope 3':
        baseColour = this.scope3Colours[this.scope3Index];
        this.scope3Index++;
        break;
      default:
        baseColour = this.scopeOColours[this.scopeOIndex];
        this.scopeOIndex++;
    }
    return baseColour
  }

  generateColorShades(baseColor: string, arrayLength: number): string[] {
    let colorArray: string[] = [];
    const step = Math.floor(50 / arrayLength); // Calculate the step for each saturation
    for (let i = 1; i <= arrayLength; i++) {
      const saturation = (i * step + 50);
      const color = i ? this.calculateSaturationColor(saturation, baseColor) : baseColor;
      colorArray.push(color);
    }
    return colorArray;
  }
  calculateSaturationColor(saturation: number, baseColor: string): string {
    const color:any = tinycolor(baseColor).toRgb()

    let max = Math.max(color.r,color.b,color.g)

    color.r === max ? color.b = color.b * saturation/100 : color.g = color.g * saturation/100;
    color.b === max ? color.g = color.g * saturation/100 : color.r = color.r * saturation/100;
    color.g === max ? color.r = color.r * saturation/100 : color.b = color.b * saturation/100;

    // Update the saturation value
    color.s = color.s * saturation/100
    const updatedHsl = tinycolor(color).toHsl()
    return tinycolor(updatedHsl).toHexString();
  }

 /* calculateSaturationColor(saturation: number, baseColor: string): string {
    const color:any = tinycolor(baseColor).toHsl()
    // Update the saturation value
    color.s = color.s * saturation/100
    const updatedHsl = tinycolor(color).toHsl()
    return tinycolor(updatedHsl).toHexString();
  }*/



/*
  generateColorShades(baseColor: string,arrayLength: number): string[] {
    let colorArray: string[] = [];
    const step = Math.floor(150 / arrayLength); // Calculate the step for each shade

    for (let i = 0; i < arrayLength; i++) {
      const shade = i * step;
      const color = this.calculateShadeColor(shade, baseColor);
      colorArray.push(color);
    }
    return colorArray
  }

  calculateShadeColor(shade: number, baseColor: string): string {
    const hex = baseColor.slice(1); // Remove the '#' character from the base color

    // Convert the base color to RGB values
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    // Calculate the shade color using the RGB values and shade value
    const shadeR = Math.max(0, r - shade);
    const shadeG = Math.max(0, g - shade);
    const shadeB = Math.max(0, b - shade);

    // Convert the shade color back to hexadecimal format
    return '#' + this.componentToHex(shadeR) + this.componentToHex(shadeG) + this.componentToHex(shadeB);
  }

  componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }*/
}
