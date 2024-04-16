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
import {NgClass} from "@angular/common";
import {Message, MessageService} from "primeng/api";
import {DividerModule} from "primeng/divider";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../_services/users/auth.service";


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
    DividerModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
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
  est_year?: Date[];
  employees:string = '';
  turnover:string = '';
  sector?:string;
  sic_code?:string[];
  website_url?:string;
  company_description?:string;
  policy?:boolean;
  policy_cosi?:boolean;
  policy_idni?:boolean;
  policy_bill?:boolean;
  carbon_emissions?:any;
  development_issues?:any;
  challenges?:any;
  decarb_plans?:any;
  economy_opportunities?:any;
  selectedEnergyType?:any;
  otherEnergyType:string = '';
  energyTypeCost: string = '';
  selectedEnergyCost?:any;
  energyCostAdditional: string = '';
  selectedEnergyInfo?:any;
  additionalEnergyInfo:string = '';
  selectedOnSiteGeneration?:any;
  onSiteGeneration?:string;
  otherOnSiteGeneration:string = '';

  energyTypes:any = [
    {name:'Oil', value:'oil'},
    {name:'Gas', value:'gas'},
    {name:'LPG', value:'lpg'},
    {name:'Electricity', value:'electricity'},
    {name:'Diesel', value:'diesel'},
    {name:'Kerosene', value:'kerosene'},
    {name:'Gas Oil/Red Diesel', value:'gas oil/red diesel'},
    {name:'Other', value:'other'}
  ]

  energyCost :any =[
    {name:'Transportation Costs', value:'transportation cost'},
    {name:'Cost of Water', value:'cost of water'},
    {name:'Cost of Waste/Recycling', value: 'cost of waste/recycling'}
  ]

  energyInfo:any =[
    {name:'Grid Allocation & Usage', value:'grid allocation usage'},
    {name:'kVa Availability', value:'kva availability'},
    {name:'Recorded Winter Max Demand kVa', value:'winter max demand'}
  ]

  generationOptions:any =[
    {name:'PV', value:'pv'},
    {name:'Wind', value:'wind'},
    {name:'Solar Thermal', value:'solar thermal'},
    {name:'CHP', value:'chp'},
    {name:'Biomass', value:'biomass'},
    {name:'Hydro', value:'hydro'},
    {name:'AD', value:'ad'},
    {name:'Other', value:'other'}
  ]

  constructor(private db: DbService,private msg: MessageService , private router: Router, private auth: AuthService) {}

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
      policy_cosi:this.policy_cosi,
      policy_idni: this.policy_idni,
      policy_bill:this.policy_bill

    }

    if (this.checkInputs()){
      this.db.addCompany(['*',], formObj, userObj).subscribe({
        next: (res) => {
        this.first_name = ''
          this.last_name = ''
          //this.email = ''
          this.phone_number = ''
          this.password = ''
          this.confirm_password = ''
          this.company_name = ''
          this.address = ''
          this.postcode = ''
          this.uprn = ''
          this.local_auth = ''
          this.est_year = []
          this.employees = ''
          this.turnover = ''
          this.sector = ''
          this.sic_code = []
          this.website_url = ''
          this.company_description = ''
          this.selectedEnergyType = null
          this.energyTypeCost = ''
          this.otherEnergyType = ''
          this.selectedEnergyCost = null
          this.energyCostAdditional = ''
          this.selectedEnergyInfo = null
          this.additionalEnergyInfo = ''
          this.selectedOnSiteGeneration = null
          this.onSiteGeneration = ' '
          this.otherOnSiteGeneration = ''
          this.carbon_emissions = ''
          this.development_issues = ''
          this.challenges = ''
          this.decarb_plans = ''
          this.economy_opportunities = ''
          this.policy = false
          this.policy_cosi = false
          this.policy_idni = false
          this.policy_bill = false

          console.log(res)

          this.msg.add({
            severity:'success',
            summary:'Success',
            detail:'You have successfully registered.'
          })
          window.location.assign(`successful-registration.html?email=${this.email}`)
        },
        error:(err) => {
         const errorMsg = err.error.errors[0].message
          if(errorMsg === 'Value for field "email" in collection "directus_users" has to be unique.'){
            return this.msg.add({
              severity:'error',
              summary: 'User Already Exists !',
              detail:'Please, register with another email address !'
            })
          }
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
      return false;
    }
    if (this?.first_name?.length < 3) {
      return false;
    }
    if (this?.last_name?.length < 4) {
      return false;
    }
    if (this?.phone_number?.length < 8) {
      return false;
    }
    if(this.company_name?.length < 5){
      return false
    }
    if (this?.address?.length < 5) {
      return false;
    }
    if (this?.postcode.length < 5) {
      return false;
    }

    if (!this.policy) {
      return false;
    }
    // if (!this.policy_bill) {
    //   return false;
    // }
    //
    // if(!this.policy_idni){
    //   return false
    // }

    if(this.policy && this.policy_bill && this.policy_idni){
        const regPassword =  /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/
        const specialSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/
        if (!regPassword.test(this.password && this.confirm_password)) {
          return false;
        }
        if(!specialSymbol.test(this.password && this.confirm_password)){
          return false;
        }

        if(this.password !== this.confirm_password){
          return false
        }
    }

     return true
  }


  // getUserRoles = async () => {
  //   this.auth.getUserRoles().subscribe({
  //     next: (res: any) => {
  //       if (!res) return;
  //       console.log(res)
  //       this.userRole = res.data
  //     }
  //   })
  // }

  ngOnInit(){
    // this.getUserRoles()
  }
}
