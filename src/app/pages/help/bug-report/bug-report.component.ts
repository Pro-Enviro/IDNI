import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-bug-report',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './bug-report.component.html',
  styleUrl: './bug-report.component.scss'
})
export class BugReportComponent implements OnInit {

  myForm: FormGroup = new FormGroup({});

  email: FormControl<string | null > = new FormControl('')
  issue: FormControl<string | null > = new FormControl('')
  stepsToReproduce: FormControl<string | null > = new FormControl('')
  screenshots: FormControl<File[] | null > = new FormControl([])
  deviceUsed: FormControl<string | null > = new FormControl('')
  browserUsed: FormControl<string | null > = new FormControl('')

  constructor() {}

  onSubmit(form: FormGroup) {
    console.log(form.value)
  }

  ngOnInit(){
    this.myForm = new FormGroup({
      email: new FormControl(''),
      issue: new FormControl(''),
      stepsToReproduce: new FormControl(''),
      screenshots: new FormControl([]),
      deviceUsed: new FormControl(''),
      browserUsed: new FormControl('')
    });

  }

}
