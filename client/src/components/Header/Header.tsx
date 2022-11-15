import { FC } from 'react';
import { Link } from 'react-router-dom';
import useEth from '../../contexts/EthContext/useEth';
import './header.scss';

export const Header: FC = () => {
  const { state, connectWallet } = useEth();

  return (
    <div className="header">
      <Link to="/">
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
      </Link>

      <nav className="header-navbar">
        <Link to="/" className="header-navbar-item">Home</Link>
        <Link to="/create-campaign" className="header-navbar-item">Create Campaign</Link>
        <Link to="/my-campaigns" className="header-navbar-item">My Campaigns</Link>
        <Link to="/my-rewards" className="header-navbar-item">My rewards</Link>
        <Link to="/about" className="header-navbar-item">About</Link>
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
