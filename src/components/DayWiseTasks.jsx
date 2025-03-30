import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const DayWiseTasks = ({ selectedDate }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    console.log("🔹 Selected Date Received:", selectedDate);

    if (!user) {
      console.warn("⚠️ No user found. Skipping fetch.");
      return;
    }

    if (!selectedDate) {
      console.warn("⚠️ No selected date. Skipping fetch.");
      return;
    }

    const fetchEvents = async () => {
      try {
        console.log("📌 Fetching events for date:", selectedDate);

        // Reference to events collection
        const eventsRef = collection(db, `users/${user.uid}/events`);
        let q = showAll ? query(eventsRef) : query(eventsRef, where("date", "==", selectedDate));

        // Fetch data
        const querySnapshot = await getDocs(q);
        const eventList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("📌 Event List:", eventList);
        setEvents(eventList);
      } catch (error) {
        console.error("❌ Error fetching events:", error.message);
      }
    };

    fetchEvents();
  }, [user, selectedDate, showAll]); // ✅ Dependencies updated

  // ✅ Debugging state updates
  useEffect(() => {
    console.log("🚀 Updated Events State:", events);
  }, [events]);

  return (
    <div className="w-[248px] h-[250px] absolute right-[22px] top-[65%] bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Day Wise Events</h3>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-blue-600 underline"
        >
          {showAll ? "Show Selected Date" : "Show All Events"}
        </button>
      </div>

      <div className="mt-2 space-y-2 max-h-[180px] overflow-y-scroll scrollbar-hide">
  {events.length > 0 ? (
    events.map((event) => {
      console.log("🖼️ Rendering Event:", event);
      return (
        <div key={event.id} className="p-2 bg-purple-100 shadow-md rounded-md text-gray-800">
          {event.title || "Untitled Event"}
        </div>
      );
    })
  ) : (
    <p className="text-gray-500 text-center">No events found</p>
  )}
</div>

    </div>
  );
};

export default DayWiseTasks;
