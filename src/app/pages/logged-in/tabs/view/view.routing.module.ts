import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewPage } from './view.page';
import {AuthService} from 'src/app/providers/auth.service';

const routes: Routes = [
    {
        path: 'view',
        component: ViewPage,
        children: [
            {
                path: 'requests',
                children: [{
                    path: '',
                    loadChildren: () => import('../../request/company-request-list/company-request-list.module').then(m => m.CompanyRequestListPageModule),
                    data: {
                      name: 'CompanyRequestListPage',
                    }
                }]
            },
            {
                path: 'staff',
                children: [{
                  path: '',
                  loadChildren: () => import('../../candidate/candidate-list/candidate-list.module').then(m => m.CandidateListPageModule),
                  data: {
                    name: 'CandidateListPage'
                  }
                }],
                canActivate: [AuthService]
            },
            {
                path: 'transfer',
                children: [{
                  path: '',
                  loadChildren: () => import('../../transfer/transfer-list/transfer-list.module').then(m => m.TransferListPageModule),
                  data: {
                    name: 'TransferListPage'
                  }
                }],
                canActivate: [AuthService]
            },
            {
                path: '',
                redirectTo: '/view/requests',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/view/requests',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class ViewPageRoutingModule { }
