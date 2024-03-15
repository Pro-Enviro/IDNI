import { Component } from '@angular/core';
import {DropdownModule} from "primeng/dropdown";
import {PaginatorModule} from "primeng/paginator";
import {InputTextModule} from "primeng/inputtext";
import {CardModule} from "primeng/card";

@Component({
  selector: 'app-energy-cost-information',
  standalone: true,
  imports: [
    DropdownModule,
    PaginatorModule,
    InputTextModule,
    CardModule
  ],
  templateUrl: './energy-cost-information.component.html',
  styleUrl: './energy-cost-information.component.scss'
})
export class EnergyCostInformationComponent {
  selectedEnergyType?:any;
  energyTypeCost?:any;
  selectedEnergyCost?:any;
  energyCostAdditional?:any;
  selectedEnergyInfo?:any;
  additionalEnergyInfo?:any;
  selectedGeneration?:any;
  onSiteGeneration?:any;

  energyTypes:any = [
    {
      name:'Oil',
      value:'oil'
    },
    {
      name:'Gas',
      value:'gas'
    },
    {
      name:'LPG',
      value:'lpg'
    },
    {
      name:'Electricity',
      value:'electricity'
    },
    {
      name:'Diesel',
      value:'diesel'
    },
    {
      name:'Kerosene',
      value:'kerosene'
    },
    {
      name:'Gas Oil/Red Diesel',
      value:'gas oil/red diesel'
    },
    {
      name:'Other',
      value:'other'
    }
  ]

  energyCost :any =[
    {
      name:'Transportation Costs',
      value:'transportation'
    },
    {
      name:'Cost of Water',
      value:'water'
    },
    {
      name:'Cost of Waste/Recycling',
      value: 'recycle'
    }
  ]

  energyInfo:any =[
    {
      name:'Grid Allocation & Usage',
      value:'grid allocation usage'
    },
    {
      name:'kVa Availability',
      value:'kva availability'
    },
    {
      name:'Recorded Winter Max Demand kVa',
      value:'winter max demand'
    }
  ]

  generationOptions:any =[
    {
      name:'PV',
      value:'pv'
    },
    {
      name:'Wind',
      value:'wind'
    },
    {
      name:'Solar Thermal',
      value:'solar thermal'
    },
    {
      name:'CHP',
      value:'chp'
    },
    {
      name:'Biomass',
      value:'biomass'
    },
    {
      name:'Hydro',
      value:'hydro'
    },
    {
      name:'AD',
      value:'ad'
    },
    {
      name:'Other',
      value:'other'
    }
  ]
}
