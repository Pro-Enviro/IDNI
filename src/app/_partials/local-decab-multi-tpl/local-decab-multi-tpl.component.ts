import {Component, Input} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {RouterLink} from "@angular/router";
import {JsonPipe, NgIf} from "@angular/common";
import {DialogModule} from "primeng/dialog";
import {LocalDecabSingleTplComponent} from "../local-decab-single-tpl/local-decab-single-tpl.component";
import {DbService} from "../../_services/db.service";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";


@Component({
  selector: 'app-local-decab-multi-tpl',
  standalone: true,
  imports: [
    ButtonModule,
    RouterLink,
    JsonPipe,
    DialogModule,
    LocalDecabSingleTplComponent,
    NgIf
  ],
  templateUrl: './local-decab-multi-tpl.component.html',
  styleUrl: './local-decab-multi-tpl.component.scss',
  providers: [DialogService, DynamicDialogRef]
})
export class LocalDecabMultiTplComponent {
  @Input('content') content: any;
  id: number | undefined;
  ref: DynamicDialogRef | undefined
  constructor(
    private http: HttpClient,
    private db: DbService,
    private dialog: DialogService,
   ) {}


  getArticle = (id:number) => {
    // console.log(id)
    this.ref = this.dialog.open(LocalDecabSingleTplComponent, {
      data: {
        id: id +1
      }
    })
  }

}
