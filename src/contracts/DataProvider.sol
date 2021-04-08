// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.6;

import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract DataProvider {
    using SafeMath for uint;
    using SafeERC20 for IERC20;
    using Address for address;

    address owner;

    mapping(uint => mapping(address => string)) recordedUpdates;

    event UpdateUpload(
        uint round,
        string indexed newUpdate
    );

    event UpdateVerified(
        uint round,
        string[] indexed update,
        address[] indexed trainer
    );

    constructor() {
        owner = msg.sender;
    }

    function doTrainingJob(string memory previousGM, uint learningRate, uint batchSize, uint round) public returns (string memory newUpdate) {
        // do the training job here
        newUpdate = "New Update";
        emit UpdateUpload(round, newUpdate);
        return newUpdate;
    }

    function doVerifyJob(string memory previoudGM, string[] memory newUpdate, uint round) public {
        // aggregate the share and do the verification job here
        string[3] memory selectedUpdates = ["1","2","3"];
        address[3] memory selectedTrainers = ['0x36eaf79c12e96a3dc6f53426c','0xf235aa56dd96bda02acfb361e','0xf235aa56dd96bda02acfb361d'];
        emit UpdateVerified(round, selectedUpdates, selectedTrainers);
    }
}