import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Search from './pages/Search';
import SelectFlight from './pages/SelectFlight';
import SeatPicker from './pages/SeatPicker';
import PassengerDetails from './pages/PassengerDetails';
import Payment from './pages/Payment';
import Ticket from './pages/Ticket';
import Admin from './pages/Admin';
import MyBookings from './pages/MyBookings';
import Hotels from './pages/Hotels';
import Favorites from './pages/Favorites';
import Offers from './pages/Offers';
import Help from './pages/Help';
import Settings from './pages/Settings';
import HotelPayment from './pages/HotelPayment';
import HotelConfirmation from './pages/HotelConfirmation';
import Rewards from './pages/Rewards';
import FlightTracking from './pages/FlightTracking';
import AdminLogin from './pages/AdminLogin';

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <div className={isAuthenticated ? "app-layout" : ""}>
            {isAuthenticated && <Sidebar />}

            <div className={isAuthenticated ? "app-main" : ""}>
                <Routes>
                    <Route path="/" element={isAuthenticated ? <Navigate to="/search" replace /> : <Login />} />
                    <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
                    <Route path="/select" element={<ProtectedRoute><SelectFlight /></ProtectedRoute>} />
                    <Route path="/seats" element={<ProtectedRoute><SeatPicker /></ProtectedRoute>} />
                    <Route path="/details" element={<ProtectedRoute><PassengerDetails /></ProtectedRoute>} />
                    <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
                    <Route path="/ticket" element={<ProtectedRoute><Ticket /></ProtectedRoute>} />
                    <Route path="/ticket/:id" element={<ProtectedRoute><Ticket /></ProtectedRoute>} />

                    <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                    <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
                    <Route path="/hotels" element={<ProtectedRoute><Hotels /></ProtectedRoute>} />
                    <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                    <Route path="/offers" element={<ProtectedRoute><Offers /></ProtectedRoute>} />
                    <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    <Route path="/hotel-payment" element={<ProtectedRoute><HotelPayment /></ProtectedRoute>} />
                    <Route path="/hotel-confirm" element={<ProtectedRoute><HotelConfirmation /></ProtectedRoute>} />
                    <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
                    <Route path="/tracking" element={<ProtectedRoute><FlightTracking /></ProtectedRoute>} />
                    <Route path="/admin-portal" element={<AdminLogin />} />
                </Routes>

                {isAuthenticated && <Footer />}
            </div>
            <Chatbot />
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <BookingProvider>
                    <AppRoutes />
                </BookingProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
