import { useAuth } from '../context/AuthContext';

export default function Footer() {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return null;

    return (
        <footer className="footer">
            <div className="footer-links">
                <a href="#">About Us</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Contact</a>
                <a href="#">FAQ</a>
            </div>
            <p>© 2026 SkyWay Airlines. All rights reserved. ✈️ Your journey, our passion.</p>
        </footer>
    );
}
