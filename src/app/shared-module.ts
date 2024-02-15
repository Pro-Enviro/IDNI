import {NgModule} from "@angular/core";
import {NgxAnimationsModule} from "ngx-animations";
import {PanelModule} from "primeng/panel";
import {MessageModule} from "primeng/message";
import {NgxEchartsModule} from "ngx-echarts";

@NgModule({
  exports: [ PanelModule, MessageModule, NgxEchartsModule],
  imports: [ PanelModule, NgxEchartsModule, NgxEchartsModule.forRoot({
    echarts: () => import('echarts')
  })]
})

export class SharedModules {}

