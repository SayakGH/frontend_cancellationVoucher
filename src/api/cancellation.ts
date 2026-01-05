import type {
  CreateCancellationPayload,
  ICreateCancellationResponse,
  IDeleteResponse,
  IGetLatestCancellationResponse,
} from "@/types/cancellationTypes";
import api from "./axios";
export const createCancellationFromInvoice = async (
  id: string,
  payload: CreateCancellationPayload
) => {
  const token = localStorage.getItem("authToken");

  const res = await api.post<ICreateCancellationResponse>(
    `/cancellation/${id}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getLatestCancellations = async () => {
  const token = localStorage.getItem("authToken");

  const res = await api.get<IGetLatestCancellationResponse>(
    `/cancellation/voucher/latest-all`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getCancellationHistory = async (id: string) => {
  const token = localStorage.getItem("authToken");

  const res = await api.get<IGetLatestCancellationResponse>(
    `/cancellation/by-invoice/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const deleteVoucher = async (id: string) => {
  const token = localStorage.getItem("authToken");

  const res = await api.delete<IDeleteResponse>(`/cancellation/latest/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateVoucher = async (
  id: string,
  amountToAdd: Number,
  payment: any
) => {
  const token = localStorage.getItem("authToken");

  const res = await api.post<ICreateCancellationResponse>(
    `/cancellation/add-amount/${id}`,
    { amountToAdd, payment },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
