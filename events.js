const { ethers, Contract } = require("ethers")

require("dotenv").config()

const PRIVATE_KEY = process.env.PRIVATE_KEY
const RECEIVER_PRIVATE_KEY = process.env.PRIVATE_KEY_2
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL

/***
 * @dev - Event emitter methods are tested in current method
 * Listening to events is crucial for a good user experience
 */

const ExploreEventEmitterMethods = async () => {
    // ON-event emitter
    console.log(
        "provider.on(<eventName>,<listener>) adds a listener whenever a event with <eventName> is triggered"
    )
    console.log("<listener> is a callback function")

    const provider = new ethers.providers.JsonRpcProvider(RINKEBY_RPC_URL)
    const senderWallet = new ethers.Wallet(PRIVATE_KEY, provider)
    const receiverWallet = new ethers.Wallet(RECEIVER_PRIVATE_KEY, provider)

    const tx = { to: receiverWallet.address, value: ethers.utils.parseEther("0.001") }

    provider.on("Transfer", () => {
        console.log("Transfer function triggered")
    })

    const txResponse = await senderWallet.sendTransaction(tx)
    const txnReceipt = await txResponse.wait(1)

    console.log("transaction receipt details", txnReceipt)
}
