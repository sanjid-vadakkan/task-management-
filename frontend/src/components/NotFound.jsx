import { useNavigate } from "react-router-dom";
import { FiHome } from "react-icons/fi";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center max-w-lg p-6">
        <h1 className="text-9xl font-thin text-gray-800 mb-4">404</h1>
        <p className="text-gray-600 mb-8 text-lg">
          The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/tasks")}
          className="flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg mx-auto hover:bg-black transition-colors"
        >
          <FiHome />
          <span>Go to Tasks</span>
        </button>
      </div>
    </div>
  );
}
