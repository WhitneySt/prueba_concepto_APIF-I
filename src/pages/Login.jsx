import { useDispatch } from "react-redux";
import { loginWithFacebookThunk } from "../redux/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const handleLoginWithFacebook = () => {
    dispatch(loginWithFacebookThunk());
  };
  return (
    <div>
      <button onClick={handleLoginWithFacebook}>Iniciar con facebook</button>
    </div>
  );
};

export default Login;
