import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from "@angular/common";
import {SharedComponents} from "../../envirotrack/shared-components";
import {InputTextareaModule} from "primeng/inputtextarea";
import {DbService} from "../../../_services/db.service";
import {MessageService} from "primeng/api";
import {GlobalService} from "../../../_services/global.service";
import {from} from "rxjs";

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

  myForm!: FormGroup;
  uploadedFiles: any = [];
  fileIds: string[] = []

  constructor(private fb: FormBuilder,private db: DbService, private msg: MessageService, private global: GlobalService) {}


  uploadHandler = (event: any) => {
    this.uploadedFiles = []
    event.files.forEach((file: any) => this.uploadedFiles.push(file))
    if (this.uploadedFiles.length > 0) {
      const formData = new FormData();
      this.uploadedFiles.forEach((file: any) => {
        formData.append('file[]', file)
      });
      from(this.global.uploadBugReportScreenshots(formData)).subscribe({
        next: (res: any) => {
          console.log(res)
          this.fileIds = res.map((file: any) => file.id);
        }
      })
    }
  }

  onSubmit(form: FormGroup) {

    if (!form.valid) {
      return this.msg.add({
        severity: 'error',
        detail: 'Email and Issue must be filled in.',

      })
    }

    if (this.uploadedFiles.length > 0) {
      this.myForm.patchValue({'screenshots': this.fileIds})
    }

    // Submit to db
    this.db.uploadBugReport(this.myForm.value).subscribe({
      next: (res: any) => {
        console.log(res)
        this.msg.add({
          severity: 'success',
          detail: 'Bug Report submitted. Thank You.'
        })
        this.uploadedFiles = []
        this.myForm.reset()
        // Redirect user?
      },
      error: (error: any) => {
        this.msg.add({
          severity: 'error',
          detail: 'Failed to submit bug report. Please try again.'
        })
      },
    })

  }

  ngOnInit(){
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      issue: ['', Validators.required],
      steps_to_reproduce: '',
      screenshots: [],
      device_used: '',
      browser: ''
    });

  }

}
