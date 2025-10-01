import { LoginComponent } from './features/client/login/components/login/login';
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
];
