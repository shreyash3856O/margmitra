import React, { createContext, useState, useContext, useEffect } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [slots, setSlots] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initial load from localStorage
    useEffect(() => {
        const storedBookings = localStorage.getItem('margmitra_mock_bookings');
        if (storedBookings) {
            setBookings(JSON.parse(storedBookings));
        }
    }, []);

    const fetchSlots = async (zone) => {
        setLoading(true);
        setError(null);
        return new Promise((resolve) => {
            setTimeout(() => {
                // Return static mock slots
                const mockSlots = [
                    { id: 1, time: '09:00 AM', status: 'optimal', surge: 1.0 },
                    { id: 2, time: '11:00 AM', status: 'available', surge: 1.2 },
                    { id: 3, time: '02:00 PM', status: 'optimal', surge: 1.0 },
                    { id: 4, time: '05:00 PM', status: 'congested', surge: 1.8 },
                ];
                setSlots(mockSlots);
                setLoading(false);
                resolve(mockSlots);
            }, 600);
        });
    };

    const createBooking = async (bookingData) => {
        setLoading(true);
        setError(null);
        return new Promise((resolve) => {
            setTimeout(() => {
                const newBooking = { 
                    ...bookingData, 
                    id: Math.random().toString(36).substr(2, 9),
                    status: 'confirmed',
                    bookingDate: new Date().toISOString()
                };
                
                const updatedBookings = [newBooking, ...bookings];
                setBookings(updatedBookings);
                localStorage.setItem('margmitra_mock_bookings', JSON.stringify(updatedBookings));
                
                setLoading(false);
                resolve(newBooking);
            }, 1000);
        });
    };

    const fetchMyBookings = async () => {
        setLoading(true);
        return new Promise((resolve) => {
            setTimeout(() => {
                const storedBookings = JSON.parse(localStorage.getItem('margmitra_mock_bookings') || '[]');
                setBookings(storedBookings);
                setLoading(false);
                resolve(storedBookings);
            }, 500);
        });
    };

    return (
        <BookingContext.Provider value={{ slots, bookings, loading, error, fetchSlots, createBooking, fetchMyBookings }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => useContext(BookingContext);
