import React, { Component } from 'react';

class Addressbar extends Component {
  render() {
    return (
    <nav>
        <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-black"><span id="account">{"Your Address: " + this.props.account}</span></small>
            </li>
        </ul>
    </nav>
    );
  }
}

export default Addressbar;
