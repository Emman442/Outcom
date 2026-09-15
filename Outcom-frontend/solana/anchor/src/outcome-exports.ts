// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import OutcomIDL from '../target/idl/outcom.json'
import type { Outcom } from '../target/types/outcom'

// Re-export the generated IDL and type
export { Outcom, OutcomIDL }

export const SEEKER_PROGRAM_ID= new PublicKey(OutcomIDL.address)

export function getSeekerProgram(provider: AnchorProvider, address?: PublicKey) {
    return new Program({ ...OutcomIDL, address: address ? address.toBase58() : OutcomIDL.address } as Outcom, provider)
}

export function getSeekerProgramId(cluster: Cluster) {
    switch (cluster) {
        case 'devnet':
        case 'testnet':
            // This is the program ID for the Counter program on devnet and testnet.
            return new PublicKey("HiQwzXsHYbUPqmzXsNiTt9ZVGNAWW5HX879KTZwgBsRW")
        case 'mainnet-beta':
        default:
            return SEEKER_PROGRAM_ID
    }
}