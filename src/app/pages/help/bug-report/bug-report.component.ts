import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from "@angular/common";
import {SharedComponents} from "../../envirotrack/shared-components";
import {uploadFiles} from "@directus/sdk";

@Component({
  selector: 'app-bug-report',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    SharedComponents,
    NgForOf
  ],
  templateUrl: './bug-report.component.html',
  styleUrl: './bug-report.component.scss'
})
export class BugReportComponent implements OnInit {

  myForm!: FormGroup;
  uploadedFiles: any = [];

  constructor(private fb: FormBuilder) {}




  uploadHandler = (event: any) => {
      // this.uploadFiles.forEach((file: any) => this.myForm.append('screenshots', file))
  }

  onSubmit(form: FormGroup) {

    console.log(this.uploadedFiles)
    console.log('valid?', form.valid)
    console.log(form.value);

    // Submit to db
    // Redirect user
  }

  ngOnInit(){
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      issue: ['', Validators.required],
      stepsToReproduce: '',
      screenshots: [],
      deviceUsed: '',
      browserUsed: ''
    });

  }

}
