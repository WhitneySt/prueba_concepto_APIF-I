import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInstagramDataThunk } from "../redux/authSlice";
import { Navigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const { instagramData, error, user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (user?.accessToken) {
      dispatch(getInstagramDataThunk(user.accessToken));
    }
  }, [dispatch, user]);

  console.log(instagramData);
  if (user?.providerId === "google.com") return <Navigate to={"/"} />;
  return (
    <div>
      Home
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default Home;
