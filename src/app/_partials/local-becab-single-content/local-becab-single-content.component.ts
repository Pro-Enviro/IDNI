import {AfterViewInit, Component, Input} from '@angular/core';

@Component({
  selector: 'app-local-becab-single-content',
  standalone: true,
  imports: [],
  templateUrl: './local-becab-single-content.component.html',
  styleUrl: './local-becab-single-content.component.scss'
})
export class LocalBecabSingleContentComponent {
  @Input('pageItems') pageItems: any;

}
