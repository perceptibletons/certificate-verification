const express = require('express');
const router = express.Router();
const { getContract } = require('./fabricClient');

// Helper to safely disconnect gateway
async function withContract(fn, res) {
  let gateway;
  try {
    const { contract, gateway: g } = await getContract();
    gateway = g;
    const r = await fn(contract);
    await gateway.disconnect();
    return res.json(r);
  } catch (err) {
    if (gateway) try { await gateway.disconnect(); } catch(e) {}
    console.error('Fabric route error', err);
    return res.status(500).json({ error: err.message });
  }
}

router.post('/issue', async (req, res) => {
  const { certID, issuer, studentName, program, issueDate, fileHash } = req.body;
  if (!certID) return res.status(400).json({ error: 'certID is required' });
  return withContract(async (contract) => {
    await contract.submitTransaction('IssueCertificate', certID, issuer || '', studentName || '', program || '', issueDate || '', fileHash || '');
    return { success: true, certID };
  }, res);
});

router.post('/verify', async (req, res) => {
  const { certID } = req.body;
  if (!certID) return res.status(400).json({ error: 'certID is required' });
  return withContract(async (contract) => {
    const result = await contract.evaluateTransaction('VerifyCertificate', certID);
    try {
      return JSON.parse(result.toString());
    } catch (e) {
      return { raw: result.toString() };
    }
  }, res);
});

router.post('/revoke', async (req, res) => {
  const { certID, reason } = req.body;
  if (!certID) return res.status(400).json({ error: 'certID is required' });
  return withContract(async (contract) => {
    await contract.submitTransaction('RevokeCertificate', certID, reason || '');
    return { success: true, certID };
  }, res);
});

router.get('/list', async (req, res) => {
  return withContract(async (contract) => {
    const result = await contract.evaluateTransaction('ListCertificates');
    try {
      return JSON.parse(result.toString());
    } catch (e) {
      return { raw: result.toString() };
    }
  }, res);
});

module.exports = router;
