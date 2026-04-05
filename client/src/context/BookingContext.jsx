import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const BookingContext = createContext();

import { API_BASE_URL } from '../api/config';
const API_URL = `${API_BASE_URL}/booking`;

export const BookingProvider = ({ children }) => {
    const [slots, setSlots] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSlots = async (zone) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/recommendations`, { params: { zone }, withCredentials: true });
            setSlots(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch slots');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createBooking = async (bookingData) => {
        setLoading(true);
        try {
            const response = await axios.post(API_URL, bookingData, { withCredentials: true });
            setBookings([response.data, ...bookings]);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchMyBookings = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/my-bookings`, { withCredentials: true });
            setBookings(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch bookings');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <BookingContext.Provider value={{ slots, bookings, loading, error, fetchSlots, createBooking, fetchMyBookings }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => useContext(BookingContext);
