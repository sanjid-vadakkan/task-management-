import { useEffect, useState } from "react";
import { LuSmilePlus } from "react-icons/lu";
import API from "../utils/axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import TaskNavbar from "../components/taskNavbar";
import { toast } from "react-toastify";
import LeftSidebar from "../components/leftSidebar";
import { Edit, Trash2, Tag, RefreshCw, Hash, Clock, User } from "lucide-react";

const ViewTask = () => {

    function getStatusColor(status) {
    switch (status) {
      case "completed":
        return "bg-green-200 text-green-800 border-green-400";
      case "in-progress":
        return "bg-yellow-200 text-yellow-800 border-yellow-400";
      case "pending":
      default:
        return "bg-gray-200 text-gray-800 border-gray-400";
    }
  }

  function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString(); // You can customize the format as needed
}


    const { id } = useParams(); // <-- This gets the task ID from the URL
    const [task, setTask] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

    useEffect(() => {
        const fetchTaskData = async () => {
            setIsLoading(true);
            try {

                const response = await API.get(`/task/get-task/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTask(response.data.task[0]);
                console.log(response.data.task[0].status);
                // Assuming the task is returned as an array
                
            } catch (error) {
                toast.error("Failed to fetch task data. Please try again.");
            } finally { 
                setIsLoading(false);
            }
        };

        fetchTaskData();
    }, [id, token]);

    const handleEdit = () => {
       
        navigate(`/edit-task/${id}`);
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        setIsDeleting(true);
        try {
            await API.delete(`/task/delete-task/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Task deleted successfully!");
            navigate("/");
        } catch (error) {
            toast.error("Failed to delete task. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading || !task) {
        return (
            <>
                <TaskNavbar />
                <div className="flex min-h-screen bg-white">
                    <LeftSidebar />
                    <main className="flex-1 flex items-center justify-center">
                        <div className="text-lg text-gray-500">Loading...</div>
                    </main>
                </div>
            </>
        );
    }

    const statusOptions = {
        "pending": "Pending",
        "in-progress": "In Progress",
        "completed": "Completed"
    };

    return (
        <>
            <TaskNavbar />
            <div className='flex'>
                <LeftSidebar />
                <div className="min-h-screen flex-1 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-3 sm:p-4 md:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header with Action Buttons */}
                        <div className="mb-6 sm:mb-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                                        Task Details
                                    </h1>
                                    <p className="text-sm sm:text-base text-gray-600">
                                        View and manage your task information
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 sm:gap-4">
                                    <button
                                        onClick={handleEdit}
                                        className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base"
                                    >
                                        <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                                        Edit
                                    </button>

                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transform hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base"
                                    >
                                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Task Card */}
                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">

                            {/* Task Header */}
                            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 sm:p-6 lg:p-8">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div
                                            className="w-4 h-4 sm:w-6 sm:h-6 rounded-full shadow-lg"
                                            style={{ backgroundColor: task.color }}
                                        ></div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white capitalize">
                                            {task.title}
                                        </h2>
                                    </div>
                                    <span className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border ${getStatusColor(task.status)} self-start sm:self-center`}>
                                        {task.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Task Content */}
                            <div className="p-4 sm:p-6 lg:p-8">

                                {/* Description Section */}
                                <div className="mb-6 sm:mb-8">
                                    <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-l-4 border-purple-500">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                                            Description
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                            {task.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Tags Section */}
                                <div className="mb-6 sm:mb-8">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                        <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Tags</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2 sm:gap-3">
                                        {task.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl transition-shadow"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Repeat Information */}
                                <div className="mb-6 sm:mb-8">
                                    <div className="bg-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-l-4 border-blue-500">
                                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Repeat Settings</h3>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                            <div>
                                                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Enabled</p>
                                                <p className="text-sm sm:text-base text-gray-800 font-semibold">
                                                    {task.repeat.enabled ? '✅ Yes' : '❌ No'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Type</p>
                                                <p className="text-sm sm:text-base text-gray-800 font-semibold capitalize">
                                                    {task.repeat.type}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Days</p>
                                                <p className="text-sm sm:text-base text-gray-800 font-semibold">
                                                    {task.repeat.days.length > 0 ? task.repeat.days.join(', ') : 'All days'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Metadata Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">

                                    {/* IDs Section */}
                                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-100">
                                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                            <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                                            <h3 className="text-sm sm:text-base font-semibold text-gray-800">Identifiers</h3>
                                        </div>
                                        <div className="space-y-2 sm:space-y-3">
                                            <div>
                                                <p className="text-xs font-medium text-gray-600 mb-1">Task ID</p>
                                                <p className="text-xs sm:text-sm text-gray-800 font-mono bg-white/50 p-2 rounded break-all">
                                                    {task._id}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-600 mb-1">User ID</p>
                                                <p className="text-xs sm:text-sm text-gray-800 font-mono bg-white/50 p-2 rounded break-all">
                                                    {task.userId}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timestamps Section */}
                                    <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-100">
                                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                            <h3 className="text-sm sm:text-base font-semibold text-gray-800">Timestamps</h3>
                                        </div>
                                        <div className="space-y-2 sm:space-y-3">
                                            <div>
                                                <p className="text-xs font-medium text-gray-600 mb-1">Created</p>
                                                <p className="text-xs sm:text-sm text-gray-800 bg-white/50 p-2 rounded">
                                                    {formatDate(task.createdAt)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-600 mb-1">Updated</p>
                                                <p className="text-xs sm:text-sm text-gray-800 bg-white/50 p-2 rounded">
                                                    {formatDate(task.updatedAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                   
                                    
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center mt-6 sm:mt-8 lg:mt-12">
                            <p className="text-xs sm:text-sm text-gray-500">
                                Task management made simple and beautiful
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
        // <>
        //   <TaskNavbar />
        //   <div className="min-h-screen bg-white">
        //     <div className="flex">
        //       <LeftSidebar />
        //       <main className="flex-1 px-5">
        //         <div className="flex items-center text-3xl font-bold space-x-4 py-5">
        //           <span>View Task</span>
        //           <LuSmilePlus className="text-gray-600" />
        //         </div>

        //         <div className="flex flex-col py-5 space-y-2">
        //           <div className="bg-gray-100 rounded-md w-full p-3 flex items-center space-x-2">
        //             <span className="font-semibold text-lg">{task.title}</span>
        //           </div>
        //           <div className="bg-gray-100 rounded-md w-full p-3 flex items-center space-x-2">
        //             <span className="text-gray-600">{task.description || "No description"}</span>
        //           </div>
        //         </div>

        //         <div className="flex flex-col space-y-3 mt-5">
        //           <h3 className="font-semibold">Card color</h3>
        //           <div className="flex items-center flex-wrap gap-4">
        //             {colors.map((colorOption, index) => (
        //               <span
        //                 key={index}
        //                 className={`w-8 h-8 rounded-full border-2 ${colorOption.class}
        //                   ${task.color === colorOption.value ? "ring-2 ring-gray-400 ring-offset-2 scale-110" : ""}
        //                 `}
        //                 title={colorOption.name}
        //               />
        //             ))}
        //           </div>
        //         </div>

        //         <div className="mb-4 mt-5">
        //           <label className="block text-gray-700 font-medium mb-2">
        //             Status
        //           </label>
        //           <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold
        //             ${
        //               task.status === "completed"
        //                 ? "bg-green-200 text-green-800"
        //                 : task.status === "in-progress"
        //                 ? "bg-yellow-200 text-yellow-800"
        //                 : "bg-gray-200 text-gray-800"
        //             }
        //           `}>
        //             {statusOptions[task.status] || task.status}
        //           </span>
        //         </div>

        //         <div className="flex flex-col lg:flex-row bg-gray-100 lg:space-x-20 rounded-xl shadow-md p-4 md:p-6 my-10 space-y-6 lg:space-y-0">
        //           <div className="w-full lg:w-1/2">
        //             <div className="flex items-start justify-between mb-4">
        //               <div>
        //                 <h3 className="text-gray-600 font-semibold mb-1">Repeat</h3>
        //                 <p className="text-gray-400 text-sm">Set a cycle for your task</p>
        //               </div>
        //               <div className="flex items-center gap-4">
        //                 <span
        //                   className={`relative w-9 h-4 rounded-full ${task.repeat?.enabled ? "bg-green-300" : "bg-gray-300"}`}
        //                   title={task.repeat?.enabled ? "Enabled" : "Disabled"}
        //                 >
        //                   <span
        //                     className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${
        //                       task.repeat?.enabled ? "left-6" : "left-0.5"
        //                     }`}
        //                   />
        //                 </span>
        //               </div>
        //             </div>
        //             <div className="border-b mb-5"></div>
        //             {task.repeat?.enabled && (
        //               <>
        //                 <div className="mb-6">
        //                   <div className="bg-gray-50 rounded-2xl px-4 py-2 inline-block capitalize font-semibold">
        //                     {task.repeat?.type}
        //                   </div>
        //                 </div>
        //                 <div className="border-b border-gray-500"></div>
        //                 {task.repeat?.type === "weekly" && (
        //                   <div className="my-6">
        //                     <div className="flex flex-wrap gap-2">
        //                       {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
        //                         <span
        //                           key={day}
        //                           className={`px-3 md:px-5 py-2 rounded-lg text-sm font-medium min-w-[40px] md:min-w-[45px] ${
        //                             task.repeat?.days?.includes(day)
        //                               ? "bg-gray-200 text-gray-800"
        //                               : "bg-gray-100 text-gray-500"
        //                           }`}
        //                         >
        //                           {day}
        //                         </span>
        //                       ))}
        //                     </div>
        //                   </div>
        //                 )}
        //                 <div className="border-b border-gray-500"></div>
        //                 <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        //                   <span className="text-gray-600 text-sm">Repeat</span>
        //                   <span className="text-gray-600 text-sm text-right">
        //                     Every {task.repeat?.type}
        //                     {task.repeat?.type === "weekly" &&
        //                       task.repeat?.days?.length > 0 &&
        //                       ` (${task.repeat.days.join(", ")})`}
        //                     &gt;
        //                   </span>
        //                 </div>
        //                 <div className="border-b border-gray-500 mt-5"></div>
        //               </>
        //             )}
        //           </div>

        //           <div className="mb-6 w-full lg:w-1/2">
        //             <h3 className="text-gray-600 font-semibold">Tags</h3>
        //             <div className="border-b mb-3"></div>
        //             <div className="flex gap-2 flex-wrap">
        //               {(task.tags || []).map((tag) => (
        //                 <span
        //                   key={tag}
        //                   className="px-4 py-2 rounded-full text-sm font-medium bg-gray-800 text-white"
        //                 >
        //                   {tag}
        //                 </span>
        //               ))}
        //             </div>
        //           </div>
        //         </div>

        //         {/* Edit and Delete Buttons */}
        //         <div className="fixed bottom-8 right-4 md:right-8 flex gap-4">
        //           <button
        //             onClick={handleEdit}
        //             className={`w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:bg-blue-600 hover:scale-105 active:scale-95`}
        //             title="Edit Task"
        //           >
        //             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        //               <path
        //                 strokeLinecap="round"
        //                 strokeLinejoin="round"
        //                 strokeWidth={2}
        //                 d="M15.232 5.232l3.536 3.536M9 13l6-6 3.536 3.536c.39.39.39 1.024 0 1.414l-7.072 7.072a2 2 0 01-1.414.586H5v-4a2 2 0 01.586-1.414l7.072-7.072c.39-.39 1.024-.39 1.414 0z"
        //               />
        //             </svg>
        //           </button>
        //           <button
        //             onClick={handleDelete}
        //             disabled={isDeleting}
        //             className={`w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
        //               isDeleting
        //                 ? "opacity-50 cursor-not-allowed"
        //                 : "hover:bg-red-600 hover:scale-105 active:scale-95"
        //             }`}
        //             title="Delete Task"
        //           >
        //             {isDeleting ? (
        //               <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        //             ) : (
        //               <svg
        //                 className="w-6 h-6 text-white"
        //                 fill="none"
        //                 stroke="currentColor"
        //                 viewBox="0 0 24 24"
        //               >
        //                 <path
        //                   strokeLinecap="round"
        //                   strokeLinejoin="round"
        //                   strokeWidth={2}
        //                   d="M6 18L18 6M6 6l12 12"
        //                 />
        //               </svg>
        //             )}
        //           </button>
        //         </div>
        //       </main>
        //     </div>
        //   </div>
        // </>
    );
};

export default ViewTask;