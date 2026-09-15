import { Connection, PublicKey } from '@solana/web3.js';
import {
  getAssociatedTokenAddressSync,
  getAccount,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from '@solana/spl-token';

export const DEVNET_USDC_MINT = new PublicKey(
  '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
);
export const USDC_DECIMALS = 6;

export async function getDevnetUsdcBalance(
  walletAddress: string,
  connection: Connection = new Connection('https://api.devnet.solana.com', 'confirmed')
): Promise<{
  raw: bigint;
  uiAmount: number;
  ata: string;
}> {
  const owner = new PublicKey(walletAddress);
  const ata = getAssociatedTokenAddressSync(DEVNET_USDC_MINT, owner);

  try {
    const account = await getAccount(connection, ata);
    const raw = account.amount; // bigint, smallest units
    return {
      raw,
      uiAmount: Number(raw) / 10 ** USDC_DECIMALS,
      ata: ata.toBase58(),
    };
  } catch (err) {
    if (
      err instanceof TokenAccountNotFoundError ||
      err instanceof TokenInvalidAccountOwnerError
    ) {
      return { raw: 0n, uiAmount: 0, ata: ata.toBase58() };
    }
    throw err;
  }
}