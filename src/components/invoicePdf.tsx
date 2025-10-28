import { CURRENCIES } from "@/data";
import { InvoiceData, InvoiceItem, Totals } from "@/types";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

export const InvoicePDF = ({
  invoiceData,
  totals,
  invoiceId
}: {
  invoiceData: InvoiceData;
  totals: Totals;
  invoiceId: string;
}) => {
  const currency = CURRENCIES[invoiceData.currency];

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#FFFFFF",
      padding: 30,
      paddingTop: 80,
      fontFamily: "Helvetica",
      justifyContent: "space-between",
      minHeight: "100%",
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 30,
      paddingBottom: 20,
      borderBottom: "2px solid #e2e8f0",
    },
    companyName: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 5,
    },
    companySubtitle: {
      fontSize: 12,
      color: "#64748b",
    },
    invoiceTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#1e293b",
      marginBottom: 5,
    },
    invoiceDetails: {
      fontSize: 10,
      color: "#64748b",
    },
    section: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 30,
    },
    fromTo: {
      width: "48%",
    },
    sectionTitle: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#1e293b",
      marginBottom: 10,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    clientName: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#1e293b",
      marginBottom: 3,
    },
    clientDetails: {
      fontSize: 10,
      color: "#64748b",
      marginBottom: 2,
    },
    table: {
      width: "100%",
      marginBottom: 30,
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#0f172a",
      color: "#ffffff",
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    tableRow: {
      flexDirection: "row",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderBottom: "1px solid #e2e8f0",
    },
    tableRowEven: {
      backgroundColor: "#f8fafc",
    },
    tableHeaderText: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#ffffff",
    },
    tableCell: {
      fontSize: 10,
      color: "#475569",
    },
    tableCellBold: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#1e293b",
    },
    colItem: {
      width: "30%",
      textAlign: "left",
    },
    colHsn: {
      width: "15%",
      textAlign: "left",
    },
    colQty: {
      width: "10%",
      textAlign: "center",
    },
    colPrice: {
      width: "15%",
      textAlign: "right",
    },
    colTax: {
      width: "10%",
      textAlign: "right",
    },
    colTotal: {
      width: "20%",
      textAlign: "right",
    },
    totals: {
      width: "40%",
      alignSelf: "flex-end",
      marginBottom: 30,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 6,
      borderBottom: "1px solid #e2e8f0",
    },
    grandTotal: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: "#0f172a",
      color: "#ffffff",
      marginTop: 5,
    },
    footer: {
      marginTop: "auto",
      paddingTop: 20,
      borderTop: "1px solid #e2e8f0",
      textAlign: "center",
    },
    footerText: {
      fontSize: 10,
      color: "#64748b",
      marginBottom: 3,
    },
    officeAddress: {
      fontSize: 10,
      color: "#64748b",
    },
    footerSection: {
      marginTop: "auto",
      // borderTop: '1px solid #e2e8f0',
      paddingTop: 15,
    },
    bankDetails: {
      marginBottom: 15,
    },
    bankRow: {
      flexDirection: "row",
      fontSize: 10,
      marginBottom: 4,
    },
    bankLabel: {
      fontWeight: "bold",
      color: "#1e293b",
      width: 110,
    },
    bankValue: {
      color: "#475569",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Main Content */}
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.companyName}>
                <Text style={{ color: "#e11d48" }}>OMTEL</Text>
                <Text style={{ color: "#1e293b", fontSize: 16 }}>
                  {" "}
                  Digital Technology <Text>EST</Text>{" "}
                </Text>
              </Text>
              <Text style={styles.companySubtitle}>
                Innovative Tech Solutions for a Digital World
              </Text>
            </View>
            <View>
              <Text style={styles.invoiceTitle}>INVOICE</Text>
              <Text style={styles.invoiceDetails}>
                Date: {new Date().toLocaleDateString("en-IN")}
              </Text>
              <Text style={styles.invoiceDetails}>
                Invoice : {invoiceId}
              </Text>
            </View>
          </View>

          {/* Company & Client Details */}
          <View style={styles.section}>
            <View style={styles.fromTo}>
              <Text style={styles.sectionTitle}>From:</Text>
              <Text style={styles.clientName}>
                OMTEL Digital Technology <Text>EST</Text>
              </Text>
              <Text style={styles.officeAddress}>Y Z BUILDING </Text>
              <Text style={styles.officeAddress}>
                Y Z Building Al Quoz 3 Office B311
              </Text>
              <Text style={styles.officeAddress}>Dubai UAE</Text>
              <Text></Text>
            </View>
            <View style={styles.fromTo}>
              <Text style={styles.sectionTitle}>Bill To:</Text>
              <Text style={styles.clientName}>
                {invoiceData.clientName || "Client Name"}
              </Text>
              {invoiceData.clientEmail && (
                <Text style={styles.clientDetails}>
                  {invoiceData.clientEmail}
                </Text>
              )}
              {invoiceData.clientPhone && (
                <Text style={styles.clientDetails}>
                  {invoiceData.clientPhone}
                </Text>
              )}
              {invoiceData.clientAddress && (
                <Text style={styles.clientDetails}>
                  {invoiceData.clientAddress}
                </Text>
              )}
            </View>
          </View>

          {/* Items Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colItem]}>Item</Text>
              <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
              <Text style={[styles.tableHeaderText, styles.colPrice]}>
                Price
              </Text>
              <Text style={[styles.tableHeaderText, styles.colTax]}>Tax</Text>
              <Text style={[styles.tableHeaderText, styles.colTotal]}>
                Total
              </Text>
            </View>

            {invoiceData.items.map((item: InvoiceItem, index: number) => {
              const itemTotal =
                item.price * item.quantity +
                (item.price * item.quantity * item.tax) / 100;
              return (
                <View
                  key={item.id}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? styles.tableRowEven : {},
                  ]}
                >
                  <Text style={[styles.tableCell, styles.colItem]}>
                    {item.productName || "Product"}
                  </Text>
                  <Text style={[styles.tableCell, styles.colQty]}>
                    {item.quantity}
                  </Text>
                  <Text style={[styles.tableCell, styles.colPrice]}>
                    {currency.symbol}
                    {item.price.toFixed(2)}
                  </Text>
                  <Text style={[styles.tableCell, styles.colTax]}>
                    {item.tax}%
                  </Text>
                  <Text style={[styles.tableCellBold, styles.colTotal]}>
                    {currency.symbol}
                    {itemTotal.toFixed(2)}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Totals */}
          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text style={styles.tableCell}>Subtotal:</Text>
              <Text style={styles.tableCell}>
                {currency.symbol}
                {totals.subtotal}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.tableCell}>Tax Amount:</Text>
              <Text style={styles.tableCell}>
                {currency.symbol}
                {totals.tax}
              </Text>
            </View>
            <View style={styles.grandTotal}>
              <Text style={[styles.tableCellBold, { color: "#ffffff" }]}>
                Grand Total:
              </Text>
              <Text
                style={[
                  styles.tableCellBold,
                  { color: "#ffffff", fontSize: 12 },
                ]}
              >
                {currency.symbol}
                {totals.total}
              </Text>
            </View>
          </View>
        </View>

        {/* ======= Bank Details + Footer (Bottom Section) ======= */}
        <View style={styles.footerSection}>
          {/* Bank Details */}
          <View style={styles.bankDetails}>
            <Text style={styles.sectionTitle}>Bank Details:</Text>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>Bank Name:</Text>
              <Text style={styles.bankValue}>
                {invoiceData.bankName || "Bank Name"}
              </Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>Account Number:</Text>
              <Text style={styles.bankValue}>
                {invoiceData.accountNumber || "xxxxxxxx"}
              </Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>IBAN Number:</Text>
              <Text style={styles.bankValue}>
                {invoiceData.ibanNumber || "xxxxxxxx"}
              </Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>Payment Method:</Text>
              <Text style={styles.bankValue}>
                {invoiceData.paymentMethod || "cash"}
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Thank you for your business!</Text>
            <Text style={styles.footerText}>
              This is a computer-generated invoice and does not require a
              signature.
            </Text>
            <Text style={styles.footerText}>
              For any queries, contact us at support@omtel.ae
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
