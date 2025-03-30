import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import CalendarWidget from "./CalendarWidget";
import girlImage from "../assets/girl.png";
import boyImage from "../assets/boy.png"; // ✅ Add a male image
import otherImage from "../assets/other.png"; // ✅ Add an "other" image
import PinnedTasks from "./PinnedTasks";
import TaskCompletionChart from "./TaskCompletionChart";
import DayWiseTasks from "./DayWiseTasks";

const DashboardContent = () => {
  const { user } = useAuth();
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [gender, setGender] = useState("female");
  const [userName, setUserName] = useState("User"); // Default is female
  const [thoughtOfTheDay, setThoughtOfTheDay] = useState("");
  // 🌟 Thought of the day based on weekdays
  const dailyThoughts = {
    Monday: "New week, new goals! You've got this. 💪",
    Tuesday: "Keep going! Small steps lead to big success. 🚀",
    Wednesday: "Halfway through! Stay strong, stay positive. 🌟",
    Thursday: "You're doing amazing, keep believing in yourself! 💖",
    Friday: "Almost there! Finish strong and celebrate your progress. 🎉",
    Saturday: "Enjoy the weekend but don't stop growing! 🌈",
    Sunday: "Take time to relax & recharge. You deserve it! ☕💆‍♀️",
  };


  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); 

  // 🔹 Fetch user gender from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setGender(userSnap.data().gender || "female");
        }
      }
    };
    fetchUserData();
  }, [user]);

  // 🔹 Fetch task data in real-time from Firestore
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, "users", user.uid, "tasks"),
      (snapshot) => {
        let completed = 0;
        let total = snapshot.size; // Total tasks count

        snapshot.forEach((doc) => {
          if (doc.data().status === "Completed") {
            completed += 1;
          }
        });

        setCompletedTasks(completed);
        setTotalTasks(total);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // 🔹 Fetch User Name from Firestore
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserName(userSnap.data().name); // ✅ Set user name
        }
      } catch (error) {
        console.error("🔥 Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]);

  // 🔹 Choose greeting & image based on gender
  // const greeting =
  //   gender === "male"
  //     ? "HEY BRO!"
  //     : gender === "female"
  //     ? "HI GIRLIE!"
  //     : "WELCOME!";
  const imageSrc =
    gender === "male" ? boyImage : gender === "female" ? girlImage : otherImage;


    // 🔹 Set the thought of the day based on the current weekday
  useEffect(() => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" }); // e.g., "Monday"
    setThoughtOfTheDay(dailyThoughts[today]);
  }, []);


  return (
    <div className="h-screen overflow-hidden flex flex-col p-6">
      <div className="grid grid-cols-4 grid-rows-4 gap-4 row-gap-10 h-full overflow-hidden">
        {/* Greeting Section */}
        <div className="col-span-3 row-span-1 bg-gradient-to-br from-purple-200 to-blue-200 p-6 rounded-lg shadow-xl flex items-center justify-between">
          <div>
            <h2 className="text-4xl text-black mb-1.5 font-bold">
              HI {userName.toUpperCase()}!
            </h2>
            <p className="text-black text-md italic">{thoughtOfTheDay}</p>
          </div>
          <div className="w-44 h-44 absolute top-0 right-[300px] flex mt-[80px] items-center justify-center">
            <img
              src={imageSrc}
              alt="Girl Waving"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Calendar Section */}
        <div className="col-span-1 row-span-2 flex justify-end">
        <CalendarWidget selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>

        {/* Pinned Tasks */}
        <div className="col-span-2">
          <PinnedTasks />
        </div>

        {/* Chart Section */}
        <div className="col-span-1">
          <TaskCompletionChart completed={completedTasks} total={totalTasks} />
        </div>

        <DayWiseTasks selectedDate={selectedDate} />

      </div>
    </div>
  );
};

export default DashboardContent;
