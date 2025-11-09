# Certificate Verification Demo (React + Express + Mock Ledger)

## Overview
This project is a lightweight demo of a certificate issuance and verification portal.
It uses a mock in-memory ledger (server/mock_ledger.json) to simulate Hyperledger Fabric chaincode behavior.
The frontend is React + Vite with Tailwind for a modern dashboard look.

## Prerequisites
- Node.js (v16+ recommended) and npm
- Git (optional)

## Setup (two terminals)
1. Start the server:
   ```bash
   cd server
   npm install
   npm start
   ```
   Server runs at http://localhost:4000

2. Start the frontend:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Frontend runs at http://localhost:3000 (Vite) and proxies /api to server.

## Notes
- The server stores a demo certificate `CERT1001` in `server/mock_ledger.json`.
- Issuing a certificate computes a SHA-256 file hash on the client and sends it to the server.
- This is a mock environment for learning — replace server endpoints with real Fabric gateway calls when ready.

## Files of interest
- `server/app.js` : Express server with mock ledger endpoints (`/api/issue`, `/api/verify`, `/api/revoke`, `/api/list`)
- `client/src/components/IssueForm.jsx` : issue UI and hash computation
- `client/src/components/VerifyForm.jsx` : verify UI and hash computation
