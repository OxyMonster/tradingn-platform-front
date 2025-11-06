import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type OrderType = 'market' | 'limit' | 'stop_limit';
export type OrderSide = 'buy' | 'sell';
export type OrderStatus = 'open' | 'filled' | 'cancelled' | 'partially_filled';

export interface DemoOrder {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  price: number;
  triggerPrice?: number;
  quantity: number;
  filled: number;
  remaining: number;
  total: number;
  fee: number;
  status: OrderStatus;
  createdAt: Date;
  filledAt?: Date;
}

export interface DemoBalance {
  asset: string;
  free: number;
  locked: number;
  total: number;
}

export interface DemoPosition {
  symbol: string;
  quantity: number;
  avgEntryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  realizedPnL: number;
}

@Injectable({
  providedIn: 'root',
})
export class DemoTradingService {
  private readonly TRADING_FEE = 0.001; // 0.1% fee
  private readonly INITIAL_BALANCE = 10000; // $10,000 USDT

  // Balances
  private balancesSubject = new BehaviorSubject<Map<string, DemoBalance>>(new Map());
  public balances$ = this.balancesSubject.asObservable();

  // Orders
  private ordersSubject = new BehaviorSubject<DemoOrder[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  // Positions
  private positionsSubject = new BehaviorSubject<DemoPosition[]>([]);
  public positions$ = this.positionsSubject.asObservable();

  // Order history
  private orderHistorySubject = new BehaviorSubject<DemoOrder[]>([]);
  public orderHistory$ = this.orderHistorySubject.asObservable();

  // Total PnL
  private totalPnLSubject = new BehaviorSubject<number>(0);
  public totalPnL$ = this.totalPnLSubject.asObservable();

  constructor() {
    this.initializeBalances();
    this.loadFromLocalStorage();
  }

  private initializeBalances(): void {
    const balances = new Map<string, DemoBalance>();

    // Initialize with demo USDT
    balances.set('USDT', {
      asset: 'USDT',
      free: this.INITIAL_BALANCE,
      locked: 0,
      total: this.INITIAL_BALANCE,
    });

    // Initialize common crypto assets with 0 balance
    ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'DOT'].forEach((asset) => {
      balances.set(asset, {
        asset,
        free: 0,
        locked: 0,
        total: 0,
      });
    });

    this.balancesSubject.next(balances);
  }

  private loadFromLocalStorage(): void {
    try {
      const savedBalances = localStorage.getItem('demo_balances');
      const savedOrders = localStorage.getItem('demo_orders');
      const savedHistory = localStorage.getItem('demo_order_history');
      const savedPositions = localStorage.getItem('demo_positions');

      if (savedBalances) {
        const balancesArray = JSON.parse(savedBalances);
        const balancesMap: any = new Map(balancesArray);
        this.balancesSubject.next(balancesMap);
      }

      if (savedOrders) {
        this.ordersSubject.next(JSON.parse(savedOrders));
      }

      if (savedHistory) {
        this.orderHistorySubject.next(JSON.parse(savedHistory));
      }

      if (savedPositions) {
        this.positionsSubject.next(JSON.parse(savedPositions));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  private saveToLocalStorage(): void {
    try {
      const balancesArray = Array.from(this.balancesSubject.value.entries());
      localStorage.setItem('demo_balances', JSON.stringify(balancesArray));
      localStorage.setItem('demo_orders', JSON.stringify(this.ordersSubject.value));
      localStorage.setItem('demo_order_history', JSON.stringify(this.orderHistorySubject.value));
      localStorage.setItem('demo_positions', JSON.stringify(this.positionsSubject.value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  getBalance(asset: string): DemoBalance | undefined {
    return this.balancesSubject.value.get(asset);
  }

  placeOrder(
    symbol: string,
    side: OrderSide,
    type: OrderType,
    quantity: number,
    price: number,
    triggerPrice?: number
  ): { success: boolean; message: string; orderId?: string } {
    try {
      // Extract base and quote assets (e.g., BTCUSDT -> BTC, USDT)
      const baseAsset = symbol.replace('USDT', '');
      const quoteAsset = 'USDT';

      // Calculate total cost
      const orderPrice = type === 'market' ? price : price;
      const total = quantity * orderPrice;
      const fee = total * this.TRADING_FEE;

      // Check if user has sufficient balance
      if (side === 'buy') {
        const quoteBalance = this.getBalance(quoteAsset);
        if (!quoteBalance || quoteBalance.free < total + fee) {
          return {
            success: false,
            message: `Insufficient ${quoteAsset} balance. Required: ${(total + fee).toFixed(2)}`,
          };
        }
      } else {
        const baseBalance = this.getBalance(baseAsset);
        if (!baseBalance || baseBalance.free < quantity) {
          return {
            success: false,
            message: `Insufficient ${baseAsset} balance. Required: ${quantity}`,
          };
        }
      }

      // Create order
      const order: DemoOrder = {
        id: this.generateOrderId(),
        symbol,
        side,
        type,
        price: orderPrice,
        triggerPrice,
        quantity,
        filled: type === 'market' ? quantity : 0,
        remaining: type === 'market' ? 0 : quantity,
        total,
        fee,
        status: type === 'market' ? 'filled' : 'open',
        createdAt: new Date(),
        filledAt: type === 'market' ? new Date() : undefined,
      };

      // Execute order based on type
      if (type === 'market') {
        this.executeMarketOrder(order, baseAsset, quoteAsset);
      } else {
        this.placeLimitOrder(order, baseAsset, quoteAsset);
      }

      this.saveToLocalStorage();

      return {
        success: true,
        message: `Order placed successfully`,
        orderId: order.id,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to place order',
      };
    }
  }

  private executeMarketOrder(order: DemoOrder, baseAsset: string, quoteAsset: string): void {
    const balances = this.balancesSubject.value;

    if (order.side === 'buy') {
      // Deduct USDT
      const quoteBalance = balances.get(quoteAsset)!;
      quoteBalance.free -= order.total + order.fee;
      quoteBalance.total = quoteBalance.free + quoteBalance.locked;

      // Add base asset
      const baseBalance = balances.get(baseAsset) || {
        asset: baseAsset,
        free: 0,
        locked: 0,
        total: 0,
      };
      baseBalance.free += order.quantity;
      baseBalance.total = baseBalance.free + baseBalance.locked;
      balances.set(baseAsset, baseBalance);
    } else {
      // Deduct base asset
      const baseBalance = balances.get(baseAsset)!;
      baseBalance.free -= order.quantity;
      baseBalance.total = baseBalance.free + baseBalance.locked;

      // Add USDT (minus fee)
      const quoteBalance = balances.get(quoteAsset)!;
      quoteBalance.free += order.total - order.fee;
      quoteBalance.total = quoteBalance.free + quoteBalance.locked;
    }

    this.balancesSubject.next(balances);

    // Add to history
    const history = this.orderHistorySubject.value;
    history.unshift(order);
    this.orderHistorySubject.next(history);

    // Update position
    this.updatePosition(order, baseAsset);
  }

  private placeLimitOrder(order: DemoOrder, baseAsset: string, quoteAsset: string): void {
    const balances = this.balancesSubject.value;

    // Lock funds
    if (order.side === 'buy') {
      const quoteBalance = balances.get(quoteAsset)!;
      quoteBalance.free -= order.total + order.fee;
      quoteBalance.locked += order.total + order.fee;
      quoteBalance.total = quoteBalance.free + quoteBalance.locked;
    } else {
      const baseBalance = balances.get(baseAsset)!;
      baseBalance.free -= order.quantity;
      baseBalance.locked += order.quantity;
      baseBalance.total = baseBalance.free + baseBalance.locked;
    }

    this.balancesSubject.next(balances);

    // Add to open orders
    const orders = this.ordersSubject.value;
    orders.unshift(order);
    this.ordersSubject.next(orders);
  }

  cancelOrder(orderId: string): { success: boolean; message: string } {
    const orders = this.ordersSubject.value;
    const orderIndex = orders.findIndex((o) => o.id === orderId);

    if (orderIndex === -1) {
      return { success: false, message: 'Order not found' };
    }

    const order = orders[orderIndex];

    if (order.status !== 'open') {
      return { success: false, message: 'Only open orders can be cancelled' };
    }

    // Unlock funds
    const baseAsset = order.symbol.replace('USDT', '');
    const quoteAsset = 'USDT';
    const balances = this.balancesSubject.value;

    if (order.side === 'buy') {
      const quoteBalance = balances.get(quoteAsset)!;
      quoteBalance.locked -= order.total + order.fee;
      quoteBalance.free += order.total + order.fee;
      quoteBalance.total = quoteBalance.free + quoteBalance.locked;
    } else {
      const baseBalance = balances.get(baseAsset)!;
      baseBalance.locked -= order.quantity;
      baseBalance.free += order.quantity;
      baseBalance.total = baseBalance.free + baseBalance.locked;
    }

    this.balancesSubject.next(balances);

    // Update order status
    order.status = 'cancelled';
    orders.splice(orderIndex, 1);
    this.ordersSubject.next(orders);

    // Add to history
    const history = this.orderHistorySubject.value;
    history.unshift(order);
    this.orderHistorySubject.next(history);

    this.saveToLocalStorage();

    return { success: true, message: 'Order cancelled successfully' };
  }

  // Simulate limit order fill when price is reached
  checkAndFillLimitOrders(currentPrice: number, symbol: string): void {
    const orders = this.ordersSubject.value;
    const ordersToFill = orders.filter((order) => {
      if (order.symbol !== symbol || order.status !== 'open') return false;

      if (order.type === 'limit') {
        if (order.side === 'buy' && currentPrice <= order.price) return true;
        if (order.side === 'sell' && currentPrice >= order.price) return true;
      }

      if (order.type === 'stop_limit' && order.triggerPrice) {
        if (order.side === 'buy' && currentPrice >= order.triggerPrice) return true;
        if (order.side === 'sell' && currentPrice <= order.triggerPrice) return true;
      }

      return false;
    });

    ordersToFill.forEach((order) => {
      const baseAsset = order.symbol.replace('USDT', '');
      const quoteAsset = 'USDT';

      // Update order
      order.filled = order.quantity;
      order.remaining = 0;
      order.status = 'filled';
      order.filledAt = new Date();

      // Update balances
      const balances = this.balancesSubject.value;

      if (order.side === 'buy') {
        const quoteBalance = balances.get(quoteAsset)!;
        quoteBalance.locked -= order.total + order.fee;
        quoteBalance.total = quoteBalance.free + quoteBalance.locked;

        const baseBalance = balances.get(baseAsset)!;
        baseBalance.free += order.quantity;
        baseBalance.total = baseBalance.free + baseBalance.locked;
        balances.set(baseAsset, baseBalance);
      } else {
        const baseBalance = balances.get(baseAsset)!;
        baseBalance.locked -= order.quantity;
        baseBalance.total = baseBalance.free + baseBalance.locked;

        const quoteBalance = balances.get(quoteAsset)!;
        quoteBalance.free += order.total - order.fee;
        quoteBalance.total = quoteBalance.free + quoteBalance.locked;
      }

      this.balancesSubject.next(balances);

      // Move to history
      const history = this.orderHistorySubject.value;
      history.unshift(order);
      this.orderHistorySubject.next(history);

      // Update position
      this.updatePosition(order, baseAsset);

      // Remove from open orders
      const updatedOrders = this.ordersSubject.value.filter((o) => o.id !== order.id);
      this.ordersSubject.next(updatedOrders);
    });

    if (ordersToFill.length > 0) {
      this.saveToLocalStorage();
    }
  }

  private updatePosition(order: DemoOrder, baseAsset: string): void {
    const positions = this.positionsSubject.value;
    let position = positions.find((p) => p.symbol === order.symbol);

    if (!position) {
      position = {
        symbol: order.symbol,
        quantity: 0,
        avgEntryPrice: 0,
        currentPrice: order.price,
        unrealizedPnL: 0,
        unrealizedPnLPercent: 0,
        realizedPnL: 0,
      };
      positions.push(position);
    }

    if (order.side === 'buy') {
      const totalCost = position.avgEntryPrice * position.quantity + order.total;
      position.quantity += order.quantity;
      position.avgEntryPrice = totalCost / position.quantity;
    } else {
      position.quantity -= order.quantity;
      if (position.quantity === 0) {
        const idx = positions.findIndex((p) => p.symbol === order.symbol);
        positions.splice(idx, 1);
      }
    }

    this.positionsSubject.next(positions);
  }

  updatePositionsPrices(symbol: string, currentPrice: number): void {
    const positions = this.positionsSubject.value;
    const position = positions.find((p) => p.symbol === symbol);

    if (position && position.quantity > 0) {
      position.currentPrice = currentPrice;
      position.unrealizedPnL = (currentPrice - position.avgEntryPrice) * position.quantity;
      position.unrealizedPnLPercent =
        ((currentPrice - position.avgEntryPrice) / position.avgEntryPrice) * 100;
      this.positionsSubject.next(positions);

      // Calculate total PnL
      const totalPnL = positions.reduce((sum, p) => sum + p.unrealizedPnL + p.realizedPnL, 0);
      this.totalPnLSubject.next(totalPnL);
    }
  }

  resetAccount(): void {
    this.initializeBalances();
    this.ordersSubject.next([]);
    this.orderHistorySubject.next([]);
    this.positionsSubject.next([]);
    this.totalPnLSubject.next(0);
    localStorage.removeItem('demo_balances');
    localStorage.removeItem('demo_orders');
    localStorage.removeItem('demo_order_history');
    localStorage.removeItem('demo_positions');
  }

  private generateOrderId(): string {
    return `DEMO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
