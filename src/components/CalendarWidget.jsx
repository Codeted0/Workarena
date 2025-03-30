import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDocs, setDoc, collection } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import DayWiseTasks from "./DayWiseTasks"; // Import DayWiseTasks

const Calendar = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState("");

  useEffect(() => {
    if (user) fetchEvents();
  }, [user, currentDate]);

  // 🔹 Fetch events from Firestore
  const fetchEvents = async () => {
    if (!user) return;

    try {
      const eventsCollection = collection(db, `users/${user.uid}/events`);
      const querySnapshot = await getDocs(eventsCollection);

      let eventsData = {};
      querySnapshot.forEach((doc) => {
        const eventData = doc.data();
        const dateKey = new Date(eventData.date).toISOString().split("T")[0];

        if (!eventsData[dateKey]) {
          eventsData[dateKey] = [];
        }
        eventsData[dateKey].push(eventData.title);
      });

      console.log("📌 Events fetched:", eventsData);
      setEvents(eventsData);
    } catch (error) {
      console.error("❌ Error fetching events:", error.message);
    }
  };

  // 🔹 Handle date selection (click)
  const handleDateClick = (day) => {
    const dateKey = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    setSelectedDate(dateKey);
    console.log("📌 Selected date updated:", dateKey);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-2xl text-md overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-gradient-to-br from-purple-400 to-blue-200 h-[50px] text-lg p-2 text-gray-800">
        <div className="flex justify-between items-center">
          <button
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
              )
            }
            className="p-1.5 hover:bg-purple-700 rounded-full"
          >
            ◀
          </button>
          <h2 className="text-base font-semibold">
            {new Intl.DateTimeFormat("en-US", {
              month: "long",
              year: "numeric",
            }).format(currentDate)}
          </h2>
          <button
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
              )
            }
            className="p-1.5 hover:bg-purple-700 rounded-full"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-semibold text-xs text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }, (_, i) => (
            <div key={`empty-${i}`} className="aspect-square"></div>
          ))}
          {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }, (_, i) => {
            const day = i + 1;
            const dateKey = `${currentDate.getFullYear()}-${String(
              currentDate.getMonth() + 1
            ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isSelected = selectedDate === dateKey;
            const hasEvent = !!events[dateKey];

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-semibold transition-colors
                  ${isSelected ? "bg-purple-500 text-white font-bold" : ""}
                  ${hasEvent ? "bg-yellow-300 text-black" : ""}
                  hover:bg-purple-50 text-gray-700`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* DayWiseTasks Component */}
      <DayWiseTasks selectedDate={selectedDate} />
    </div>
  );
};

export default Calendar;
