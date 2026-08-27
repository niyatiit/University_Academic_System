import ExcelJS from "exceljs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const PDFDocument = require("pdfkit");

// Generate Excel file buffer
export const generateExcel = async (title, columns, rows) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(title);

  sheet.columns = columns.map((col) => ({
    header: col.header,
    key: col.key,
    width: col.width || 20,
  }));

  sheet.getRow(1).font = { bold: true };
  rows.forEach((row) => sheet.addRow(row));

  return await workbook.xlsx.writeBuffer();
};

// Generate PDF file buffer (report style with title/header)
export const generatePDF = (title, columns, rows) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 0, size: "A4", layout: "landscape" });
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const pageWidth = doc.page.width;
    const margin = 30;

    // Colored header band
    doc.rect(0, 0, pageWidth, 90).fill("#1e293b");
    doc
      .fillColor("#ffffff")
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("Academic Payment Portal", margin, 25, { align: "left" });
    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor("#94a3b8")
      .text(title, margin, 55);
    doc
      .fontSize(8)
      .fillColor("#94a3b8")
      .text(`Generated: ${new Date().toLocaleString()}`, margin, 70);

    doc.fillColor("#000000");

    const startX = margin;
    let y = 115;
    const pageWidth2 = doc.page.width - margin * 2;
    const colWidth = pageWidth2 / columns.length;

    // Table header row with background
    doc.rect(startX, y, pageWidth2, 24).fill("#3b82f6");
    doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(9);
    columns.forEach((col, i) => {
      doc.text(col.header, startX + i * colWidth + 6, y + 7, {
        width: colWidth - 10,
        align: "left",
      });
    });
    y += 24;
    doc.fillColor("#000000");

    // Table rows with alternating background
    doc.font("Helvetica").fontSize(8.5);
    rows.forEach((row, rowIndex) => {
      if (y > doc.page.height - margin - 30) {
        doc.addPage({ margin: 0, size: "A4", layout: "landscape" });
        y = margin;
      }

      const rowHeight = 22;
      if (rowIndex % 2 === 0) {
        doc.rect(startX, y, pageWidth2, rowHeight).fill("#f1f5f9");
        doc.fillColor("#000000");
      }

      columns.forEach((col, i) => {
        doc.text(String(row[col.key] ?? ""), startX + i * colWidth + 6, y + 6, {
          width: colWidth - 10,
          align: "left",
        });
      });
      y += rowHeight;
    });

    // Footer line
    doc
      .moveTo(startX, doc.page.height - 30)
      .lineTo(startX + pageWidth2, doc.page.height - 30)
      .strokeColor("#cbd5e1")
      .stroke();
    doc
      .fontSize(7)
      .fillColor("#94a3b8")
      .text("Academic Payment Portal — Confidential Report", startX, doc.page.height - 22);

    doc.end();
  });
};