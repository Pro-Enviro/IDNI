import {NgModule} from "@angular/core";
import {NgxAnimationsModule} from "ngx-animations";
import {PanelModule} from "primeng/panel";
import {MessageModule} from "primeng/message";
import {NgxEchartsModule} from "ngx-echarts";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@NgModule({
  exports: [ CommonModule, FormsModule, PanelModule, MessageModule, NgxEchartsModule],
  imports: [ FormsModule, CommonModule, PanelModule, NgxEchartsModule, NgxEchartsModule.forRoot({
    echarts: () => import('echarts')
  })]
})

export class SharedModules {}

