import { api } from './api';

export interface WalletStats {
  availableBalance: number;
  pendingClearance: number;
  totalLifetimeEarnings: number;
  totalFeesPaid: number;
  commissionRate: number;
}

export interface RequestWithdrawalPayload {
  amount: number;
  payoutMethod: string;
  payoutDetails: {
    accountHolderName?: string;
    bankName?: string;
    accountNumber?: string;
    sortCode?: string;
    iban?: string;
    paypalEmail?: string;
    notes?: string;
  };
}

export interface WithdrawalHistoryItem {
  id: string;
  date: string;
  grossAmount: number;
  feeDeducted: number;
  feePercent: number;
  netAmount: number;
  method: string;
  status: string;
  referenceId: string;
  payoutDetails?: any;
  adminNotes?: string;
}

export const hostWalletService = {
  async getWalletStats(): Promise<WalletStats> {
    const response = await api.get('/hosts/wallet');
    return response.data;
  },

  async requestWithdrawal(payload: RequestWithdrawalPayload) {
    const response = await api.post('/hosts/withdraw', payload);
    return response.data;
  },

  async getWithdrawalHistory(): Promise<WithdrawalHistoryItem[]> {
    const response = await api.get('/hosts/withdrawals');
    return response.data;
  },
};
