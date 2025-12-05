import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice'; // Assuming you will create this later
import productReducer from './productSlice'; // Assuming you will create this later

export const store = configureStore({
  // The 'reducer' object is where you define the global state structure.
  // Each key here becomes the property name in your useSelector hooks (e.g., state.auth.user)
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
  },
  
  // Middleware configuration is crucial for handling non-serializable values (like Firebase User objects)
  // that we need to store globally. Disabling the check prevents runtime warnings/errors.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});