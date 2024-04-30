import {Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CheckboxModule} from "primeng/checkbox";
import {ChipsModule} from "primeng/chips";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputGroupModule} from "primeng/inputgroup";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {PanelModule} from "primeng/panel";
import {PasswordModule} from "primeng/password";
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";
import {DbService} from "../../_services/db.service";
import {InputMaskModule} from "primeng/inputmask";
import {CommonModule, NgClass, NgIf} from "@angular/common";
import {MessageService} from "primeng/api";
import {DividerModule} from "primeng/divider";
import { RouterLink} from "@angular/router";
import {StorageService} from "../../_services/storage.service";


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
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
    CardModule,
    DropdownModule,
    InputMaskModule,
    NgClass,
    DividerModule,
    RouterLink,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  myForm!: FormGroup;
  policy_idni: boolean = false
  policy: boolean = false
  policy_bill: boolean = false

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

  constructor(private db: DbService,private msg: MessageService , private fb: FormBuilder, private storage: StorageService) {
    if (this.storage.get('directus-data') !== null) {
      localStorage.clear()
      window.location.reload()
    }
  }

  onSubmit = (form: FormGroup) => {
    const userObj = {
      // first_name: this.first_name,
      // last_name: this.last_name,
      // email: this.email,
      // phone_number: this.phone_number,
      // password: this.password,
      // confirm_password: this.confirm_password,
    }
    console.log('FORM SUBMISSION')
    console.log(this.myForm.value)
    console.log('valid:', form.valid)

    // Check for required/valid fields
    if(!this.myForm.valid) {
      this.myForm.markAllAsTouched();

      return this.msg.add({
        severity: 'warn',
        detail: 'Please fill in all required fields.'
      })
    }

    // Pick out user details required

    // Send to backend to create company/user

  }




  ngOnInit(){
    this.myForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [ Validators.required, Validators.email]],
      phone_number: ['',  Validators.required],
      password: [''],
      confirm_password: [''],
      company_name: ['',  Validators.required],
      address: ['', Validators.required],
      postcode: ['', Validators.required],
      uprn: [''],
      local_auth: [''],
      est_year: [''],
      employees: [''],
      turnover: [''],
      sector: [''],
      sic_code: [''],
      website_url: [''],
      company_description: [''],
      policy: ['', Validators.required],
      policy_cosi: [''],
      policy_idni: ['', Validators.required],
      policy_bill: ['', Validators.required],
      carbon_emissions: [''],
      development_issues: [''],
      challenges: [''],
      decarb_plans: [''],
      economy_opportunities: [''],
      selectedEnergyType: [''],
      otherEnergyType: [''],
      energyTypeCost: [''],
      selectedEnergyCost: [''],
      energyCostAdditional: [''],
      selectedEnergyInfo: [''],
      additionalEnergyInfo: [''],
      selectedOnSiteGeneration: [''],
      onSiteGeneration: [''],
      otherOnSiteGeneration: [''],
    })
  }
}



// checkInputs = () => {
//   const reg = /^\S+@\S+\.\S+$/;
//   if (!reg.test(this.email)) {
//     return false;
//   }
//   if (this.first_name.length < 3) {
//     return false;
//   }
//   if (this.last_name.length < 4) {
//     return false;
//   }
//   if (this?.phone_number?.length < 8) {
//     return false;
//   }
//   if(this.company_name?.length < 5){
//     return false
//   }
//   if (this?.address?.length < 5) {
//     return false;
//   }
//   if (this?.postcode.length < 5) {
//     return false;
//   }
//
//   if (!this.policy) {
//     return false;
//   }
//   // if (!this.policy_bill) {
//   //   return false;
//   // }
//   //
//   // if(!this.policy_idni){
//   //   return false
//   // }
//
//   if(this.policy && this.policy_bill && this.policy_idni){
//       const regPassword =  /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/
//       const specialSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/
//       if (!regPassword.test(this.password && this.confirm_password)) {
//         return false;
//       }
//       if(!specialSymbol.test(this.password && this.confirm_password)){
//         return false;
//       }
//
//       if(this.password !== this.confirm_password){
//         return false
//       }
//   }
//
//    return true
// }
