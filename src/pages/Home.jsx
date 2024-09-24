import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInstagramDataThunk } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { instagramData, error, user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (user?.accessToken) {
      dispatch(getInstagramDataThunk(user.accessToken));
    }
  }, [dispatch, user]);

  return (
    <div>
      Home
      {!instagramData && (
        <button onClick={() => navigate("/feed")}>
          Ir a Feed para autenticarse con Instagram
        </button>
      )}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default Home;
