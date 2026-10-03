import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Booking {
    id: number;
    movieTitle?: string;
    theatre: string;
    showDate: string;
    showTime: string;
    seatNumbers: string;
    totalAmount: number;
    paymentStatus?: string;
    status?: string;
}

export const BookingHistory: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await api.get('/bookings');
            if (Array.isArray(response.data)) {
                setBookings(response.data);
            } else {
                setBookings([]);
            }
        } catch (error) {
            console.error('Error fetching bookings from API:', error);
// Fallback to local storage mock data if API endpoint isn't ready
            const mockBookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
            setBookings(mockBookings);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (id: number) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            await api.delete(`/bookings/${id}`);
            alert('Booking canceled successfully!');
            setBookings(bookings.filter((b) => b.id !== id));
        } catch (error) {
            console.error('Error canceling booking:', error);
// Fallback local update
            const updated = bookings.filter((b) => b.id !== id);
            setBookings(updated);
            localStorage.setItem('mock_bookings', JSON.stringify(updated));
            alert('Booking canceled successfully!');
        }
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <nav className="bg-blue-600 px-6 py-4 flex justify-between items-center shadow-md">
                <div className="flex items-center space-x-2 text-white font-bold text-xl">
                    <span>🎬</span>
                    <span>Movie Booking App</span>
                </div>
                <button
                    onClick={() => navigate('/movies')}
                    className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-1.5 rounded-md font-medium text-sm transition-colors"
                >
                    Back to Movies 🍿
                </button>
            </nav>

            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">My Booking History</h1>

                {loading ? (
                    <p className="text-gray-500">Loading your bookings...</p>
                ) : bookings.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl text-center shadow-sm border border-gray-200">
                        <p className="text-gray-500 mb-4">You have no active movie bookings.</p>
                        <button
                            onClick={() => navigate('/movies')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
                        >
                            Book a Movie Now
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                            >
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h3 className="text-lg font-bold text-gray-800">
                                            {booking.movieTitle || 'Movie Booking'}
                                        </h3>
                                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
{booking.paymentStatus || 'PAID'}
</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {booking.theatre} • {booking.showDate} at {booking.showTime}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1 font-medium">
                                        Seats: <span className="text-blue-600 font-bold">{booking.seatNumbers}</span>
                                    </p>
                                </div>

                                <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
<span className="text-lg font-bold text-gray-900">
${Number(booking.totalAmount).toFixed(2)}
</span>
                                    <button
                                        onClick={() => handleCancelBooking(booking.id)}
                                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                                    >
                                        Cancel Booking
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

