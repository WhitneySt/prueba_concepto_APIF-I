export const INSTAGRAM_APP_ID = "907662524513353";
export const INSTAGRAM_SECRET_KEY = "";
export const REDIRECT_URL =
  "https://whitneyst.github.io/prueba_concepto_APIF-I/";
export const URL_API = "http://localhost:3000/api/instagram";

const endpoints = {
  userAuth: `${URL_API}/auth`,
  userInfo: `${URL_API}/user-info`,
  userMedia: `${URL_API}/user-media`,
  publicAccountInfo: `${URL_API}/public-account-info`,
  puclicAccountMedia: `${URL_API}/public-account-media`,
};

export default endpoints;
