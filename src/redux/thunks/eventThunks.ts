import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Event } from "../../interfaces/Event";
import { setEvents, setLoading, setError } from "../slices/eventSlice";

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get<Event[]>("http://localhost:3001/events");
      console.log("Raw event data from API:", response.data);

      dispatch(setEvents(response.data));
    } catch (error) {
      console.error("Error fetching events:", error);
      dispatch(setError("Failed to fetch events. Please try again."));
    } finally {
      dispatch(setLoading(false));
    }
  }
);
