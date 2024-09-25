import { useDispatch } from "react-redux";
import {
  // getFacebookProfileDataThunk,
  loginWithFacebookThunk,
  loginWithGoogleThunk,
} from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { isAuthenticated, user, error } = useSelector((store) => store.auth);
  const handleLoginWithFacebook = () => {
    dispatch(loginWithFacebookThunk());
    navigate("/home");
  };

  const handleLoginWithGoogle = () => {
    dispatch(loginWithGoogleThunk());
    navigate("/");
  };

  // if (error) {
  //   alert(error);
  // }

  // if (isAuthenticated && user) {
  //   dispatch(getFacebookProfileDataThunk(user.accessToken));
  //   alert("Has inicicado sesión exitosamente");
  // }

  return (
    <div>
      <button onClick={handleLoginWithFacebook}>Iniciar con facebook</button>
      <button onClick={handleLoginWithGoogle}>Iniciar sesión con Google</button>
    </div>
  );
};

export default Login;
