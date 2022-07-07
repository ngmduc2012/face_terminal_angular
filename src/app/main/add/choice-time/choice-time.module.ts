import {InjectionToken, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChoiceTimeComponent} from "./choice-time.component";
import {CoreCardModule} from "../../../../@core/components/core-card/core-card.module";
import {NgbDropdownModule, NgbProgressbarModule, NgbTimepickerModule} from "@ng-bootstrap/ng-bootstrap";
import {CardSnippetModule} from "../../../../@core/components/card-snippet/card-snippet.module";
import {ContentHeaderModule} from "../../../layout/components/content-header/content-header.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {CoreCommonModule} from "../../../../@core/common.module";
import {CoreTouchspinModule} from "../../../../@core/components/core-touchspin/core-touchspin.module";
import {ChoiceTimeService} from "./choice-time.service";
import {NgxMaskModule} from "ngx-mask";


@NgModule({
  declarations: [ChoiceTimeComponent],
  imports: [
    CommonModule,
    CoreCommonModule,
    NgSelectModule,
    ContentHeaderModule,
    CardSnippetModule,
    NgbProgressbarModule,
    CoreCardModule,
    CoreTouchspinModule,
    NgbTimepickerModule,
    NgbDropdownModule,
    NgxMaskModule,
  ],
  exports: [
    ChoiceTimeComponent
  ],
  providers: [
    ChoiceTimeService
  ]
})
export class ChoiceTimeModule { }
