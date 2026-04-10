import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

export default function PassengerDetails() {
    const { selectedFlight, selectedSeats, passengers, setPassengers } = useBooking();
    const navigate = useNavigate();

    // Initialize forms array based on selected seats
    const [forms, setForms] = useState(() => {
        if (passengers && passengers.length === selectedSeats.length) {
            return passengers;
        }
        return selectedSeats.map(() => ({
            firstName: '', lastName: '', email: '', phone: '',
            passport: '', nationality: '', dateOfBirth: '', gender: 'male',
        }));
    });

    const [errors, setErrors] = useState(selectedSeats.map(() => ({})));

    if (!selectedFlight || selectedSeats.length === 0) {
        return (
            <div className="page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <h2>Please select a flight and seats first</h2>
                <button className="btn btn-primary" onClick={() => navigate('/search')} style={{ marginTop: '1rem' }}>← Back to Search</button>
            </div>
        );
    }

    const handleChange = (index, field, value) => {
        const newForms = [...forms];
        newForms[index] = { ...newForms[index], [field]: value };
        setForms(newForms);
        
        if (errors[index][field]) {
            const newErrors = [...errors];
            newErrors[index] = { ...newErrors[index], [field]: '' };
            setErrors(newErrors);
        }
    };

    const validate = () => {
        const newErrors = forms.map(form => {
            const errs = {};
            if (!form.firstName.trim()) errs.firstName = 'First name is required';
            if (!form.lastName.trim()) errs.lastName = 'Last name is required';
            if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email is required';
            if (!form.phone.trim() || form.phone.length < 10) errs.phone = 'Valid phone number is required';
            if (!form.passport.trim()) errs.passport = 'Passport number is required';
            if (!form.nationality.trim()) errs.nationality = 'Nationality is required';
            if (!form.dateOfBirth) errs.dateOfBirth = 'Date of birth is required';
            return errs;
        });

        setErrors(newErrors);
        return newErrors.every(err => Object.keys(err).length === 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setPassengers(forms);
            navigate('/payment');
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>👤 Passenger Details</h1>
                <p>Please enter information for all {selectedSeats.length} passengers</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {selectedSeats.map((seat, index) => (
                        <div key={seat.id} className="passenger-form card" style={{ animation: `fadeSlideUp ${0.3 + index * 0.1}s ease-out` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-glass)' }}>
                                <h3 style={{ margin: 0, color: 'var(--accent-primary)' }}>Passenger {index + 1}</h3>
                                <span className="badge" style={{ background: 'var(--bg-glass)', color: 'var(--text-secondary)' }}>Seat {seat.id} ({seat.seatClass})</span>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name *</label>
                                    <input className="form-input" placeholder="John" value={forms[index].firstName}
                                        onChange={(e) => handleChange(index, 'firstName', e.target.value)} />
                                    {errors[index].firstName && <div className="form-error">{errors[index].firstName}</div>}
                                </div>
                                <div className="form-group">
                                    <label>Last Name *</label>
                                    <input className="form-input" placeholder="Doe" value={forms[index].lastName}
                                        onChange={(e) => handleChange(index, 'lastName', e.target.value)} />
                                    {errors[index].lastName && <div className="form-error">{errors[index].lastName}</div>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email Address *</label>
                                    <input className="form-input" type="email" placeholder="john@example.com" value={forms[index].email}
                                        onChange={(e) => handleChange(index, 'email', e.target.value)} />
                                    {errors[index].email && <div className="form-error">{errors[index].email}</div>}
                                </div>
                                <div className="form-group">
                                    <label>Phone Number *</label>
                                    <input className="form-input" type="tel" placeholder="+91 98765 43210" value={forms[index].phone}
                                        onChange={(e) => handleChange(index, 'phone', e.target.value)} />
                                    {errors[index].phone && <div className="form-error">{errors[index].phone}</div>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Passport Number *</label>
                                    <input className="form-input" placeholder="A12345678" value={forms[index].passport}
                                        onChange={(e) => handleChange(index, 'passport', e.target.value.toUpperCase())} />
                                    {errors[index].passport && <div className="form-error">{errors[index].passport}</div>}
                                </div>
                                <div className="form-group">
                                    <label>Nationality *</label>
                                    <input className="form-input" placeholder="Indian" value={forms[index].nationality}
                                        onChange={(e) => handleChange(index, 'nationality', e.target.value)} />
                                    {errors[index].nationality && <div className="form-error">{errors[index].nationality}</div>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date of Birth *</label>
                                    <input className="form-input" type="date" value={forms[index].dateOfBirth}
                                        onChange={(e) => handleChange(index, 'dateOfBirth', e.target.value)} />
                                    {errors[index].dateOfBirth && <div className="form-error">{errors[index].dateOfBirth}</div>}
                                </div>
                                <div className="form-group">
                                    <label>Gender</label>
                                    <select className="form-select" value={forms[index].gender}
                                        onChange={(e) => handleChange(index, 'gender', e.target.value)}>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', marginBottom: '4rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/seats')}>← Back to Seats</button>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>Proceed to Payment →</button>
                </div>
            </form>
        </div>
    );
}
