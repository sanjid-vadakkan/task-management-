import { useEffect, useState } from "react";
import { LuSmilePlus } from "react-icons/lu";
import API from "../utils/axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TaskNavbar from "../components/taskNavbar";
import { toast } from "react-toastify";
import LeftSidebar from "../components/leftSidebar";
import { useParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const EditTask = () => {
  const location = useLocation();
  const id = useParams().id; // Get the task ID from the URL parameters
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#22c55e");
  const [status, setStatus] = useState("pending");
  const [repeat, setRepeat] = useState({
    enabled: true,
    type: "weekly",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  });
  const [tags, setTags] = useState(["Daily Routine"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = useSelector((state) => state.auth.user.token);
  const navigate = useNavigate();

  const colors = [
    { name: "Light Green", value: "#bbf7d0", class: "bg-green-200" },
    { name: "Purple", value: "#c084fc", class: "bg-purple-400" },
    { name: "Orange", value: "#fdba74", class: "bg-orange-300" },
    { name: "Light Cyan", value: "#a5f3fc", class: "bg-cyan-200" },
    { name: "Yellow", value: "#fde047", class: "bg-yellow-300" },
    { name: "Green", value: "#22c55e", class: "bg-green-500" },
    { name: "Cyan", value: "#22d3ee", class: "bg-cyan-400" },
    { name: "Blue", value: "#3b82f6", class: "bg-blue-500" },
    { name: "Purple", value: "#8b5cf6", class: "bg-purple-500" },
    { name: "Pink", value: "#ec4899", class: "bg-pink-500" },
    { name: "Rose", value: "#f43f5e", class: "bg-rose-400" },
    { name: "Red", value: "#ef4444", class: "bg-red-500" },
    { name: "Gray", value: "#9ca3af", class: "bg-gray-300" },
  ];

  const availableTags = [
    "Daily Routine",
    "Study Routine",
    "Personal",
    "Work",
    "Shopping",
    "Travel",
  ];
  const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

  useEffect(() => {
    console.log(id);
    
    // Fetch existing task data if editing
    const fetchTaskData = async () => {
        try {
            const response = await API.get(`/task/get-task/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log( response.data.task[0]);
            
            const taskData = response.data.task[0]; // Assuming the task is returned as an array
            setTitle(taskData.title);
            setDescription(taskData.description);
            setColor(taskData.color);
            setStatus(taskData.status);
            setRepeat(taskData.repeat);
            setTags(taskData.tags);
        } catch (error) {
            console.error("Error fetching task data:", error);
            toast.error("Failed to fetch task data. Please try again.");
        }
    };

    fetchTaskData();
  }, [id, token]);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const toggleDay = (day) => {
    setRepeat((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast.warn("Please enter a task title");
      return false;
    }

    if (repeat.enabled && repeat.type === "weekly" && repeat.days.length === 0) {
      toast.warn("Please select at least one day for weekly repeat");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const taskPayload = {
      id: id, // Use the task ID from the URL
      title: title.trim(),
      description: description.trim(),
      color,
      status,
      repeat,
      tags: tags.length > 0 ? tags : ["Daily Routine"],
    };

    console.log(token);

    try {
      await API.put("/task/edit-task", taskPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Task Edited successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error saving task:", error);
      const errorMessage = error.response?.data?.message || "Failed to save task. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <>
     <TaskNavbar />
    <div className="min-h-screen bg-white">
     
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 px-5" onKeyDown={handleKeyPress}>
          <div className="flex items-center text-3xl font-bold space-x-4 py-5">
            <span>New Task</span>
            <LuSmilePlus className="text-gray-600" />
          </div>

          <div className="flex flex-col py-5 space-y-2">
            <div className="bg-gray-100 rounded-md w-full p-3 flex items-center space-x-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-b border-gray-400 w-full bg-transparent outline-none"
                placeholder="Name your new task"
                required
                maxLength={100}
              />
            </div>
            <div className="bg-gray-100 rounded-md w-full p-3 flex items-center space-x-2">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-b border-gray-400 w-full bg-transparent outline-none"
                placeholder="Describe your new task"
                maxLength={200}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-3 mt-5">
            <h3 className="font-semibold">Card color</h3>
            <div className="flex items-center justify-start flex-wrap gap-4 md:space-x-10 md:gap-0">
              {colors.map((colorOption, index) => (
                <button
                  key={index}
                  onClick={() => setColor(colorOption.value)}
                  className={`w-8 mb-1 h-8 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 ${
                    colorOption.class
                  } ${
                    color === colorOption.value
                      ? "ring-2 ring-gray-400 ring-offset-2 scale-110"
                      : ""
                  }`}
                  title={colorOption.name}
                  aria-label={`Select ${colorOption.name} color`}
                />
              ))}
            </div>
          </div>

           {/* Status select */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col lg:flex-row bg-gray-100 lg:space-x-20 rounded-xl shadow-md p-4 md:p-6 my-10 space-y-6 lg:space-y-0">
            <div className="w-full lg:w-1/2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-gray-600 font-semibold mb-1">Repeat</h3>
                  <p className="text-gray-400 text-sm">Set a cycle for your task</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setRepeat((prev) => ({ ...prev, enabled: !prev.enabled }))
                    }
                    className={`relative w-9 h-4 rounded-full transition-colors duration-200 ${
                      repeat.enabled ? "bg-gray-300" : "bg-gray-300"
                    }`}
                    aria-label={`${repeat.enabled ? 'Disable' : 'Enable'} repeat`}
                  >
                    <div
                      className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${
                        repeat.enabled ? "left-6" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="border-b mb-5"></div>

              {repeat.enabled && (
                <div className="mb-6">
                  <div className="flex justify-evenly bg-gray-50 rounded-2xl">
                    {["daily", "weekly", "monthly"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setRepeat((prev) => ({ ...prev, type }))}
                        className={`px-4 md:px-8 py-2 rounded-2xl text-sm font-medium capitalize transition-colors duration-200 ${
                          repeat.type === type
                            ? "bg-gray-200 text-gray-800"
                            : "bg-gray-100 text-gray-600 hover:bg-white"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-b border-gray-500"></div>

              {repeat.enabled && repeat.type === "weekly" && (
                <div className="my-6">
                  <div className="flex flex-wrap gap-2">
                    {days.map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-3 md:px-5 py-2 rounded-lg text-sm font-medium min-w-[40px] md:min-w-[45px] transition-colors duration-200 ${
                          repeat.days.includes(day)
                            ? "bg-gray-200 text-gray-800"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-b border-gray-500"></div>

              {repeat.enabled && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-gray-600 text-sm">Repeat</span>
                  <span className="text-gray-600 text-sm text-right">
                    Every {repeat.type}
                    {repeat.type === "weekly" &&
                      repeat.days.length > 0 &&
                      ` (${repeat.days.join(", ")})`}{" "}
                    &gt;
                  </span>
                </div>
              )}
              <div className="border-b border-gray-500 mt-5"></div>
            </div>

            <div className="mb-6 w-full lg:w-1/2">
              <h3 className="text-gray-600 font-semibold">Tags</h3>
              <div className="border-b mb-3"></div>
              <div className="flex gap-2 flex-wrap">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      tags.includes(tag)
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="fixed bottom-8 right-4 md:right-8">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                isSubmitting 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:bg-gray-600 hover:scale-105 active:scale-95"
              }`}
              title="Create Task"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          </div>
        </main>
      </div>
    </div>
    </>
  );
};

export default EditTask;