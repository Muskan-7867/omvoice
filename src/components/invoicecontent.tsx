import { InvoiceData, InvoiceItem, Totals } from "@/types";

export const InvoiceContent = ({
  invoiceData,
  date,
  invoiceId,
  currency,
  calculateItemTotal,
  totals,
}: {
  invoiceData: InvoiceData;
  date: string;
  invoiceId: string;
  currency: any;
  calculateItemTotal: (item: InvoiceItem) => number;
  totals: Totals;
}) => (
  <div className="bg-white p-8 md:p-12 min-h-[1122px] flex flex-col justify-between">
    {/* Main Body (Header + Items + Totals) */}
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-slate-200">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-rose-600">OMTEL</span>
            <span className="text-slate-800 text-xl ml-2">
              Digital Technology{" "}
              <span className="font-italic text-sm">EST</span>{" "}
            </span>
          </h1>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">INVOICE</h2>
          <p className="text-slate-600 text-sm">Date: {date}</p>
          <p className="text-slate-600 text-sm">Invoice #: {invoiceId}</p>
        </div>
      </div>

      {/* Company & Client Details */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">
            From:
          </h3>
          <p className="text-slate-700 font-semibold">
            OMTEL Digital Technology <span className="italic">EST</span>
          </p>
          <p className="text-slate-500 text-sm">Y Z BUILDING</p>
          <p className="text-slate-500 text-sm">
            Y Z Building Al Quoz 3 Office B311
          </p>
          <p className="text-slate-500 text-sm">Dubai UAE</p>
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">
            Bill To:
          </h3>
          <p className="text-slate-700 font-semibold">
            {invoiceData.clientName || "Client Name"}
          </p>
          {invoiceData.clientEmail && (
            <p className="text-slate-600 text-sm">{invoiceData.clientEmail}</p>
          )}
          {invoiceData.clientPhone && (
            <p className="text-slate-600 text-sm">{invoiceData.clientPhone}</p>
          )}
          {invoiceData.clientAddress && (
            <p className="text-slate-600 text-sm">
              {invoiceData.clientAddress}
            </p>
          )}
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="text-left py-3 px-4 text-sm font-semibold border border-slate-700">
                Item
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold border border-slate-700">
                Qty
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold border border-slate-700">
                Price
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold border border-slate-700">
                Tax
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold border border-slate-700">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr
                key={item.id}
                className={index % 2 === 0 ? "bg-slate-50" : "bg-white"}
              >
                <td className="py-3 px-4 text-sm text-slate-700 border border-slate-200">
                  {item.productName || "Product"}
                </td>
                <td className="py-3 px-4 text-sm text-slate-700 text-center border border-slate-200">
                  {item.quantity}
                </td>
                <td className="py-3 px-4 text-sm text-slate-700 text-right border border-slate-200">
                  {currency.symbol}
                  {item.price.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-sm text-slate-600 text-right border border-slate-200">
                  {item.tax}%
                </td>
                <td className="py-3 px-4 text-sm text-slate-800 font-semibold text-right border border-slate-200">
                  {currency.symbol}
                  {calculateItemTotal(item).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-full md:w-64 space-y-2">
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span className="text-slate-600">Subtotal:</span>
            <span className="text-slate-800 font-medium">
              {currency.symbol}
              {totals.subtotal}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span className="text-slate-600">Tax Amount:</span>
            <span className="text-slate-800 font-medium">
              {currency.symbol}
              {totals.tax}
            </span>
          </div>
          <div className="flex justify-between py-3 bg-slate-900 text-white px-4 rounded">
            <span className="font-bold">Grand Total:</span>
            <span className="font-bold text-lg">
              {currency.symbol}
              {totals.total}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Section (Bank Details + Footer) */}
    <div className="pt-6 ">
      <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">
        Bank Details:
      </h3>

      <div className="flex items-center gap-2">
        <p className="font-semibold text-black">Bank Name:</p>
        <p className="text-slate-700">{invoiceData.bankName || "Bank Name"}</p>
      </div>

      <div className="flex items-center gap-2">
        <p className="font-semibold text-black">Account Number:</p>
        <p className="text-slate-700">
          {invoiceData.accountNumber || "xxxxxxxx"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <p className="font-semibold text-black">IBAN Number:</p>
        <p className="text-slate-700">{invoiceData.ibanNumber || "xxxxxxxx"}</p>
      </div>
      <div className="flex items-center gap-2">
        <p className="font-semibold text-black">Payment Method:</p>
        <p className="text-slate-700">{invoiceData.paymentMethod || "cash"}</p>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-slate-200 text-center">
        <p className="text-slate-600 text-sm">Thank you for your business!</p>
        <p className="text-slate-500 text-xs mt-2">
          This is a computer-generated invoice and does not require a signature.
        </p>
        <p className="text-slate-500 text-xs mt-1">
          For any queries, contact us at support@omtel.ae
        </p>
      </div>
    </div>
  </div>
);
