import { useDispatch, useSelector } from "react-redux";
import { getFacebookProfileDataThunk, signOutThunk } from "../redux/authSlice";
import { useEffect } from "react";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((store) => store.auth);
  const handleLogout = () => {
    dispatch(signOutThunk());
  };

  useEffect(() => {
    if (user?.accessToken) {
      dispatch(getFacebookProfileDataThunk(user.accessToken));
    }
  }, [dispatch, user]);
  return (
    <nav>
      <span>Esto es una prueba</span>
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
