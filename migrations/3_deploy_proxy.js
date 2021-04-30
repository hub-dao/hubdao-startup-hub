const IHOByProxy = artifacts.require("IHOByProxy");
const IHOUpgradeProxy = artifacts.require("IHOUpgradeProxy");

const fs = require('fs');
const abi = require('./abi/iho.json')

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org'));

module.exports = async function(deployer, a, account) {
    await deployer.deploy(IHOByProxy);

    const num = 100000000 * Math.pow(10, 6);
    const numAsHex = "0x" + num.toString(16);

    const num1 = 149200 * Math.pow(10, 18);
    const numAsHex1 = "0x" + num1.toString(16);

    const proxyAdmin= '0x0F9399FC81DaC77908A2Dde54Bb87Ee2D17a3373';
    const ihoAdmin= '0x35f16A46D3cf19010d28578A8b02DfA3CB4095a1';

    const lpToken = '0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6'; //cake-bnb
    const offeringToken = '0x63870a18b6e42b01ef1ad8a2302ef50b7132054f'; //blk
    const startBlock = '2401100';
    const endBlock = '2402320';
    const offeringAmount = numAsHex;
    const raisingAmount = numAsHex1;
    const adminAddress = ihoAdmin;

    const abiEncodeData = web3.eth.abi.encodeFunctionCall({
      "inputs": [
        {
          "internalType": "contract IBEP20",
          "name": "_lpToken",
          "type": "address"
        },
        {
          "internalType": "contract IBEP20",
          "name": "_offeringToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_startBlock",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_endBlock",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_offeringAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_raisingAmount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_adminAddress",
          "type": "address"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }, [
      lpToken,
      offeringToken,
      startBlock,
      endBlock,
      offeringAmount,
      raisingAmount,
      adminAddress
    ]);

    await deployer.deploy(IHOUpgradeProxy, proxyAdmin, IHOByProxy.address, abiEncodeData);

    console.log(proxyAdmin, IHOByProxy.address, abiEncodeData);

    // const lotteryProxy = new web3.eth.Contract(abi, IHOUpgradeProxy.address);
    // console.log((await lotteryProxy.methods.getAddressListLength().call()).toString())

};



