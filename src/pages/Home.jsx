import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInstagramDataThunk } from "../redux/authSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { instagramData, error, user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (user?.accessToken) {
      dispatch(getInstagramDataThunk(user.accessToken));
    }
  }, [dispatch, user]);

  console.log(instagramData);
  return (
    <div>
      Home
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default Home;
