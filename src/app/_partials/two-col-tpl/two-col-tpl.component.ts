import {Component, Input} from '@angular/core';
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-two-col-tpl',
  standalone: true,
  imports: [
    JsonPipe
  ],
  templateUrl: './two-col-tpl.component.html',
  styleUrl: './two-col-tpl.component.scss'
})
export class TwoColTplComponent {
 @Input('content') content: any;
}
