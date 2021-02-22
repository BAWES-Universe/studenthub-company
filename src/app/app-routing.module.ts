import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectiveLoadingStrategy } from './util/SelectiveLoadingStrategy';
// services
import { AuthService } from './providers/auth.service';
import {LoginGuard} from './providers/guards/login-guard.service';


const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'transfer-list',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    loadChildren: () => import('./pages/logged-in/tabs/view/view.module').then(m => m.ViewPageModule),
    canActivate: [AuthService],
    data: {
      name: 'ViewPage',
      preload: true
    }
  },
  {
    path: 'no-internet',
    loadChildren: () => import('./pages/errors/no-internet/no-internet.module').then(m => m.NoInternetPageModule),
    data: {
      name: 'NoInternetPage',
    }
  },
  {
    path: 'server-error',
    loadChildren: () => import('./pages/errors/server-error/server-error.module').then(m => m.ServerErrorPageModule),
    data: {
      name: 'ServerErrorPage',
    }
  },
  {
    path: 'not-found',
    loadChildren: () => import('./pages/errors/not-found/not-found.module').then(m => m.NotFoundPageModule),
    data: {
      name: 'NotFoundPage',
    }
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/start-pages/login/login.module').then(m => m.LoginPageModule),
    canActivate: [LoginGuard],
    data: {
      name: 'LoginPage'
    }
  },
  {
    path: 'change-password',
    loadChildren: () => import('./pages/logged-in/change-password/change-password.module').then(m => m.ChangePasswordPageModule),
    canActivate: [AuthService],
    data: {
      name: 'ChangePasswordPage'
    }
  },
  // {
  //   path: 'candidate-list',
  //   loadChildren: () => import('./pages/logged-in/candidate/candidate-list/candidate-list.module').then(m => m.CandidateListPageModule),
  //   canActivate: [AuthService],
  //   data: {
  //     name: 'CandidateListPage'
  //   }
  // },
  {
    path: 'candidate-view',
    loadChildren: () => import('./pages/logged-in/candidate/candidate-view/candidate-view.module').then(m => m.CandidateViewPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CandidateViewPage'
    }
  },
  {
    path: 'company-list',
    loadChildren: () => import('./pages/logged-in/company/company-list/company-list.module').then(m => m.CompanyListPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CompanyListPage'
    }
  },
  {
    path: 'company-view',
    loadChildren: () => import('./pages/logged-in/company/company-view/company-view.module').then(m => m.CompanyViewPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CompanyViewPage'
    }
  },
  {
    path: 'store-list',
    loadChildren: () => import('./pages/logged-in/store/store-list/store-list.module').then(m => m.StoreListPageModule),
    canActivate: [AuthService],
    data: {
      name: 'StoreListPage'
    }
  },
  {
    path: 'store-view',
    loadChildren: () => import('./pages/logged-in/store/store-view/store-view.module').then(m => m.StoreViewPageModule),
    canActivate: [AuthService],
    data: {
      name: 'StoreViewPage'
    }
  },
  {
    path: 'import-transfer-form',
    loadChildren: () => import('./pages/logged-in/transfer/import-transfer-form/import-transfer-form.module').then(m => m.ImportTransferFormPageModule),
    canActivate: [AuthService],
    data: {
      name: 'ImportTransferFormPage'
    }
  },
  {
    path: 'transfer-form',
    loadChildren: () => import('./pages/logged-in/transfer/transfer-form/transfer-form.module').then(m => m.TransferFormPageModule),
    canActivate: [AuthService],
    data: {
      name: 'TransferFormPage'
    }
  },
  // {
  //   path: 'transfer-list',
  //   loadChildren: () => import('./pages/logged-in/transfer/transfer-list/transfer-list.module').then(m => m.TransferListPageModule),
  //   canActivate: [AuthService],
  //   data: {
  //     name: 'TransferListPage'
  //   }
  // },
  {
    path: 'transfer-view',
    loadChildren: () => import('./pages/logged-in/transfer/transfer-view/transfer-view.module').then(m => m.TransferViewPageModule),
    canActivate: [AuthService],
    data: {
      name: 'TransferViewPage'
    }
  },

  // {
  //   path: 'candidate-search',
  //   loadChildren: () => import('./pages/logged-in/candidate/candidate-search/candidate-search.module').then(m => m.CandidateSearchPageModule),
  //   canActivate: [AuthService],
  //   data: {
  //     name: 'CandidateSearchPage',
  //     navDisable: true,
  //   }
  // },
  // {
  //   path: 'request-list',
  //   loadChildren: () => import('./pages/logged-in/request/company-request-list/company-request-list.module').then(m => m.CompanyRequestListPageModule),
  //   canActivate: [AuthService],
  //   data: {
  //     name: 'CompanyRequestListPage',
  //   }
  // },
  {
    path: 'request-view',
    loadChildren: () => import('./pages/logged-in/request/company-request-view/company-request-view.module').then(m => m.CompanyRequestViewPageModule),
    canActivate: [AuthService],
    data: {
      name: 'CompanyRequestViewPage',
    }
  },
  {
    path: 'request-form',
    loadChildren: () => import('./pages/logged-in/request/request-form/request-form.module').then(m => m.RequestFormPageModule),
    canActivate: [AuthService],
    data: {
      name: 'RequestFormPage',
    }
  },
  {
    path: 'company-contacts',
    loadChildren: () => import('./pages/logged-in/company-contact/company-contact-list/company-contact-list.module').then(m => m.CompanyContactListPageModule),
    canActivate: [AuthService],
    data: {
      name: 'RequestFormPage',
    }
  },
  {
    path: 'update-password/:token',
    loadChildren: () => import('./pages/start-pages/update-password/update-password.module').then(m => m.UpdatePasswordPageModule),
    data: {
      name: 'UpdatePasswordPage',
    }
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/start-pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule),
    data: {
      name: 'ForgotPasswordPage',
    }
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/logged-in/account/account.module').then( m => m.AccountPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/start-pages/register/register.module').then(m => m.RegisterPageModule),
    data: {
      name: 'RegisterPage',
      disableMenu: true
    }
  },

  {
    path: 'cv-search',
    loadChildren: () => import('./pages/logged-in/candidate/candidate-search/candidate-search.module').then(m => m.CandidateSearchPageModule),
    data: {
      name: 'CandidateSearchPage',
      navDisable: true,
    },
    canActivate: [AuthService]
  },
  {
    path: 'company-edit',
    loadChildren: () => import('./pages/logged-in/company/company-edit/company-edit.module').then( m => m.CompanyEditPageModule)
  },

  {
    path: 'app-error',
    loadChildren: () => import('./pages/errors/app-error/app-error.module').then( m => m.AppErrorPageModule)
  },
  {
    path: '**',
    redirectTo: 'not-found'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: SelectiveLoadingStrategy })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
