import { FC } from 'react';
import useEth from '../../contexts/EthContext/useEth';
import './header.scss';

export const Header: FC = () => {
  const { state, connectWallet } = useEth();

  return (
    <div className="header">
      <div className="header-logo">
        <div className="header-logo-icon">TOD</div>
        <p className="header-logo-text">
          Tokenization
          <br />
          Of
          <br />
          Donation
        </p>
      </div>

      <nav className="header-navbar">
        <div className="header-navbar-item">Home</div>
        <div className="header-navbar-item">Create Campaign</div>
        <div className="header-navbar-item">About</div>
      </nav>

      <div className="header-authorization">
        {state.isMetamaskInstalled
          ? state.userAccount
            ? (
              <p className="header-authorization-account-address">{state.userAccount}</p>
            )
            : (<button onClick={connectWallet} className="header-authorization-sign-up button" type="submit">Connect wallet</button>)
          : (
            <a href="https://metamask.io/download/" target="_blank" rel="noreferrer">
              <button type="button">Install metamask wallet to login</button>
            </a>
          )}

      </div>
    </div>
  );
};
