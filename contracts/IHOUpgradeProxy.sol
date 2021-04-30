pragma solidity 0.6.12;

import "@hubdao-finance/hubdao-lib/contracts/proxy/TransparentUpgradeableProxy.sol";

contract IHOUpgradeProxy is TransparentUpgradeableProxy {

    constructor(address admin, address logic, bytes memory data) TransparentUpgradeableProxy(logic, admin, data) public {

    }

}