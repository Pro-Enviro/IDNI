
import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {TopPageImgTplComponent} from "../top-page-img-tpl/top-page-img-tpl.component";
import {DbService} from "../../_services/db.service";
import {findInputsOnElementWithTag} from "@angular/cdk/schematics";
import {JsonPipe} from "@angular/common";
import {DialogRef} from "@angular/cdk/dialog";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ButtonModule} from "primeng/button";
import moment from "moment/moment";


@Component({
  selector: 'app-local-decab-single-tpl',
  standalone: true,
  imports: [
    TopPageImgTplComponent,
    JsonPipe,
    ButtonModule
  ],
  templateUrl: './local-decab-single-tpl.component.html',
  styleUrl: './local-decab-single-tpl.component.scss',
  providers: [DynamicDialogConfig]
})
export class LocalDecabSingleTplComponent implements OnDestroy{
  @Input('content') content: any;
  @Input('pageItems') pageItems: any;


  constructor(
    private db: DbService,
    private dialogConfig: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private dialog: DialogService
  ) {
    // console.log(this.dialogConfig,this.dialog.getInstance(this.ref).data['id'])
    this.db.getContentFromCollection(`local_decarb/${this.dialog.getInstance(this.ref).data['id']}`, `
?fields=
title,
content,
summary,
idni_logo,
partner_logo,
address,
phone_number,
name,
position,
website,
items.item.title,
items.item.content,
items.item.image,
factsheet_files.factsheet_files_id.name,
factsheet_files.factsheet_files_id.date_published,
factsheet_files.factsheet_files_id.date_range,
factsheet_files.factsheet_files_id.file_size,
factsheet_files.factsheet_files_id.document_link
`).subscribe({
      next: (res: any) => {
        this.content = res
        this.content.items = this.content.items.map((las_item:any) => las_item.item)
        this.content.factsheet_files = this.content.factsheet_files.map((files:any) => files.factsheet_files_id)
        this.content.factsheet_files = this.content.factsheet_files.sort((a:any,b:any) => moment(a.date, "DD/MM/YYYY").toDate().getTime() - moment(b.date,"DD/MM/YYYY").toDate().getTime())
      },

      error: (err: any) => {
        console.error(err)
      }
    })
  }

  ngOnDestroy(): void {
        this.ref.destroy()
    }








}
