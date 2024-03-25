import { Component } from '@angular/core';
import {TopPageImgTplComponent} from "../../../_partials/top-page-img-tpl/top-page-img-tpl.component";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-waste-transport',
  standalone: true,
  imports: [
    TopPageImgTplComponent,
    ButtonModule
  ],
  templateUrl: './waste-transport.component.html',
  styleUrl: './waste-transport.component.scss'
})
export class WasteTransportComponent {

}
