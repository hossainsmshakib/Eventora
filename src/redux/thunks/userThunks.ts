import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../interfaces/User";
import { setUser, setLoading, setError } from "../slices/userSlice";

export const registerUser = createAsyncThunk(
  "user/register",
  async (userData: Omit<User, "id">, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post<User>(
        "http://localhost:3001/users",
        userData
      );
      dispatch(setUser(response.data));
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      dispatch(setError("Registration failed. Please try again."));
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: { username: string; password: string }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get<User[]>("http://localhost:3001/users", {
        params: { username: credentials.username },
      });
      if (response.data.length > 0) {
        const user = response.data[0];
        dispatch(setUser(user));
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        dispatch(setError("Invalid credentials"));
      }
    } catch (error) {
      dispatch(setError("Login failed. Please try again."));
    }
  }
);
