import {NgModule} from "@angular/core";
import {PanelModule} from "primeng/panel";
import {NgxEchartsModule} from "ngx-echarts";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {TableModule} from "primeng/table";

@NgModule({
  exports: [ TableModule, CommonModule, FormsModule, PanelModule, NgxEchartsModule],
  imports: [ TableModule, FormsModule, CommonModule, PanelModule, NgxEchartsModule, NgxEchartsModule.forRoot({
    echarts: () => import('echarts')
  })]
})

export class SharedModules {}

