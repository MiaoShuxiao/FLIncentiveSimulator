// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.6;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract DataProviderGroup {
    using SafeERC20 for IERC20;
    using SafeMath for uint;
    mapping(address => uint) public stakeBalances;
    mapping(address => bool) public isGroupMember;

    mapping(uint => string[]) public selectedUpdates;

    mapping(uint => address[]) public activeMemberForEachRound;
    mapping(address => bool) public isTrainer;
    mapping(address => bool) public isVerifier;

    uint currentRound = 0;

    address[] rewardTrainer;
    address[] rewardVerifier;

    uint TrainerRewardPerRound = 100;
    uint VerifierRewardPerRound = 5;

    event TaskStarted(
        string indexed initModel,
        string indexed trainingModel,
        uint threshold,
        uint minimumPeerNumber,
        uint learningRate,
        uint batchSize,
        uint iterationNumber,
        uint taskDuration
    );

    event RoundStarted(
        string indexed previousModel,
        string indexed trainingModel,
        uint threshold,
        uint learningRate,
        uint batchSize,
        uint roundNumber
    );

    event JobAssigned();

    event JobCompleted(
        string indexed finalModel
    );

    event JobFailed();

    string public finalModel;

    address public admin;
    address public rewardToken;

    string deviceInfo;
    uint peerTotalNumber;
    string dataType;
    string dataSample;

    uint minimumBounty;

    modifier onlyGroupMember() {
        require(isGroupMember[msg.sender], 'Not a valid group member.');
        _;
    }

    constructor () {
        admin = msg.sender;
        deviceInfo = 'Android Phone';
        peerTotalNumber = 0;
        dataType = 'Keyboard Input History';
        dataSample = 'Sample Input';
        minimumBounty = 100000000000000000; //1 reward token
    }

    function joinGroup(string memory ipAddress) public {
        if(_isPeerEligible()){
            peerTotalNumber = peerTotalNumber + 1;
            stakeBalances[msg.sender] = 0;
            isGroupMember[msg.sender] = true;
        }
    }

    function withdrawStake(uint amount) public {
        require(amount <= stakeBalances[msg.sender], 'Not enough amount to withdraw.');
        stakeBalances[msg.sender] = stakeBalances[msg.sender].sub(amount);
        IERC20(rewardToken).safeTransfer(msg.sender, amount);
    }

    function startTask(string memory initModel, string memory trainingModel, uint threshold, uint minimumPeerNumber, uint learningRate, uint batchSize, uint iterationNumber, uint taskDuration, uint bounty) public onlyGroupMember {
        if(bounty < minimumBounty || minimumPeerNumber > peerTotalNumber) {
            emit JobFailed();
        }

        emit TaskStarted(initModel,
            trainingModel,
            threshold,
            minimumPeerNumber,
            learningRate,
            batchSize,
            iterationNumber,
            taskDuration);
    }

    function startRound(string memory previousGM, string memory trainingModel, uint roundNumber, uint threshold, uint learningRate, uint batchSize) public {
        emit RoundStarted(previousGM,
            trainingModel,
            threshold,
            learningRate,
            batchSize,
            roundNumber);
    }

    function recordData(string[] memory updates, address[] memory trainer, address verifier, uint round) public {
        uint totalT = trainer.length;
        uint totalU = updates.length;
        for(uint i = 0; i < totalU; i++) {
            selectedUpdates[round].push(updates[i]);
        }

        for(uint i = 0; i < totalT; i++) {
            rewardTrainer.push(trainer[i]);
        }

        rewardVerifier.push(verifier);
    }

    function endRound() public {
        updateStake();
        // check the end condition, start another round or return the final model
        string memory finalModel = 'test final model';
        emit JobCompleted(finalModel);
    }

    function updateStake() public {
        // add reward to their stake
        uint totalT = rewardTrainer.length;
        uint totalV = rewardVerifier.length;
        for(uint i = 0; i < totalT; i++) {
            stakeBalances[rewardTrainer[i]] = stakeBalances[rewardTrainer[i]] + TrainerRewardPerRound;
        }

        for(uint i = 0; i < totalV; i++) {
            stakeBalances[rewardVerifier[i]] = stakeBalances[rewardVerifier[i]] + VerifierRewardPerRound;
        }
    }

    function joinActiveNode(uint roundNumber) public onlyGroupMember {
        activeMemberForEachRound[roundNumber].push(msg.sender);
    }

    function assignJobs() public {
        // use hash value and hash ring to assign each active node a job => either a trainer or a isVerifier
        isTrainer[msg.sender] = true;
        isVerifier[msg.sender] = true;
        emit JobAssigned();
    }

    function _isPeerEligible() private returns (bool) {
        // TODO: run a small learning task to verify if the node is eligible to do any related FL task
        return true;
    }
}