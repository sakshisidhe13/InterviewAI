// =============================================
// FILE: src/components/Footer.jsx
// PURPOSE: Bottom of the page with branding, links, and copyright
// =============================================

function Footer() {
  // Get the current year dynamically — no need to update manually each year
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">

      {/* Top row: branding + nav links */}
      <div className="footer-top">

        {/* Brand name */}
        <div className="footer-brand">
          <span className="footer-logo">InterviewAI</span>
          <p className="footer-tagline">Prepare smarter. Interview better.</p>
        </div>

        {/* Footer navigation links */}
        <nav className="footer-nav" aria-label="Footer navigation">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </nav>

      </div>

      {/* Divider line */}
      <hr className="footer-divider" />

      {/* Bottom row: copyright */}
      <div className="footer-bottom">
        <p>© {currentYear} InterviewAI. All rights reserved.</p>
      </div>

    </footer>
  );
}

export default Footer;
