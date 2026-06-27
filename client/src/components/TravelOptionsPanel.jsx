import { estimateTrain, estimateFlight, MIN_FLIGHT_DISTANCE_KM } from "../utils/travelEstimates";
import { buildCabLinks, TRAIN_LINKS, FLIGHT_LINKS } from "../utils/travelLinks";
import "./TravelOptionsPanel.css";

// shows how the route compares across walking, cab, train and flight
// walk + car numbers come from the real route already fetched in Planner.jsx
// train + flight are distance-based estimates, clearly labeled as such
const TravelOptionsPanel = ({ originCoord, destinationCoord, drivingRoute, walkingRoute }) => {
  if (!originCoord || !destinationCoord) {
    return null;
  }

  const train = estimateTrain(originCoord, destinationCoord);
  const flight = estimateFlight(originCoord, destinationCoord);
  const cabLinks = buildCabLinks(originCoord, destinationCoord);

  // walking a few hundred km isn't realistic, but we still show the number -
  // just with an honest heads up instead of pretending it's a normal commute
  const walkIsUnrealistic = walkingRoute && walkingRoute.durationMin > 24 * 60;

  // flying somewhere 20km away isn't really a thing, so we hide that card below this distance
  const showFlight = flight.distanceKm >= MIN_FLIGHT_DISTANCE_KM;

  return (
    <div className="travel-options card-surface">
      <h3>Compare your options</h3>

      <div className="travel-options-grid">
        <div className="travel-option">
          <span className="travel-option-icon">🚶</span>
          <h4>Walk</h4>
          {walkingRoute ? (
            <>
              <p>{walkingRoute.distanceText}</p>
              <p className="travel-option-time">{walkingRoute.durationText}</p>
              {walkIsUnrealistic && <p className="travel-option-note">not realistic by foot</p>}
            </>
          ) : (
            <p className="travel-option-time">Not available for this route</p>
          )}
        </div>

        <div className="travel-option">
          <span className="travel-option-icon">🚗</span>
          <h4>Car / Cab</h4>
          {drivingRoute && (
            <>
              <p>{drivingRoute.distanceText}</p>
              <p className="travel-option-time">{drivingRoute.durationText}</p>
            </>
          )}
          <div className="travel-option-links">
            <a href={cabLinks.uberUrl} target="_blank" rel="noopener noreferrer">
              Uber
            </a>
            <a href={cabLinks.olaUrl} target="_blank" rel="noopener noreferrer">
              Ola
            </a>
            <a href={cabLinks.rapidoUrl} target="_blank" rel="noopener noreferrer">
              Rapido
            </a>
          </div>
        </div>

        <div className="travel-option">
          <span className="travel-option-icon">🚆</span>
          <h4>Train</h4>
          <p>{train.distanceText}</p>
          <p className="travel-option-time">{train.durationText}</p>
          <div className="travel-option-links">
            {TRAIN_LINKS.map((link) => (
              <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {showFlight && (
          <div className="travel-option">
            <span className="travel-option-icon">✈️</span>
            <h4>Flight</h4>
            <p>{flight.distanceText}</p>
            <p className="travel-option-time">{flight.durationText}</p>
            <div className="travel-option-links">
              {FLIGHT_LINKS.map((link) => (
                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="travel-options-note">
        Walk and car figures come from the live route above. Train and flight are rough
        estimates based on straight-line distance, not live schedules or fares - tap through to
        check real options.
      </p>
    </div>
  );
};

export default TravelOptionsPanel;
