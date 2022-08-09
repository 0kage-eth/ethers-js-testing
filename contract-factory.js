const { ethers } = require("ethers")
require("dotenv").config()

const { weth_contract_abi, weth_contract_bytecode } = require("./weth_contract_abi")
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY

/**
 * important pointers on contract factory
 *
 */

const keyNotes = () => {
    console.log(
        "To deploy a contract, additional information is needed that is not present in Contract object itself. Bytecode of a contract is needed to deploy a contract"
    )

    console.log(
        "Contract factory sends a special txn, an init txn, where 'to' address is null & data field is initcode. Init code will be evaluated and the result becomes new code to deployed as new contract"
    )

    console.log("To create a new contract, we use the following...")
    console.log("> new ethers.ContractFactory(interface, bytecode, signer)")
    console.log(
        "Creates a new instance of ContractFactory of contract described by interface and bytecode"
    )

    console.log("-----------------------")

    console.log("To connect a contract factory to a new signer")
    console.log("> contractFactory.connect(signer)")
    console.log("returns a new instance of contractFactory but with a new signer")

    /// Properties of Contract Factory
    console.log("Contract factory properties...")
    console.log("> const interface  = contractFactory.interface ")
    console.log("returns an instance of interface")

    console.log("> const byteCode = contractFactory.byteCode")
    console.log("returns byteCode (initcode) thatg is used to deploy the contract")

    console.log("> const signer = contractFactory.signer")
    console.log("returns signer who will deploy instances of Contract on the blockchain")

    // Methods used in Contract Factory
    console.log(" Contract factory methods...")

    console.log("> const contract  = contractFactory.attach(address)")
    console.log(
        "returns instance of a contract attached to address - > like using Contract constructor with address, and interface/signer passed when creating Contract Factory"
    )

    console.log("> const unsignedTxn = contractFactory.getDeployTransaction(...args [,overrides])")
    console.log(
        "returns unsigned txn that will deploy this contract with args passed to Contract constructor"
    )

    console.log(">contractFactory.deploy(args, [, overrides]")
    console.log(
        "Deploys a contract with args passed into constructor and returns a contract attached to address where this contract will be deployed once its minded"
    )

    console.log(
        "Txn can be found at contract.deployTransaction and no interactions should be made until contract is mined"
    )
}

const deployTransaction = async () => {
    // DEPLOY a transaction
    console.log("Getting abi and bytecode of existing contract (WETH)")
    const abi = weth_contract_abi
    const bytecode = weth_contract_bytecode

    // creating provider
    console.log("Creating provider and wallet on Rinkeby and using Metamask private key")
    const provider = new ethers.providers.JsonRpcProvider(RINKEBY_RPC_URL)
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)

    const contractFactory = new ethers.ContractFactory(
        weth_contract_abi,
        weth_contract_bytecode,
        wallet
    )

    console.log("Deploying weth_contract using contractFactory.deploy()")
    const weth_contract = await contractFactory.deploy()

    console.log("deploy txn", weth_contract.deployTransaction)
    console.log("Note that deploy txn will give an unsigned txn that is yet to be deployed")

    const txnRecepit = await weth_contract.deployTransaction.wait(1)
    console.log(">weth_contract.deployTransaction.wait(1)")
    console.log("this gives us txn receipt once txn is mined on blockchain")
    console.log("txn receipt after deployment", txnRecepit)
}

const main = () => {
    keyNotes()
    deployTransaction()
}

main()
