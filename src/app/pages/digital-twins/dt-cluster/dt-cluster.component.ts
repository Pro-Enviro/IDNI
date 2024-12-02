import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Cluster, ClusterObject, Companies} from "../../../_services/dt.service";
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

export class DtClusterComponent implements AfterViewInit, OnChanges {
  @Input('cmp') companies: Companies[] | undefined;
  @Input('clusters') clusters: any | undefined;
  @ViewChild('picklist') picklist: any;
  @ViewChild('panel') panel: any;
  @Output() returnCluster: EventEmitter<Cluster> = new EventEmitter<Cluster>()

  clusterName!: string;
  selectedCluster: ClusterObject | undefined;
  clusterCompanies: Companies[] = [];
  filteredClusters: any[] = [];
  targetHeight: number | undefined = 1000;



  onSave = () => {
     if (this.selectedCluster) {
        this.returnCluster.emit({
          id: this.selectedCluster?.id,
          name: this.selectedCluster?.name,
          companies: this.clusterCompanies
        });
      } else {
        this.returnCluster.emit({
          name: this.clusterName,
          companies: this.clusterCompanies
        });
      }
  }

  onSelect = (event: AutoCompleteCompleteEvent) => {

    this.filteredClusters = this.clusters.filter(
      (cluster: ClusterObject) => cluster.name.toLowerCase().includes(event.query.toLowerCase())
    );
  }

  onClusterSelect = (event: any) => {
    this.selectedCluster = event.value;
    this.clusterCompanies = event.value.companies || [];
    console.log('Selected Cluster:', event);
    console.log('Cluster Companies:', this.clusterCompanies);
  }

  getTargetHeader = () => {
    return this.selectedCluster ? `${this.selectedCluster.name} Cluster` : 'New Cluster';
  }

  onClearSelection = () => {
    this.selectedCluster = undefined;
    this.clusterCompanies = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
    if (changes['clusters']) {
      this.filteredClusters = this.clusters || [];
    }
  }

  ngAfterViewInit() {
    // setTimeout((): void => {
    //   this.targetHeight = this.picklist.el.nativeElement.offsetHeight - 150
    // }, 1000)
  }
}
