// core/models/trading.model.ts
export interface TradingAccount {
  id: number;
  account_type: 'spot' | 'margin';
  is_active: boolean;
  balances: Balance[];
  total_balance_usd: number;
  created_at: string;
}

export interface Balance {
  id: number;
  asset: string;
  available: number;
  locked: number;
  borrowed: number;
  total: number;
  usd_value: number;
  updated_at: string;
}

export interface Order {
  id: number;
  symbol: string;
  base_asset: string;
  quote_asset: string;
  order_type: 'market' | 'limit' | 'stop_loss' | 'take_profit';
  side: 'buy' | 'sell';
  quantity: number;
  filled_quantity: number;
  price: number;
  trigger_price?: number;
  status: 'pending' | 'open' | 'partially_filled' | 'filled' | 'cancelled' | 'rejected';
  leverage: number;
  is_margin: boolean;
  fee: number;
  fee_asset: string;
  total_value: number;
  created_at: string;
  updated_at: string;
}

export interface Trade {
  id: number;
  order: number;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  fee: number;
  fee_asset: string;
  executed_at: string;
}

export interface Position {
  id: number;
  symbol: string;
  side: 'long' | 'short';
  quantity: number;
  entry_price: number;
  leverage: number;
  margin: number;
  borrowed: number;
  liquidation_price: number;
  stop_loss?: number;
  take_profit?: number;
  unrealized_pnl: number;
  unrealized_pnl_percentage: number;
  realized_pnl: number;
  margin_ratio: number;
  position_value: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  is_open: boolean;
  opened_at: string;
  closed_at?: string;
}

export interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
