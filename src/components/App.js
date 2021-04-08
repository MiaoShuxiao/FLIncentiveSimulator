import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import AssetVault from '../abis/AssetVault'
import UniswapV2Vault from '../abis/UniswapV2Vault'
import AMMVaultPolicy from '../abis/AMMVaultPolicy'
import ERC20Token from '../abis/ERC20Token'
import Addressbar from './Addressbar'
import Main from './Main'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      lpBundles: [],
      // rinkby
      assetVaultAddress: '0x47f9B2b7E41A1e293f4a440360eAeac29a4F72De',
      uniswapV2VaultAddress: '0x66Fecd3d7b67a1F88cC8849CF9449f282A3BFA2D',
      ammVaultPolictyAddress: '0x662717dB4110Cb0e1fA8366f6076348aF0dEaD52',
      ubcTokenAddress: '0xA2D05B18854709434293237B98aEA0aFb11b31Cd',
      daiTokenAddress: '0xe6959A36be14fE547Ef18F7b8b18aB6d5dE79631'

      // kovan
      // assetVaultAddress: '0x6664De33de0Cdb367BBBcaf7d20698cAA3f52024',
      // uniswapV2VaultAddress: '0x9127b947C85b6048637803650f9e2b9DB828d150',
      // ammVaultPolictyAddress: '0x7d40B076f2700BE48B236AE5948d41E89EDb3A72',
      // ubcTokenAddress: '0x12A5E4b5B826676a572FDA3AfFC2B1797e7961Fa',
      // daiTokenAddress: '0x7Bcde7f1B6Cf0b87EE27a943b5De4F994156273c'
    };

    this.addCapitalType = async () => {
      const gasAmount = await this.state.deployedAMMVaultPolicy.methods.addCapitalType(this.state.daiTokenAddress).estimateGas({from: this.state.account})
      this.state.deployedAMMVaultPolicy.methods.addCapitalType(this.state.daiTokenAddress).send({from: this.state.account, gas:gasAmount})
    }

    this.addBorrower = async () => {
      const gasAmount = await this.state.deployedAssetVault.methods.addBorrower(this.state.uniswapV2VaultAddress).estimateGas({from: this.state.account})
      this.state.deployedAssetVault.methods.addBorrower(this.state.uniswapV2VaultAddress).send({from: this.state.account, gas:gasAmount})
    }

    this.assetApprove = async (amount) => {
      const gasAmount = await this.state.deployedUBCToken.methods.approve(this.state.assetVaultAddress, amount).estimateGas({from: this.state.account})
      this.state.deployedUBCToken.methods.approve(this.state.assetVaultAddress, amount).send({from: this.state.account, gas:gasAmount})
    }

    this.asset2Approve = async (amount) => {
      const gasAmount = await this.state.deployedUBCToken.methods.approve(this.state.uniswapV2VaultAddress, amount).estimateGas({from: this.state.account})
      this.state.deployedUBCToken.methods.approve(this.state.uniswapV2VaultAddress, amount).send({from: this.state.account, gas:gasAmount})
    }

    this.capitalApprove = async (amount) => {
      const gasAmount = await this.state.deployedDAIToken.methods.approve(this.state.uniswapV2VaultAddress, amount).estimateGas({from: this.state.account})
      this.state.deployedDAIToken.methods.approve(this.state.uniswapV2VaultAddress, amount).send({from: this.state.account, gas:gasAmount})
    }

    this.deposit = async (assetAmount) => {
      const gasAmount = await this.state.deployedAssetVault.methods.deposit(this.state.ubcTokenAddress, assetAmount).estimateGas({from: this.state.account})
      this.state.deployedAssetVault.methods.deposit(this.state.ubcTokenAddress, assetAmount).send({from: this.state.account, gas: gasAmount})
      .once('receipt', async (receipt)=> {
      })
    }
  
    this.withdraw = async (assetAmount) => {
      const gasAmount = await this.state.deployedAssetVault.methods.withdraw(this.state.ubcTokenAddress, assetAmount).estimateGas({from: this.state.account})
      this.state.deployedAssetVault.methods.withdraw(this.state.ubcTokenAddress, assetAmount).send({from: this.state.account, gas: gasAmount })
      .once('receipt', async (receipt)=> {
      })
    }

    this.addLiquidity = async(capitalAmount) => {
      const gasAmount = await this.state.deployedUniswapV2Vault.methods.addLiquidity(this.state.daiTokenAddress, capitalAmount, this.state.ubcTokenAddress).estimateGas({from: this.state.account})
      this.state.deployedUniswapV2Vault.methods.addLiquidity(this.state.daiTokenAddress, capitalAmount, this.state.ubcTokenAddress).send({from: this.state.account, gas: gasAmount })
    }

    this.removeLiquidity = async(bundleID, amount) => {
      console.log(bundleID);
      // const gasAmount = await this.state.deployedUniswapV2Vault.methods.removeLiquidity(this.state.daiTokenAddress, this.state.ubcTokenAddress, 0, 0).estimateGas({from: this.state.account})
      await this.state.deployedUniswapV2Vault.methods.removeLiquidity(this.state.daiTokenAddress, this.state.ubcTokenAddress, bundleID, amount).send({from: this.state.account})
    }
  }
  
  async componentDidMount(){
    await this.getWeb3Provider();
    await this.connectToBlockchain();
  }
  
  async getWeb3Provider(){
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async connectToBlockchain(){
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]});
    const deployedAssetVault = new web3.eth.Contract(AssetVault.abi, this.state.assetVaultAddress);
    this.setState({deployedAssetVault: deployedAssetVault});
    const deployedUniswapV2Vault = new web3.eth.Contract(UniswapV2Vault.abi, this.state.uniswapV2VaultAddress);
    this.setState({deployedUniswapV2Vault: deployedUniswapV2Vault});
    const deployedAMMVaultPolicy = new web3.eth.Contract(AMMVaultPolicy.abi, this.state.ammVaultPolictyAddress);
    this.setState({deployedAMMVaultPolicy: deployedAMMVaultPolicy});
    const deployedUBCToken = new web3.eth.Contract(ERC20Token.abi, this.state.ubcTokenAddress);
    const deployedDAIToken = new web3.eth.Contract(ERC20Token.abi, this.state.daiTokenAddress);
    this.setState({deployedUBCToken: deployedUBCToken});
    this.setState({deployedDAIToken: deployedDAIToken});
    const lpBundle = await deployedUniswapV2Vault.methods.lpBundles(this.state.account, this.state.daiTokenAddress, this.state.ubcTokenAddress).call();
    this.setState({lpBundles: [lpBundle]});
  }
  
  render() {
    return (
      <div>
        <Addressbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main>
              { this.state.loading 
                ? 
                  <div><p className="text-center">Loading ...</p></div> 
                : 
                  <Main
                        lpBundles = {this.state.lpBundles}
                        addBorrower = {this.addBorrower}
                        deposit = {this.deposit}
                        withdraw = {this.withdraw}
                        addCapitalType = {this.addCapitalType}
                        assetApprove = {this.assetApprove}
                        asset2Approve = {this.asset2Approve}
                        capitalApprove = {this.capitalApprove}
                        addLiquidity = {this.addLiquidity}
                        removeLiquidity = {this.removeLiquidity}
                  />}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
