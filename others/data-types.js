const { ethers, utils } = require("ethers")
require("dotenv").config()

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const RECEIVER_PRIVATE_KEY = process.env.PRIVATE_KEY_2

//**** Here I test and document all data types in ethers.js */

const blockHash = "0x1955e85d4705c222f4441929daba10183b1e62af402f1cc605495df0eff74313"

const dataTypes = async () => {
    console.log("Block type")

    const provider = new ethers.providers.JsonRpcProvider(RINKEBY_RPC_URL)
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    const receiverWallet = new ethers.Wallet(RECEIVER_PRIVATE_KEY, provider)
    // blockType(provider)
    // networkType(provider)
    // feeDataType(provider)
    // filterType(provider, wallet)
    transactionType(provider, wallet, receiverWallet)
}

const blockType = async (provider) => {
    console.log("Exploring Block object...")

    console.log("Pasing a block hash to provider.getBlock(<hash>) function")
    console.log(">const block = await provider.getBlock(blockHash)")
    const block = await provider.getBlock(blockHash)

    console.log("All elements in Block object..")
    Object.keys(block).forEach((name) => console.log(name))

    console.log("get all transaction hashes in block")
    block.transactions.map((txn) => console.log(txn))

    console.log("Get latest block by sending in the 'latest' block tag to getBlock")
    console.log("const latestblock = await provider.getBlock('latest')")
    const latestblock = await provider.getBlock("latest")

    console.log("latest block hash", latestblock.hash)

    console.log("give a negative mnumber to get a offset block from latest")
    const pastBlock = await provider.getBlock(-10)
    console.log("getting hash of 10'th block from latest", pastBlock.hash)

    console.log("get block at a given height")
    const latestBlockHeight = await provider.getBlockNumber()
    const blockAtGivenHeight = await provider.getBlock(latestBlockHeight - 50)

    console.log(`Block with height ${latestBlockHeight - 50} has hash ${blockAtGivenHeight.hash}`)

    console.log("get pending block yet to be confirmed")
    const pendingBlock = await provider.getBlock("pending")
    console.log(`Hash of pending block is ${pendingBlock.hash}`)
}

const networkType = async (provider) => {
    console.log("Exploring Network object...")
    const network = await provider.getNetwork()
    console.log("Here are the members of Network object")
    Object.keys(network).forEach((key) => console.log(key))
}

const feeDataType = async (provider) => {
    console.log("Exploring FeeData object...")
    console.log(
        "FeeData object gives maxFeePerGas and maxPriorityFeePerGas that is recommended for block"
    )
    console.log(
        "These values are used by wallets to display the fee to end user where it is expected to pass"
    )
    const feeData = await provider.getFeeData()

    console.log("Elements of FeeData are...")
    Object.keys(feeData).forEach((key) => console.log(`${key}:${feeData[key]}`))
}

const filterType = async (provider, wallet) => {
    console.log("Exploring filter type..")

    console.log(
        "Filter type is very important to understand. filtes are used to capture logs or listen to events onchain"
    )

    console.log(
        "Filters can be set using address or block numbers or topics. Lets explore each of them"
    )

    console.log("> const logs = provider.getLogs(filter)")
    console.log(
        "Note that logs is an array of Log objects.",
        "Each Log object has: a. blockNumber, b. blockHash, c. removed (incase of orphan block, this indicates log entry has been removed) d.transactionLogIndex (index of this log) e. address (address of contract that generated this log) f. data - data included in this log g. topics - list of topics f. transactionHash - hash of txn log g. transactionIndex - index of txn h. logIndex - index of this log across all logs in a block"
    )

    console.log("Each log object")

    // FILTERING WITH ADDRESS
    const blockNumber = await provider.getBlockNumber()

    const walletFilter = {
        address: wallet.address,
    }

    // returning list of topics
    console.log("returning logs for given wallet: ", walletFilter)
    const walletWiseLogs = await provider.getLogs(walletFilter)
    walletWiseLogs.map((logs) =>
        logs.map((log) => console.log(`address: ${log.address}, topic 0: ${log.topics[0]}`))
    )

    // FILTERING WITH BLOCK NUMBERS

    const blockSpecificFilter = { fromBlock: blockNumber - 10, toBlock: blockNumber }
    // returning list of topics
    console.log("returning logs for given block numbers: ", blockSpecificFilter)
    const blockWiseLogs = await provider.getLogs(blockSpecificFilter)

    blockWiseLogs.map((log) => console.log(`address: ${log.address}, topic 0: ${log.topics[0]}`))

    //FILTERING WITH TOPIC
    const topicWiseFilter = {
        topics: ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"],
    }
    console.log("returning logs for given topic condition", topicWiseFilter)

    const topicWiseLogs = await provider.getLogs(topicWiseFilter)

    topicWiseLogs.map((log) =>
        console.log(`address: ${log.address}, block number: ${log.blockNumber}`)
    )
}

const transactionType = async (provider, wallet, receiverWallet) => {
    // Picking a random txn to play around
    txnHash = "0xc42a3274a0f2b4fdf679317a608feea3d277603226d0d3d7e5897384a9351137"

    console.log("******* SAMPLE TRANSACTION REQUEST *******")
    const txn = provider.getTransaction(txnHash)

    const sampleTxnRequest = {
        to: "0x",
        from: "0x", // this is automatically assigned when we use used methods such as signTransaction, sendTransaction
        nonce: 55, // this should be set to number of txns sent from address. Don't need to do this, as it is done automatically in practice
        data: {}, //this is payload send with msg call - this payload is used as input for the code in contract address
        value: ethers.utils.parseEther("0.001"), // amounr in wei sent with this txn
        gasLimit: ethers.utils.parseEther("0.0003"), //maximum amount of gas in wei this transaction is allowed to use
        gasPrice: ethers.utils.parseEther("0.0003"), // gas price in Wei - after EIP 1559, this is not being used. if maxFeePerGas or maxPriorityFeePerGas is given, this is ignored
        maxfeePerGas: ethers.utils.parseEther("0.0001"), //max fee per gas specified in wei - this should be left to default in most cases. This is max fee per gas this txn will pay for combined EIP1559 base fee and priority fee
        maxPriorityFeePerGas: ethers.utils.parseEther("0.00005"), // price per unit of gas that will be paid to miners (apart from base fee) - this is included in max fee per gas
    }

    console.log("Here is a sample transaction request...")
    Object.keys(sampleTxnRequest).forEach((key) => console.log(`${key}: ${sampleTxnRequest[key]}`))

    console.log("**************************")

    console.log("******* TRANSACTION RESPONSE *******")

    const txnRequest = { to: receiverWallet.address, value: ethers.utils.parseEther("0.001") }

    const txResponse = await wallet.sendTransaction(txnRequest)

    console.log("Here is list of outputs in txn response")
    console.log("blockNumber -> block number in which this txn was mined")
    console.log("blockHash -> block hash in which this txn was mined")
    console.log("timestamp -> timestamp in UTC when txn is mined. If not mined, this returns null")
    console.log("confirmation -> number of blocks that have been mined since this txn was mined")
    console.log(
        "wait([confirms=1]) => wait() resolves to object of TransactionReceipt type -> note that if block not mined, this returns null"
    )
    console.log(
        "IMP : If CALL_EXCEPTION error, error will be rejected with following props: error.transaction: original txn, error.transactionHash: hash of txn, error.receipt: 0 (returns with status 0)"
    )
    console.log(
        "IMP: IF TRANSACTION_REPLACED, error will be rejected with following props: error.hash: hash of original txn, error.reason - reason, one of 'replaced', 'cancelled', 'repriced'. error.cancelled - boolean, 'repriced' txn is not considered cancelled, replaced & cancelled are, error.replacement gives replacement txn(a transaction Response), error.receipt: replacement txn receipt (Txn receipt) "
    )
    console.log("type -> 1 if success, 0 if failed")

    console.log("Here is a sample txn response for a simple transfer")
    Object.keys(txResponse).forEach((key) => console.log(`${key}: ${txResponse[key]}`))

    console.log("******* TRANSACTION RECEIPT *******")
    console.log("Once a transaction response is finalized, we get a transaction receipt")

    const txnReceipt = await txResponse.wait(1)
    console.log("Here is list of outputs in txn response")

    console.log(
        "to -> the address this transaction is to. If to is null, it is an init transaction used to deploy a contract"
    )
    console.log("from -> the address this transaction is from")
    console.log(
        "contractAddress -> IF txn is null, this is init txn used to deploy the contract - this becomes address of that deployed contract"
    )

    console.log("transactionIndex -> index of txn in list of txns included in mined block")
    console.log("gas used -> amount of gas actually used by txn")
    console.log(
        "effectiveGasPrice -> effective gas price txn was charged at. After EIP1559 this is base gas price + priority gas fees"
    )
    console.log(
        "logsBloom -> bloom filter which includes all addresses and topics included in anylog in this txn"
    )
    console.log("blockHash - hash of block")
    console.log("txnHash -> hash of txn")
    console.log("logs -> array of logs emitted by txn")
    console.log("blockNumber")
    console.log("confirmations -> number of confirmations")
    console.log(
        "cumulativeGasUsed -> for block this txn was included in, this is sum of gas used by each txn in ordered list of txns upto (and including) this txn"
    )
    console.log("status - 1, if succes, 0 if failure")
    Object.keys(txnReceipt).forEach((key) => console.log(`${key}: ${txnReceipt[key]}`))
}
//********* */

const main = () => {
    dataTypes()
}

main()
