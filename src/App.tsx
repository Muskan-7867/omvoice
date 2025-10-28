import "./App.css";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Download } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { InvoiceData, InvoiceItem, Totals } from "./types";
import { InvoicePDF } from "./components/invoicePdf";
import { CURRENCIES } from "./data";
import { InvoiceContent } from "./components/invoicecontent";
import { writeFile } from "@tauri-apps/plugin-fs";
import { save } from "@tauri-apps/plugin-dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select";
import { ScrollArea } from "./components/ui/scroll-area";
import {
  getCurrentInvoiceId,
  incrementInvoiceId,
} from "./lib/utils";

export type CurrencyCode = keyof typeof CURRENCIES;

export default function ProfessionalInvoice() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    currency: "USD",
    bankName: "",
    accountNumber: "",
    ibanNumber: "",
    paymentMethod: "",
    items: [{ id: 1, productName: "", quantity: 1, price: 0, tax: 18 }]
  });
  const [date, setDate] = useState("");
  const [invoiceId, setInvoiceId] = useState("");

  useEffect(() => {
    async function setupInvoice() {
      const id = await getCurrentInvoiceId();
      setInvoiceId(id);
      const currentDate = new Date().toLocaleDateString("en-IN");
      setDate(currentDate);
    }

    setupInvoice();
  }, []);

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        {
          id: Date.now(),
          productName: "",
          quantity: 1,
          price: 0,
          tax: 18
        }
      ]
    });
  };

  const removeItem = (id: number) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData({
        ...invoiceData,
        items: invoiceData.items.filter((item) => item.id !== id)
      });
    }
  };

  const updateItem = (
    id: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  const updateField = (field: keyof InvoiceData, value: string) => {
    setInvoiceData({ ...invoiceData, [field]: value });
  };

  const updateCurrency = (currencyCode: CurrencyCode) => {
    setInvoiceData({ ...invoiceData, currency: currencyCode });
  };

  const calculateItemTotal = (item: InvoiceItem) => {
    const subtotal = item.price * item.quantity;
    const taxAmount = (subtotal * item.tax) / 100;
    return subtotal + taxAmount;
  };

  const calculateTotals = (): Totals => {
    let subtotal = 0;
    let totalTax = 0;

    invoiceData.items.forEach((item) => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;
      totalTax += (itemSubtotal * item.tax) / 100;
    });

    return {
      subtotal: subtotal.toFixed(2),
      tax: totalTax.toFixed(2),
      total: (subtotal + totalTax).toFixed(2)
    };
  };

  const handleDownloadPDF = async () => {
    if (!invoiceData.clientName.trim() || !invoiceData.bankName.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const totals = calculateTotals();
      const blob = await pdf(
        <InvoicePDF
          invoiceData={invoiceData}
          totals={totals}
          invoiceId={invoiceId}
        />
      ).toBlob();

      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Open native save dialog
      const filePath = await save({
        defaultPath: `invoice-${invoiceId}.pdf`,
        filters: [{ name: "PDF Document", extensions: ["pdf"] }]
      });

      if (!filePath) return; // user canceled

      // Write file using Tauri v2 API
      await writeFile(filePath, uint8Array);
      // 🧠 Ask user if they want to refresh the invoice ID
      const shouldRefresh = await confirm(
        "Do you want to generate a new Invoice ID for the next invoice?"
      );
      console.log("from app", shouldRefresh);
      if (shouldRefresh) {
        const newId = await incrementInvoiceId();
        setInvoiceId(newId);
      }
    } catch (err) {
      console.error("❌ Error generating PDF:", err);
      alert("Error saving PDF.");
    }
  };

  const resetForm =  () => {
     setInvoiceData({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    currency: "USD",
    bankName: "",
    accountNumber: "",
    ibanNumber: "",
    paymentMethod: "",
    items: [{ id: 1, productName: "", quantity: 1, price: 0, tax: 18 }]
  })
  }

  const totals = calculateTotals();
  const currency = CURRENCIES[invoiceData.currency];

  return (
    <ScrollArea className="h-screen">
      <div className="min-h-screen  p-4 md:p-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* LEFT: Form */}

          <Card className="border-none ">
            <CardHeader className="">
              <CardTitle className="text-2xl text-primary">
                Invoice Details
              </CardTitle>
              
              <CardAction>
                <Button variant={"ghost"} className="text-red-400" onClick={resetForm}>
                  Clear
                </Button>

              </CardAction>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Company Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm uppercase tracking-wide">
                  Company Information
                </h3>

                <div className="grid gap-3">
                  <div>
                    <Label>Currency</Label>
                    <Select
                      value={invoiceData.currency}
                      onValueChange={(value) =>
                        updateCurrency(value as CurrencyCode)
                      }
                    >
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Select a currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CURRENCIES).map(([code, currency]) => (
                          <SelectItem key={code} value={code}>
                            {currency.symbol} {currency.name} ({currency.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              {/* Client Info */}
              <Card className="space-y-3  p-4 border-none bg-neutral-600/10">
                <h3 className="font-semibold  text-sm uppercase tracking-wide">
                  Client Information
                </h3>
                <div className="grid gap-3">
                  <div>
                    <Label className="">
                      Client Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={invoiceData.clientName}
                      onChange={(e) =>
                        updateField("clientName", e.target.value)
                      }
                      placeholder="Enter client name"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label className="">Email (Optional)</Label>
                    <Input
                      value={invoiceData.clientEmail}
                      onChange={(e) =>
                        updateField("clientEmail", e.target.value)
                      }
                      placeholder="client@example.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="">Phone (Optional)</Label>
                    <Input
                      value={invoiceData.clientPhone}
                      onChange={(e) =>
                        updateField("clientPhone", e.target.value)
                      }
                      placeholder="+91 xxxxx xxxxx"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="">Address (Optional)</Label>
                    <Input
                      value={invoiceData.clientAddress}
                      onChange={(e) =>
                        updateField("clientAddress", e.target.value)
                      }
                      placeholder="Complete address"
                      className="mt-1"
                    />
                  </div>
                </div>
              </Card>

              {/* Bank Info */}
              <Card className="space-y-3  p-4 border-none bg-neutral-600/10">
                <h3 className="font-semibold  text-sm uppercase tracking-wide">
                  Bank Information
                </h3>
                <div className="grid gap-3">
                  <div>
                    <Label className="">
                      Bank Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={invoiceData.bankName}
                      onChange={(e) => updateField("bankName", e.target.value)}
                      placeholder="Enter Bank name"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label className="">Account No</Label>
                    <Input
                      value={invoiceData.accountNumber}
                      onChange={(e) =>
                        updateField("accountNumber", e.target.value)
                      }
                      placeholder="xxxxxxxxxxxxxxxxxxxxxx"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="">IBAN No</Label>
                    <Input
                      value={invoiceData.ibanNumber}
                      onChange={(e) =>
                        updateField("ibanNumber", e.target.value)
                      }
                      placeholder="xxxxxxx xxxxx xxxxx"
                      className="mt-1"
                    />
                  </div>

                  <Select
                    value={invoiceData.paymentMethod}
                    onValueChange={(value) =>
                      updateField("paymentMethod", value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Payment Method</SelectLabel>
                        {/* 💳 Traditional Methods */}
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="debit_card">Debit Card</SelectItem>
                        <SelectItem value="bank_transfer">
                          Bank Transfer (NEFT / RTGS)
                        </SelectItem>

                        {/* 🌐 Digital Wallets */}
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="google_pay">Google Pay</SelectItem>
                        <SelectItem value="apple_pay">Apple Pay</SelectItem>
                        <SelectItem value="phonepe">PhonePe</SelectItem>
                        <SelectItem value="paytm">Paytm</SelectItem>

                        {/* 🪙 Others */}
                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              {/* Items */}
              <div className="space-y-3 pt-4 ">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-primary text-sm uppercase tracking-wide">
                    Items
                  </h3>
                  <Button onClick={addItem} size="sm" className="">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </Button>
                </div>

                {invoiceData.items.map((item, index) => (
                  <Card
                    key={item.id}
                    className="space-y-3  p-4 border-none bg-neutral-600/10"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium ">
                          Item {index + 1}
                        </span>
                        {invoiceData.items.length > 1 && (
                          <Button
                            onClick={() => removeItem(item.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid gap-3">
                        <div>
                          <Label className=" text-xs">Product Name</Label>
                          <Input
                            value={item.productName}
                            onChange={(e) =>
                              updateItem(item.id, "productName", e.target.value)
                            }
                            placeholder="Enter product name"
                            className="mt-1"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label className=" text-xs">Qty</Label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "quantity",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="mt-1"
                              min="1"
                            />
                          </div>
                          <div>
                            <Label className=" text-xs">
                              Price ({currency.symbol})
                            </Label>
                            <Input
                              type="number"
                              value={item.price}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "price",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="mt-1"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <Label className=" text-xs">Tax (%)</Label>
                            <Input
                              type="number"
                              value={item.tax}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "tax",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="mt-1"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div className="text-right text-sm font-semibold text-slate-200">
                          Item Total: {currency.symbol}
                          {calculateItemTotal(item).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* RIGHT: Invoice Preview */}

          <div className="space-y-4  ">
            <InvoiceContent
              invoiceData={invoiceData}
              date={date}
              invoiceId={invoiceId}
              calculateItemTotal={calculateItemTotal}
              currency={currency}
              totals={totals}
            />

            <Button
              onClick={handleDownloadPDF}
              className="rounded-full h-12 w-12 text-lg font-semibold fixed bottom-4 right-4  active:scale-90"
            >
              <Download className="w-5 h-5 " />
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
