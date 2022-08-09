const { ethers } = require("ethers")
require("dotenv").config()
const { weth_contract_abi } = require("./weth_contract_abi")

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const WETH_CONTRACT_ADDRESS = "0xDf032Bc4B9dC2782Bb09352007D4C57B75160B15"

/**
 * important pointers on contracts
 */
const KeyNotes = () => {
    console.log("***********CONTRACT - KEY NOTES**************")
    console.log("Contract is an abstraction of code that is deployed onchain")

    console.log(
        "Contract may be sent transactions with input data - chain runs the contract code that uses bytecode, input params and current state of blockchain"
    )
    console.log("---------------------------------------------")
}

/**
 * @dev method deals with creation of a contract instance, given address, abi and provider
 * we can call access any contract deployed onchain if we have these 3
 */

const CreateContractInstance = () => {
    console.log("***********CREATE CONTRACT INSTANCE**************")
    console.log("Creates contract instance of any contract that is deployed on-chain")
    console.log("To create a contract instance we need contract address, abi and provider/signer")
    console.log("abi here refers to application binary interface")

    const address = WETH_CONTRACT_ADDRESS
    const abi = weth_contract_abi
    const provider = new ethers.providers.JsonRpcProvider(RINKEBY_RPC_URL)
    const signerWallet = new ethers.Wallet(PRIVATE_KEY, provider)

    console.log("Note that we can pass a provider or signer to initiate contract instance")
    console.log("Passing a provider makes the contract read only - only getter calls")
    console.log(
        "Passing a signer however allows us to send txns to the contract and change state of chain"
    )
    console.log("> const contract = new ethers.Contract(address, abi, <signer>|<provider>)")

    const contract = new ethers.Contract(address, abi, signerWallet)
    console.log("Original contract instance", contract.address)
    //   console.log("contract details", contract)
    console.log("---------------------------------------------")

    console.log("***********ATTACHING CONTRACTS**************")

    console.log(
        "If Contract code is the same (ie abi is same) across multiple addresses, we can use .attach(<address>)"
    )
    console.log("Returns a new instance of contract attached to new address")
    console.log(
        "useful when there are multiple identical copies of contract across multiple addresses"
    )
    console.log("> const newContract = contract.attach(<address>)")

    const newAttachedContract = contract.attach(signerWallet.address)
    console.log("address of new attached contract", newAttachedContract.address)
    // console.log(
    //     `new attached contract with wallet address ${signerWallet.address}`,
    //     newAttachedContract
    // )
    console.log("---------------------------------------------")

    console.log("***********CONNECT CONTRACTS**************")

    console.log("Returns a new instance of contract connected to signer/provider")
    console.log("Passing a provider downgrades a contract and makes it read only")
    console.log("Passing a signer allows signer to interact with contract and change state")
    console.log("> const contractConnectedWithSigner = contract.connect(signerWallet)")

    const contractConnectedWithSigner = contract.connect(signerWallet)
    console.log("address of connected contract", contractConnectedWithSigner.address)

    // console.log("contract signed with Signer", contractConnectedWithSigner)
    console.log("---------------------------------------------")
    return contractConnectedWithSigner
}

const RevealContractProperties = async (contract) => {
    const resolvedAddress = await contract.resolvedAddress
    console.log("***********CONTRACT PROPERTIES**************")
    console.log(
        "Contract has propeties such as address, provider, resolvedAddress, interface, deployTransaction, provider, signer"
    )

    console.log("Address contract was constructed with: ", contract.address)
    console.log("Contract signer: ", contract.signer.address)
    //    console.log("Contract interface", contract.interface)
    // console.log("Provider: ", contract.provider)
}

/**
 * @dev contract deployment status is verified with the deployed() function. Async function that returns Promise of Contract
 * @param contract instance of contract object
 * @returns boolean - contract status deployed, true/false
 */
const isDeployed = async (contract) => {
    console.log("***********VERIFY CONTRACT DEPLOYMENT**************")
    const deployedContract = await contract.deployed()

    const deploymentStatus =
        deployedContract === null ? "Contract not deployed" : "Contract deployed"

    console.log("Contract status?", deploymentStatus)
    console.log("---------------------------------------------")
    return deploymentStatus
}

/**
 * @dev I test how to read and write functions in a contract library
 * @param contract instance of Contract object
 */

const CallingContractFunctions = async (contract) => {
    console.log("***********CALLING READ FUNCTIONS IN CONTRACT**************")

    console.log("Call symbol function in this contract")
    const symbol = await contract.symbol()

    console.log("Call totalSupply function in this contract")
    const totalSupply = await contract.totalSupply()

    console.log("Call balance of function in this contract")
    const balance = await contract.balanceOf(contract.signer.address)

    console.log(
        `Contract data includes symbol: ${symbol}, supply: ${totalSupply}, balance: ${ethers.utils.formatUnits(
            balance,
            "gwei"
        )}`
    )
    console.log("***********CALLING WRITE FUNCTIONS IN CONTRACT**************")
    console.log("Call Deposit function in this contract to deposit 0.001 Eth")

    const depositTx = await contract.deposit({ value: ethers.utils.parseEther("0.01") })
    const depositReceipt = await depositTx.wait(1)
    console.log("Deposit txn hash is:", depositReceipt)
    console.log("---------------------------------------------")
}

/**
 * @dev test all events triggered by a transaction
 * @param contract instance of Contract object
 */
const ContractEvents = async (contract) => {
    console.log("**************QUERY FILTERS ****************")
    console.log(" Filter Query based on event name")
    console.log(
        ">const depositEvents = contract.queryFilter(<event>, [, fromBlockorBlockHash, toBlock]) "
    )
    console.log(
        "Note that we need to send block hash or startblock/endblock. If endblock not specified, it automatically defaults to latest"
    )

    console.log("Define a deposit filter by >contracts.filters.Deposit()")
    console.log("All filters are stored as an array in filters object inside Contract")

    const depositFilter = contract.filters.Deposit()
    const depositEvents = await contract.queryFilter(
        depositFilter,
        "0xb6604264ba3771ee2bf523b522baea2781172b2bfa4814c89eda9c714e79ae15"
    )

    console.log("Looping over events to find out if there is a deposit event")
    console.log("For each event, we can find params in event by looping over args")
    if (depositEvents) {
        depositEvents.map((depositEvent) => {
            console.log(
                `Deposit event, to Address: ${
                    depositEvent.args[0]
                }, value (gwei): ${ethers.utils.commify(
                    ethers.utils.formatUnits(depositEvent.args[1], "gwei")
                )}`
            )
        })
    }
    console.log("---------------------------------------------")
}

/**
 *
 * @param contract listens to events when contract functions get called
 * I will try to catch as many events as possible using this method
 */
const ListeningToEvents = async (contract) => {
    console.log("**************LISTENING TO EVENTS****************")

    const depositFilter = contract.filters.Deposit()

    console.log("There are multiple types of event listeners...Let's see one at a time")
    console.log(
        ">contract.listenerCount(<event>) returns number of listeners subscribed to an event"
    )
    console.log("if no event provided, returns total count of all events")
    const listenerCount = contract.listenerCount([depositFilter])
    console.log("total listener count:", listenerCount)
    // TO DO
    console.log("---------------------------")

    console.log(">contract.listeners(<event>) returns a list of listeners subscribed to event")
    // TO DO
    console.log("---------------------------")

    console.log(">contract.off(<event>, <listener>) unsubscribes listener to an event")

    console.log(">contract.on(<event>, <listener>) subscribes listener to an event")
    contract.on(depositFilter, (to, value) => {
        console.log(
            `Caught an event with deposit address ${to} and value : ${ethers.utils.formatEther(
                value
            )}`
        )
    })

    console.log(
        ">contract.once(<event>, <listener>) subscribes once to listener when event occurs. And stops after that..."
    )

    contract.once(depositFilter, () => {
        console.log("Caught deposit event first time using once() ....")
    })

    console.log(
        ">contract.removeAllListeners([event]) unsubscribe all listeners for event. If no event provided, all listners unsubscribed"
    )

    const depositTxnRes = await contract.deposit({ value: ethers.utils.parseEther("0.001") })
    const depositTxnReceipt = await depositTxnRes.wait(1)
}

const runContracts = () => {
    console.log("Testing all contract methods and properties...")
    KeyNotes()
    const contract = CreateContractInstance()
    // RevealContractProperties(contract)
    // isDeployed(contract)
    // CallingContractFunctions(contract)
    // ContractEvents(contract)
    ListeningToEvents(contract)
}

runContracts()
