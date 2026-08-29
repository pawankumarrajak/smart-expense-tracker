function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div
            className="footer-logo"
            aria-hidden="true"
          >
            ₹
          </div>

          <div className="footer-brand-text">
            <strong>Smart Expense Tracker</strong>

            <span>
              Track smarter. Spend better.
            </span>
          </div>
        </div>

        <div
          className="footer-divider"
          aria-hidden="true"
        />

        <p className="footer-copyright">
          © {currentYear} Smart Expense Tracker.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;