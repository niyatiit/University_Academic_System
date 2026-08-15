# Academic Payment Portal

A full-stack **MERN** application to manage examiner remuneration for theory and practical examinations — from recording exam duty payments to storing bank details for disbursement, with department and semester-wise tracking and reporting.

## Overview

Academic institutions need a reliable way to track how much examiners are owed for conducting theory and practical exams, calculate payments automatically based on designation-based rates, and maintain bank details for disbursement — all while avoiding manual spreadsheet errors and duplicate payments.

Academic Payment Portal solves this with a centralized, authenticated web app that automates remuneration calculations, prevents duplicate bank entries, and generates exportable reports.

## Features

- **Authentication** — Secure registration and login with JWT-based sessions and hashed passwords
- **Examiner Management** — Add examiners with designation and per-day rate (auto-creates or updates designation rates)
- **Theory Examination** — Record exam duty days; remuneration (Rate × Days) calculates instantly
- **Practical Examination** — Record duty days, TA, DA, and Honorarium; total calculates instantly as `(Rate × Days) + TA + DA + Honorarium`
- **Bank Details** — Auto-calculated total payable amount per examiner (sum of all Theory + Practical entries), with duplicate account number protection
- **Department & Semester Tracking** — Every Theory/Practical entry is tagged by department (BBA, MBA, BCA, MCA, JMC, B.TECH, BCOM) and semester, with semester range adapting to degree type (1–8 for bachelor's, 1–4 for master's)
- **Summary Reports** — Consolidated, filterable summary view (by department and semester) with grand totals
- **Export to Excel & PDF** — Download Theory, Practical, and Bank Details records as formatted reports
- **Protected Routes** — Dashboard and all data-entry pages are accessible only to authenticated users
- **Field Validation** — Format validation for subject codes, account numbers, and IFSC codes on both client and server

## Tech Stack

**Frontend**
- React (Vite)
- React Router
- Tailwind CSS
- Axios

**Backend**
- Node.js + Express
- MongoDB with Mongoose
- JWT authentication + bcrypt password hashing
- ExcelJS & PDFKit for report generation

## Project Structure

```
Academic_Payment_Portal/
├── Client/          # React frontend
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── context/
│       ├── api/
│       └── utils/
│
└── Server/          # Express backend
    ├── config/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    └── utils/
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd Server
npm install
```

Create a `.env` file in `Server/`:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

Run the server:

```bash
npm run dev
```

### Frontend Setup

```bash
cd Client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`, connecting to the backend at `http://localhost:3000`.

## API Overview

| Module | Base Route | Description |
|---|---|---|
| Auth | `/api/user` | Register, login |
| Examiner | `/api/examiner` | Add/list examiners and designations |
| Theory | `/api/theory` | Add/list theory entries, export Excel/PDF |
| Practical | `/api/practical` | Add/list practical entries, export Excel/PDF |
| Bank | `/api/bank` | Add/list bank details, filtered summary, export PDF |

All routes except register/login require a `Bearer` token in the `Authorization` header.

## Author

Developed by **Niyati Patel**

## License

This project is for educational/institutional use.
