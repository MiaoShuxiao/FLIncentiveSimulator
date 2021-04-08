import React, { Component } from 'react';

class Main extends Component {
  state = {
    assetAmount: 0,
    capitalAmount: 0,
    assetAmountToRepay: 0,
    bundleID: 0,
  };

  constructor(props) {
    super(props);

    this.handleCapitalApprove = this.handleCapitalApprove.bind(this);
    this.handleAssetApprove = this.handleAssetApprove.bind(this);
    this.handleAsset2Approve = this.handleAsset2Approve.bind(this);
    this.handleDeposit = this.handleDeposit.bind(this);
    this.handleWithdraw = this.handleWithdraw.bind(this);
    this.handleAddLiquidity = this.handleAddLiquidity.bind(this);
    this.handleRemoveLiquidity = this.handleRemoveLiquidity.bind(this);
    this.handleAddCapitalType = this.handleAddCapitalType.bind(this);
    this.handleAddBorrower = this.handleAddBorrower.bind(this);
  }

  // AssetAddressChangeHandler = (event) => {
  //   this.setState({assetAddress: event.target.value});
  // }

  // CapitalAddressChangeHandler = (event) => {
  //   this.setState({capitalAddress: event.target.value});
  // }

  AssetAmountChangeHandler = (event) => {
    if(event.target.value !== ''){
      this.setState({assetAmount: window.web3.utils.toWei(event.target.value.toString(), 'Ether')});
    } else {
      this.setState({assetAmount: 0});
    }
  }

  AssetAmountToRepayChangeHandler = (event) => {
    if(event.target.value !== ''){
       this.setState({assetAmountToRepay: window.web3.utils.toWei(event.target.value.toString(), 'Ether')});
   } else {
       this.setState({assetAmountToRepay: 0});
    }
 }

  CapitalAmountChangeHandler = (event) => {
    if(event.target.value !== ''){
      this.setState({capitalAmount: window.web3.utils.toWei(event.target.value.toString(), 'Ether')});
    } else {
      this.setState({capitalAmount: 0});
    }
  }

  BundleIDChangeHandler = (event) => {
    this.setState({bundleID: event.target.value});
  }

  async handleAddCapitalType(event) {
      event.preventDefault();
      await this.props.addCapitalType()
  }

  async handleAddBorrower(event) {
      event.preventDefault();
      await this.props.addBorrower()
  }


    async handleCapitalApprove(event) {
    event.preventDefault();
    await this.props.capitalApprove(this.state.capitalAmount)
  }

  async handleAssetApprove(event) {
    event.preventDefault();
    await this.props.assetApprove(this.state.assetAmount)
  }

  async handleAsset2Approve(event) {
    event.preventDefault();
    await this.props.asset2Approve(this.state.assetAmountToRepay)
  }
  async handleDeposit(event) {
    event.preventDefault();
    // const assetAddress = this.state.assetAddress
    await this.props.deposit(this.state.assetAmount)
  }

  async handleWithdraw(event) {
    event.preventDefault();
    // const assetAddress = this.state.assetAddress
    await this.props.withdraw(this.state.assetAmount)
  }

  async handleAddLiquidity(event) {
    event.preventDefault();
    const capitalAmount = this.state.capitalAmount
    await this.props.addLiquidity(capitalAmount)
  }

  async handleRemoveLiquidity(event) {
    event.preventDefault();
    const bundleID = this.state.bundleID;
    const assetAmountToRepay = this.state.assetAmountToRepay;
    await this.props.removeLiquidity(bundleID, assetAmountToRepay)
  }

  render() {
    return (
      <div id="content">
        <h2>Deposit</h2>
        <form>
        <div>
            <input 
            id="assetAmount"
            type="text"
            onChange={this.AssetAmountChangeHandler}
            className="form-control"
            placeholder="Asset Token Amount"
            required/>
        </div>
        <button type="submit" className="btn btn-primary" onClick = {this.handleAssetApprove}>Approve</button>
        <button type="submit" className="btn btn-primary" onClick = {this.handleDeposit}>Deposit</button>
        <button type="submit" className="btn btn-primary" onClick = {this.handleWithdraw}>Withdraw</button>
        </form>
        <h2>Add Liquidity</h2>
        <form>
        <div>
            <input 
            id="capitalAmount"
            type="text"
            onChange={this.CapitalAmountChangeHandler}
            className="form-control"
            placeholder="Capital Token Amount"
            required/>
        </div>
        <button type="submit" className="btn btn-primary" onClick = {this.handleCapitalApprove}>Approve</button>
        <button type="submit" className="btn btn-primary" onClick = {this.handleAddLiquidity}>Add Liquidity</button>
        </form>
        <h2>Remove Liquidity</h2>
        <form>
        <div>
            <input 
            id="bundleId"
            type="text"
            onChange={this.BundleIDChangeHandler}
            className="form-control"
            placeholder="BundleID"
            required/>
        </div>
        <button type="submit" className="btn btn-primary" onClick = {this.handleRemoveLiquidity}>Remove Liquidity</button>
        </form>
        <form>
        <div>
            <input
            id="assetAmount"
            type="text"
            onChange={this.AssetAmountToRepayChangeHandler}
            className="form-control"
            placeholder="Asset Token Amount"
            required/>
        </div>
        <button type="submit" className="btn btn-primary" onClick = {this.handleAsset2Approve}>Approve</button>
        </form>
        <h2>Add Capital Type</h2>
        <button className="btn btn-primary" onClick = {this.handleAddCapitalType}>Approve DAI Token</button>
          <h2>Add Borrower</h2>
          <button className="btn btn-primary" onClick = {this.handleAddBorrower}>Add UniswapV2Vault as borrower</button>
      </div>
    );
  }
}

export default Main;
