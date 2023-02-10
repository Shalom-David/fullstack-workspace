import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom'
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaLinkedin,
} from 'react-icons/fa'
import { MdFingerprint } from 'react-icons/md'
import logo from '../../libs/Travelays-Logo.png'
import ScrollToTop from '../BackToTopButton/ScrollToTop'

function Footer() {
  return (
    <div className="footer-container">
      <ScrollToTop />
      <div className="footer-links">
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2>About Us</h2>
            <Link to="/">How it works</Link>
            <Link to="/">Testimonials</Link>
            <Link to="/">Careers</Link>
            <Link to="/">Investors</Link>
            <Link to="/">Terms of Service</Link>
          </div>
          <div className="footer-link-items">
            <h2>Contact Us</h2>
            <Link to="/">Contact</Link>
            <Link to="/">Support</Link>
            <Link to="/">Destinations</Link>
            <Link to="/">Sponsorships</Link>
          </div>
        </div>
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2>Social Media</h2>
            <Link to="/">Instagram</Link>
            <Link to="/">Facebook</Link>
            <Link to="/">Youtube</Link>
            <Link to="/">Twitter</Link>
          </div>
        </div>
      </div>
      <section className="social-media">
        <div className="social-media-wrap">
          <div className="footer-logo">
            <Link to="/" className="social-logo">
              <MdFingerprint className="navbar-icon" />
              <img className="logoImgFooter" src={logo} alt="travelays-logo" />
            </Link>
          </div>
          <small className="website-rights">TRAVELAYS © 2023</small>
          <div className="social-icons">
            <Link className="social-icon-link" to="/" aria-label="Facebook">
              <FaFacebook />
            </Link>
            <Link className="social-icon-link" to="/" aria-label="Instagram">
              <FaInstagram />
            </Link>
            <Link className="social-icon-link" to="/" aria-label="Youtube">
              <FaYoutube />
            </Link>
            <Link className="social-icon-link" to="/" aria-label="Twitter">
              <FaTwitter />
            </Link>
            <Link className="social-icon-link" to="/" aria-label="LinkedIn">
              <FaLinkedin />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Footer
