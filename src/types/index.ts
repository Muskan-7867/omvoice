import { CurrencyCode } from "@/App";

export interface InvoiceItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  tax: number;
}

export interface InvoiceData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  items: InvoiceItem[];
  currency: CurrencyCode;
  bankName: string;
  accountNumber: string;
  ibanNumber: string;
  paymentMethod :string;
}

export interface Totals {
  subtotal: string;
  tax: string;
  total: string;
}