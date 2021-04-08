// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.6;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "./DataProviderGroup.sol";

contract GlobalModelChannel {
    using SafeERC20 for IERC20;
    using SafeMath for uint;

    address public admin;
    address public rewardToken;
    uint public bounty;

    DataProviderGroup public dataProviderGroup;
    uint public DECIMALBASE = 10000;

    struct GMInfo {
        string initModel;
        uint threshold;
        uint minimumPeerNumber;
    }

    struct Configuration {
        string trainingModel;
        uint learningRate;
        uint batchSize;
        uint iterationNumber;
        uint taskDuration;
    }

    GMInfo public gmInfo;
    Configuration public configuration;


    constructor () public {
        admin = msg.sender;
        gmInfo.initModel = "Init Model";
        gmInfo.minimumPeerNumber = 10;
        gmInfo.threshold = 9000; //DECIMALBASE 10000, threshold is 90%
        configuration.learningRate = 10;
        configuration.trainingModel = "Training Model";
        configuration.batchSize = 50;
        configuration.iterationNumber = 1000;
    }

    function selectGroup(address groupAddress) public {
        dataProviderGroup = DataProviderGroup(groupAddress);
    }

    function startTask() public {
        dataProviderGroup.startTask(gmInfo.initModel,
            configuration.trainingModel,
            gmInfo.threshold,
            gmInfo.minimumPeerNumber,
            configuration.learningRate,
            configuration.batchSize,
            configuration.iterationNumber,
            configuration.taskDuration,
            bounty);
    }

    function completeTask() public {
        IERC20(rewardToken).transferFrom(address(this), address(dataProviderGroup), bounty);
    }
}