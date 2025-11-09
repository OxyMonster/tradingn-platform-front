import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';
import { supportGuard, workerGuard, staffGuard } from './core/guards/role.guard';
import { Client as ClientComponent } from './features/client/client';

export const routes: Routes = [
  // * * * * * Client ROUTES * * * * *
  {
    path: '',
    component: ClientComponent,
    children: [
      // ... your other routes

      {
        path: '',
        redirectTo: 'landing',
        pathMatch: 'full',
      },
      {
        path: 'landing',
        loadComponent: () =>
          import('./features/client/landing/pages/landing/landing').then((m) => m.LandingComponent),
      },
      {
        path: 'trading/markets',
        loadComponent: () =>
          import('./features/client/landing/pages/markets/markets').then((m) => m.MarketsComponent),
      },
      {
        path: 'trading/swap',
        loadComponent: () =>
          import('./features/client/landing/pages/swap/swap').then((m) => m.SwapComponent),
      },

      {
        path: 'trading/tournament',
        loadComponent: () =>
          import('./features/client/landing/pages/tournament/tournament').then(
            (m) => m.TournamentComponent
          ),
      },

      // * * * * * BUY CRYPTO * * * *
      {
        path: 'tools/market-cap',
        loadComponent: () =>
          import('./features/client/landing/pages/market-cap/market-cap').then(
            (m) => m.MarketCapComponent
          ),
      },
      // * * * * * TOOLS * * * * *
      {
        path: 'tools/market-cap',
        loadComponent: () =>
          import('./features/client/landing/pages/market-cap/market-cap').then(
            (m) => m.MarketCapComponent
          ),
      },
      {
        path: 'tools/market-screener',
        loadComponent: () =>
          import('./features/client/landing/pages/market-screener/market-screener').then(
            (m) => m.MarketScreenerComponent
          ),
      },
      {
        path: 'tools/cross-rates',
        loadComponent: () =>
          import('./features/client/landing/pages/cross-rates/cross-rates').then(
            (m) => m.CrossRatesComponent
          ),
      },
      {
        path: 'tools/currency-heat-map',
        loadComponent: () =>
          import('./features/client/landing/pages/currency-heat-map/currency-heat-map').then(
            (m) => m.CurrencyHeatMapComponent
          ),
      },
      {
        path: 'tools/technical-analysis',
        loadComponent: () =>
          import('./features/client/landing/pages/technical-analysis/technical-analysis').then(
            (m) => m.TechnicalAnalysisComponent
          ),
      },

      // * * * * EARN * * *
      {
        path: 'earn/crypto-landing',
        loadComponent: () =>
          import('./features/client/landing/pages/crypto-landing/crypto-landing').then(
            (m) => m.CryptoLandingComponent
          ),
      },

      // * * * * DOCUMENTATION * * *
      {
        path: 'documentation/user-agreement',
        loadComponent: () =>
          import('./features/client/landing/pages/user-agreement/user-agreement').then(
            (m) => m.UserAgreementComponent
          ),
      },
      {
        path: 'documentation/aml-policy',
        loadComponent: () =>
          import('./features/client/landing/pages/aml-policy/aml-policy').then(
            (m) => m.AmlPolicyComponent
          ),
      },
      {
        path: 'documentation/privacy-policy',
        loadComponent: () =>
          import('./features/client/landing/pages/privacy-policy/privacy-policy').then(
            (m) => m.PrivacyPolicyComponent
          ),
      },

      // * * * OUR CARD * * *
      {
        path: 'our-card',
        loadComponent: () =>
          import('./features/client/landing/pages/our-card-overview/our-card-overview').then(
            (m) => m.OurCardOverviewComponent
          ),
      },

      // * * * LOGIN * * *
      {
        path: 'login',
        canActivate: [publicGuard],
        loadComponent: () =>
          import('./features/client/landing/pages/login/login').then((m) => m.LoginComponent),
      },

      // * * * SIGN UP * * *
      {
        path: 'signup',
        canActivate: [publicGuard],
        loadComponent: () =>
          import('./features/client/landing/pages/sign-up/sign-up').then((m) => m.SignUpComponent),
      },

      // * * **  PROFILE * * *
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/client/profile/profile').then((m) => m.ProfileComponent),
        children: [
          {
            path: 'spot/:id',
            loadComponent: () =>
              import('./features/client/profile/pages/trading-terminal/trading-terminal').then(
                (m) => m.TradingTerminalComponent
              ),
          },
          {
            path: 'wallet',
            loadComponent: () =>
              import('./features/client/profile/pages/wallet/wallet-component').then(
                (m) => m.WalletComponent
              ),
          },
          {
            path: 'transactions',
            loadComponent: () =>
              import('./features/client/profile/pages/transactions/transactions').then(
                (m) => m.TransactionsComponent
              ),
            children: [
              {
                path: '',
                redirectTo: 'all-transactions',
                pathMatch: 'full',
              },
              {
                path: 'all-transactions',
                loadComponent: () =>
                  import(
                    './features/client/profile/pages/transactions/components/all-transactions/all-transactions'
                  ).then((m) => m.AllTransactionsComponent),
              },
              {
                path: 'deposits',
                loadComponent: () =>
                  import(
                    './features/client/profile/pages/transactions/components/deposits/deposits'
                  ).then((m) => m.DepositsComponent),
              },
              {
                path: 'earnings',
                loadComponent: () =>
                  import(
                    './features/client/profile/pages/transactions/components/earnings/earnings'
                  ).then((m) => m.EarningsComponent),
              },
              {
                path: 'transfers',
                loadComponent: () =>
                  import(
                    './features/client/profile/pages/transactions/components/transfers/transfers'
                  ).then((m) => m.TransfersComponent),
              },
              {
                path: 'withdrawals',
                loadComponent: () =>
                  import(
                    './features/client/profile/pages/transactions/components/withdrawals/withdrawals'
                  ).then((m) => m.WithdrawalsComponent),
              },
            ],
          },
          {
            path: 'support',
            loadComponent: () =>
              import('./features/admin/support/support').then((m) => m.SupportComponent),
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./features/client/profile/pages/client-settings/settings').then(
                (m) => m.SettingsComponent
              ),
            children: [
              {
                path: 'account-settings',
                loadComponent: () =>
                  import(
                    './features/client/profile/pages/client-settings/components/account-settings/account-settings'
                  ).then((m) => m.AccountSettingsComponent),
              },
              {
                path: 'api-managment',
                loadComponent: () =>
                  import(
                    './features/client/profile/pages/client-settings/components/api-managment/api-managment'
                  ).then((m) => m.ApiManagmentComponent),
              },
              {
                path: 'identity-verification',
                loadComponent: () =>
                  import(
                    './features/client/profile/pages/client-settings/components/identity-verification/identity-verification'
                  ).then((m) => m.IdentityVerificationComponent),
              },
              {
                path: 'mobile-app',
                loadComponent: () =>
                  import(
                    './features/client/profile/pages/client-settings/components/mobile-app/mobile-app'
                  ).then((m) => m.MobileAppComponent),
              },
              {
                path: 'promo-codes',
                loadComponent: () =>
                  import(
                    './features/client/profile/pages/client-settings/components/promo-codes/promo-codes'
                  ).then((m) => m.PromoCodesComponent),
              },
              {
                path: 'referal-program',
                loadComponent: () =>
                  import(
                    './features/client/profile/pages/client-settings/components/refferal-program/refferal-program'
                  ).then((m) => m.RefferalProgramComponent),
              },
              {
                path: 'security',
                loadComponent: () =>
                  import(
                    './features/client/profile/pages/client-settings/components/security/security'
                  ).then((m) => m.SecurityComponent),
              },
              {
                path: 'wallet-connect',
                loadComponent: () =>
                  import(
                    './features/client/profile/pages/client-settings/components/wallet-connect/wallet-connect'
                  ).then((m) => m.WalletConnectComponent),
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: 'admin-login',
    loadComponent: () =>
      import('./features/admin/admin/components/admin-login/admin-login').then((m) => m.AdminLogin),
  },

  // * * * Admin Panel * * *
  {
    path: 'admin',
    canActivate: [authGuard, staffGuard],
    loadComponent: () => import('./features/admin/admin/admin').then((m) => m.AdminComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },

      {
        path: 'clients',
        loadComponent: () =>
          import('./features/admin/admin/components/admin-clients/admin-clients.component').then(
            (m) => m.AdminClientsComponent
          ),
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('./features/admin/admin/components/admin-workers/admin-workers').then(
            (m) => m.AdminWorkersComponent
          ),
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import(
            './features/admin/admin/components/admin-transactions/admin-transactions.component'
          ).then((m) => m.AdminTransactionsComponent),
        children: [
          {
            path: '',
            redirectTo: 'deposits',
            pathMatch: 'full',
          },
          {
            path: 'deposits',
            loadComponent: () =>
              import(
                './features/admin/admin/components/admin-transactions/pages/admin-transaction-deposits/admin-transaction-deposits'
              ).then((m) => m.AdminTransactionDeposits),
          },
          {
            path: 'transfers',
            loadComponent: () =>
              import(
                './features/admin/admin/components/admin-transactions/pages/admin-transaction-transfers/admin-transaction-transfers'
              ).then((m) => m.AdminTransactionTransfers),
          },
          {
            path: 'withdrawals',
            loadComponent: () =>
              import(
                './features/admin/admin/components/admin-transactions/pages/admin-transaction-withdrawals/admin-transaction-withdrawals'
              ).then((m) => m.AdminTranasctionWithdrawalsComponent),
          },
        ],
      },

      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin/admin/components/admin-users/admin-users').then(
            (m) => m.AdminUsersComponent
          ),
      },

      {
        path: 'workers',
        loadComponent: () =>
          import('./features/admin/admin/components/admin-workers/admin-workers').then(
            (m) => m.AdminWorkersComponent
          ),
      },

      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './features/admin/admin/components/admin-dashboard/admin-dashboard.component'
          ).then((m) => m.AdminDashboardComponent),
      },
      {
        path: 'open-orders',
        loadComponent: () =>
          import('./features/admin/admin/components/admin-open-orders/admin-orders.component').then(
            (m) => m.AdminOrdersComponent
          ),
        children: [
          {
            path: '',
            redirectTo: 'open',
            pathMatch: 'full',
          },
          {
            path: 'open',
            loadComponent: () =>
              import(
                './features/admin/admin/components/admin-open-orders/components/admin-open-orders/admin-open-orders'
              ).then((m) => m.AdminOpenOrdersComponent),
          },
          {
            path: 'history',
            loadComponent: () =>
              import(
                './features/admin/admin/components/admin-open-orders/components/admin-closed-orders/admin-closed-orders'
              ).then((m) => m.AdminClosedOrders),
          },
        ],
      },
    ],
  },

  {
    path: 'worker',
    canActivate: [authGuard, workerGuard],
    loadComponent: () => import('./features/admin/worker/worker').then((m) => m.WorkerComponent),
  },
  {
    path: 'support',
    canActivate: [authGuard, supportGuard],
    loadComponent: () => import('./features/admin/support/support').then((m) => m.SupportComponent),
  },
];
