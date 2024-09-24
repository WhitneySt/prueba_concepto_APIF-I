import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInstagramDataThunk } from "../redux/authSlice";
import endpoints, { INSTAGRAM_APP_ID, REDIRECT_URL } from "../config";
import axios from "axios";

const Home = () => {
  const dispatch = useDispatch();
  const { instagramData, error, user } = useSelector((store) => store.auth);

  const [token, setToken] = useState("");
  const [errorToken, setErrorToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [userMedia, setUserMedia] = useState(null);

  const exchangeCodeForToken = async (code) => {
    try {
      const response = await axios.post(endpoints.userAuth, { code });
      const atoken = response.data.access_token;
      setToken(atoken);
      return atoken;
    } catch (err) {
      setErrorToken("Error al obtener el token de acceso");
      console.error("Error:", err);
    }
  };

  const getUserInfo = async (atoken) => {
    try {
      const response = await axios.post(endpoints.userInfo, {
        accessToken: atoken,
      });
      console.log(response.data);
      setUserInfo(response.data);
    } catch (err) {
      setErrorToken("Error al obtener la información del usuario");
      console.error("Error:", err);
    }
  };

  const getUserMedia = async (atoken) => {
    try {
      const response = await axios.post(endpoints.userMedia, {
        accessToken: atoken,
      });
      setUserMedia(response.data);
    } catch (err) {
      setErrorToken("Error al obtener los medios del usuario");
      console.error("Error:", err);
    }
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      exchangeCodeForToken(code).then((atoken) => {
        if (atoken) {
          getUserInfo(atoken);
          getUserMedia(atoken);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (user?.accessToken && !token) {
      dispatch(getInstagramDataThunk(user.accessToken));
    }
  }, [dispatch, user, token]);

  const handleInstagramAuthentication = () => {
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URL}&scope=user_profile,user_media&response_type=code`;
    window.location.href = authUrl;
  };

  return (
    <div>
      Home
      {(!instagramData || error) && (
        <button onClick={handleInstagramAuthentication}>
          Autenticar con Instagram
        </button>
      )}
      {token && <div>AccessToken: {token}</div>}
      {errorToken && <div>Error: {errorToken}</div>}
      {userInfo && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Información del usuario:</h2>
          <p>ID: {userInfo.id}</p>
          <p>Username: {userInfo.username}</p>
          <p>Account Type: {userInfo.account_type}</p>
          <p>Media Count: {userInfo.media_count}</p>
        </div>
      )}
      {userMedia && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Medios del usuario:</h2>
          {userMedia.map((media) => (
            <div key={media.id} className="mt-2">
              <p>{media.caption}</p>
              {media.media_type === "IMAGE" && (
                <img
                  src={media.media_url}
                  alt={media.caption}
                  className="max-w-xs"
                />
              )}
              {media.media_type === "VIDEO" && (
                <video src={media.media_url} controls className="max-w-xs" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
