'use server'
const Footer = () => {
    const date = new Date();
    const presentYear = date.getFullYear();
    return (
        <footer className="text-center">
            <p>&copy; {presentYear} Ruqyah Support BD. All rights reserved.</p>
        </footer>
    );
};

export default Footer;