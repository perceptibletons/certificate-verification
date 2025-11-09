const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '10mb'}));

const DATA_FILE = path.join(__dirname, 'mock_ledger.json');

// Load or init mock ledger
let ledger = { certificates: {} };
if (fs.existsSync(DATA_FILE)) {
  try { ledger = JSON.parse(fs.readFileSync(DATA_FILE)); } catch(e){ console.error(e); }
} else {
  // sample certificate
  ledger.certificates['CERT1001'] = {
    certID: 'CERT1001',
    issuer: 'University A',
    studentName: 'Alice Example',
    program: 'B.Tech Computer Science',
    issueDate: '2025-06-15',
    fileHash: 'a1b2c3d4e5f6deadbeef00112233445566778899aabbccddeeff0011223344',
    status: 'active'
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(ledger, null, 2));
}

// Issue certificate (mock chaincode invocation)
app.post('/api/issue', (req, res) => {
  const { certID, issuer, studentName, program, issueDate, fileHash } = req.body;
  if (!certID) return res.status(400).json({ error: 'certID required' });
  if (ledger.certificates[certID]) return res.status(400).json({ error: 'Certificate already exists' });
  ledger.certificates[certID] = { certID, issuer, studentName, program, issueDate, fileHash, status: 'active' };
  fs.writeFileSync(DATA_FILE, JSON.stringify(ledger, null, 2));
  return res.json({ success: true, message: 'Certificate issued', cert: ledger.certificates[certID] });
});

// Verify certificate
app.post('/api/verify', (req, res) => {
  const { certID, hashHex } = req.body;
  if (!certID) return res.status(400).json({ error: 'certID required' });
  const cert = ledger.certificates[certID];
  if (!cert) return res.json({ valid: false, message: 'Certificate not found' });
  if (cert.status !== 'active') return res.json({ valid: false, message: 'Certificate not active ('+cert.status+')' });
  const valid = (cert.fileHash === hashHex);
  return res.json({ valid, cert, message: valid ? '✔ Valid certificate' : '✖ Invalid or tampered' });
});

// Revoke certificate
app.post('/api/revoke', (req, res) => {
  const { certID, reason } = req.body;
  if (!certID) return res.status(400).json({ error: 'certID required' });
  const cert = ledger.certificates[certID];
  if (!cert) return res.status(400).json({ error: 'Certificate not found' });
  cert.status = 'revoked';
  cert.revokedReason = reason || 'unspecified';
  cert.revokedAt = new Date().toISOString();
  fs.writeFileSync(DATA_FILE, JSON.stringify(ledger, null, 2));
  return res.json({ success: true, message: 'Certificate revoked', cert });
});

// List all certificates (for demo)
app.get('/api/list', (req, res) => {
  return res.json({ certificates: ledger.certificates });
});

app.use('/', express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Mock server running on port', PORT));



// --- Fabric routes (optional). Keep mock routes too. ---
try {
  const fabricRoutes = require('./fabricRoutes');
  app.use('/fabric', fabricRoutes);
  console.log('Mounted /fabric routes (Fabric-backed).');
} catch (e) {
  console.log('Fabric routes not mounted (missing deps or files).', e.message);
}
