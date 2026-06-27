import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="page-section">
      <div className="container empty-state">
        <h2 className="section-heading">404</h2>
        <p>This page took a wrong turn. Let's get you back on route.</p>
        <br />
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
