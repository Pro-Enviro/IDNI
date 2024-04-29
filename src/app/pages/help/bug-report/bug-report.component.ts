import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-bug-report',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './bug-report.component.html',
  styleUrl: './bug-report.component.scss'
})
export class BugReportComponent implements OnInit {

  myForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  onSubmit(form: FormGroup) {
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
