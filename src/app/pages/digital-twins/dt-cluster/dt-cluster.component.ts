import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
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

export class DtClusterComponent implements AfterViewInit {
  @Input('cmp') companies: Companies[] | undefined;
  @Input('clusters') clusters: any | undefined;
  @ViewChild('picklist') picklist: any;
  @ViewChild('panel') panel: any;
  @Output() returnCluster: EventEmitter<Cluster> = new EventEmitter<Cluster>()

  clusterName: any = '';
  selectedCluster: ClusterObject | undefined;
  clusterCompanies: Companies[] = [];
  filteredClusters: any[] = [];
  targetHeight: number | undefined = 1000;

  onSave = () => {

    // Picklist ngModel will either be a string if its a new cluster OR could be an object from the already created clusters
    const clusterNameFromStringOrObject = typeof this.clusterName === 'string' ? this.clusterName.toLowerCase() : (this.clusterName as any)?.name?.toLowerCase()

    // Check if the cluster already exists as string or object
    const existingCluster = this.clusters?.find(
      (cluster: ClusterObject) => cluster.name.toLowerCase() === clusterNameFromStringOrObject
    );


     if (existingCluster) {
        this.returnCluster.emit({
          id: existingCluster.id,
          name: existingCluster.name,
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

    this.filteredClusters = this.clusters?.filter(
      (cluster: ClusterObject) => cluster.name.toLowerCase().includes(event.query.toLowerCase())
    ) || [];

    // When typing in a name, it should match instantly if found. IF not found, reset all companies to prevent saving companies on another cluster
    const exactMatch = this.clusters.find(
      (cluster: ClusterObject) => cluster.name.toLowerCase() === event.query.toLowerCase()
    );

    if (exactMatch) {
      this.selectedCluster = exactMatch;
      this.clusterCompanies = exactMatch.companies || []
    } else {
      this.selectedCluster = undefined;
      this.clusterName = event.query;
      this.clusterCompanies = []
    }
  }

  onClusterSelect = (event: any) => {
    if (event && event.value) {
      this.selectedCluster = event.value;
      this.clusterName = event.value.name;
      this.clusterCompanies = event.value.companies || [];
    }
  }

  getTargetHeader = () => {

    // Update Picklist selection name, if cluster exists, use that name. Otherwise take the newly typed in name
    const name = typeof this.clusterName === 'string'
      ? this.clusterName
      : (this.clusterName as any)?.name;

    if (!name) {
      return 'No Cluster Selected'
    }

    return this.selectedCluster ? `${this.selectedCluster.name} Cluster` : `New Cluster: ${name || ''}`

  }

  onClearSelection = () => {
    this.selectedCluster = undefined;
    this.clusterCompanies = [];
    this.clusterName = ''
  }

  ngAfterViewInit() {
    // setTimeout((): void => {
    //   this.targetHeight = this.picklist.el.nativeElement.offsetHeight - 150
    // }, 1000)
  }
}
