import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {CoreCommonModule} from '@core/common.module';
import {ContentHeaderModule} from 'app/layout/components/content-header/content-header.module';

import {HomeComponent} from './home.component';
// import {CoreTouchspinModule} from "../../../@core/components/core-touchspin/core-touchspin.module";
import {NgbDropdownModule, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {NgSelectModule} from "@ng-select/ng-select";
import {NouisliderModule} from "ng2-nouislider";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import { DialogComponent } from './dialog/dialog.component';
import {CardSnippetModule} from "../../../@core/components/card-snippet/card-snippet.module";
import {CoreTouchspinModule} from "../../../@core/components/core-touchspin/core-touchspin.module";


const routes = [

    {
        path: 'home',
        component: HomeComponent,
        data: {animation: 'home'}
    }
    ,

];

@NgModule({
    declarations: [ HomeComponent, DialogComponent,

    ],
    imports: [RouterModule.forChild(routes),
        ContentHeaderModule,
        TranslateModule,
        CoreCommonModule,
        // CoreTouchspinModule,
        NgbDropdownModule,
        NgSelectModule,
        NouisliderModule,
        CommonModule,
        FormsModule,

        NgbModule,
        ContentHeaderModule,
        CardSnippetModule,
        CoreTouchspinModule,


    ],
    exports: [ HomeComponent,
    ]
})
export class HomeModule {
}
