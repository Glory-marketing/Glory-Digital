"use client";

import { useCallback, useEffect } from "react";
import { useLocale } from "next-intl";

interface InvoiceGeneratorProps {
  project: {
    client_name: string;
    client_email: string;
    project_name: string;
    project_type: string;
    budget: string;
    status: string;
    created_at: string;
    discount_percent?: number;
  };
}

export function InvoiceGenerator({ project }: InvoiceGeneratorProps) {
  const locale = useLocale();
  const isAr = locale === "ar";

  const generateInvoice = useCallback(() => {
    const invoiceNumber = `GLORY-INV-${Date.now()}`;
    const subtotal = parseFloat(project.budget.replace(/[^0-9.]/g, "")) || 0;
    const discount = project.discount_percent || 0;
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = `<!DOCTYPE html>
<html dir="${isAr ? "rtl" : "ltr"}">
<head>
  <meta charset="UTF-8" />
  <title>Invoice - ${project.project_name}</title>
  <style>
    @media print {
      body * { visibility: visible; }
      body { margin: 0; padding: 0; }
      .no-print { display: none !important; }
      @page { margin: 20mm; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      background: #fff;
      color: #111;
      padding: 40px;
      direction: ${isAr ? "rtl" : "ltr"};
    }
    .invoice-header {
      background: linear-gradient(135deg, #BF953F, #FCF6BA, #B38728);
      padding: 32px;
      border-radius: 12px;
      margin-bottom: 32px;
      text-align: center;
    }
    .invoice-header h1 {
      font-size: 28px;
      font-weight: 800;
      color: #000;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .invoice-header p {
      color: #111;
      font-size: 14px;
      margin-top: 4px;
    }
    .invoice-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 2px solid #eee;
      font-size: 13px;
      color: #555;
    }
    .invoice-meta strong { color: #111; }
    .invoice-meta div { line-height: 1.8; }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #BF953F;
      text-transform: uppercase;
      margin-bottom: 8px;
      letter-spacing: 1px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 8px;
    }
    .info-grid .label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-grid .value { font-size: 15px; font-weight: 600; color: #111; margin-top: 2px; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th {
      background: #111;
      color: #fff;
      padding: 12px 16px;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      text-align: ${isAr ? "right" : "left"};
    }
    td {
      padding: 14px 16px;
      border-bottom: 1px solid #eee;
      font-size: 14px;
    }
    td:last-child, th:last-child { text-align: right; }
    .totals { margin-top: 16px; ${isAr ? "text-align: left;" : "text-align: right;"} }
    .totals div { padding: 6px 0; font-size: 14px; }
    .totals .grand-total {
      font-size: 20px;
      font-weight: 800;
      color: #BF953F;
      border-top: 2px solid #BF953F;
      padding-top: 12px;
      margin-top: 8px;
    }
    .footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid #eee;
      text-align: center;
      font-size: 12px;
      color: #888;
    }
    .payment-terms {
      margin-top: 24px;
      padding: 16px 20px;
      background: #f5f5f5;
      border-radius: 8px;
      font-size: 13px;
      color: #555;
    }
    .payment-terms strong { color: #111; }
  </style>
</head>
<body>
  <div class="invoice-header">
    <h1>${isAr ? "وكالة جلوري" : "GLORY AGENCY"}</h1>
    <p>${isAr ? "دعاية وإعلان وتسويق" : "Advertising, Marketing & Development"}</p>
  </div>

  <div class="invoice-meta">
    <div>
      <strong>${isAr ? "رقم الفاتورة" : "Invoice No."}:</strong> ${invoiceNumber}<br>
      <strong>${isAr ? "التاريخ" : "Date"}:</strong> ${new Date(project.created_at).toLocaleDateString(isAr ? "ar-EG" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
    </div>
    <div>
      <strong>${isAr ? "الحالة" : "Status"}:</strong> ${project.status.replace(/_/g, " ")}<br>
      <strong>${isAr ? "تاريخ الفاتورة" : "Invoice Date"}:</strong> ${new Date().toLocaleDateString(isAr ? "ar-EG" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
    </div>
  </div>

  <div class="info-grid">
    <div>
      <div class="section-title">${isAr ? "العميل" : "CLIENT"}</div>
      <div class="label">${isAr ? "الاسم" : "Name"}</div>
      <div class="value">${project.client_name}</div>
      <div class="label" style="margin-top:8px">${isAr ? "البريد الإلكتروني" : "Email"}</div>
      <div class="value">${project.client_email}</div>
    </div>
    <div>
      <div class="section-title">${isAr ? "المشروع" : "PROJECT"}</div>
      <div class="label">${isAr ? "اسم المشروع" : "Project Name"}</div>
      <div class="value">${project.project_name}</div>
      <div class="label" style="margin-top:8px">${isAr ? "النوع" : "Type"}</div>
      <div class="value">${project.project_type}</div>
    </div>
  </div>

  <div class="section-title">${isAr ? "تفاصيل الفاتورة" : "INVOICE DETAILS"}</div>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>${isAr ? "الخدمة" : "Service"}</th>
        <th>${isAr ? "المبلغ" : "Amount"}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>${project.project_name} — ${project.project_type}</td>
        <td>${project.budget}</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <div>${isAr ? "المجموع الفرعي" : "Subtotal"}: <strong>${project.budget}</strong></div>
    ${discount > 0 ? `<div>${isAr ? "الخصم" : "Discount"} (${discount}%): <strong>-${discountAmount.toFixed(2)}</strong></div>` : ""}
    <div class="grand-total">${isAr ? "الإجمالي" : "Total"}: <strong>${total.toFixed(2)}</strong></div>
  </div>

  <div class="payment-terms">
    <strong>${isAr ? "شروط الدفع" : "Payment Terms"}:</strong> ${isAr ? "الدفع خلال 14 يوم" : "Due within 14 days"}
  </div>

  <div class="footer">
    <p>Glory Agency (Advertising & Marketing)</p>
    <p style="margin-top:4px">${isAr ? "شكراً لثقتكم بنا" : "Thank you for your trust"}</p>
  </div>

  <div class="no-print" style="text-align:center;margin-top:32px">
    <button onclick="window.print()" style="padding:12px 32px;background:#BF953F;color:#000;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer">
      ${isAr ? "طباعة" : "Print"}
    </button>
  </div>
</body>
</html>`;

    printWindow.document.write(html);
    printWindow.document.close();
  }, [project, isAr]);

  return (
    <button
      onClick={generateInvoice}
      className="rounded-lg bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] px-6 py-2.5 text-sm font-medium text-black transition-all hover:brightness-110"
    >
      {isAr ? "إنشاء فاتورة" : "Generate Invoice"}
    </button>
  );
}
