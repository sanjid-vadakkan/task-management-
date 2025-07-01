import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const LeftSidebar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Current month
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const today = new Date().getDate(); // Today's date

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    const days = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Fill in the days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days = getDaysInMonth(currentMonth);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.sidebar-container') && !event.target.closest('.sidebar-toggle')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Toggle Button - only visible on small screens */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sidebar-toggle fixed top-4 left-4 z-50 lg:hidden bg-white rounded-lg shadow-lg p-2 border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {isOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" />
      )}

      {/* Sidebar */}
      <div className={`
  sidebar-container
  fixed lg:relative
  top-0 left-0
  w-80 lg:w-64
  h-full min-h-screen
  bg-white
  border-r-2 border-gray-200
  transform transition-transform duration-300 ease-in-out
  z-40
  overflow-y-auto
  ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
`}>
        <div className="p-4 pt-16 lg:pt-4">
          {/* Calendar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-800">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-xs text-gray-500 text-center py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <button
                  key={index}
                  onClick={() => day && setSelectedDate(day)}
                  className={`h-8 text-sm rounded transition-colors ${day === selectedDate
                    ? 'bg-blue-500 text-white'
                    : day === today
                      ? 'bg-orange-100 text-orange-600'
                      : day
                        ? 'text-gray-700 hover:bg-gray-100'
                        : ''
                    }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-800 mb-3">Tasks</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <span className="text-sm text-gray-700">Today</span>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">2</span>
              </div>
            </div>
          </div>

          {/* Lists Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-800 mb-3">Lists</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <span className="text-sm text-gray-700">Daily Routine</span>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">1</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <span className="text-sm text-gray-700">Study</span>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;