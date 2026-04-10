import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
    const { token, user, logout } = useAuth();
    const [searchParams, setSearchParams] = useState(null);
    const [flights, setFlights] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [passengers, setPassengers] = useState([]);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [bookingId, setBookingId] = useState(null);

    // Hotel booking state
    const [hotelBooking, setHotelBooking] = useState(null);
    const [hotelBookingId, setHotelBookingId] = useState(null);

    // Centralized Bookings History (Persistent via Backend)
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(false);

    useEffect(() => {
        if (token) {
            fetchBookings();
        }
    }, [token]);

    const fetchBookings = async () => {
        setLoadingBookings(true);
        try {
            const data = await api.getMyBookings(token);
            if (Array.isArray(data)) {
                setBookings(data);
            } else if (data && (data.message === 'Token is not valid' || data.message === 'No token, authorization denied')) {
                if (logout) logout();
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoadingBookings(false);
        }
    };

    const resetBooking = () => {
        setSearchParams(null);
        setFlights([]);
        setSelectedFlight(null);
        setSelectedSeats([]);
        setPassengers([]);
        setPaymentStatus(null);
        setBookingId(null);
    };

    const generateBookingId = () => {
        const id = 'SKY-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        setBookingId(id);
        return id;
    };

    const getUpiUrl = (amount, transactionName = 'SkyWay Booking') => {
        const vpa = 'skyway@upi';
        const name = encodeURIComponent(transactionName);
        return `upi://pay?pa=${vpa}&pn=${name}&am=${amount}&cu=INR`;
    };

    const confirmFlightBooking = async (flight, seats, passengers, price, paymentMethod, paymentDetails) => {
        try {
            const currentId = generateBookingId(); // Always generate a fresh ID
            const bookingData = {
                bookingId: currentId,
                bookingType: 'flight',
                flight: flight._id || flight.id,
                passengers,
                seats,
                totalPrice: price,
                paymentMethod,
                paymentDetails
            };
            
            const response = await api.createBooking(bookingData, token);
            if (response._id) {
                await fetchBookings();
                return { success: true, bookingId: response.bookingId };
            }
            if (response.message === 'Token is not valid' || response.message === 'No token, authorization denied') {
                if (logout) logout();
                return { success: false, error: 'Session expired. Please log in again.' };
            }
            return { success: false, error: response.message || 'Validation failed' };
        } catch (error) {
            console.error('Error confirming flight booking:', error);
            return { success: false, error: error.message };
        }
    };

    const generateHotelBookingId = () => {
        const id = 'HTL-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        setHotelBookingId(id);
        return id;
    };

    const confirmHotelBooking = async (hotelData, paymentMethod, paymentDetails) => {
        try {
            if (!hotelData) return null;
            const currentId = generateHotelBookingId(); // Always generate a fresh ID
            const bookingData = {
                bookingId: currentId,
                bookingType: 'hotel',
                hotel: hotelData.hotel._id || hotelData.hotel.id,
                checkIn: hotelData.checkIn,
                checkOut: hotelData.checkOut,
                nights: hotelData.nights,
                guests: hotelData.guests,
                passengers: [hotelData.passenger || {
                    firstName: user?.name?.split(' ')[0] || 'Guest',
                    lastName: user?.name?.split(' ')[1] || 'User',
                    email: user?.email
                }],
                totalPrice: hotelData.total,
                roomNo: Math.floor(Math.random() * 500) + 101, // Assign a random room number
                paymentMethod,
                paymentDetails
            };

            const response = await api.createBooking(bookingData, token);
            if (response._id) {
                await fetchBookings();
                return response.bookingId;
            }
            if (response.message === 'Token is not valid' || response.message === 'No token, authorization denied') {
                if (logout) logout();
            }
            return null;
        } catch (error) {
            console.error('Error confirming hotel booking:', error);
            return null;
        }
    };

    return (
        <BookingContext.Provider value={{
            searchParams, setSearchParams,
            flights, setFlights,
            selectedFlight, setSelectedFlight,
            selectedSeats, setSelectedSeats,
            passengers, setPassengers,
            paymentStatus, setPaymentStatus,
            bookingId, generateBookingId,
            resetBooking, getUpiUrl,
            hotelBooking, setHotelBooking,
            hotelBookingId, generateHotelBookingId,
            bookings, setBookings,
            loadingBookings,
            confirmFlightBooking,
            confirmHotelBooking,
            fetchBookings
        }}>
            {children}
        </BookingContext.Provider>
    );
}

export const useBooking = () => useContext(BookingContext);
