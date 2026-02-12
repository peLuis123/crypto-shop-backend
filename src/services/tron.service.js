import pkg from "tronweb";
import dotenv from "dotenv";

dotenv.config();

const { TronWeb } = pkg;

const tronWeb = new TronWeb({
  fullHost: process.env.TRON_NETWORK
});

export const createWallet = async () => {
  return await tronWeb.createAccount();
};

export const getBalance = async (address) => {
  try {
    if (!tronWeb.isAddress(address)) {
      throw new Error("Invalid TRON address");
    }
    const balance = await tronWeb.trx.getBalance(address);
    return tronWeb.fromSun(balance);
  } catch (error) {
    throw error;
  }
};

export const sendTRX = async (privateKey, toAddress, amount) => {
  try {
    const tronWebWithPK = new TronWeb({
      fullHost: process.env.TRON_NETWORK,
      privateKey
    });

    const transaction = await tronWebWithPK.transactionBuilder.sendTrx(
      toAddress,
      tronWebWithPK.toSun(amount)
    );

    const signedTx = await tronWebWithPK.trx.sign(transaction);
    return await tronWebWithPK.trx.sendRawTransaction(signedTx);
  } catch (error) {
    throw error;
  }};