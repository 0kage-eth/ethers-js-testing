const { ethers } = require("ethers")

const PRIVATE_KEY = process.env.PRIVATE_KEY
const RECEIVER_PRIVATE_KEY = process.env.PRIVATE_KEY_2
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL

/**
 * In this method, I try to sign a message using a wallet
 * signing a message is giving an approval for any third party application
 * ethers.js library helps us easily sign messages
 */

const sendMessage = async () => {
    const provider = new ethers.providers.JsonRpcProvider(RINKEBY_RPC_URL)
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    const msg = MESSAGE

    console.log("wallet.signMessage(<Message) function helps us sign a message")
    console.log(
        "it is an async method that returns a promise of a Raw Signature (Refer ether-data-types.js for more on this object)"
    )
    console.log(">const txSign = await wallet.signMessage(<Message>)")

    const txnSign = await wallet.signMessage(msg)
    console.log("response of signMessage() after promise is resolved:", txnSign)
    console.log("response is a Raw transaction that is a 65 byte (130 nibble) DataHexString")
}

/**
 * Sign Transaction, acts similar to sign message
 * /// @dev function shows how to sign txn using ethers.js library
 */
const signTransaction = async () => {
    const provider = new ethers.providers.JsonRpcProvider(RINKEBY_RPC_URL)
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    const otherWallet = new ethers.Wallet(RECEIVER_PRIVATE_KEY, provider)

    const txn = { to: otherWallet.address, value: ethers.utils.parseEther("0.01") }

    console.log("user can sign txn by using wallet.")
    const signTx = await wallet.signTransaction(txn)
    console.log("signed transaction output: ", signTx)

    console.log(
        "returns a Promise which resolves to the signed transaction of the transactionRequest. It is of type HexString"
    )
    console.log(
        "signTransaction is implemented in base class called Signer - Wallet class inherits from Signer."
    )
    console.log(
        "All sub-classes have to implement this - they can throw an error if a wallet is not allowed to sign a txn"
    )
    console.log("----------")
}

/**
 * check transaction and populate transaction are 2 methods used to verify if a transaction request is in correct format
 * /// @dev both checkTransaction() and populateTransaction() verify if transcation request is in proper format
 * Both of them don't need to be overriden unless we want custom behavior in sub classes
 * This method is used to play with both methods and see their response
 */
const checkAndPopulateTransactionRequests = async () => {
    console.log("Check Transcation method in Signer class")
    console.log("Note that signer is a base class - and we cannot make changes at this level")
    console.log("Instead we extend these classes and override methods for custom behavior")

    console.log(
        "Check Transaction returns copy of txn request with properties needed by call, estimateGas and populateTransaction"
    )
    console.log(
        "Default implementation checks if valid TransactionRequest properties exist and adds from to request, if it does not exist"
    )

    console.log(">const checkedTxnRequest = wallet.checkTransaction(txRequest)")

    const provider = new ethers.providers.JsonRpcProvider(RINKEBY_RPC_URL)
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    const receiverWallet = new ethers.Wallet(RECEIVER_PRIVATE_KEY, provider)

    const txRequest = { to: receiverWallet.address, value: ethers.utils.parseEther("0.01") }
    const checkedTxnRequest = wallet.checkTransaction(txRequest)

    console.log(checkedTxnRequest)
    console.log("CHECK TRANSACTION")
    console.log("Note that checkTransaction() adds from address to txn request")

    console.log("Now let's check what happens if I send an incomple txnRequest with no to address")
    const incompleteTxnRequest = { value: ethers.utils.parseEther("0.01") }

    console.log("incomplete txn request", incompleteTxnRequest)

    const checkTxnRequestIncomplete = wallet.checkTransaction(incompleteTxnRequest)
    console.log("check txn response for incomplete txn", checkTxnRequestIncomplete)
    console.log(
        "default implementation just adds the from address. it does not check if there is to address/ value."
    )
    console.log("devs can override this and setup custom implementation")

    console.log("---------------------------")

    console.log("POPULATE TRANSACTION")
    const populateTxnResponse = await wallet.populateTransaction(txRequest)

    console.log("populate transaction response:", populateTxnResponse)
    console.log(
        "Note that populate transaction response includes to/from/value/gasLimit, chainId, nonce, maxFeePerGas, maxPriorityFeePerGas"
    )
}

/**
 * method shows hot to send a transaction to blockchain
 * /// @dev sendTransaction functionality using ethers.js
 */

const sendTransaction = async () => {
    // send transaction to specific address as specified in txnDetails

    const provider = new ethers.providers.JsonRpcProvider(RINKEBY_RPC_URL)
    const senderWallet = new ethers.Wallet(PRIVATE_KEY, provider)
    const receiverWallet = new ethers.Wallet(RECEIVER_PRIVATE_KEY, provider)

    const txn = { to: receiverWallet.address, value: ethers.utils.parseEther("0.01") }

    console.log("transaction can be sent using wallet.sendTransaction(<txn>)")
    console.log(
        "sendTransaction() is an async function that returns a Promise of transactionResponse (see types for more details)"
    )
    console.log(">const sendTxn = await senderWallet.sendTransaction(txn)")

    console.log("we can wait for 1 block confirmation and get txn receipt")
    console.log(">const sendTxnReceipt = await sendTxn.wait(1)")
    const sendTxn = await senderWallet.sendTransaction(txn)
    const sendTxnReceipt = await sendTxn.wait(1)

    console.log("send transaction response", sendTxn)

    console.log("send transaction receipt", sendTxnReceipt)
    console.log("Txn receipt has following fields.....")

    console.log(
        `to address: ${sendTxnReceipt.to}, from address: ${
            sendTxnReceipt.from
        }, contract address: ${sendTxnReceipt.contractAddress}, transactionIndex: ${
            sendTxnReceipt.transactionIndex
        }, gasUsed: ${ethers.utils.formatEther(sendTxnReceipt.gasUsed)} ETH, txn hash: ${
            sendTxnReceipt.transactionHash
        }, block hash: ${sendTxnReceipt.blockHash}, block number: ${
            sendTxnReceipt.blockNumber
        }, effective gas price: ${ethers.utils.formatEther(
            sendTxnReceipt.effectiveGasPrice
        )}, cumulativeGasUsed: ${ethers.utils.formatEther(
            sendTxnReceipt.cumulativeGasUsed
        )}, status: ${sendTxnReceipt.status} }`
    )
    console.log("----------")
}
