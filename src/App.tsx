import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { MovieList } from './pages/MovieList';
import { BookingHistory } from './pages/BookingHistory';

// Protected Route Guard
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/signin" replace />;
    }
    return <>{children}</>;
};

export const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Authentication Routes */}
                <Route path="/signin" element={<Login />} />
                <Route path="/signup" element={<Register />} />

                {/* Protected Application Routes */}
                <Route
                    path="/movies"
                    element={
                        <ProtectedRoute>
                            <MovieList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/bookings"
                    element={
                        <ProtectedRoute>
                            <BookingHistory />
                        </ProtectedRoute>
                    }
                />

                {/* Default Fallback Redirect */}
                <Route path="*" element={<Navigate to="/movies" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;

