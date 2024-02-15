import {NgModule} from "@angular/core";
import {NgxAnimationsModule} from "ngx-animations";
import {PanelModule} from "primeng/panel";
import {MessageModule} from "primeng/message";

@NgModule({
  exports: [NgxAnimationsModule, PanelModule, MessageModule],
  imports: [NgxAnimationsModule, PanelModule]
})

export class SharedModules {}

