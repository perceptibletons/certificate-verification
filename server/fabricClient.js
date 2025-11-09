const path = require('path');
const fs = require('fs');
const { Gateway, Wallets } = require('fabric-network');

async function getContract() {
  const ccpPath = process.env.FABRIC_CCP_PATH || path.resolve(__dirname, 'connection-org1.json');
  if (!fs.existsSync(ccpPath)) {
    throw new Error(`Connection profile not found at ${ccpPath}. Please copy connection-org1.json here.`);
  }
  const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
  const ccp = JSON.parse(ccpJSON);

  const walletPath = process.env.FABRIC_WALLET_PATH || path.join(process.cwd(), 'server', 'wallet');
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const identity = process.env.FABRIC_APP_IDENTITY || 'appUser';
  const gateway = new Gateway();

  // asLocalhost should be false when Fabric runs on another machine
  const asLocalhost = (process.env.FABRIC_AS_LOCALHOST || 'false') === 'true';

  await gateway.connect(ccp, {
    wallet,
    identity,
    discovery: { enabled: false, asLocalhost }
  });

  const channel = process.env.FABRIC_CHANNEL || 'mychannel';
  const chaincode = process.env.FABRIC_CHAINCODE_NAME || 'certificateChaincode';

  const network = await gateway.getNetwork(channel);
  const contract = network.getContract(chaincode);
  return { contract, gateway };
}

module.exports = { getContract };
