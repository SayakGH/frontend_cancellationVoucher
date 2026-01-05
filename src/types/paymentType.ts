export type PaymentMode =
  | "Cash"
  | "UPI"
  | "Bank Transfer"
  | "Cheque"
  | "Demand Draft"
  | "Others";

export interface IPAYMENT {
  _id: string;
  createdAt: string;
  amount: number;

  payment: {
    mode: PaymentMode;
    bankName?: string | null;
    chequeNumber?: string | null;
  };

  customer: {
    name: string;
    phone: string;
    address: string;
    PAN: string;
    GSTIN?: string;
  };
  cancellation_id?: string;
}

export interface IGetPaymentResponse {
  success: boolean;
  count: number;
  data: IPAYMENT[];
}
