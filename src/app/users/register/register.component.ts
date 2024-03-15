import { Component } from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CheckboxModule} from "primeng/checkbox";
import {ChipsModule} from "primeng/chips";
import {FormsModule} from "@angular/forms";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputGroupModule} from "primeng/inputgroup";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {PanelModule} from "primeng/panel";
import {PasswordModule} from "primeng/password";
import {TopPageImgTplComponent} from "../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    ChipsModule,
    FormsModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputNumberModule,
    InputTextModule,
    InputTextareaModule,
    PanelModule,
    PasswordModule,
    TopPageImgTplComponent,
    CardModule,
    DropdownModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  name?:string;
  email?:string;
  phone_number?:string;
  password?:string;
  confirm_password?:string;
  company_name?:string;
  address?:string;
  postcode?:string;
  uprn?:string;
  local_auth?:string;
  est_year?: Date;
  employees?:string;
  turnover?:string;
  sector?:string;
  sic_code?:string;
  website_url?:string;
  company_description?:string;
  policy?:boolean;
  policy_idni?:boolean;
  carbon_emissions?:any;
  development_issues?:any;
  challenges?:any;
  decarb_plans?:any;
  economy_opportunities?:any;
  existing_plans?:any;
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
