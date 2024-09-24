import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../Firebase/firebaseConfig";
import axios from "axios";

const facebookApi = (token) =>
  `https://graph.facebook.com/v20.0/me/accounts?access_token=${token}`;
const instagramApi = (instagramBusinessAccountId, token) =>
  `https://graph.facebook.com/v20.0/${instagramBusinessAccountId}?fields=id,username,profile_picture_url,followers_count,media_count&access_token=${token}`;

// const getFacebookProfileData = async (accessToken) => {
//   try {
//     const response = await axios.get(
//       `https://graph.facebook.com/v20.0/me?fields=id,name,picture.type(large)&access_token=${accessToken}`
//     );

//     console.log("Facebook API Response:", response.data);

//     if (
//       response.data &&
//       response.data.picture &&
//       response.data.picture.data &&
//       response.data.picture.data.url
//     ) {
//       return response.data.picture.data.url;
//     } else {
//       console.error("Unexpected API response structure:", response.data);
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching Facebook profile data:", error);
//     return null;
//   }
// };

export const getFacebookProfileDataThunk = createAsyncThunk(
  "auth/getProfilePicture",
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/v20.0/me?fields=id,name,picture.type(large)&access_token=${accessToken}`
      );
      if (
        response.data &&
        response.data.picture &&
        response.data.picture.data &&
        response.data.picture.data.url
      ) {
        await updateProfile(auth.currentUser, {
          photoURL: response.data.picture.data.url,
        });
        return response.data.picture.data.url;
      } else {
        console.error("Unexpected API response structure:", response.data);
        throw new Error("No se encontró foto");
      }
    } catch (error) {
      console.error("Error fetching Facebook profile data:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const loginWithFacebookThunk = createAsyncThunk(
  "auth/loginWithFacebook",
  async (_, { rejectWithValue }) => {
    const provider = new FacebookAuthProvider();
    provider.addScope("public_profile");
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;

      const response = await axios.get(
        `https://graph.facebook.com/v20.0/me?fields=id,name,picture.type(large)&access_token=${accessToken}`
      );
      if (
        response.data &&
        response.data.picture &&
        response.data.picture.data &&
        response.data.picture.data.url
      ) {
        await updateProfile(auth.currentUser, {
          photoURL: response.data.picture.data.url,
        });
      }

      return {
        id: result.user.uid,
        accessToken,
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: response.data?.picture?.data?.url
          ? response.data.picture.data.url
          : result.user.photoURL,
        providerId: result.providerId,
      };
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
  }
);

// export const getInstagramDataThunk = createAsyncThunk(
//   "auth/getInstagramData",
//   async (token, { rejectWithValue }) => {
//     try {
//       //Primero se debe obtener el ID de la página de instagram asociada
//       const facebookURL = facebookApi(token);
//       const data = await axios.get(facebookURL);
//       console.log("data de api graph de facebook", data);
//       // Encontrar la página con una cuenta de Instagram Business asociada
//       const pageWithInstagram = data.data.find(
//         (page) => page.instagram_business_account
//       );

//       if (!pageWithInstagram) {
//         throw new Error(
//           "No se encontró una cuenta de Instagram Business asociada"
//         );
//       }

//       const instagramBusinessAccountId =
//         pageWithInstagram.instagram_business_account.id;

//       //Luego, se debe obtener los datos básicos de instagram
//       const instagramURL = instagramApi(instagramBusinessAccountId, token);
//       const instagramData = await axios.get(instagramURL);
//       console.log("datos de instagram", instagramData);

//       return instagramData;
//     } catch (error) {
//       console.error(error);
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const getInstagramDataThunk = createAsyncThunk(
  "auth/getInstagramData",
  async (token, { rejectWithValue }) => {
    try {
      const facebookURL = facebookApi(token);
      const response = await axios.get(facebookURL);
      console.log("Respuesta completa de Facebook:", response);

      // Si data.data está vacío
      if (response.data.data.length === 0) {
        console.error("No se encontraron páginas asociadas a la cuenta");
        throw new Error("No se encontraron páginas asociadas a la cuenta");
      }

      const pageWithInstagram = response.data.data.find(
        (page) => page.instagram_business_account
      );

      if (!pageWithInstagram) {
        throw new Error(
          "No se encontró una cuenta de Instagram Business asociada"
        );
      }

      const instagramBusinessAccountId =
        pageWithInstagram.instagram_business_account.id;

      const instagramURL = instagramApi(instagramBusinessAccountId, token);
      const instagramData = await axios.get(instagramURL);
      console.log("datos de instagram", instagramData.data);

      return instagramData.data;
    } catch (error) {
      console.error("Error detallado:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const signOutThunk = createAsyncThunk("auth/signOut", async () => {
  await signOut(auth);
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null,
    instagramData: null,
    loading: false,
    error: null,
  },
  reducers: {
    restoreUserData: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithFacebookThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithFacebookThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginWithFacebookThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getInstagramDataThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInstagramDataThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.instagramData = action.payload;
      })
      .addCase(getInstagramDataThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(signOutThunk.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.instagramData = null;
        state.error = null;
        state.loading = false;
      })
      .addCase(getFacebookProfileDataThunk.fulfilled, (state, action) => {
        state.user.photoURL = action.payload;
      });
  },
});

export const { restoreUserData } = authSlice.actions;

export default authSlice.reducer;
