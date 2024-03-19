import {Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CheckboxModule} from "primeng/checkbox";
import {ChipsModule} from "primeng/chips";
import {FormBuilder, FormGroup, FormsModule, NgForm, Validators} from "@angular/forms";
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
import {DbService} from "../../_services/db.service";
import {InputMaskModule} from "primeng/inputmask";
import {NG_VALIDATORS} from '@angular/forms';
import {NgClass} from "@angular/common";
import {Message, MessageService} from "primeng/api";

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
    DropdownModule,
    InputMaskModule,
    NgClass,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent{
  first_name:string = '';
  last_name:string = '';
  email:string = '';
  phone_number:string = '';
  password:string = '';
  confirm_password:string = '';
  company_name:string = '';
  address:string = '';
  postcode:string = '';
  uprn?:string;
  local_auth?:string;
  est_year?: Date;
  employees?:string;
  turnover?:string;
  sector?:string;
  sic_code?:string;
  website_url?:string;
  company_description?:string;
  policy:boolean = false;
  policy_idni?:boolean;
  policy_bill?:boolean;
  carbon_emissions?:any;
  development_issues?:any;
  challenges?:any;
  decarb_plans?:any;
  economy_opportunities?:any;
  selectedEnergyType?:any;
  otherEnergyType?:any;
  energyTypeCost?:any;
  selectedEnergyCost?:any;
  energyCostAdditional?:any;
  selectedEnergyInfo?:any;
  additionalEnergyInfo?:any;
  selectedOnSiteGeneration?:any;
  onSiteGeneration?:any;
  otherOnSiteGeneration?:any;
  //form!: FormGroup;
  messages!: Message[];

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
      value:'transportation cost'
    },
    {
      name:'Cost of Water',
      value:'cost of water'
    },
    {
      name:'Cost of Waste/Recycling',
      value: 'cost of waste/recycling'
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


  constructor(private db: DbService,private msg: MessageService) {
  }

  onSubmit = () => {
    const userObj = {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      phone_number: this.phone_number,
      password: this.password,
      confirm_password: this.confirm_password,
    }

    const formObj = {
      name: this.company_name,
      address: this.address,
      postcode: this.postcode,
      uprn: this.uprn,
      local_auth: this.local_auth,
      est_year: this.est_year,
      employees: this.employees,
      turnover: this.turnover,
      sector: this.sector,
      sic_code: this.sic_code,
      website_url: this.website_url,
      company_description: this.company_description,
      selectedEnergyType: this.selectedEnergyType,
      energyTypeCost: this.energyTypeCost,
      otherEnergyType: this.otherEnergyType,
      selectedEnergyCost: this.selectedEnergyCost,
      energyCostAdditional: this.energyCostAdditional,
      selectedEnergyInfo: this.selectedEnergyInfo,
      additionalEnergyInfo: this.additionalEnergyInfo,
      selectedOnSiteGeneration: this.selectedOnSiteGeneration,
      onSiteGeneration: this.onSiteGeneration,
      otherOnSiteGeneration: this.otherOnSiteGeneration,
      carbon_emissions: this.carbon_emissions,
      development_issues: this.development_issues,
      challenges: this.challenges,
      decarb_plans: this.decarb_plans,
      economy_opportunities: this.economy_opportunities,
      policy: this.policy,
      policy_idni: this.policy_idni,
      policy_bill:this.policy_bill

    }


    if (this.checkInputs()){
      this.db.addCompany(['*'], formObj, userObj).subscribe({
        next: (res) => {
          console.log(res)
        }
      })
    } else{
      this.msg.add({
        severity:'warn',
        detail:'Please fill in all of the mandatory fields.'
      })
    }

  }

  checkInputs = () => {
    const reg = /^\S+@\S+\.\S+$/;
    if (!reg.test(this.email)) {
      this.messages = [{
        severity: 'warn',
        detail: 'Please fill in valid email.'
      }];
      return false;
    }
    if (this?.first_name?.length < 3) {
      this.messages = [{
        severity: 'warn',
        detail: 'Your first name must contain minimum 3 characters!'
      }]
      return false;
    }
    if (this?.last_name?.length < 4) {
      this.messages = [{
        severity: 'warn',
        detail: 'Your surname must contain minimum 4 characters!'
      }]
      return false;
    }
    if (this?.phone_number?.length < 8) {
      this.messages = [{
        severity: 'warn',
        detail: 'Your mobile number must contain minimum 8 characters!'
      }]
      return false;
    }
    if (this?.address?.length < 5) {
      this.messages = [{
        severity: 'warn',
        detail: 'Your address must contain minimum 5 characters!'
      }]
      return false;
    }
    if (this?.postcode.length < 5) {
      this.messages = [{
        severity: 'warn',
        detail: 'Your postcode must contain minimum 6 characters!'
      }]
      return false;
    }

    if (!this.policy) {
      return false;
    }
    if (!this.policy_bill) {
      return false;
    }
    if (!this.policy_idni) {
      return false;
    }

    const regPassword =  /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/
    const specialSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/
    if (!regPassword.test(this.password && this.confirm_password)) {
      this.messages = [{
        severity: 'warn',
        detail: 'Please fill in valid password.'
      }];
      return false;
    }
    if(!specialSymbol.test(this.password && this.confirm_password)){
      this.messages = [{
        severity: 'warn',
        detail: 'Please fill in valid password.'
      }];
      return false;
    }

    // if(this?.password.length < 8 || this?.confirm_password.length < 8){
    //   return false
    // }



    if(this.password !== this.confirm_password){
      return false
    }

     return true
  }


}
