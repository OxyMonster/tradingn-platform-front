// src/app/core/models/trading.model.ts

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  warning?: string;
  message?: string;
}

// Market Data
export interface MarketPrice {
  symbol: string;
  price: number;
  price_change_24h: number;
  price_change_percent_24h: number;
  high_24h: number;
  low_24h: number;
  volume_24h: number;
  timestamp: string;
}

// Order Book
export interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

// Spot Trading
export interface SpotOrderRequest {
  symbol: string;
  side: 'buy' | 'sell';
  order_type: 'market' | 'limit';
  quantity: number;
  price?: number;
}

export interface SpotOrder {
  id: number;
  user: number;
  symbol: string;
  side: 'buy' | 'sell';
  order_type: 'market' | 'limit';
  status: 'pending' | 'open' | 'filled' | 'cancelled' | 'rejected';
  quantity: number;
  filled_quantity: number;
  price: number;
  average_price?: number;
  fee: number;
  created_at: string;
  updated_at: string;
}

// Margin Trading
export interface MarginPositionRequest {
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  leverage: number;
  stop_loss?: number;
  take_profit?: number;
}

export interface MarginPosition {
  id: number;
  user: number;
  symbol: string;
  side: 'buy' | 'sell';
  status: 'open' | 'closed' | 'liquidated';
  quantity: number;
  entry_price: number;
  exit_price?: number;
  leverage: number;
  margin: number;
  liquidation_price: number;
  stop_loss?: number;
  take_profit?: number;
  pnl: number;
  fees: number;
  opened_at: string;
  closed_at?: string;
}

// Portfolio
export interface PortfolioAsset {
  symbol: string;
  balance: number;
  available_balance: number;
  locked_balance: number;
  usd_value: number;
}

export interface Portfolio {
  total_balance_usd: number;
  total_pnl: number;
  total_pnl_percent: number;
  assets: PortfolioAsset[];
  margin_level?: number;
  used_margin?: number;
  available_margin?: number;
}

// Trade History
export interface Trade {
  id: number;
  order_id: number;
  symbol: string;
  side: 'buy' | 'sell';
  price: number;
  quantity: number;
  fee: number;
  timestamp: string;
}

// Account Balance
export interface Balance {
  asset: string;
  free: number;
  locked: number;
  total: number;
}

// Wallet
export interface Wallet {
  id: number;
  user: number;
  currency: string;
  balance: number;
  available_balance: number;
  locked_balance: number;
  created_at: string;
  updated_at: string;
}

// Transaction
export interface Transaction {
  id: number;
  wallet: number;
  transaction_type: 'deposit' | 'withdrawal' | 'trade' | 'fee' | 'transfer';
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
}

// User Stats
export interface UserStats {
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  total_pnl: number;
  total_fees_paid: number;
  average_trade_size: number;
  largest_win: number;
  largest_loss: number;
}
