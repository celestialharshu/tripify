import "./PlaceCard.css";

// one destination card - the Home page renders one of these per place
// fetched from MongoDB, so the grid naturally grows as more places get added
const PlaceCard = ({ place }) => {
  return (
    <div className="place-card card-surface">
      <div className="place-card-image">
        <img src={place.image} alt={place.name} loading="lazy" />
        <span className="place-card-rating">★ {place.rating}</span>
      </div>

      <div className="place-card-body">
        <span className="place-card-category">{place.category}</span>
        <h3>{place.name}</h3>
        <p className="place-card-location">{place.location}</p>
        <p className="place-card-description">{place.description}</p>
      </div>
    </div>
  );
};

export default PlaceCard;
