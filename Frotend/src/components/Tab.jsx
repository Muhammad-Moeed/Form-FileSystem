import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Tab = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Nav.Item>
      <Nav.Link
        as={Link}
        to={to}
        className={`custom-tab-link ${isActive ? 'active' : ''}`}
      >
        {label}
      </Nav.Link>
    </Nav.Item>
  );
};

export default Tab;
