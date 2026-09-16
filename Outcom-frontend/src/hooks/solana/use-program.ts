import { useMemo } from "react";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Outcom, OutcomIDL } from "@/solana/anchor/src";

export const useProgram = () => {
    const wallet = useAnchorWallet();
    const { connection } = useConnection();

    const { program, provider } = useMemo(() => {
        if (!wallet?.publicKey) return { program: null, provider: null };

        const provider = new AnchorProvider(connection, wallet, {
            commitment: "confirmed",
        });

        const program = new Program<Outcom>(OutcomIDL, provider);

        return { program, provider };
    }, [connection, wallet]);

    return { program, provider };
};