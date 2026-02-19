// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {FlashLoanReceiver} from "../src/FlashLoanReceiver.sol";

contract DeployAaveReceiver is Script {

    function run() public {

        uint256 key = vm.envUint("PRIVATE_KEY");
        address lendingPool = vm.envAddress("LENDING_POOL");

        vm.startBroadcast(key);

        FlashLoanReceiver receiver =
            new FlashLoanReceiver(lendingPool);

        vm.stopBroadcast();

        console.log("Flash Receiver deployed at:");
        console.log(address(receiver));
    }
}
