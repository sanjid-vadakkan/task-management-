import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="bg-white shadow-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <div className="flex items-center">
                        <img src="src/assets/logo.png" alt="Listify Logo" className="h-10 w-auto" />
                    </div>


                    {/* Menu for large screens */}
                    <nav className="hidden md:flex space-x-6 text-sm">
                        <a href="#" className="hover:text-blue-600">About us</a>
                        <a href="#" className="hover:text-blue-600">Contacts</a>
                    </nav>

                    {/* Hamburger Menu (Mobile) */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <nav className="md:hidden pb-4 flex flex-col space-y-2">
                        <a href="#" className="hover:text-blue-600">About us</a>
                        <a href="#" className="hover:text-blue-600">Contacts</a>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Navbar;
