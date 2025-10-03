export interface CryptoPair {
  id: number;
  symbol: string;
  base_asset: string;
  quote_asset: string;
  display_name: string;
  trading_pair: string;
  icon_url?: string;
  last_price: number;
  price_change_24h: number;
  price_change_percent: number;
  high_24h: number;
  low_24h: number;
  volume_24h: number;
  formatted_price: string;
  formatted_high: string;
  formatted_low: string;
  formatted_volume: string;
  price_change_display: string;
  last_updated: string;
}

export interface MarketData {
  symbol: string;
  last_price: number;
  price_change: number;
  price_change_percent: number;
  high_24h: number;
  low_24h: number;
  volume_24h: number;
  quote_volume_24h: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
