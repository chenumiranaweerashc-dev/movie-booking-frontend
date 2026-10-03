
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Movie {
    id: number;
    title: string;
    genre: string;
    description?: string;
    posterUrl?: string;
    imageUrl?: string;
    durationMinutes?: number;
}

export const MovieList: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

// Search & Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');

// Booking Modal States
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [selectedTheatre, setSelectedTheatre] = useState('Liberty Cinema - Hall 1');
    const [bookingDate, setBookingDate] = useState('2026-10-05');
    const [showtime, setShowtime] = useState('6:00 PM');
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const navigate = useNavigate();
    const ticketPrice = 12.50;

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const response = await api.get('/movies');
            if (Array.isArray(response.data)) {
                setMovies(response.data);
            } else if (response.data && Array.isArray(response.data.content)) {
                setMovies(response.data.content);
            } else {
                setMovies([]);
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

// Dedicated poster resolver to prevent blank/duplicate images
    const getPosterUrl = (movie: Movie) => {
        const dbUrl = (movie as any).poster_url || (movie as any).posterUrl || movie.posterUrl || movie.imageUrl;

// Use DB URL if valid web image link
        if (dbUrl && typeof dbUrl === 'string' && dbUrl.startsWith('http')) {
            return dbUrl;
        }

// Specific Unsplash covers based on title
        const titleLower = movie.title.toLowerCase();
        if (titleLower.includes('inception')) {
            return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500';
        }
        if (titleLower.includes('interstellar')) {
            return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500';
        }
        if (titleLower.includes('dark knight')) {
            return 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500';
        }

// General default cover
        return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500';
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/signin');
    };

    const handleOpenBooking = (movie: Movie) => {
        setSelectedMovie(movie);
        setSelectedSeats([]);
    };

    const handleCloseBooking = () => {
        setSelectedMovie(null);
    };

    const toggleSeat = (seatNum: number) => {
        if (selectedSeats.includes(seatNum)) {
            setSelectedSeats(selectedSeats.filter((s) => s !== seatNum));
        } else {
            setSelectedSeats([...selectedSeats, seatNum]);
        }
    };

    const handleConfirmBooking = async () => {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat to proceed!');
            return;
        }

        setIsProcessingPayment(true);

        const bookingPayload = {
            movieId: selectedMovie?.id,
            movieTitle: selectedMovie?.title,
            theatre: selectedTheatre,
            showDate: bookingDate,
            showTime: showtime,
            seatNumbers: selectedSeats.join(', '),
            totalAmount: selectedSeats.length * ticketPrice,
            paymentStatus: 'COMPLETED',
        };

        try {
            await api.post('/bookings', bookingPayload);
            alert(`Booking Successful! Total paid: $${(selectedSeats.length * ticketPrice).toFixed(2)}`);
            setSelectedMovie(null);
        } catch (err) {
            console.error('Booking API call error:', err);
// Fallback local storage mock for offline testing
            const existingBookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
            const newBooking = {
                id: Date.now(),
                ...bookingPayload,
                status: 'CONFIRMED'
            };
            localStorage.setItem('mock_bookings', JSON.stringify([...existingBookings, newBooking]));

            alert(`Booking confirmed for ${selectedMovie?.title}! Total: $${(selectedSeats.length * ticketPrice).toFixed(2)}`);
            setSelectedMovie(null);
        } finally {
            setIsProcessingPayment(false);
        }
    };

// Dynamic Genres Extraction for Filter Dropdown
    const genres = ['All', ...Array.from(new Set(movies.map((m) => m.genre ? m.genre.split('/')[0].trim() : 'Other')))];

// Live Search & Genre Filter Logic
    const filteredMovies = movies.filter((movie) => {
        const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = selectedGenre === 'All' || (movie.genre && movie.genre.toLowerCase().includes(selectedGenre.toLowerCase()));
        return matchesSearch && matchesGenre;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <p className="text-gray-600 font-medium">Loading movie catalog...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Top Navbar */}
            <nav className="bg-blue-600 px-6 py-4 flex justify-between items-center shadow-md">
                <div className="flex items-center space-x-2 text-white font-bold text-xl">
                    <span>🎬</span>
                    <span>Movie Booking App</span>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => navigate('/bookings')}
                        className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 rounded-md font-medium text-sm transition-colors"
                    >
                        My Bookings 🎟️
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md font-medium text-sm transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Now Showing</h1>

                    {/* Search & Filter Controls */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                        <select
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            {genres.map((genre) => (
                                <option key={genre} value={genre}>
                                    {genre === 'All' ? 'All Genres' : genre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {filteredMovies.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl text-center shadow-sm border border-gray-200">
                        <p className="text-gray-500">No movies match your search criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredMovies.map((movie) => {
                            return (
                                <div
                                    key={movie.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between"
                                >
                                    <div className="h-64 overflow-hidden bg-gray-100">
                                        <img
                                            src={getPosterUrl(movie)}
                                            alt={movie.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="p-4 flex flex-col justify-between flex-1">
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-800">{movie.title}</h2>
                                            <p className="text-xs text-gray-400 font-medium mt-0.5">
                                                {movie.genre}
                                                {movie.durationMinutes ? ` • ${Math.floor(movie.durationMinutes / 60)}h ${movie.durationMinutes % 60}m` : ''}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleOpenBooking(movie)}
                                            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md text-sm transition-colors"
                                        >
                                            Book Tickets
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            {selectedMovie && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={handleCloseBooking}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl"
                        >
                            ×
                        </button>

                        <h2 className="text-xl font-bold text-gray-800 mb-1">
                            Book: {selectedMovie.title}
                        </h2>
                        <p className="text-xs text-gray-500 mb-4">
                            {selectedMovie.genre} • Ticket: ${ticketPrice.toFixed(2)}
                        </p>

                        <div className="mb-3">
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                                Select Theatre
                            </label>
                            <select
                                value={selectedTheatre}
                                onChange={(e) => setSelectedTheatre(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Liberty Cinema - Hall 1">Liberty Cinema - Hall 1</option>
                                <option value="Majestic Cineplex - Screen 2">Majestic Cineplex - Screen 2</option>
                                <option value="CCC Scope Cinemas - VIP">CCC Scope Cinemas - VIP</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                                    Select Date
                                </label>
                                <input
                                    type="date"
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                                    Select Showtime
                                </label>
                                <select
                                    value={showtime}
                                    onChange={(e) => setShowtime(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="11:30 AM">11:30 AM</option>
                                    <option value="3:00 PM">3:00 PM</option>
                                    <option value="6:00 PM">6:00 PM</option>
                                    <option value="9:00 PM">9:00 PM</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-semibold text-gray-600 uppercase">
                                    Select Seats
                                </label>
                                <span className="text-xs text-blue-600 font-semibold">
{selectedSeats.length} seat(s) selected
</span>
                            </div>

                            <div className="w-full bg-gray-200 text-center py-1 rounded text-[10px] text-gray-500 tracking-widest uppercase mb-3 font-semibold">
                                --- CINEMA SCREEN ---
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((seat) => {
                                    const isSelected = selectedSeats.includes(seat);
                                    return (
                                        <button
                                            key={seat}
                                            onClick={() => toggleSeat(seat)}
                                            className={`py-2 rounded-md text-xs font-medium border transition-colors ${
                                                isSelected
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                                            }`}
                                        >
                                            Seat {seat}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-lg border border-gray-200 mb-5 space-y-1">
                            <div className="flex justify-between text-xs text-gray-600">
                                <span>Selected Seats:</span>
                                <span className="font-semibold text-gray-800">
{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-600">
                                <span>Price per Ticket:</span>
                                <span>${ticketPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-gray-900 pt-1 border-t border-gray-200">
                                <span>Total Amount:</span>
                                <span className="text-blue-600">${(selectedSeats.length * ticketPrice).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={handleCloseBooking}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmBooking}
                                disabled={isProcessingPayment}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:bg-blue-400"
                            >
                                {isProcessingPayment ? 'Processing...' : 'Confirm & Pay'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

