import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ListComponent} from "./list.component";
import {RouterModule} from "@angular/router";
import {ContentHeaderModule} from "../../layout/components/content-header/content-header.module";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {CoreCommonModule} from "../../../@core/common.module";
import {NgbDropdownModule, NgbPaginationModule, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";



const routes = [

  {
    path: 'list',
    component: ListComponent,
    data: {animation: 'list'}
  }
  ,

];

@NgModule({
  declarations: [ListComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        ContentHeaderModule,
        NgxDatatableModule,
        CoreCommonModule,
        NgbDropdownModule,
        NgbTooltipModule,
        NgbPaginationModule,

    ]
})

export class ListModule { }
