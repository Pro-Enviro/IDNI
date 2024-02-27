import {AfterViewInit, Component, Input} from '@angular/core';

@Component({
  selector: 'app-content-tpl',
  standalone: true,
  imports: [],
  templateUrl: './content-tpl.component.html',
  styleUrl: './content-tpl.component.scss'
})
export class ContentTplComponent{
  @Input('content') content: any
}
