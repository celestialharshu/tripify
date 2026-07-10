import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createTrip } from "../api/tripApi";
import { geocodePlace, getRoute } from "../api/orsApi";
import { formatRoute } from "../utils/distance";
import TripMap from "../components/TripMap";
import AiItinerary from "../components/AiItinerary";
import "./Planner.css";

const Planner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({ from: "", to: "", date: "" });
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [originCoord, setOriginCoord] = useState(null);
  const [destinationCoord, setDestinationCoord] = useState(null);
  const [drivingRoute, setDrivingRoute] = useState(null);

  const [saveMessage, setSaveMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // if the user arrived here via a "Book Now" click on a place card,
  // the destination is already in the URL as ?to=PlaceName — pre-fill it
  useEffect(() => {
    const destinationFromUrl = searchParams.get("to");
    if (destinationFromUrl) {
      setFormData((prev) => ({ ...prev, to: destinationFromUrl }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!formData.from.trim() || !formData.to.trim() || !formData.date) return;

    setSearching(true);
    setSearchError("");
    setSaveMessage("");
    setDrivingRoute(null);
    setOriginCoord(null);
    setDestinationCoord(null);

    try {
      // step 1: turn city names into coordinates
      const [origin, destination] = await Promise.all([
        geocodePlace(formData.from),
        geocodePlace(formData.to),
      ]);

      setOriginCoord(origin);
      setDestinationCoord(destination);

      // step 2: get the actual road route for the map
      const driving = await getRoute(origin, destination, "driving-car");
      setDrivingRoute(formatRoute(driving));
    } catch (err) {
      setSearchError(
        err.message || "Couldn't find a route. Check the place names and try again."
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
      setSaveMessage("Trip saved! Head to your dashboard to track it.");
    } catch (err) {
      setSaveMessage(err.response?.data?.message || "Couldn't save the trip. Try again.");
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
          Enter a starting point, destination and date — get the route on the map, then let AI
          plan the whole trip for you day by day.
        </p>

        {/* ---- search form ---- */}
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

          <button
            type="submit"
            className="btn btn-primary planner-search-btn"
            disabled={searching}
          >
            {searching ? "Searching..." : "Find route"}
          </button>
        </form>

        {searchError && <p className="error-text">{searchError}</p>}

        {/* ---- results: summary strip + map ---- */}
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
                <span className="route-summary-label">Drive time</span>
                <span className="route-summary-value">{drivingRoute.durationText}</span>
              </div>
              <button className="btn btn-primary" onClick={handleSaveTrip} disabled={saving}>
                {saving ? "Saving..." : "Save trip"}
              </button>
            </div>

            {saveMessage && <p className="planner-save-message">{saveMessage}</p>}

            {/* the live map with the plotted driving route */}
            <TripMap
              originCoord={originCoord}
              destinationCoord={destinationCoord}
              route={drivingRoute}
            />

            {/* AI day-by-day itinerary — shown below the map once a route is found */}
            <AiItinerary from={formData.from} to={formData.to} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Planner;
