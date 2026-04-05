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
                    { _id: 's1', startTime: new Date(Date.now() + 3600000).toISOString(), congestionLevel: 'low', currentLoad: 45, maxCapacity: 100 },
                    { _id: 's2', startTime: new Date(Date.now() + 7200000).toISOString(), congestionLevel: 'medium', currentLoad: 78, maxCapacity: 150 },
                    { _id: 's3', startTime: new Date(Date.now() + 10800000).toISOString(), congestionLevel: 'low', currentLoad: 12, maxCapacity: 100 },
                    { _id: 's4', startTime: new Date(Date.now() + 14400000).toISOString(), congestionLevel: 'high', currentLoad: 190, maxCapacity: 200 },
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
