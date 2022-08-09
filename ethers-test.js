const { ethers, Contract } = require("ethers")

require("dotenv").config()

const PRIVATE_KEY = process.env.PRIVATE_KEY
const RECEIVER_PRIVATE_KEY = process.env.PRIVATE_KEY_2
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const MNEMONIC = process.env.MNEMONIC
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL
const MESSAGE = "Hey there! Keep building, keep helping, keep growing..."
const AAVE_ADDRESS = "0x465c1118d786dfce554A33ee7Da46a40F8E42da8"
const ENS_NAME = "vitalik.eth"
const VITALIK_ADDRESS = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
const TXN_HASH = "0xecf90bb83b9b67b77e12aa8aecf7096c5881824b956ae5c8ab1301b9705d32f1"
const TRANSFER_TXN_HASH = "0xbb1a7c88bde4e82ece4394bd47632fa9d8be3d92478716ef33bb74d8f10bba2e"

const { ethers, Contract } = require("ethers")



const estimateGas = async (txnDetails, wallet, provider) => {}

//************************* */

//*** Filter methods */
const filterFromTxns = async (abi, wallet, provider) => {
    //eventDetails = {name: "", signature: ""}
}

const filterToTxns = async (abi, wallet, provider) => {}

//*********** */

const getLogs = async (provider, wallet) => {}

//************* Event emitter methods */

//************************ */

//********* Inspection */

const isProvider = (provider) => {
    // check if provider is an abstraction of node
}

//*************** */

//*** Base provider specific methods */

//*** Test JSON RPC Provider methods */
const TestJSONRPCProvider = async () => {}

//************ */

const ethersTesting = async () => {
    console.log("Beginning testing...")

    console.log("Private Key", PRIVATE_KEY)
    console.log("Rinkeby RPC URL", RINKEBY_RPC_URL)

    const provider = new ethers.providers.JsonRpcProvider({ url: RINKEBY_RPC_URL })

    // console.log("provider details", provider)
    // const chainId = provider.network.
    // const networkName = provider.network.name

    // gets the latest block number
    const blockNumber = await provider.getBlockNumber()

    // gets balance in a given wallet address
    //const balance = await provider.getBalance("0xd7Dd548772fF126999a1a02640beFA34C2ce470B")

    // use utils.formatEther() to convert wei to ether
    //const formattedBalance = ethers.utils.formatEther(balance)

    // use parseEther function to convert ether to wei
    //const etherToWei = ethers.utils.parseEther("1")

    // use parseUnit function to convert ether to gwei or wei
    //const etherToWei2 = ethers.utils.parseUnits("1", "ether")

    console.log("block number", blockNumber.toString())
    //console.log("balance", balance.toString())

    //console.log("balance in ETH:", formattedBalance)

    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)

    // const walletBalance = await wallet.getBalance()
    const walletAddress = await wallet.getAddress()
    // const chainId = await wallet.getChainId()
    // const gasPrice = await wallet.getGasPrice()

    // const txnsOnThisAddress = await wallet.getTransactionCount()

    // console.log("wallet balance", walletBalance.toString())
    // console.log("wallet address", walletAddress)
    // console.log("chain id", chainId)
    // console.log("gas price", gasPrice.toString())
    // console.log("txns on this address", txnsOnThisAddress)
    // console.log(`chain ID is ${chainId} and chain Name is ${networkName}`)
    // const signer = await provider.getSigner()

    //signing a message
    // const tx = await wallet.signMessage("Hi. Sushant Here")
    // console.log("signed txn", tx)

    // transfer eth
    // const toAccnt = "0x9dc5e01466D985359dc7e17A21D7EC7B4bbb60E1"

    // const balanceBeforeFromAccnt = await wallet.getBalance()
    // const balanceBeforeToAccnt = await provider.getBalance(toAccnt)

    // console.log(
    //     "from account balance before transfer",
    //     `${ethers.utils.formatEther(balanceBeforeFromAccnt)} ETH`
    // )
    // console.log(
    //     "to account balance before transfer",
    //     `${ethers.utils.formatEther(balanceBeforeToAccnt)} ETH`
    // )

    // const txData = { to: toAccnt, value: ethers.utils.parseEther("0.01") }
    // const transferTx = await wallet.sendTransaction(txData)

    // const transferTxReceipt = await transferTx.wait(1)

    // console.log("transfer receipt", transferTxReceipt)

    // const balanceAfterFromAccnt = await wallet.getBalance()
    // const balanceAfterToAccnt = await provider.getBalance(toAccnt)

    // console.log(
    //     "from account balance after transfer",
    //     `${ethers.utils.formatEther(balanceAfterFromAccnt)} ETH`
    // )
    // console.log(
    //     "to account balance after transfer",
    //     `${ethers.utils.formatEther(balanceAfterToAccnt)} ETH`
    // )

    // Example: filter all events

    // first we define an abi
    const abi = ["event Transfer(address indexed src, address indexed dst, unit val) "]

    // get a contract object - by giving address, abi and provider
    const contract = new Contract(walletAddress, abi, provider)

    // console.log("contract", contract)
    // gets all transactions originated from my account
    //    const allTxnsFromMyAddress = contract.filters.Transfer(walletAddress)

    //    console.log("all txns originated from my address", allTxnsFromMyAddress)

    const allTxnsToMyAddress = contract.filters.Transfer(null, walletAddress)
    console.log("all txns received by my address", allTxnsToMyAddress)

    //gets all transatcions where I am recepient
}

//GetProvider()
//ethersTesting()
//TestEtherUtils()
//GetNetworkDetails()
//ExploreProviderTransactionMethods()
ExploreEventEmitterMethods()
//ExploreCallFunction()
// GetWallet()
//sendMessage()
//signTransaction()
//checkTransactionRequests()
//sendTransaction()
//ExploreProviderAccountMethods()
//ExploreProviderBlockMethods()
//ExploreProviderENSMethods()
