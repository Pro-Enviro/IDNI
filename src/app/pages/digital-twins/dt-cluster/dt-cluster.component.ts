import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Cluster, Companies} from "../../../_services/dt.service";
import {PickListModule} from "primeng/picklist";
import {PanelModule} from "primeng/panel";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {JsonPipe, NgClass} from "@angular/common";
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {AnimateOnScrollModule} from "primeng/animateonscroll";
import {DropdownChangeEvent, DropdownModule} from "primeng/dropdown";
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";

@Component({
  selector: 'app-dt-cluster',
  standalone: true,
  imports: [PickListModule, PanelModule, InputTextModule, FormsModule, JsonPipe, CardModule, ButtonModule, NgClass, AnimateOnScrollModule, DropdownModule, AutoCompleteModule],
  templateUrl: './dt-cluster.component.html',
  styleUrl: './dt-cluster.component.scss'
})

export class DtClusterComponent implements AfterViewInit{
  @Input('cmp') companies: Companies[] | undefined;
  @Input('clusters') clusters: any | undefined;
  @ViewChild('picklist') picklist: any;
  @ViewChild('panel') panel: any;
  @Output() returnCluster: EventEmitter<Cluster> = new EventEmitter<Cluster>()

  clusterName!: string;
  clusterCompanies: Companies[] = [];
  targetHeight: number | undefined;

  onSave = () => {
    this.returnCluster.emit({id: this.clusters.filter((x:any) => x.name === this.clusterName)[0].id,name: this.clusterName, companies: this.clusterCompanies})
  }

  onSelect =(event: AutoCompleteCompleteEvent) => {
    if(this.clusters.filter((x:any) => x.name === event.query)){
      this.clusterCompanies = this.clusters.filter((x:any) => x.name === event.query)[0].companies;
    }
  }


  ngAfterViewInit() {
    setTimeout(():void=> {
      this.targetHeight = this.picklist.el.nativeElement.offsetHeight - 150
    },1000)
  }
}
