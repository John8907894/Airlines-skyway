import { useState, useRef, useEffect } from 'react';

/**
 * A searchable autocomplete component for flight origin/destination selection.
 * @param {Object} props
 * @param {string[]} props.options - List of all available city/airport names.
 * @param {string} props.value - Current selected value.
 * @param {function} props.onChange - Callback fired when a selection is made.
 * @param {string} props.placeholder - Input placeholder.
 * @param {string} props.label - Field label.
 * @param {string[]} props.disabledOptions - Options that should be disabled (e.g., origin matches destination).
 */
export default function Autocomplete({ options, value, onChange, placeholder, label, disabledOptions = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value || '');
    const wrapperRef = useRef(null);

    // Sync searchTerm with value when it changes externally
    useEffect(() => {
        setSearchTerm(value || '');
    }, [value]);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm(value || ''); // Reset search to current selected value
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [value]);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputClick = () => {
        setIsOpen(true);
        if (value === searchTerm) setSearchTerm(''); // Clear on click for easier selection
    };

    return (
        <div className="search-input-group autocomplete-container" ref={wrapperRef} style={{ position: 'relative' }}>
            <label>{label}</label>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={handleInputClick}
                placeholder={placeholder}
                autoComplete="off"
                required
            />
            {isOpen && (
                <ul className="autocomplete-dropdown">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(option => (
                            <li
                                key={option}
                                className={`autocomplete-item ${disabledOptions.includes(option) ? 'disabled' : ''} ${option === value ? 'selected' : ''}`}
                                onClick={() => {
                                    if (!disabledOptions.includes(option)) {
                                        onChange(option);
                                        setIsOpen(false);
                                    }
                                }}
                            >
                                <span className="item-icon">📍</span>
                                {option}
                            </li>
                        ))
                    ) : (
                        <li className="autocomplete-no-results">No airports found</li>
                    )}
                </ul>
            )}
        </div>
    );
}
