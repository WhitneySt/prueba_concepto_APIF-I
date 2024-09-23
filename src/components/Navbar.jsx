import { useDispatch, useSelector } from "react-redux";
import { signOutThunk } from "../redux/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((store) => store.auth);
  const handleLogout = () => {
    dispatch(signOutThunk());
  };
  return (
    <nav>
      <span>Home</span>
      {isAuthenticated && <button onClick={handleLogout}>Cerrar sesión</button>}
      {user?.photoURL && (
        <figure>
          <img src={user?.photoURL} alt={user?.displayName} />
        </figure>
      )}
    </nav>
  );
};

export default Navbar;
