import React from 'react';
import { Nav } from 'react-bootstrap';
import '../App.css';
import Tab from '../components/Tab';
import bg from '../assets/bg.jpg';
import logo from '../assets/saylani-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // ✅ Required for icons to show
import { faFacebookF, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { PiStudent } from "react-icons/pi";

const socialLinks = [
  {
    href: 'https://www.facebook.com/muhammad.moeed.qadri.2025',
    icon: faFacebookF,
    label: 'Facebook',
    color: '#4d72aa',
  },
  {
    href: 'https://www.instagram.com/muhammadmoeedqadri/',
    icon: faInstagram,
    label: 'Instagram',
    color: '#d55f76',
  },
  {
    href: 'https://www.youtube.com/@muhammadmoeedqadri',
    icon: faYoutube,
    label: 'YouTube',
    color: '#ca3737',
  },
];

const tabs = [
  { to: "/", label: "Registration" },
  { to: "/download", label: "Download ID Card" },
  { to: "/results", label: "Results" },
];

const Header = () => {
  return (
    <header className="bg-white w-full">
      <div className="w-full mx-auto">

        <div
          className="max-w-[1000px] mx-auto h-[140px] bg-cover bg-center flex flex-col items-center justify-center relative"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backgroundBlendMode: 'lighten',
          }}
        >
          {/* Logo */}
          <img src={logo} alt="Saylani Logo" className="h-[60px] mb-1" />

          {/* Bottom row */}
          <div className="w-full flex items-center text-gray-700 px-4">

            {/* Social Icons */}
            <div className="flex items-center gap-3 ml-6 px-5">
              {socialLinks.map(({ href, icon, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:scale-110"
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-full"
                    style={{ backgroundColor: color, color: 'white' }}
                  >
                    <FontAwesomeIcon icon={icon} className="text-lg p-2" />
                  </div>

                </a>
              ))}
            </div>

            {/* Center heading */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h3 className="text-md font-semibold whitespace-nowrap">
                <b>Registration Form-SMIT</b>
              </h3>
            </div>

            {/* Right: button */}
            <div className="ml-auto mr-4">
              <button
                className="bg-white bg-opacity-70 font-semibold px-3 py-1 rounded-full backdrop-blur-sm hover:bg-opacity-90 transition text-sm portal"
              >
                <PiStudent className="inline mr-1" /> Student Portal
              </button>
            </div>
          </div>
        </div>

        {/* Tabs navigation */}
        <Nav variant="tabs" className="justify-center mt-2 custom-tabs">
          {tabs.map(({ to, label }) => (
            <Tab key={to} to={to} label={label} />
          ))}
        </Nav>
      </div>
    </header>
  );
};

export default Header;
