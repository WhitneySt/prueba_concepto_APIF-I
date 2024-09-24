import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { restoreUserData } from "../redux/authSlice";
import { auth } from "../Firebase/firebaseConfig";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Feed from "../pages/Feed";

const AppRouter = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((store) => store.auth);
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log(currentUser);
        dispatch(
          restoreUserData({
            id: currentUser.uid,
            displayName: currentUser.displayName,
            accessToken: currentUser.accessToken,
            photoURL: currentUser.photoURL,
            email: currentUser.email,
            providerId: currentUser.providerData[0].providerId,
          })
        );
      }
    });
  }, [dispatch]);
  return (
    <BrowserRouter basename="/prueba_concepto_APIF-I">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<PrivateRoutes isAuthenticated={isAuthenticated} />}>
            <Route path="home" element={<Home />} />
            <Route index element={<Feed />} />
          </Route>
          <Route element={<PublicRoutes isAuthenticated={isAuthenticated} />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
