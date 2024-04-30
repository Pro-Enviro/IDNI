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
import {RouterLink} from "@angular/router";
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

  energyTypes: any = [
    {name: 'Oil', value: 'oil'},
    {name: 'Gas', value: 'gas'},
    {name: 'LPG', value: 'lpg'},
    {name: 'Electricity', value: 'electricity'},
    {name: 'Diesel', value: 'diesel'},
    {name: 'Kerosene', value: 'kerosene'},
    {name: 'Gas Oil/Red Diesel', value: 'gas oil/red diesel'},
    {name: 'Other', value: 'other'}
  ]

  energyCost: any = [
    {name: 'Transportation Costs', value: 'transportation cost'},
    {name: 'Cost of Water', value: 'cost of water'},
    {name: 'Cost of Waste/Recycling', value: 'cost of waste/recycling'}
  ]

  energyInfo: any = [
    {name: 'Grid Allocation & Usage', value: 'grid allocation usage'},
    {name: 'kVa Availability', value: 'kva availability'},
    {name: 'Recorded Winter Max Demand kVa', value: 'winter max demand'}
  ]

  generationOptions: any = [
    {name: 'PV', value: 'pv'},
    {name: 'Wind', value: 'wind'},
    {name: 'Solar Thermal', value: 'solar thermal'},
    {name: 'CHP', value: 'chp'},
    {name: 'Biomass', value: 'biomass'},
    {name: 'Hydro', value: 'hydro'},
    {name: 'AD', value: 'ad'},
    {name: 'Other', value: 'other'}
  ]

  constructor(private msg: MessageService, private fb: FormBuilder, private storage: StorageService) {
    if (this.storage.get('directus-data') !== null) {
      localStorage.clear()
      window.location.reload()
    }
  }

  onSubmit = (form: FormGroup) => {
    // Check for required/valid fields
    if (!this.myForm.valid) {
      this.myForm.markAllAsTouched();

      // Password Confirm validators
      if (this.myForm.controls['password'].value !== this.myForm.controls['confirm_password'].value){
        return this.myForm.controls['password'].setErrors({'not_matching': true});
      }

      return this.msg.add({
        severity: 'warn',
        detail: 'Please fill in all required fields.'
      })
    }

    // Pick out user details required
    const user = {
      first_name: this.myForm.controls['first_name'].value,
      last_name: this.myForm.controls['last_name'].value,
      email: this.myForm.controls['email'].value,
      phone_number: this.myForm.controls['phone_number'].value,
      password: this.myForm.controls['password'].value,
      confirm_password: this.myForm.controls['confirm_password'].value,
    }

    console.log(user)
    console.log('Sending to DB')

    // Send to backend to create company/user
    // this.db.addCompany(['*'], this.myForm.value, user).subscribe({
    //   next: (res) => {
    //       this.myForm.reset()
    //   }
    // })
  }


  ngOnInit() {
    this.myForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      password: [''],
      confirm_password: [''],
      company_name: ['', Validators.required],
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

  checkPolicyLevel() {
    const policy = this.myForm.controls['policy'].value
    const policy_bill = this.myForm.controls['policy_bill'].value
    const policy_idni = this.myForm.controls['policy_idni'].value


    if (policy && policy_bill && policy_idni) {
      this.myForm.controls['password'].setValidators([Validators.required, Validators.minLength(8)])
      this.myForm.controls['confirm_password'].setValidators([Validators.required,  Validators.minLength(8)])
      this.myForm.markAllAsTouched()
      return true;
    }

    return false;
  }
}


