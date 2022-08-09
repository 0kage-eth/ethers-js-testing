const { ethers } = require("ethers")

const PRIVATE_KEY = process.env.PRIVATE_KEY
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const MNEMONIC = process.env.MNEMONIC

/**
 * various properties of wallet
 * ///@dev method shows various properties of wallet object in ethers.js
 * wallet inherits from ExternallyOwnedAccount and Signer
 */
const GetWallet = async () => {
    //get wallet
    const provider = new ethers.providers.JsonRpcProvider(RINKEBY_RPC_URL)

    console.log("Wallet inherits from ExternallyOwnedAccount and Signer")
    // define a wallet from Mnemonic
    console.log("wallet can be initiated from menmonic")
    console.log(">const walletFromMnemonic = new ethers.Wallet.fromMnemonic(<MNEMONIC>)")
    const walletFromMnemonic = new ethers.Wallet.fromMnemonic(MNEMONIC)
    console.log("------------")

    // wallet built from mnemonic retains the mnemonic data
    console.log("wallet built from mnemonic retains the mnemonic. Can be accessed by")
    console.log(">walletFromMnemonic.mnemonic")
    console.log("mnemonic", walletFromMnemonic.mnemonic)
    console.log("------------")

    // creates a new wallet instance
    console.log("wallet can be created from private key and provider")
    console.log(">const wallet = new ethers.Wallet(PRIVATE_KEY, provider)")
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    console.log("------------")

    // A wallet created from private key does not have mnemonic
    console.log("wallet built from private key does not house mnemonic")
    console.log(">wallet.mnemonic")
    console.log("returns null")
    console.log("mnemonic of wallet created from private key", wallet.mnemonic)
    console.log("------------")

    console.log(
        "check if wallets match from mnemonic and private key",
        walletFromMnemonic.address == wallet.address
    )
    console.log("------------")
    // wallet only exists for EOA - external owned accounts
    // not applicable for contract accounts

    //get wallet balance
    console.log(
        "get balance of a wallet by calling a async function getBalance()that returns a promise of Big Number"
    )
    console.log(">const walletBalance = await wallet.getBalance()")
    const walletBalance = await wallet.getBalance()
    console.log("------------")

    // get wallet address
    console.log(
        "get address of wallet by calling async function getAddress() that returns a promise of string"
    )
    console.log(">const walletAddress = await wallet.getAddress()")
    const walletAddress = await wallet.getAddress()

    // get gas price
    console.log(
        "get gas price set for wallet by calling async function getGasPrice() that returns a promise of big number"
    )
    console.log("> const gasPriceInEther = ethers.utils.formatEther(await wallet.getGasPrice())")
    const gasPriceInEther = ethers.utils.formatEther(await wallet.getGasPrice())
    console.log("------------")

    // get public key
    const publicKey = wallet.publicKey
    console.log("access public key on a wallet")
    console.log(">const publicKey = wallet.publicKey")
    console.log("wallet public key:", publicKey)
    console.log("------------")

    //get chain ID. We can also get chain ID from wallet
    // we already looked at how to get it from provider by accessing its network
    console.log("access chain ID of network wallet is connected to")
    console.log("wallet has an async function getChainId() that returns promise of a number")
    console.log(">const chainId = await wallet.getChainId()")
    const chainID = await wallet.getChainId()
    console.log("------------")

    // get tx Count of a wallet - this is sent as a noce when sending a txn
    console.log("get number of txns that were initiated by address")
    console.log("note that this number goes as a nonce when we send a transaction")
    console.log(
        "wallet has an async function getTransactionCount() that returns promise of a number"
    )
    console.log("> const numTxns = await wallet.getTransactionCount()")
    const numTxns = await wallet.getTransactionCount()
    console.log("------------")
}
