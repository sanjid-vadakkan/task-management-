import { GiOpenBook } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import API from "../utils/axios";
import TaskNavbar from "../components/taskNavbar";
import LeftSidebar from "../components/leftSidebar";
import { toast } from "react-toastify";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const token = useSelector((state) => state.auth.user?.token);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      toast.error("You need to be logged in to view tasks");
      navigate("/login");
      return; // Prevent further execution
    }
    const fetchTasks = async () => {
      try {
        const response = await API.get("/task/get-all-tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched tasks:", response.data.tasks);
        
        setTasks(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error(error.response?.data?.message || "Failed to load tasks");
      }
    };

    fetchTasks();
  }, [token]);

  const statuses = [
    "pending",
    "in-progress",
    "completed",
   
  ];

  const filteredTasks = selectedStatus
    ? tasks.filter((task) => task.status === selectedStatus)
    : tasks;

  return (
    <div className="min-h-screen ">
      <TaskNavbar />
      <div className="flex">
        <LeftSidebar />

        {/* Main Content - Fixed alignment */}
        <main className="flex-1 p-4 md:p-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">

              <h1 className="text-2xl font-bold text-gray-800">Today</h1>
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              {statuses.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Task Cards Section */}
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg">No tasks found.</div>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <Link
                  to={`/view-task/${task._id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <div 
                    key={task._id}
                    className="bg-white mb-3 rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
                      style={{ backgroundColor: task.color }}
                  >

                    <div className="flex items-center justify-between">
                      <div>

                        <img src="/src/assets/square.png" alt="box" className="inline mr-4" />
                        <img src="/src/assets/read.png" alt="read" className="inline" />

                      </div>


                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Add Task Button */}
          <Link
            to="/add-task"
            className="fixed bottom-6 right-6 bg-white-600 hover:bg-blue-700 text-black w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
          >
            <span className="text-2xl">+</span>
          </Link>
        </main>
      </div>
    </div>
  );
};

export default TaskPage;