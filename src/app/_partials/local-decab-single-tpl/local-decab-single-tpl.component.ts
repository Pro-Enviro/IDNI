import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {TopPageImgTplComponent} from "../top-page-img-tpl/top-page-img-tpl.component";
import {DbService} from "../../_services/db.service";
import {findInputsOnElementWithTag} from "@angular/cdk/schematics";
import {JsonPipe} from "@angular/common";
import {DialogRef} from "@angular/cdk/dialog";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";


@Component({
  selector: 'app-local-decab-single-tpl',
  standalone: true,
  imports: [
    TopPageImgTplComponent,
    JsonPipe
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
    console.log(this.dialogConfig,this.dialog.getInstance(this.ref))
    this.db.getContentFromCollection(`local_decarb/${this.dialog.getInstance(this.ref).data['id']}`, `
?fields=
las.related_local_decarb_id.items.item.title,
las.related_local_decarb_id.items.item.content,
las.related_local_decarb_id.items.item.image
`).subscribe({
      next: (res: any) => {
        this.content = res
        this.content.las = this.content.las[0].related_local_decarb_id.items.map((las_items:any) => las_items.item)


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
