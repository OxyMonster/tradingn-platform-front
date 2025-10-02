import { Routes } from '@angular/router';

export const routes: Routes = [
  // * * * * * TRADING * * * * *

  {
    path: '',
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
      import('./features/client/trading/components/margin/margin').then((m) => m.MarginComponent),
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
    loadComponent: () =>
      import('./features/client/login/components/login/login').then((m) => m.LoginComponent),
  },

  // * * * SIGN UP * * *
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/client/sign-up/components/sign-up/sign-up').then((m) => m.SignUpComponent),
  },

  // * * **  PROFILE * * *
  {
    path: 'profile',
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
          import('./features/client/profile/components/settings/api-managment/api-managment').then(
            (m) => m.ApiManagmentComponent
          ),
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
          import('./features/client/profile/components/settings/mobile-app/mobile-app').then(
            (m) => m.MobileAppComponent
          ),
      },
      {
        path: 'promo-codes',
        loadComponent: () =>
          import('./features/client/profile/components/settings/promo-codes/promo-codes').then(
            (m) => m.PromoCodesComponent
          ),
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
      {
        path: 'wallet',
        loadComponent: () =>
          import('./features/client/profile/components/wallet/wallet-component').then(
            (m) => m.WalletComponent
          ),
      },
    ],
  },
];
