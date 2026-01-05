import type { INVOICE } from "./invoicsTypes";

export interface CreateCancellationPayload {
  cancellation_charge: number;
  net_return: number;
  already_returned: number;
  yetTB_returned: number;
  payment: {
    mode:
      | "Cash"
      | "UPI"
      | "Bank Transfer"
      | "Cheque"
      | "Others"
      | "Demand Draft";
    bankName: string | null;
    chequeNumber: string | null;
  };
}
export interface CANCELLATION {
  _id: string;
  inv_id: string;

  customer: INVOICE["customer"];
  company: INVOICE["company"];
  items: INVOICE["items"];

  advance: number;

  cancellation_charge: number;
  net_return: number;
  already_returned: number;
  yetTB_returned: number;

  status: "CANCELLED";
  version: number;
  createdAt: string;
}

export interface ICreateCancellationResponse {
  success: boolean;
  message: string;
  data: CANCELLATION;
}

export interface IGetLatestCancellationResponse {
  success: boolean;
  count: number;
  data: CANCELLATION[];
}

export interface IDeleteResponse {
  success: boolean;
  message: string;
}
