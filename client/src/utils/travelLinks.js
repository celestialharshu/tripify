// Uber and Ola both officially support pre-filling pickup/drop through a plain web
// link, no API key or app review needed - this just hands the user off to their
// own apps to actually book and pay.
// Rapido doesn't publish a link format like this, and it's a city-local bike/auto
// taxi service rather than an intercity one, so we just link to their site instead.
export const buildCabLinks = (origin, destination) => {
  const uberUrl =
    "https://m.uber.com/ul/?action=setPickup" +
    `&pickup[latitude]=${origin.lat}&pickup[longitude]=${origin.lng}` +
    `&pickup[nickname]=${encodeURIComponent(origin.label)}` +
    `&dropoff[latitude]=${destination.lat}&dropoff[longitude]=${destination.lng}` +
    `&dropoff[nickname]=${encodeURIComponent(destination.label)}`;

  const olaUrl =
    "https://book.olacabs.com/?" +
    `lat=${origin.lat}&lng=${origin.lng}` +
    `&drop_lat=${destination.lat}&drop_lng=${destination.lng}` +
    "&utm_source=tripify";

  const rapidoUrl = "https://www.rapido.bike/";

  return { uberUrl, olaUrl, rapidoUrl };
};

// train and flight booking sites don't offer a reliable way to pre-fill a
// city-to-city search through a plain link, so these just go to their search pages
export const TRAIN_LINKS = [
  { name: "IRCTC", url: "https://www.irctc.co.in/nget/train-search" },
  { name: "MakeMyTrip", url: "https://www.makemytrip.com/railways/" },
];

export const FLIGHT_LINKS = [
  { name: "IndiGo", url: "https://www.goindigo.in/" },
  { name: "MakeMyTrip", url: "https://www.makemytrip.com/flights/" },
  { name: "Air India", url: "https://www.airindia.com/" },
];
