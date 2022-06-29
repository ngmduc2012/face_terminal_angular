import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AddComponent} from "./add.component";
import {RouterModule} from "@angular/router";
import {NgbDatepickerModule, NgbNavModule} from "@ng-bootstrap/ng-bootstrap";
import {Ng2FlatpickrModule} from "ng2-flatpickr";
import {CoreCommonModule} from "../../../@core/common.module";
import {ContentHeaderModule} from "../../layout/components/content-header/content-header.module";
import {NgSelectModule} from "@ng-select/ng-select";
import { DialogComponent } from './dialog/dialog.component';
import { NgxMaskModule, IConfig } from 'ngx-mask'

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
const routes = [
  {
    path: 'add',
    component: AddComponent,
    data: {animation: 'add'}
  },
];

@NgModule({
  declarations: [AddComponent, DialogComponent],
  imports: [
    NgxMaskModule.forRoot(),
    RouterModule.forChild(routes),
    CommonModule,
    NgbNavModule,
    Ng2FlatpickrModule,
    CoreCommonModule,
    NgbDatepickerModule,
    ContentHeaderModule,
    NgSelectModule,
    NgxMaskModule,
  ]
})
export class AddModule { }
