import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPlaces } from "../api/placeApi";
import PlaceCard from "../components/PlaceCard";
import Loader from "../components/Loader";
import "./Home.css";

const Home = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // grab the destination list from the backend once when the page loads
  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const data = await getPlaces();
        setPlaces(data);
      } catch (err) {
        setError("Couldn't load destinations right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadPlaces();
  }, []);

  return (
    <div>
      {/* ---------- hero section ---------- */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="eyebrow">Plan smarter, travel further</span>
            <h1>
              Your next trip,
              <br />
              mapped &amp; tracked.
            </h1>
            <p>
              Tripify helps you figure out the route, the distance and the time between any two
              places, then keeps every trip you plan in one tidy dashboard.
            </p>
            <div className="hero-actions">
              <Link to="/planner" className="btn btn-primary">
                Plan a trip
              </Link>
              <Link to="/register" className="btn btn-outline">
                Create free account
              </Link>
            </div>
          </div>

          {/* signature element: a dashed route connecting a start pin to an end pin */}
          <div className="hero-route" aria-hidden="true">
            <svg viewBox="0 0 320 320" fill="none">
              <path
                d="M40 270 C 80 180, 60 120, 140 110 S 260 60, 280 40"
                stroke="var(--primary)"
                strokeWidth="3"
                strokeDasharray="10 10"
                strokeLinecap="round"
              />
              <circle cx="40" cy="270" r="9" fill="var(--accent)" />
              <circle cx="40" cy="270" r="4" fill="var(--surface)" />
              <circle cx="280" cy="40" r="9" fill="var(--primary)" />
              <circle cx="280" cy="40" r="4" fill="var(--surface)" />
            </svg>
          </div>
        </div>
      </section>

      {/* ---------- destinations grid, grows with your MongoDB data ---------- */}
      <section className="page-section">
        <div className="container">
          <span className="eyebrow">Popular picks</span>
          <h2 className="section-heading">Destinations worth the drive</h2>
          <p className="section-subtext">
            A growing list of places to explore — add more from your database any time and they
            show up here automatically.
          </p>

          {loading && <Loader />}

          {!loading && error && <p className="error-text">{error}</p>}

          {!loading && !error && places.length === 0 && (
            <div className="empty-state">
              No destinations yet. Run the seed script or add a place from the API to see this
              section come alive.
            </div>
          )}

          {!loading && !error && places.length > 0 && (
            <div className="places-grid">
              {places.map((place) => (
                <PlaceCard key={place._id} place={place} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
