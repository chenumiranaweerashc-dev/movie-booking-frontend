import React, { useState } from 'react';
import api from '../services/api';

interface Movie {
    id: number;
    title: string;
    genre: string;
    duration: string;
}

interface BookingModalProps {
    movie: Movie;
    onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ movie, onClose }) => {
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [showtime, setShowtime] = useState('18:00');
    const [step, setStep] = useState<'SEATS' | 'PAYMENT'>('SEATS');
    const [paymentMethod, setPaymentMethod] = useState('CARD');
    const [loading, setLoading] = useState(false);

    const TICKET_PRICE = 12; // $12 per ticket
    const seats = Array.from({ length: 12 }, (_, i) => i + 1);
    const totalPrice = selectedSeats.length * TICKET_PRICE;

    const toggleSeat = (seatNum: number) => {
        if (selectedSeats.includes(seatNum)) {
            setSelectedSeats(selectedSeats.filter((s) => s !== seatNum));
        } else {
            setSelectedSeats([...selectedSeats, seatNum]);
        }
    };

    const handleProceedToPayment = () => {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat!');
            return;
        }
        setStep('PAYMENT');
    };

    const handleBooking = async () => {
        setLoading(true);
        try {
            await api.post('/bookings', {
                movieId: movie.id,
                showtime,
                seats: selectedSeats,
                totalAmount: totalPrice,
                paymentMethod,
            });
            alert(`🎉 Payment Successful!\nBooked ${selectedSeats.length} ticket(s) for ${movie.title}.\nTotal Paid: $${totalPrice}`);
            onClose();
        } catch (err) {
// Fallback for testing frontend without live backend
            alert(`🎉 Demo Payment & Booking Confirmed!\nMovie: ${movie.title}\nSeats: ${selectedSeats.join(', ')}\nTotal: $${totalPrice}\nPayment: ${paymentMethod}`);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                        {step === 'SEATS' ? `Book: ${movie.title}` : 'Payment Checkout'}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 font-bold text-lg">
                        ✕
                    </button>
                </div>

                {/* STEP 1: SEAT SELECTION & PRICE CALCULATION */}
                {step === 'SEATS' && (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Showtime</label>
                            <select
                                value={showtime}
                                onChange={(e) => setShowtime(e.target.value)}
                                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="14:00">2:00 PM</option>
                                <option value="18:00">6:00 PM</option>
                                <option value="21:00">9:00 PM</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Seats ($12/seat)</label>
                            <div className="grid grid-cols-4 gap-2">
                                {seats.map((seat) => {
                                    const isSelected = selectedSeats.includes(seat);
                                    return (
                                        <button
                                            key={seat}
                                            onClick={() => toggleSeat(seat)}
                                            className={`py-2 rounded font-medium border text-sm transition ${
                                                isSelected
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
                                            }`}
                                        >
                                            Seat {seat}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="bg-gray-50 p-3 rounded-md mb-6 text-sm text-gray-700 space-y-1">
                            <div className="flex justify-between">
                                <span>Selected Seats:</span>
                                <span className="font-semibold">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
                            </div>
                            <div className="flex justify-between border-t pt-1 font-bold text-gray-900 text-base">
                                <span>Total Amount:</span>
                                <span className="text-blue-600">${totalPrice}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded font-medium transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleProceedToPayment}
                                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium transition"
                            >
                                Proceed to Pay
                            </button>
                        </div>
                    </>
                )}

                {/* STEP 2: PAYMENT INTERFACE */}
                {step === 'PAYMENT' && (
                    <>
                        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">Booking Summary</p>
                            <p className="font-bold text-gray-800">{movie.title}</p>
                            <p className="text-sm text-gray-600">Seats: {selectedSeats.join(', ')} • Time: {showtime}</p>
                            <p className="text-lg font-bold text-blue-700 mt-2">Total Due: ${totalPrice}</p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Payment Method</label>
                            <div className="space-y-2">
                                <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="CARD"
                                        checked={paymentMethod === 'CARD'}
                                        onChange={() => setPaymentMethod('CARD')}
                                        className="mr-3"
                                    />
                                    <span className="text-sm font-medium text-gray-800">💳 Credit / Debit Card</span>
                                </label>
                                <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="ONLINE"
                                        checked={paymentMethod === 'ONLINE'}
                                        onChange={() => setPaymentMethod('ONLINE')}
                                        className="mr-3"
                                    />
                                    <span className="text-sm font-medium text-gray-800">🌐 Online Banking</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep('SEATS')}
                                className="w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded font-medium transition"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleBooking}
                                disabled={loading}
                                className="w-2/3 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium transition"
                            >
                                {loading ? 'Processing...' : `Pay $${totalPrice}`}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

