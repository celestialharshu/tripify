import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyTrips, updateTrip, deleteTrip } from "../api/tripApi";
import Loader from "../components/Loader";
import "./Dashboard.css";

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const data = await getMyTrips();
      setTrips(data);
    } catch (err) {
      setError("Couldn't load your trips. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  // flips a trip between "planned" and "completed"
  const handleToggleStatus = async (trip) => {
    const newStatus = trip.status === "planned" ? "completed" : "planned";

    try {
      const updated = await updateTrip(trip._id, { status: newStatus });
      setTrips((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      console.error("Failed to update trip status:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Remove this trip from your tracker?");
    if (!confirmed) return;

    try {
      await deleteTrip(id);
      setTrips((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Failed to delete trip:", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="page-section">
      <div className="container">
        <span className="eyebrow">Trip tracker</span>
        <h2 className="section-heading">My trips</h2>
        <p className="section-subtext">
          Everything you've planned and saved, in one place. Mark a trip as completed once you're
          back home.
        </p>

        {loading && <Loader />}

        {!loading && error && <p className="error-text">{error}</p>}

        {!loading && !error && trips.length === 0 && (
          <div className="empty-state">
            You haven't saved any trips yet.{" "}
            <Link to="/planner">Plan your first one →</Link>
          </div>
        )}

        {!loading && !error && trips.length > 0 && (
          <div className="trip-list">
            {trips.map((trip) => (
              <div key={trip._id} className="trip-row card-surface">
                <div className="trip-row-main">
                  <span className={`trip-status trip-status-${trip.status}`}>
                    {trip.status}
                  </span>
                  <h3>
                    {trip.from} → {trip.to}
                  </h3>
                  <p className="trip-date">{formatDate(trip.date)}</p>
                </div>

                <div className="trip-row-stats">
                  {trip.distanceText && <span>{trip.distanceText}</span>}
                  {trip.durationText && <span>{trip.durationText}</span>}
                </div>

                <div className="trip-row-actions">
                  <button className="btn btn-outline" onClick={() => handleToggleStatus(trip)}>
                    Mark as {trip.status === "planned" ? "completed" : "planned"}
                  </button>
                  <button
                    className="btn btn-danger-outline"
                    onClick={() => handleDelete(trip._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
