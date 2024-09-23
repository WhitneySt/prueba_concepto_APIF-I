import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInstagramDataThunk } from "../redux/authSlice";

const Home = () => {
  const dispatch = useDispatch();
  // const { accessToken } = useSelector((store) => store.auth.user);
  const { instagramData, error, user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (user?.accessToken) {
      dispatch(getInstagramDataThunk(user.accessToken));
    }
  }, [dispatch, user]);

  console.log(instagramData);
  console.log(error);
  return <div>Home</div>;
};

export default Home;
