// The monthly hosting & maintenance fee starts at this many HUF. It is part of
// every project, also after handover; the German and English pages show it
// converted with the backend's daily rate (see useHufFormatter).
export const MAINTENANCE_STARTING_PRICE_HUF = 25_000;

// Google Search ads: the one-time ad account setup (only when the client has
// no account yet). The monthly management fee is quoted per campaign. There
// is a single ads service, so it lives here rather than in the admin.
export const ADS_SETUP_PRICE_HUF = 35_000;
