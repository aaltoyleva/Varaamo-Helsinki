import React, { PropTypes } from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import { LinkContainer } from 'react-router-bootstrap';

import { injectT } from 'i18n';
import { getSearchPageUrl } from 'utils/searchUtils';

function MainNavbar(props) {
  const {
    activeLink,
    clearSearchResults,
    isAdmin,
    isLoggedIn,
    t,
  } = props;

  return (
    <Navbar className="app-MainNavbar" fluid>
      <Navbar.Header>
        <Navbar.Brand>Varaamo</Navbar.Brand>
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav activeKey={activeLink}>
          <LinkContainer to={getSearchPageUrl()}>
            <NavItem eventKey="/" onClick={clearSearchResults}>
              {t('Navbar.search')}
            </NavItem>
          </LinkContainer>
          {isAdmin && (
            <LinkContainer to="/admin-resources">
              <NavItem eventKey="/admin-resources">
                {t('Navbar.adminResources')}
              </NavItem>
            </LinkContainer>
          )}
          {isLoggedIn && (
            <LinkContainer to="/my-reservations">
              <NavItem eventKey="/my-reservations">
                {t('Navbar.userResources')}
              </NavItem>
            </LinkContainer>
          )}
          <LinkContainer to="/about">
            <NavItem eventKey="/about" href="/about">
              {t('Navbar.aboutLink')}
            </NavItem>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

MainNavbar.propTypes = {
  activeLink: PropTypes.string.isRequired,
  clearSearchResults: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(MainNavbar);
