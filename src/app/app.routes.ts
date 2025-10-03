import { SettingsComponent } from './features/client/profile/components/settings/settings';
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';
import { adminGuard, supportGuard, workerGuard } from './core/guards/role.guard';
import { Client as ClientComponent } from './features/client/client';

export const routes: Routes = [
  // * * * * * Client ROUTES * * * * *
  {
    path: '',
    component: ClientComponent,
    children: [
      {
        path: 'trading',
        loadComponent: () =>
          import('./features/client/profile/pages/trading-terminal').then(
            (m) => m.TradingTerminalComponent
          ),
      },
      {
        path: '',
        redirectTo: 'landing',
        pathMatch: 'full',
      },
      {
        path: 'landing',
        loadComponent: () =>
          import('./features/client/landing/components/landing/landing').then(
            (m) => m.LandingComponent
          ),
      },
      {
        path: 'trading/markets',
        loadComponent: () =>
          import('./features/client/trading/components/markets/markets').then(
            (m) => m.MarketsComponent
          ),
      },
      {
        path: 'trading/swap',
        loadComponent: () =>
          import('./features/client/trading/components/swap/swap').then((m) => m.SwapComponent),
      },
      {
        path: 'trading/spot',
        loadComponent: () =>
          import('./features/client/trading/components/spot/spot').then((m) => m.SpotComponent),
      },
      {
        path: 'trading/margin',
        loadComponent: () =>
          import('./features/client/trading/components/margin/margin').then(
            (m) => m.MarginComponent
          ),
      },
      {
        path: 'trading/tournament',
        loadComponent: () =>
          import('./features/client/trading/components/tournament/tournament').then(
            (m) => m.TournamentComponent
          ),
      },

      // * * * * * BUY CRYPTO * * * *
      {
        path: 'tools/market-cap',
        loadComponent: () =>
          import('./features/client/tools/components/market-cap/market-cap').then(
            (m) => m.MarketCapComponent
          ),
      },
      // * * * * * TOOLS * * * * *
      {
        path: 'tools/market-cap',
        loadComponent: () =>
          import('./features/client/tools/components/market-cap/market-cap').then(
            (m) => m.MarketCapComponent
          ),
      },
      {
        path: 'tools/market-screener',
        loadComponent: () =>
          import('./features/client/tools/components/market-screener/market-screener').then(
            (m) => m.MarketScreenerComponent
          ),
      },
      {
        path: 'tools/cross-rates',
        loadComponent: () =>
          import('./features/client/tools/components/cross-rates/cross-rates').then(
            (m) => m.CrossRatesComponent
          ),
      },
      {
        path: 'tools/currency-heat-map',
        loadComponent: () =>
          import('./features/client/tools/components/currency-heat-map/currency-heat-map').then(
            (m) => m.CurrencyHeatMapComponent
          ),
      },
      {
        path: 'tools/technical-analysis',
        loadComponent: () =>
          import('./features/client/tools/components/technical-analysis/technical-analysis').then(
            (m) => m.TechnicalAnalysisComponent
          ),
      },

      // * * * * EARN * * *
      {
        path: 'earn/crypto-landing',
        loadComponent: () =>
          import('./features/client/earn/components/crypto-landing/crypto-landing').then(
            (m) => m.CryptoLandingComponent
          ),
      },

      // * * * * DOCUMENTATION * * *
      {
        path: 'documentation/user-agreement',
        loadComponent: () =>
          import('./features/client/documentation/components/user-agreement/user-agreement').then(
            (m) => m.UserAgreementComponent
          ),
      },
      {
        path: 'documentation/aml-policy',
        loadComponent: () =>
          import('./features/client/documentation/components/aml-policy/aml-policy').then(
            (m) => m.AmlPolicyComponent
          ),
      },
      {
        path: 'documentation/privacy-policy',
        loadComponent: () =>
          import('./features/client/documentation/components/privacy-policy/privacy-policy').then(
            (m) => m.PrivacyPolicyComponent
          ),
      },

      // * * * OUR CARD * * *
      {
        path: 'our-card',
        loadComponent: () =>
          import('./features/client/our-card/components/our-card-overview/our-card-overview').then(
            (m) => m.OurCardOverviewComponent
          ),
      },

      // * * * LOGIN * * *
      {
        path: 'login',
        canActivate: [publicGuard],
        loadComponent: () =>
          import('./features/client/login/components/login/login').then((m) => m.LoginComponent),
      },

      // * * * SIGN UP * * *
      {
        path: 'signup',
        canActivate: [publicGuard],
        loadComponent: () =>
          import('./features/client/sign-up/components/sign-up/sign-up').then(
            (m) => m.SignUpComponent
          ),
      },

      // * * **  PROFILE * * *
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/client/profile/profile').then((m) => m.ProfileComponent),
        children: [
          {
            path: 'wallet',
            loadComponent: () =>
              import('./features/client/profile/components/wallet/wallet-component').then(
                (m) => m.WalletComponent
              ),
          },
          {
            path: 'transactions',
            loadComponent: () =>
              import('./features/client/profile/components/transactions/transactions').then(
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
                    './features/client/profile/components/transactions/all-transactions/all-transactions'
                  ).then((m) => m.AllTransactionsComponent),
              },
              {
                path: 'deposits',
                loadComponent: () =>
                  import(
                    './features/client/profile/components/transactions/deposits/deposits'
                  ).then((m) => m.DepositsComponent),
              },
              {
                path: 'earnings',
                loadComponent: () =>
                  import(
                    './features/client/profile/components/transactions/earnings/earnings'
                  ).then((m) => m.EarningsComponent),
              },
              {
                path: 'transfers',
                loadComponent: () =>
                  import(
                    './features/client/profile/components/transactions/transfers/transfers'
                  ).then((m) => m.TransfersComponent),
              },
              {
                path: 'withdrawals',
                loadComponent: () =>
                  import(
                    './features/client/profile/components/transactions/withdrawals/withdrawals'
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
              import('./features/client/profile/components/settings/settings').then(
                (m) => m.SettingsComponent
              ),
            children: [
              {
                path: 'account-settings',
                loadComponent: () =>
                  import(
                    './features/client/profile/components/settings/account-settings/account-settings'
                  ).then((m) => m.AccountSettingsComponent),
              },
              {
                path: 'api-managment',
                loadComponent: () =>
                  import(
                    './features/client/profile/components/settings/api-managment/api-managment'
                  ).then((m) => m.ApiManagmentComponent),
              },
              {
                path: 'identity-verification',
                loadComponent: () =>
                  import(
                    './features/client/profile/components/settings/identity-verification/identity-verification'
                  ).then((m) => m.IdentityVerificationComponent),
              },
              {
                path: 'mobile-app',
                loadComponent: () =>
                  import(
                    './features/client/profile/components/settings/mobile-app/mobile-app'
                  ).then((m) => m.MobileAppComponent),
              },
              {
                path: 'promo-codes',
                loadComponent: () =>
                  import(
                    './features/client/profile/components/settings/promo-codes/promo-codes'
                  ).then((m) => m.PromoCodesComponent),
              },
              {
                path: 'referal-program',
                loadComponent: () =>
                  import(
                    './features/client/profile/components/settings/refferal-program/refferal-program'
                  ).then((m) => m.RefferalProgramComponent),
              },
              {
                path: 'security',
                loadComponent: () =>
                  import('./features/client/profile/components/settings/security/security').then(
                    (m) => m.SecurityComponent
                  ),
              },
              {
                path: 'wallet-connect',
                loadComponent: () =>
                  import(
                    './features/client/profile/components/settings/wallet-connect/wallet-connect'
                  ).then((m) => m.WalletConnectComponent),
              },
            ],
          },
        ],
      },
    ],
  },

  // * * * Admin Panel * * *
  {
    path: 'admin',
    // canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/admin/admin').then((m) => m.AdminComponent),
    children: [
      {
        path: '',
        redirectTo: 'common-domains',
        pathMatch: 'full',
      },
      {
        path: 'common-domains',
        loadComponent: () =>
          import(
            './features/admin/admin/components/admin-common-domains/admin-common-domains'
          ).then((m) => m.AdminCommonDomainsComponent),
      },
      {
        path: 'logs',
        loadComponent: () =>
          import('./features/admin/admin/components/admin-logs/admin-logs').then(
            (m) => m.AdminLogsComponent
          ),
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./features/admin/admin/components/admin-paymnets/admin-paymnets').then(
            (m) => m.AdminPaymnetsComponent
          ),
      },
      {
        path: 'promo-codes',
        loadComponent: () =>
          import('./features/admin/admin/components/admin-promo-codes/admin-promo-codes').then(
            (m) => m.AdminPromoCodesComponent
          ),
      },
      {
        path: 'support',
        loadComponent: () =>
          import('./features/admin/admin/components/admin-support/admin-support').then(
            (m) => m.AdminSupportComponent
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin/admin/components/admin-users/admin-users').then(
            (m) => m.AdminUsersComponent
          ),
      },
      {
        path: 'wallet-connect',
        loadComponent: () =>
          import(
            './features/admin/admin/components/admin-wallet-connect/admin-wallet-connect'
          ).then((m) => m.AdminWalletConnectComponent),
      },
      {
        path: 'withdrawals',
        loadComponent: () =>
          import('./features/admin/admin/components/admin-withdrawals/admin-withdrawals').then(
            (m) => m.AdminWithdrawalsComponent
          ),
      },
      {
        path: 'worker-domains',
        loadComponent: () =>
          import(
            './features/admin/admin/components/admin-worker-domains/admin-worker-domains'
          ).then((m) => m.AdminWorkerDomainsComponent),
      },
      {
        path: 'workers',
        loadComponent: () =>
          import('./features/admin/admin/components/admin-workers/admin-workers').then(
            (m) => m.AdminWorkersComponent
          ),
      },
      {
        path: 'kyc-list',
        loadComponent: () =>
          import('./features/admin/admin/components/kyc-list/kyc-list').then(
            (m) => m.KycListComponent
          ),
      },
      {
        path: 'statistics',
        loadComponent: () =>
          import('./features/admin/admin/components/statistics/statistics').then(
            (m) => m.StatisticsComponent
          ),
      },
      {
        path: 'detailed-statistics',
        loadComponent: () =>
          import('./features/admin/admin/components/detailed-statistics/detailed-statistics').then(
            (m) => m.DetailedStatisticsComponent
          ),
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
