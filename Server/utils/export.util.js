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
    const doc = new PDFDocument({ margin: 30, size: "A4", layout: "landscape" });
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    doc.fontSize(16).font("Helvetica-Bold").text("Academic Payment Portal", { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(13).font("Helvetica-Bold").text(title, { align: "center" });
    doc.moveDown(0.3);
    doc
      .fontSize(9)
      .font("Helvetica")
      .text(`Generated on: ${new Date().toLocaleString()}`, { align: "center" });
    doc.moveDown(1);

    const startX = doc.page.margins.left;
    let y = doc.y;
    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const colWidth = pageWidth / columns.length;

    doc.font("Helvetica-Bold").fontSize(9);
    columns.forEach((col, i) => {
      doc.text(col.header, startX + i * colWidth, y, { width: colWidth, align: "left" });
    });
    y += 20;
    doc.moveTo(startX, y - 5).lineTo(startX + pageWidth, y - 5).stroke();

    doc.font("Helvetica").fontSize(8);
    rows.forEach((row) => {
      if (y > doc.page.height - doc.page.margins.bottom - 20) {
        doc.addPage({ margin: 30, size: "A4", layout: "landscape" });
        y = doc.page.margins.top;
      }
      columns.forEach((col, i) => {
        doc.text(String(row[col.key] ?? ""), startX + i * colWidth, y, {
          width: colWidth,
          align: "left",
        });
      });
      y += 18;
    });

    doc.end();
  });
};