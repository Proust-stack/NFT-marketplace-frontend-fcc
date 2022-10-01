import React from "react"
import { NFTBalance } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"

export default function myNfts() {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    console.log(typeof account)
    return (
        <div>
            <NFTBalance address={account ? account : ""} chain="goerli" />
        </div>
    )
}
