import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {CoreCommonModule} from '@core/common.module';
import {ContentHeaderModule} from 'app/layout/components/content-header/content-header.module';

import {HomeComponent} from './home.component';
import {CoreTouchspinModule} from "../../../@core/components/core-touchspin/core-touchspin.module";
import {NgbDropdownModule} from "@ng-bootstrap/ng-bootstrap";
import {NgSelectModule} from "@ng-select/ng-select";
import {NouisliderModule} from "ng2-nouislider";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";


const routes = [

    {
        path: 'home',
        component: HomeComponent,
        data: {animation: 'home'}
    }
    ,

];

@NgModule({
    declarations: [ HomeComponent,

    ],
    imports: [RouterModule.forChild(routes),
        ContentHeaderModule,
        TranslateModule,
        CoreCommonModule,
        CoreTouchspinModule,
        NgbDropdownModule,
        NgSelectModule,
        NouisliderModule,
        CommonModule,
        FormsModule,

    ],
    exports: [ HomeComponent,

    ]
})
export class HomeModule {
}
