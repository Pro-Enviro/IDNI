import {Component, Input} from '@angular/core';
import {TopPageImgTplComponent} from "../top-page-img-tpl/top-page-img-tpl.component";

@Component({
  selector: 'app-msx-tpl',
  standalone: true,
  imports: [
    TopPageImgTplComponent
  ],
  templateUrl: './msx-tpl.component.html',
  styleUrl: './msx-tpl.component.scss'
})
export class MsxTplComponent {

}
