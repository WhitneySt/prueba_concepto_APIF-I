import { useDispatch, useSelector } from "react-redux";
import {
  getFacebookProfileDataThunk,
  loginWithFacebookThunk,
} from "../redux/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, error } = useSelector((store) => store.auth);
  const handleLoginWithFacebook = () => {
    dispatch(loginWithFacebookThunk());
  };
  if (error) {
    alert(error);
  }

  if (isAuthenticated && user) {
    dispatch(getFacebookProfileDataThunk(user.accessToken));
    alert("Has inicicado sesión exitosamente");
  }

  return (
    <div>
      <button onClick={handleLoginWithFacebook}>Iniciar con facebook</button>
    </div>
  );
};

export default Login;
