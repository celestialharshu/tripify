import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createTrip } from "../api/tripApi";
import { geocodePlace, getRoute } from "../api/orsApi";
import { formatRoute } from "../utils/distance";
import TripMap from "../components/TripMap";
import TravelOptionsPanel from "../components/TravelOptionsPanel";
import "./Planner.css";

const Planner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ from: "", to: "", date: "" });
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  // the resolved coordinates and routes for the last search
  // these get shared by both the map and the travel options panel below
  const [originCoord, setOriginCoord] = useState(null);
  const [destinationCoord, setDestinationCoord] = useState(null);
  const [drivingRoute, setDrivingRoute] = useState(null);
  const [walkingRoute, setWalkingRoute] = useState(null);

  const [saveMessage, setSaveMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // fires when the form is submitted (covers both the Enter key and clicking the button)
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!formData.from.trim() || !formData.to.trim() || !formData.date) {
      return;
    }

    setSearching(true);
    setSearchError("");
    setSaveMessage("");
    setDrivingRoute(null);
    setWalkingRoute(null);

    try {
      // step 1: turn the two place names into real coordinates
      const [origin, destination] = await Promise.all([
        geocodePlace(formData.from),
        geocodePlace(formData.to),
      ]);

      setOriginCoord(origin);
      setDestinationCoord(destination);

      // step 2: the actual driving route - this is what gets shown on the map
      // and saved if the user keeps this trip
      const driving = await getRoute(origin, destination, "driving-car");
      setDrivingRoute(formatRoute(driving));

      // step 3: a walking route too, just for the comparison panel
      // wrapped in its own try/catch so a slow/odd walking route never blocks the page
      try {
        const walking = await getRoute(origin, destination, "foot-walking");
        setWalkingRoute(formatRoute(walking));
      } catch {
        setWalkingRoute(null);
      }
    } catch (err) {
      setSearchError(
        err.message || "Couldn't find a route between these places. Try checking the spelling."
      );
    } finally {
      setSearching(false);
    }
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
        distanceText: drivingRoute.distanceText,
        durationText: drivingRoute.durationText,
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
          Type a starting point, a destination and a date, then hit enter to see the route on
          the map plus how it compares across walking, cab, train and flight.
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

          <button type="submit" className="btn btn-primary planner-search-btn" disabled={searching}>
            {searching ? "Searching..." : "Find route"}
          </button>
        </form>

        {searchError && <p className="error-text">{searchError}</p>}

        {drivingRoute && (
          <div className="planner-results">
            <div className="route-summary card-surface">
              <div className="route-summary-item">
                <span className="route-summary-label">Route</span>
                <span className="route-summary-value">
                  {formData.from} → {formData.to}
                </span>
              </div>
              <div className="route-summary-item">
                <span className="route-summary-label">Distance</span>
                <span className="route-summary-value">{drivingRoute.distanceText}</span>
              </div>
              <div className="route-summary-item">
                <span className="route-summary-label">Driving time</span>
                <span className="route-summary-value">{drivingRoute.durationText}</span>
              </div>
              <button className="btn btn-primary" onClick={handleSaveTrip} disabled={saving}>
                {saving ? "Saving..." : "Save this trip"}
              </button>
            </div>

            {saveMessage && <p className="planner-save-message">{saveMessage}</p>}

            <TripMap originCoord={originCoord} destinationCoord={destinationCoord} route={drivingRoute} />

            <TravelOptionsPanel
              originCoord={originCoord}
              destinationCoord={destinationCoord}
              drivingRoute={drivingRoute}
              walkingRoute={walkingRoute}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Planner;
