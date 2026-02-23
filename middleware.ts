import { auth } from "express-oauth2-jwt-bearer";

const checkJwt = auth({
  audience: "https://blockerspace2.onrender.com/api",
  issuerBaseURL: `https://dev-kgfnckfiyjr00xxm.us.auth0.com/`,
});