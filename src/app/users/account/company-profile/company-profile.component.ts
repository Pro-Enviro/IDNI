import { Component } from '@angular/core';
import {AvatarModule} from "primeng/avatar";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputGroupModule} from "primeng/inputgroup";
import {InputTextModule} from "primeng/inputtext";
import {CommonModule, NgIf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SharedModules} from "../../../shared-module";
import {SharedComponents} from "../../../pages/envirotrack/shared-components";
import {UserService} from "../../../_services/users/user.service";
import {GlobalService} from "../../../_services/global.service";
import {readCollection} from "@directus/sdk";
import {from} from "rxjs";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [
    SharedModules,
    SharedComponents,
    CommonModule,
    AvatarModule,
    ButtonModule,
    CardModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputTextModule,
    ReactiveFormsModule,
    SharedModules
  ],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.scss'
})
export class CompanyProfileComponent {

  client?: any
  companyEditForm!: FormGroup
  company: any;

  constructor(private userService: UserService, private fb: FormBuilder, private global: GlobalService, private msg: MessageService) {
    this.client = this.global.client

    this.companyEditForm = this.fb.group({
      company_name: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      postcode: new FormControl('', [Validators.required]),
      employees: new FormControl('', [Validators.required]),
      company_description: new FormControl('', [Validators.required]),
      est_year: new FormControl('', [Validators.required]),
      sector: new FormControl('', [Validators.required]),
      sic_code: new FormControl('', [Validators.required]),
      turnover: new FormControl('', [Validators.required]),
      uprn: new FormControl('', [Validators.required]),
      website_url: new FormControl('', [Validators.required]),
    })

    this.getUsersCompany()
  }


  getUsersCompany = async () => {
    from(this.userService.getUsersCompany()).subscribe({
      next: (res: any) => {
        if (!res.length) return;

        const firstCompany = res[0]
        this.company = firstCompany

        this.companyEditForm.patchValue({
          company_name: firstCompany.name,
          address: firstCompany.address,
          postcode: firstCompany.postcode,
          employees: firstCompany.employees,
          company_description: firstCompany.company_description,
          est_year: firstCompany.est_year,
          sector: firstCompany.sector,
          sic_code: firstCompany.sic_code,
          turnover: firstCompany.turnover,
          uprn: firstCompany.uprn,
          website_url: firstCompany.website_url,
        })

      },
      error: (error :any) => {
        this.msg.add({
          severity: 'error',
          detail: 'Error getting the company'
        })
      }
    })
  }

  editCompanySubmit() {
    from(this.userService.editUsersCompany(this.company.id, this.companyEditForm.value)).subscribe({
      next: (res: any) => {
        this.msg.add({
          severity: 'success',
          detail: 'Company details successfully updated'
        })
      },
      error: (error: any) => {
        this.msg.add({
          severity: 'warn',
          detail: 'Failed to update company details. Please try again.'
        })
      }
    })
  }
}
