import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createTrip } from "../api/tripApi";
import TripMap from "../components/TripMap";
import "./Planner.css";

const Planner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ from: "", to: "", date: "" });
  // searchedRoute holds the from/to that we actually pass to the map
  // (kept separate from formData so the map doesn't refire on every keystroke)
  const [searchedRoute, setSearchedRoute] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // fires when the form is submitted (covers both the Enter key and clicking the button)
  const handleSearch = (e) => {
    e.preventDefault();

    if (!formData.from.trim() || !formData.to.trim() || !formData.date) {
      return;
    }

    setRouteInfo(null);
    setSaveMessage("");
    setSearchedRoute({ from: formData.from.trim(), to: formData.to.trim() });
  };

  const handleSaveTrip = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setSaving(true);
    setSaveMessage("");

    try {
      await createTrip({
        from: formData.from,
        to: formData.to,
        date: formData.date,
        distanceText: routeInfo.distanceText,
        durationText: routeInfo.durationText,
      });
      setSaveMessage("Trip saved! You can see it on your dashboard.");
    } catch (err) {
      setSaveMessage(err.response?.data?.message || "Could not save the trip, please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-section">
      <div className="container planner-page">
        <span className="eyebrow">Trip planner</span>
        <h2 className="section-heading">Where are you headed?</h2>
        <p className="section-subtext">
          Type a starting point, a destination and a date, then hit enter to see the route,
          distance and travel time on the map.
        </p>

        <form className="planner-form card-surface" onSubmit={handleSearch}>
          <div className="form-group">
            <label htmlFor="from">From</label>
            <input
              type="text"
              id="from"
              name="from"
              value={formData.from}
              onChange={handleChange}
              placeholder="e.g. Jammu"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="to">To</label>
            <input
              type="text"
              id="to"
              name="to"
              value={formData.to}
              onChange={handleChange}
              placeholder="e.g. Gulmarg"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary planner-search-btn">
            Find route
          </button>
        </form>

        {searchedRoute && (
          <div className="planner-results">
            {routeInfo && (
              <div className="route-summary card-surface">
                <div className="route-summary-item">
                  <span className="route-summary-label">Route</span>
                  <span className="route-summary-value">
                    {searchedRoute.from} → {searchedRoute.to}
                  </span>
                </div>
                <div className="route-summary-item">
                  <span className="route-summary-label">Distance</span>
                  <span className="route-summary-value">{routeInfo.distanceText}</span>
                </div>
                <div className="route-summary-item">
                  <span className="route-summary-label">Travel time</span>
                  <span className="route-summary-value">{routeInfo.durationText}</span>
                </div>
                <button
    className="btn btn-primary"
    onClick={handleSaveTrip}
    disabled={saving || !routeInfo}
>
                  {saving ? "Saving..." : "Save this trip"}
                </button>
              </div>
            )}

            {saveMessage && <p className="planner-save-message">{saveMessage}</p>}

            <TripMap
    origin={searchedRoute?.from}
    destination={searchedRoute?.to}
    onRouteFound={(data) => {
        setRouteInfo(data);
    }}
/>
          </div>
        )}
      </div>
    </div>
  );
};

export default Planner;
