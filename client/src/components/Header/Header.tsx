import { FC } from 'react';
import './header.scss';

export const Header: FC = () => (
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
      <button className="header-authorization-sign-up button" type="submit">Sign up</button>
      <button className="header-authorization-sign-in button" type="submit">Sign in</button>
    </div>
  </div>
);
