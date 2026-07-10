import { useNavigate } from "react-router-dom";
import "./PlaceCard.css";

const PlaceCard = ({ place }) => {
  const navigate = useNavigate();

  // sends user to the planner page with this place pre-filled as the destination
  // the "from" field is left for the user to fill in themselves
  const handleBookNow = () => {
    navigate(`/planner?to=${encodeURIComponent(place.name)}`);
  };

  return (
    <div className="place-card card-surface">
      <div className="place-card-image">
        <img src={place.image} alt={place.name} loading="lazy" />
        <span className="place-card-rating">★ {place.rating}</span>
        <span className="place-card-category-badge">{place.category}</span>
      </div>

      <div className="place-card-body">
        <h3>{place.name}</h3>
        <p className="place-card-location">📍 {place.location}</p>
        <p className="place-card-description">{place.description}</p>
      </div>

      <div className="place-card-footer">
        <button className="btn btn-primary btn-full" onClick={handleBookNow}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default PlaceCard;
