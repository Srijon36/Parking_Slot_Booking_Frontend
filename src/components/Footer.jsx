import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <span>© {year} ParkEase Inc. All rights reserved.</span>

      <div className="site-footer-links">
        <Link to="/">Support</Link>
        <Link to="/">Terms of Service</Link>
        <Link to="/">Privacy Policy</Link>
      </div>
    </footer>
  );
};

export default Footer;