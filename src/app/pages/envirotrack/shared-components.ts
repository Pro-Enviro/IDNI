import {NgModule} from "@angular/core";
import {TabViewModule} from "primeng/tabview";
import {ButtonModule} from "primeng/button";
import {ToastModule} from "primeng/toast";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {TooltipModule} from "primeng/tooltip";
import {CalendarModule} from "primeng/calendar";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {MessageModule} from "primeng/message";
import {RippleModule} from "primeng/ripple";
import {DragDropModule} from "primeng/dragdrop";
import {DropdownModule} from "primeng/dropdown";
import {AutoCompleteModule} from "primeng/autocomplete";
import {OrderListModule} from "primeng/orderlist";
import {CardModule} from "primeng/card";
import {CheckboxModule} from "primeng/checkbox";
import {FileUploadModule} from "primeng/fileupload";
import {SelectButtonModule} from "primeng/selectbutton";
import {ToggleButtonModule} from "primeng/togglebutton";
import {MenuModule} from "primeng/menu";
import {PanelModule} from "primeng/panel";


@NgModule({
  exports: [TabViewModule, ButtonModule, ToastModule, ConfirmDialogModule, TooltipModule, CalendarModule,
    InputNumberModule,
    InputTextModule,
    MessageModule,
    RippleModule,
    DragDropModule,
    DropdownModule,
    AutoCompleteModule,
    OrderListModule,
    CardModule,
    CheckboxModule,
    FileUploadModule,
    SelectButtonModule,
    ToggleButtonModule,
    MenuModule,
    PanelModule,
  ],
  imports: [TabViewModule, ButtonModule, ToastModule, ConfirmDialogModule, TooltipModule, CalendarModule,
    InputNumberModule,
    InputTextModule,
    MessageModule,
    RippleModule,
    DragDropModule,
    DropdownModule,
    AutoCompleteModule,
    OrderListModule,
    CardModule,
    CheckboxModule,
    FileUploadModule,
    SelectButtonModule,
    ToggleButtonModule,
    MenuModule,
    PanelModule,

  ]
})

export class SharedComponents {
}

