import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>
          <strong>Tripify</strong> — plan it, track it, live it.
        </p>
        <p className="footer-copy">© {year} Tripify. Built for travelers who like a plan.</p>
      </div>
    </footer>
  );
};

export default Footer;
