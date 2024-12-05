import {Injectable} from '@angular/core';
import {authentication, createDirectus, graphql, rest, readMe, uploadFiles, readFolders} from "@directus/sdk";
import {BehaviorSubject, from} from "rxjs";

@Injectable({
  providedIn: 'root',
})

export class Storage {
  get() {
    let ret;
    try {
      ret = JSON.parse(localStorage.getItem("directus-data") || '');
    } catch (error) {
      localStorage.clear()
      window.location.reload()
    }
    return ret
  }

  set(data: any) {
    localStorage.setItem("directus-data", JSON.stringify(data));
  }
}

export class GlobalService {
  role: BehaviorSubject<string> = new BehaviorSubject<any>('User');
  companyAssignedId: BehaviorSubject<number | null> = new BehaviorSubject<any>(null)
  companyName: BehaviorSubject<string | null> = new BehaviorSubject<any>(null)
  isSignedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  selectedMpan: BehaviorSubject<any> = new BehaviorSubject<any>(null)

  public _client: any;
  url: any = `https://app.idni.eco`

  constructor() {
    this.initSession();
  }

  get client() {
    return this._client;
  }

  getCurrentUser = () => {
    return from(this.client.request(readMe({fields: ['email', 'role.name']})))
  }


  updateRole = (value: string) => this.role.next(value);
  updateCompanyId = (value: number) => this.companyAssignedId.next(value)
  updateCompanyName = (value: string) => this.companyName.next(value)
  onSignedIn = this.isSignedIn.asObservable();
  updateSelectedMpan = (value: any) => this.selectedMpan.next(value);

  uploadBugReportScreenshots = async (screenshots: any) => {
    const result = await this.client.request(uploadFiles(screenshots))
    return result;
  }

  uploadDataForCompany = async (dataFiles: any) => {
    const result = await this.client.request(uploadFiles(dataFiles))
    return result
  }

  uploadReportDataForCompany = async (files: any) => {
    const result = await this.client.request(uploadFiles(files))
    return result;
  }

  // Helper function to show folders UUID's
  listDirectusFolders = async () => {
    const result = await this.client.request(readFolders())
    return result;
  }

  initSession = () => {
    const storage: Storage = new Storage()
    this._client = createDirectus('https://app.idni.eco')
      .with(authentication('json', {storage}))
      .with(rest())
      .with(graphql());

  }
}
