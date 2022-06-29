import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ResultComponent} from "./result.component";
import {RouterModule} from "@angular/router";
import {ContentHeaderModule} from "../../layout/components/content-header/content-header.module";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {CoreCommonModule} from "../../../@core/common.module";
import {NgbDropdownModule, NgbPaginationModule, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {CoreCardModule} from "../../../@core/components/core-card/core-card.module";
import {Ng2FlatpickrModule} from "ng2-flatpickr";
import { NgxMaskModule, IConfig } from 'ngx-mask'

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;


const routes = [

  {
    path: 'result',
    component: ResultComponent,
    data: {animation: 'result'}
  }
  ,

];

@NgModule({
  declarations: [ResultComponent],
  imports: [
    NgxMaskModule.forRoot(),
    RouterModule.forChild(routes),
    CommonModule,
    ContentHeaderModule,
    NgxDatatableModule,
    CoreCommonModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbPaginationModule,
    CoreCardModule,
    Ng2FlatpickrModule,
  ]
})
export class ResultModule { }
