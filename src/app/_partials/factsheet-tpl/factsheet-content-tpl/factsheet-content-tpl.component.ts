import {Component, Input} from '@angular/core';
import {DbService} from "../../../_services/db.service";

@Component({
  selector: 'app-factsheet-content-tpl',
  standalone: true,
  imports: [],
  templateUrl: './factsheet-content-tpl.component.html',
  styleUrl: './factsheet-content-tpl.component.scss'
})
export class FactsheetContentTplComponent {
  @Input('content') content: any;


}
