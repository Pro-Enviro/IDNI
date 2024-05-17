import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from "@angular/common";
import {SharedComponents} from "../../envirotrack/shared-components";
import {InputTextareaModule} from "primeng/inputtextarea";
import {DbService} from "../../../_services/db.service";
import {MessageService} from "primeng/api";
import {GlobalService} from "../../../_services/global.service";
import {from} from "rxjs";
import {FileUpload} from "primeng/fileupload";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-bug-report',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    SharedComponents,
    NgForOf,
    InputTextareaModule
  ],
  templateUrl: './bug-report.component.html',
  styleUrl: './bug-report.component.scss'
})
export class BugReportComponent implements OnInit {
  url: string = 'https://app.idni.eco';
  myForm!: FormGroup;
  uploadedFiles: any = [];
  fileIds: string[] = []

  constructor(private fb: FormBuilder,private db: DbService, private msg: MessageService, private global: GlobalService, private http: HttpClient) {}


  uploadHandler = (event: any, fileUpload: FileUpload) => {
    this.uploadedFiles = []
    event.files.forEach((file: any) => this.uploadedFiles.push(file))
    if (this.uploadedFiles.length > 0) {
      const formData = new FormData();
      // Uploading a file requires a certain format before pushed to DB
      // the folder UUID refers to 'bug_report_screenshots' in file repository
      this.uploadedFiles.forEach((file: any) => {
        formData.append('folder', '1367f1b6-f680-4cb9-8eb9-8352f0e715fb')
        formData.append('file[]', file)
      });

        from(this.global.uploadBugReportScreenshots(formData)).subscribe({
        next: (res: any) => {
          if (res.length > 1 ) {
            this.fileIds = res.map((file: any) => file.id);
          } else if (res.id) {
            this.fileIds = res.id
          }
          fileUpload.clear()
        }
      })
    }
  }

  onSubmit(form: FormGroup) {

    if (!form.valid) {
      return this.msg.add({
        severity: 'error',
        detail: 'Email and Issue must be filled in.'
      })
    }

    // Formatting of the api body needs to be different depending on if 1 file was uploaded or multiple
    // this format will attach the fileIds from the pre-uploaded screenshots to the body object
    // direct_files_id is required to make it link correctly
    if (this.uploadedFiles.length === 1 ) {
      this.myForm.patchValue({'files':  [{directus_files_id: this.fileIds}]})
    } else if (this.uploadedFiles.length > 1 && this.uploadedFiles.length < 4) {
      let mappedIds = this.fileIds.map((fileId: string) => {
        return {
          directus_files_id: fileId
        }
      })
      this.myForm.patchValue({'files': mappedIds})
    }

    // Submit to db
    this.db.uploadBugReport(this.myForm.value).subscribe({
      next: (res: any) => {
        this.msg.add({
          severity: 'success',
          detail: 'Bug Report submitted. Thank You.'
        })

        this.sendNotificationToProEnviro()
        this.uploadedFiles = []
        this.myForm.reset()
      },
      error: (error: any) => {
        this.msg.add({
          severity: 'error',
          detail: 'Failed to submit bug report. Please try again.'
        })
      },
    })
  }

  sendNotificationToProEnviro = () => {
    return this.http.post(`${this.url}/Mailer`,{
      subject: 'New Bug Report',
      to: ['it@proenviro.co.uk'], // WIP: Update with correct email address
      template: {
        name: "data_uploaded",
        data: {
          "user": this.myForm.value.email
        }
      },
      "files": [this.fileIds]
    },{responseType: "text"}).subscribe({
      next:(res) => {
        console.log(res)
      },
      error: (error: any) =>console.log(error),
    })
  }

  ngOnInit(){
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      issue: ['', Validators.required],
      files: [],
      steps_to_reproduce: '',
      device_used: '',
      browser: ''
    });

  }


}
