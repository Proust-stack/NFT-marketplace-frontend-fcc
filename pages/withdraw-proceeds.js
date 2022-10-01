import { Form, useNotification, Button, NFTBalance } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import nftAbi from "../constants/BasicNft.json"
import nftMarketplaceAbi from "../constants/NFTMarketplace.json"
import networkMapping from "../constants/networkMapping.json"
import { useEffect, useState } from "react"

export default function WithdrawNFT() {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].nftMarketplace[0]
    const dispatch = useNotification()
    const [proceeds, setProceeds] = useState("0")

    const { runContractFunction } = useWeb3Contract()

    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        setupUI()
    }, [proceeds, account, isWeb3Enabled, chainId])

    async function setupUI() {
        const returnedProceeds = await runContractFunction({
            params: {
                abi: nftMarketplaceAbi,
                contractAddress: marketplaceAddress,
                functionName: "getProceeds",
                params: {
                    seller: account,
                },
            },
            onError: (error) => console.log(error),
        })
        if (returnedProceeds) {
            const withdrawAmount = ethers.utils.formatEther(returnedProceeds.toString())
            setProceeds(Number(withdrawAmount))
        }
    }

    const handleWithdrawSuccess = async (trx) => {
        await trx.wait(1)
        setUpdating(false)
        dispatch({
            type: "success",
            message: "Withdrawing proceeds",
            position: "topR",
        })
    }

    const handleWithdraw = async () => {
        const withdrawOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "withdrawProceeds",
            params: {},
        }
        setUpdating(true)
        await runContractFunction({
            params: withdrawOptions,
            onError: (error) => console.log(error),
            onSuccess: handleWithdrawSuccess,
        })
    }
    return (
        <div className="container mx-auto">
            {isWeb3Enabled ? (
                <>
                    <div>You may withdraw {proceeds} ETH </div>
                    {proceeds != "0" && (
                        <Button
                            onClick={handleWithdraw}
                            text="Withdraw"
                            type="button"
                            theme="primary"
                            isLoading={updating}
                        />
                    )}
                </>
            ) : (
                <div>Web3 Currently Not Enabled</div>
            )}
        </div>
    )
}
