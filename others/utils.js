const { ethers, Contract } = require("ethers")

/**
 * Describes utility functions in ether.js
 *
 * @dev mainly functions of converting ethers to gwei/wei and vice versa and formatting
 */
const TestEtherUtils = async () => {
    // parse Ether to wei
    const etherToWei = ethers.utils.parseEther("0.1")
    console.log("Ether to Wei", etherToWei.toString())

    const GweiToWei = ethers.utils.parseUnits("200", "gwei")
    console.log("Gwei to Wei", GweiToWei.toString())
    // parse Ether to gwei

    // Get a 12 digit big number
    const bigNum1 = ethers.utils.parseUnits("2", 10)
    console.log("10 digit big number", bigNum1.toString())

    // get number in wei
    const numberInWei = ethers.utils.parseUnits("3", 18)
    console.log("Number in Wei", numberInWei.toString())

    //format units
    /**
     * @dev ethers.utils.formatUnits(<bigNumber>, "unit")
     * converts a big number into a string -> can be converted to gwei or wei
     * special function here is ethers.utils.formatEther(<bigNumber)
     */
    const numberBackInEther = ethers.utils.formatUnits(numberInWei, "ether")
    console.log("number back in ether", numberBackInEther)

    const numberBackInEther2 = ether.utils.formatEther(numberInWei)
    console.log("number back in ether using formatEther", numberBackInEther2)

    const numberBackInGwei = ethers.utils.formatUnits(numberInWei, "gwei")
    console.log("number back in gwei", numberBackInGwei)

    // commify
    /**
     * @dev ethers.utils.commify() converts a number, however large, into a comma
     * separated string.
     */

    const commaValue = ethers.utils.commify(bigNum1)
    console.log("comma separated value", commaValue)
}
