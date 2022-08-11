const { ethers, Contract } = require("ethers")

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const RANDOM_ADDRESS = "0xd7Dd548772fF126999a1a02640beFA34C2ce470B"
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL
const AAVE_ADDRESS = "0x465c1118d786dfce554A33ee7Da46a40F8E42da8"
const ENS_NAME = "vitalik.eth"
const VITALIK_ADDRESS = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
const TRANSFER_TXN_HASH = "0xbb1a7c88bde4e82ece4394bd47632fa9d8be3d92478716ef33bb74d8f10bba2e"

/**
 * ///@dev shows how to access provider
 * provider is an abstraction of node that connects us to blockchain
 * In ethers-api-providers.js, I try out all third party api providers (infura/alchemy/ankr etc)
 * In this method, I mainly look at generic JsonRpcProvider()
 */
const getProvider = async () => {
    // get provider instance

    console.log("generic provider instance can be initiated by using JsonRpcProvice")
    console.log(">const provider = new ethers.providers.JsonRpcProvider({ url: RINKEBY_RPC_URL })")
    console.log("In this example, I am using a Alchemy API endpoint for rinkeby network")
    console.log("-------------")
    const provider = new ethers.providers.JsonRpcProvider({ url: RINKEBY_RPC_URL })

    // get block number
}

/***
 * Explore Provider Account methods
 * /// @dev in this method, I try to explore all methods supported by provider object
 * */
const exploreProviderAccountMethods = async () => {
    const provider = new ethers.providers.JsonRpcProvider(RINKEBY_RPC_URL)

    //GET BALANCE
    // get balance of given address
    console.log("we can get balance of any addresss with a public key")
    console.log("getBalance(<address>) is async function that returns a promise of balance")
    console.log(">const balance = await provider.getBalance(<address>)")

    const balance = await provider.getBalance(RANDOM_ADDRESS)
    console.log("Balance in wallet", balance.toString())
    console.log("--------------------")

    // GET BLOCK NUMBER
    console.log(
        "we can get block number by calling async function getBlockNumber() that returns a Promise of number"
    )
    console.log(">const blockNumber = await provider.getBlockNumber()")
    console.log("Block Number", blockNumber.toString())
    console.log("-------------------")
    const blockNumber = await provider.getBlockNumber()

    //GET CODE
    console.log(
        "getCode(<address>, [, blockTag=latest]) is async function that returns code of address "
    )
    console.log("function returns a promise of a DataHexString")
    console.log(
        "By default, block tag is latest - however, we can get the code at any block by giving block number"
    )
    console.log("using AAVE Token address to get the code")
    console.log("If there is no code, reverts with a '0x'")
    const code = await provider.getCode(AAVE_ADDRESS)

    console.log("code", code)
    console.log("Returns byte code of the contract")
    console.log("------------------------")

    // GET STORAGE

    console.log(
        "getStorageAt(address, position, [, blockTag=Latest] is an async function that returns promise of DataHexString"
    )
    console.log(">const storeZero = await provider.getStorageAt(<address>, 1)")
    console.log(
        "first param is address, second param is position (incase of multiple variables, blockTag is block number"
    )
    const storeZero = await provider.getStorageAt(RANDOM_ADDRESS, 1)
    console.log("storage at zero location:", storeZero)

    // TO DO - need to understand this method better
    // How is data stored in address & what does position mean...

    // GET TRANSACTION COUNT
    // This function is also available in the wallet
    console.log(
        "getTransactionCount(<address>, [, blockTag=latest]) is an async function that returns a promise of a number"
    )
    console.log("> const numTxns = await provider.getTransactionCount(<address>)")
    const numTxns = await provider.getTransactionCount(RANDOM_ADDRESS)
    console.log("num txns", numTxns)
}

/***
 * Explore Provider Block methods
 * /// @dev in this method, I explore block methods supported by provider as in ethers.js
 *
 */

const exploreProviderBlockMethods = async () => {
    // GET BLOCK

    console.log("getBlock() is an async function that returns a promise of a block")
    console.log("block is of type Block (refer to ethers-data-types.js for more)")
    console.log("getBlock(<blockNumber>) returns a block with specific block number")
    console.log("> const block = await provider.getBlock(<blockNumber>)")
    console.log(
        "Note that block contains blockHash, parentHash, blockNumber, timeStamp, nonce, difficult, gasLimit, gasUsed"
    )
    console.log("miner address (winner), extraData???, list<txn hashes>")

    // TO DO - find out more about extraData
    const provider = new ethers.providers.JsonRpcProvider(RINKEBY_RPC_URL)
    const latestBlockNumber = await provider.getBlockNumber()

    const latestBlock = await provider.getBlock(latestBlockNumber)

    console.log("latest block returned by getBlock()", latestBlock)
    console.log("----------------------")

    // GET BLOCK WITH TRANSACTIONS

    console.log("Note that getBlock() returns hashed transactions")
    console.log(
        "if we need more explicit data regarding txns, we need to use getBlockWithTransactions()"
    )
    console.log(
        "getBlockWithTransactios() is an async function that returns a promise of object of type BlockWithTransactions (more on this in ethers-data-types.js)"
    )
    console.log("const blockWithTxns = await provider.getBlockWithTransactions(<blockNumber>)")

    const latestBlockWithTxns = await provider.getBlockWithTransactions(latestBlockNumber)
    console.log("latest block with txns", latestBlockWithTxns)

    console.log(
        "note that key difference is that each txn has more info - array of TransactionResponse objects"
    )
    console.log(
        "every txn has txnhash, blockHash, blockNumber, confirmations, from, to, gasPrice, gasLimit, value, nonce, data, r/s/v (??), chainId, wait, creates"
    )
}

/**
 * Explore ENS methods
 * //@dev experiment with functions to resolve ENS name
 */

const exploreProviderENSMethods = async () => {
    // Note - for this, get the mainnet provider
    const provider = new ethers.providers.JsonRpcProvider(MAINNET_RPC_URL)

    // GET AVATAR
    console.log("Gets Avatar associated with ENS name. Null if empyty")
    console.log("getAvatar() is an async function that returns promise of string - url of avatar")
    console.log("> const avatar = await provider.getAvatar(<ENS name>)")
    console.log(`Getting avatar for ${ENS_NAME}...`)
    const avatar = await provider.getAvatar(ENS_NAME)
    console.log(`avatar for ENS ${ENS_NAME} is ${avatar}`)
    console.log("---------------------")

    // RESOLVE NAME FOR ADDRESS
    console.log("Get public address for the ENS Name. Null if empty")
    console.log("resolveName(<ENSname>) is async function that returns promise of string")
    console.log(">const publicAddress = await provider.resolveName(<ENS name>)")

    console.log(`Getting address for ${ENS_NAME}`)
    const publicAddress = await provider.resolveName(ENS_NAME)
    console.log(`public address foe ${ENS_NAME} is`, publicAddress)
    console.log("---------------------")

    // GET ENS NAME GIVEN ADDRESS
    console.log("Get ENS name given address. Null if empty")
    console.log("lookupAddress(<address>) is async function that returns promise of ENS name")
    console.log(">const ensName = await provider.lookupAddress(<address>)")

    const ensName = await provider.lookupAddress(VITALIK_ADDRESS)
    console.log(`ENS for ${VITALIK_ADDRESS} is ${ensName}`)
    console.log("---------------------")
    // console.log(``)

    // GET ENS RESOLVER
    console.log(
        "ENS Resolver object has name, address, avatar, content hash, test (email/twitter etc)"
    )
    console.log(
        "getResolver(<ensName>) is async function that returns promise of ENS Resolver object"
    )
    console.log("ENSResolve object has all data associated with ENS name")
    console.log(">const ensResolver = await provider.GetResolver(<ensName>)")
    const ensResolver = await provider.getResolver(ENS_NAME)

    // getting address
    console.log(">const address = await ensResolver.getAddress([coinType=60])")
    console.log(
        "coinType defines the coin address stored for the ENS Name. Default is 60 for ETH address"
    )
    console.log("coinType for Bitcoin is 0")

    const ethAddress = await ensResolver.getAddress()
    console.log(`ETH address for ${ENS_NAME} is ${ethAddress}`)

    const btcAddress = await ensResolver.getAddress(0)
    console.log(`BTC address for ${ENS_NAME} is ${btcAddress}`)

    console.log("---------------------")

    // getting name
    console.log("Name of ENS holder is", ensResolver.name)

    const avatarInfo = await ensResolver.getAvatar()
    console.log("GetAvatar() is an async function that returns a promise of type AvatarInfo")
    console.log("AvatarInfo has url of avatar and linkage ")
    console.log("Linkage is an array of info for each step resolving avatar")

    console.log(`Avatar info for ${ENS_NAME} has url: ${avatarInfo.url}`)
    console.log(
        `Avatar info for ${ENS_NAME} also has linkage - an array of linkages representing each stage in avatar resolution.`
    )
    console.log(`Lets see linkages for ${ENS_NAME}`)
    avatarInfo.linkage.map((link) => {
        console.log(`key: ${link.type}, value: ${link.content}`)
    })
    console.log("As you can see, linkage has url, attributes, metadata, ipfs location")
    console.log("---------------------")

    // GET CONTENT HASH
    console.log(
        "GetContentHash() is an async function that returns a promise of any stored EIP-1577 content hash"
    )
    console.log(
        "EIP-1577 introduced contenthash to standardize how data is stored for a ENS name in file storage systems such as Swarm and IPFS"
    )

    console.log(">const contentHash = await ensResolver.getContentHash()")
    const contentHash = await ensResolver.getContentHash()
    console.log("content hash is", contentHash)
    console.log("---------------------")

    //GET TEXT
    console.log(
        "GetText() is an async function that returns a promise to any EIP-634 text entry for key"
    )
    console.log(
        "EIP 634 refers to EIP that simplifies extracting key-value pair associated with ENS"
    )

    console.log(">const email = await ensResolver.getText('email')")
    console.log(">const url = await ensResolver.getText('url')")
    console.log(">const twitter = await ensResolver.getText('com.twitter')")

    const email = await ensResolver.getText("email")
    const url = await ensResolver.getText("url")
    const twitter = await ensResolver.getText("com.twitter")

    console.log(
        `Email is ${email}, url is ${url} and twitter is ${twitter} for ENS ${ensResolver.name} with address ${ensResolver.address}`
    )
    console.log("---------------------")
}

/**
 *get network details for given provider
 ///@dev method shows how to get network details from provider using ethers.js library 
 */

const getContractLogs = async () => {
    // given provider - get chainId, network name

    const provider = new ethers.providers.JsonRpcProvider(RINKEBY_RPC_URL)

    // GET NETWORK DETAILS
    console.log("get network details from provider by using async function")
    console.log(
        "getNetwork() that returns a promise of an object of Network type (refer ether-data-types.js)"
    )
    console.log("> const network  = await provider.getNetwork()")
    console.log("Network type contains name, chainId, ensAddress properties")
    const network = await provider.getNetwork()

    console.log("network details", network)
    console.log("-----------------")

    // GET GAS PRICE
    console.log(
        "getGasPrice() is a async function that returns promise of gas price in wei for network"
    )
    console.log("> const gasPrice = await provider.getGasPrice()")

    const gasPrice = await provider.getGasPrice()
    console.log("Gas Price in gwei", ethers.utils.formatUnits(gasPrice, "gwei"))
    console.log("-----------------")

    //GET BLOCK NUMBER
    console.log(
        "getBlockNumber() is async function that gives promise of latest block mined by network"
    )
    console.log(">const latestBlock = await provider.getBlockNumber()")

    const blockNumber = await provider.getBlockNumber()
    console.log("Block Number of network:", blockNumber)
    console.log("-----------------")

    //GET FEED DATA
    console.log("Feed data includes gasPrice, maxFeePerGas, maxPriorityFeePerGas")
    console.log("Returns gas price in wei")
    console.log("> const gasFeeData = await provider.getFeedData()")

    const gasFeeData = await provider.getFeeData()

    console.log(
        `Gas Fees Data - Max Fee Per Gas in GWEI ${ethers.utils.formatUnits(
            gasFeeData.maxFeePerGas,
            "gwei"
        )}, Gas Price in ETH:  ${ethers.utils.formatUnits(
            gasFeeData.gasPrice,
            "ether"
        )}, Max Priority Fees Per Gas: ${ethers.utils.formatUnits(
            gasFeeData.maxPriorityFeePerGas,
            "gwei"
        )}`
    )
    console.log("-----------------")

    // CHECK IF NETWORK IS READY

    console.log(
        "isReady() is a async function that returns a promise of network until network is established"
    )
    console.log("checking if network is ready....")
    const isNetworkReady = await provider.ready()
    console.log("Network ready", isNetworkReady)
}

/**
 * get logs
 * @dev provider has logs - we can fetch all logs from a provider
 * note that this is generic & sometimes there might be too much data to fetch in one go
 */
const getLogs = async () => {
    const provider = new ethers.providers.JsonRpcProvider(RINKEBY_RPC_URL)
    const endBlock = await provider.getBlockNumber()
    const startBlock = 11182883

    let filterLogs = {
        fromBlock: startBlock,
        toBlock: endBlock,
        topics: ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"],
    }

    const logs = await provider.getLogs(filterLogs)

    console.log("logs size", logs.length)
    logs.map((log) => {
        console.log(log)
    })
}

/***
 * @dev - ExploreProviderTransactionMethods is used to play around with transaction related provider functionality
 *
 */
const exploreProviderTransactionMethods = async () => {
    const provider = new ethers.providers.JsonRpcProvider(RINKEBY_RPC_URL)

    //GET TRANSACTION
    console.log(
        "getTransaction(<txn hash>) is a async function that reverts a Promise of transactionResponse "
    )
    console.log(
        "txnResponse contains txn Hash, to, from, gasPrice, maxGasFee (refer to ethers-data-types.js)"
    )
    console.log("Powerful function that gets any transaction on chain by its hash")

    console.log("> const txnResponse = await provider.getTransaction(<txnhash>)")

    const txnResponse = await provider.getTransaction(TRANSFER_TXN_HASH)
    console.log("tx Response", txnResponse)
    console.log("---------------------")

    const txnReceipt = await txnResponse.wait(1)
    console.log("tx receipt", txnReceipt)
    console.log("---------------------")

    // ESTIMATE GAS
    console.log("estimateGas(<txn>) calculates the gas estimated to execute a given txn")
    console.log(
        "Wallets run this method to check if the txn will go through - again a read only function that is gas free"
    )
    console.log("First, we pick data of a past txn using getTransaction() & estimate gas")

    const txn = { to: txnResponse.to, data: txnResponse.data, value: txnResponse.value }
    console.log("txn sent", txn)

    const gasEstimate = await provider.estimateGas(txn)
    console.log(
        `Gas estimate for txn with hash ${TXN_HASH} is ${ethers.utils.formatUnits(
            gasEstimate,
            "gwei"
        )} gwei`
    )
    console.log("-------------------")

    // GET TRANSACTION RECEIPT

    console.log(
        "getTransactionReceipt(<txnHash>) returns promise of txnreceipt (see more in ethers-data-types.js)"
    )
    console.log(
        "TranscationReceipt object has blockHash, blockNumber, confirmations, contractAddress, from, to, gasUsed, effectiveGasPrice, cumulativeGasUsed, logs"
    )
    console.log("> const txnReceipt = await provider.getTransactionReceipt(<txnHash>)")

    const txnReceiptNew = await provider.getTransactionReceipt(TXN_HASH)
    console.log(`tx Receipt for txn hash ${TXN_HASH} received`)
    console.log(
        `gas details: effective Gas Price - ${txnReceiptNew.effectiveGasPrice}, cumulative gas = ${txnReceiptNew.cumulativeGasUsed}, gas used = ${txnReceiptNew.gasUsed}`
    )
    console.log(`logs: ${txnReceipt.logs}`)

    // WAIT FOR TRANSACTION

    console.log("waitForTransaction(txnhash, [, confirms=1 [, timeout]]) waits for txn to be mined")
    console.log(
        "confirms=1 will block until transaction has blocks confirmed on top of current block it is mined, confirms=0 is unblocking, will return null if txn is not mined"
    )
    console.log(" returns a promise of TransactionReceipt (more on this, in ethers-data-types.js)")
    console.log("await txn.wait(1) is a shortform notation of the same")

    console.log(">const waitTransaction = await provider.waitForTransaction(<txnHash>, 1)")

    const waitTransaction = await provider.waitForTransaction(TXN_HASH, 1)
    console.log("wait transaction status", waitTransaction)
}

/***
 * @dev - Call Function is a read only execution of a transaction
 * It does not consume any gas - and does not change any state of txn
 * useful for calling getters on contracts
 */

const exploreCallFunction = async () => {
    const provider = new ethers.providers.JsonRpcProvider(RINKEBY_RPC_URL)

    console.log(`Using a random contract call with txnHash: ${TXN_HASH}`)
    console.log(`Get transaction for txn hash using async function getTransaction()`)
    console.log("Function returns a promise of txn response")
    console.log("> const tx = await provider.getTransaction(TXN_HASH)")
    const tx = await provider.getTransaction(TXN_HASH)

    console.log("tx response", tx)
    console.log("Picking the data and block number for tx")

    const txBlockNumber = tx.blockNumber
    const txData = tx.data
    const txValue = tx.value
    const toAddress = tx.to

    try {
        console.log(
            " provider.call(<tx>) executes logic without changing state of blockchain. Gas free"
        )
        console.log("This is useful for calling getters on Contracts")
        console.log(
            " This is what Metamask (and other wallets) runs to check if txn is likely to revert. Saves on gas fees of users"
        )
        console.log(
            "> const callTx = await provider.call({to: toAddress, data: txData, value: ethers.utils.formatEther('20')})"
        )
        console.log("Note that this returns an error as transfer exceeds wallet balance")
        const callTx = await provider.call(
            { to: toAddress, data: txData, value: ethers.utils.formatEther("20") },
            txBlockNumber
        )
        console.log("call txn rsponse:", callTx)
        console.log("--------------------")
    } catch (e) {
        console.log(`Error code: ${e.code}, reason: ${e.reason}`)
        console.log("--------------------")
    }
}

const main = async () => {
    // getProvider()
    // exploreProviderAccountMethods()
    // exploreProviderBlockMethods()
    // exploreProviderENSMethods()
    // getContractLogs()
    getLogs()
    // exploreProviderTransactionMethods()
    // exploreCallFunction()
}

main()
    .then(() => {
        console.log("ran successfully")
    })
    .catch((e) => console.log(e))
