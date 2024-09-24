export const INSTAGRAM_APP_ID = "907662524513353";
export const INSTAGRAM_SECRET_KEY = "";
export const REDIRECT_URL = "https://whitneyst.github.io/prueba_concepto_APIF-I/";
export const URL_API = "http://localhost:3000/";

const endpoints = {
  userAuth: `${URL_API}api/instagram/auth`,
  userInfo: `${URL_API}api/instagram/user-info`,
  userMedia: `${URL_API}api/instagram/user-media`,
  publicAccountInfo: `${URL_API}api/instagram/public-account-info`,
  puclicAccountMedia: `${URL_API}api/instagram/public-account-media`,
};

export default endpoints;