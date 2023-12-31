// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "forge-std/Script.sol";
import "./Helper.sol";
import {CrossChainRelayer} from "../src/CrossChainRelayer.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";

contract DeployCrossChainRelayer is Script, Helper {
  function run(
    SupportedNetworks destination,
    address dappInputBox,
    address dappAddress
  ) external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);

    (address router, , , ) = getConfigFromNetwork(destination);

    CrossChainRelayer crossChainRelayer = new CrossChainRelayer(
      router,
      dappInputBox,
      dappAddress
    );

    console.log(
      "Basic Message Receiver deployed on ",
      networks[destination],
      "with address: ",
      address(crossChainRelayer)
    );

    vm.stopBroadcast();
  }
}

contract CCIPTokenTransfer is Script, Helper {
  function run(
    SupportedNetworks source,
    SupportedNetworks destination,
    address crossChainRelayer,
    address tokenToSend,
    uint256 amount,
    PayFeesIn payFeesIn
  ) external returns (bytes32 messageId) {
    uint256 senderPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(senderPrivateKey);

    (address sourceRouter, address linkToken, , ) = getConfigFromNetwork(
      source
    );
    (, , , uint64 destinationChainId) = getConfigFromNetwork(destination);

    IERC20(tokenToSend).approve(sourceRouter, amount);

    Client.EVMTokenAmount[]
      memory tokensToSendDetails = new Client.EVMTokenAmount[](1);
    Client.EVMTokenAmount memory tokenToSendDetails = Client.EVMTokenAmount({
      token: tokenToSend,
      amount: amount
    });

    tokensToSendDetails[0] = tokenToSendDetails;

    Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
      receiver: abi.encode(crossChainRelayer),
      data: "",
      tokenAmounts: tokensToSendDetails,
      extraArgs: "",
      feeToken: payFeesIn == PayFeesIn.LINK ? linkToken : address(0)
    });

    uint256 fees = IRouterClient(sourceRouter).getFee(
      destinationChainId,
      message
    );

    if (payFeesIn == PayFeesIn.LINK) {
      IERC20(linkToken).approve(sourceRouter, fees);
      messageId = IRouterClient(sourceRouter).ccipSend(
        destinationChainId,
        message
      );
    } else {
      messageId = IRouterClient(sourceRouter).ccipSend{value: fees}(
        destinationChainId,
        message
      );
    }

    console.log(
      "You can now monitor the status of your Chainlink CCIP Message via https://ccip.chain.link using CCIP Message ID: "
    );
    console.logBytes32(messageId);

    vm.stopBroadcast();
  }
}

contract GetLatestMessageDetails is Script, Helper {
  function run(address crossChainRelayer) external view {
    (
      bytes32 latestMessageId,
      uint64 latestSourceChainSelector,
      address latestSender,
      string memory latestMessage
    ) = CrossChainRelayer(crossChainRelayer).getLatestMessageDetails();

    console.log("Latest Message ID: ");
    console.logBytes32(latestMessageId);
    console.log("Latest Source Chain Selector: ");
    console.log(latestSourceChainSelector);
    console.log("Latest Sender: ");
    console.log(latestSender);
    console.log("Latest Message: ");
    console.log(latestMessage);
  }
}
