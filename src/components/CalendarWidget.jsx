import React, { useState } from 'react';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-2xl text-md overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-gradient-to-br from-purple-400 to-blue-200  h-[50px] text-lg p-2 text-white">
      <div className="flex justify-between items-center">
          <button onClick={handlePrevMonth} className="p-1.5 hover:bg-purple-700 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-base font-semibold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <button onClick={handleNextMonth} className="p-1.5 hover:bg-purple-700 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Names */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map(day => (
            <div key={day} className="text-center font-semibold text-xs text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className="aspect-square"></div>
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const isSelected = selectedDate && 
              selectedDate.getDate() === day && 
              selectedDate.getMonth() === currentDate.getMonth() && 
              selectedDate.getFullYear() === currentDate.getFullYear();
            const isToday = new Date().getDate() === day && 
              new Date().getMonth() === currentDate.getMonth() && 
              new Date().getFullYear() === currentDate.getFullYear();

            return (
              <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-semibold transition-colors
                ${isSelected ? 'bg-purple-600 text-white' : 
                  isToday ? 'bg-purple-100 text-purple-600' : 
                  'hover:bg-purple-50 text-gray-700'}`}
            >
              {day}
            </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Calendar; 