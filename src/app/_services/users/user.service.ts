import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalService} from "../global.service";
import {readItems, readMe, updateItem, updateMe} from "@directus/sdk";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url: string = 'https://app.idni.eco/'
  client: any

  constructor(private http: HttpClient, private global: GlobalService,) {
    this.client = this.global.client
  }

  getCurrentUserData = async () =>{
    const result = await this.client.request(readMe({fields: ['id', 'first_name', 'last_name', 'email','phone_number']}))
    return result
  }

  updateCurrentUserDatails = async (newDetails: {[key: string] : string}) => {
    const {first_name, last_name, email, contact_number: phone_number} = newDetails;

    const result = await this.client.request(updateMe({
      first_name,
      last_name,
      // @ts-ignore
      // Ignore workaround due to phone_number being a custom field on the user database table
      phone_number
    }))

    return result
  }

  getUsersCompany = async () => {
    try {
      const currentUser = await this.getCurrentUserData();
      // @ts-ignore
      const usersCompany = await this.client.request(readItems("companies", {
        fields: ['id', 'name', 'address', 'postcode', 'uprn', 'est_year','employees','turnover', 'sector','sic_code','website_url', 'company_description'],
        filter: {
          "users": {
            "directus_users_id": {
              '_eq': currentUser.id
            }
          }
        }
      }))

      return usersCompany
    } catch {
      console.log('Error fetching companies')
    }
  }

  editUsersCompany = async (companyId: number, updatedFields: {[key: string]: string | number | null}) => {
    try {
      const currentUser = await this.getCurrentUserData()
      // @ts-ignore
      const usersCompany = await this.client.request(updateItem('companies', companyId, {...updatedFields, name: updatedFields.company_name}))
      return usersCompany
    } catch {
      return console.log('Error updating your company')
    }
  }
}
