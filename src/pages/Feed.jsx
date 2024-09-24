import { useState, useEffect } from "react";
import axios from "axios";
import endpoints, { INSTAGRAM_APP_ID, REDIRECT_URL } from "../config";
// import { useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";

const Feed = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userMedia, setUserMedia] = useState(null);
  const [error, setError] = useState(null);
  const [publicAccountInfo, setPublicAccountInfo] = useState(null);
  const [publicAccountMedia, setPublicAccountMedia] = useState(null);
  const [searchUsername, setSearchUsername] = useState("");

  // const { instagramData } = useSelector((store) => store.auth);

  const exchangeCodeForToken = async (code) => {
    try {
      const response = await axios.post(endpoints.userAuth, { code });
      const token = response.data.access_token;
      setAccessToken(token);
      return token;
    } catch (err) {
      setError("Error al obtener el token de acceso");
      console.error("Error:", err);
    }
  };

  const getUserInfo = async (token) => {
    try {
      const response = await axios.post(endpoints.userInfo, {
        accessToken: token,
      });
      setUserInfo(response.data);
    } catch (err) {
      setError("Error al obtener la información del usuario");
      console.error("Error:", err);
    }
  };

  const getUserMedia = async (token) => {
    try {
      const response = await axios.post(endpoints.userMedia, {
        accessToken: token,
      });
      setUserMedia(response.data);
    } catch (err) {
      setError("Error al obtener los medios del usuario");
      console.error("Error:", err);
    }
  };

  const handleAuthentication = () => {
    const TU_APP_ID = INSTAGRAM_APP_ID;
    const TU_REDIRECT_URI = REDIRECT_URL;
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${TU_APP_ID}&redirect_uri=${TU_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
    window.location.href = authUrl;
  };

  const getPublicAccountInfo = async (username) => {
    try {
      const response = await axios.post(endpoints.publicAccountInfo, {
        accessToken,
        username,
      });
      setPublicAccountInfo(response.data);
      return response.data.id;
    } catch (err) {
      setError("Error al obtener la información de la cuenta pública");
      console.error("Error:", err);
    }
  };

  const getPublicAccountMedia = async (instagramAccountId) => {
    try {
      const response = await axios.post(endpoints.puclicAccountMedia, {
        accessToken,
        instagramAccountId,
      });
      setPublicAccountMedia(response.data);
    } catch (err) {
      setError("Error al obtener los medios de la cuenta pública");
      console.error("Error:", err);
    }
  };

  const handleSearch = async () => {
    const accountId = await getPublicAccountInfo(searchUsername);
    if (accountId) {
      getPublicAccountMedia(accountId);
    }
  };

  useEffect(() => {
    console.log("URL después de la redirección:", window.location.href);
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");
    const errorReason = urlParams.get("error_reason");
    console.log(code);
    if (error) {
      console.error("Error en la autenticación:", error, errorReason);
      setError(`Error en la autenticación: ${error}. Razón: ${errorReason}`);
    } else if (code) {
      exchangeCodeForToken(code).then((token) => {
        if (token) {
          getUserInfo(token);
          getUserMedia(token);
        }
      });
    }
  }, []);

  // if (instagramData) return <Navigate to={"/home"} />;

  return (
    <div className="p-4">
      <button onClick={handleAuthentication}>Autenticar con Instagram</button>
      {accessToken && <p>Token de acceso obtenido: {accessToken}</p>}
      {userInfo && (
        <div>
          <h2>Información del usuario:</h2>
          <p>ID: {userInfo.id}</p>
          <p>Username: {userInfo.username}</p>
          <p>Account Type: {userInfo.account_type}</p>
          <p>Media Count: {userInfo.media_count}</p>
        </div>
      )}
      {userMedia && (
        <div>
          <h2>Medios del usuario:</h2>
          {userMedia.map((media) => (
            <div key={media.id}>
              <p>{media.caption}</p>
              {media.media_type === "IMAGE" && (
                <img src={media.media_url} alt={media.caption} />
              )}
              {media.media_type === "VIDEO" && (
                <video src={media.media_url} controls />
              )}
            </div>
          ))}
        </div>
      )}
      {error && <p>{error}</p>}

      <div className="mt-4">
        <input
          type="text"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          placeholder="Buscar cuenta de Instagram"
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {publicAccountInfo && (
        <div>
          <h2>Información de la cuenta pública:</h2>
          <p>Username: {publicAccountInfo.username}</p>
          <p>Name: {publicAccountInfo.name}</p>
          <p>Followers: {publicAccountInfo.followers_count}</p>
          <p>Following: {publicAccountInfo.follows_count}</p>
          <p>Media Count: {publicAccountInfo.media_count}</p>
          <img src={publicAccountInfo.profile_picture_url} alt="Profile" />
        </div>
      )}

      {publicAccountMedia && (
        <div>
          <h2>Medios de la cuenta pública:</h2>
          <div>
            {publicAccountMedia.map((media) => (
              <div key={media.id} className="border p-2">
                {media.media_type === "IMAGE" && (
                  <img
                    src={media.media_url}
                    alt={media.caption}
                    className="w-full h-40 object-cover"
                  />
                )}
                {media.media_type === "VIDEO" && (
                  <video src={media.media_url} controls />
                )}
                <p className="mt-2 text-sm">
                  {media.caption
                    ? media.caption.substring(0, 50) + "..."
                    : "No caption"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p>{error}</p>}
    </div>
  );
};

export default Feed;
