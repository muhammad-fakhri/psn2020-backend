const ClientId = process.env.NODE_ENV === "development" ? "00298" : "00773";
const SecretKey =
  process.env.NODE_ENV === "development"
    ? "787b175aeb54a1e133fb71b5d2ebe11d"
    : "61c16a7e0dab54a0709ad748f485951e";

module.exports = { ClientId, SecretKey };
