
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../services/authService";
import { getTasks, addTask, toggleTask, deleteTask } from "../services/taskService";
import AddTaskModal from "../components/AddTaskModal";
import TaskItem from "../components/TaskItem";
import { Plus, LogOut, CheckCircle, Clock, Moon, Sun  } from "lucide-react";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all"); // all, completed, pending
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  

  const handleAdd = (taskData) => {
  const newTask = addTask(taskData);   // instant
  setTasks(prev => [newTask, ...prev]);
};




  const handleToggle = (id) => {
  setTasks(prev =>
    prev.map(t =>
      t.id === id
        ? { ...t, completed: toggleTask(id, t.completed) }
        : t
    )
  );
};



  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div
  className="
    min-h-screen p-4 md:p-6
    bg-gradient-to-br
    from-gray-50 via-blue-50/40 to-indigo-50/30
    dark:from-gray-950 dark:via-gray-900 dark:to-gray-950
    text-gray-900 dark:text-gray-100
  "
>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto mb-6 md:mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
              My Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {tasks.length === 0 
                ? "No tasks yet" 
                : `${completedCount} completed • ${pendingCount} pending`
              }
            </p>
          </div>

          <div className="flex items-center gap-3">
        

            {/* Filter Buttons */}
            <div className="flex items-center bg-white dark:bg-gray-900 rounded-xl shadow-sm p-1">

              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  filter === "all"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  filter === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  filter === "completed"
                    ? "bg-green-100 text-green-700"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Done
              </button>
            </div>

            {/* Add Task Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden md:inline">Add Task</span>
              <span className="md:hidden">Add</span>
            </motion.button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 grid grid-cols-2 gap-3"
          >
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">

              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{completedCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">

              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-xl font-bold text-gray-800">{pendingCount}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        {/* Task List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-20"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
                />
                <p className="text-gray-600 dark:text-gray-400">Loading tasks...</p>
              </div>
            </motion.div>
          ) : filteredTasks.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 bg-white/50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700"

            >
              <div className="max-w-sm mx-auto">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  No tasks found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {filter === "all"
                    ? "Get started by creating your first task!"
                    : `No ${filter} tasks found`}
                </p>
                {filter === "all" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    Create Your First Task
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="tasks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-3"
            >
              <AnimatePresence>
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TaskItem
                      task={task}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Task Modal */}
        <AnimatePresence>
          {showModal && (
            <AddTaskModal
              onClose={() => setShowModal(false)}
              onSave={handleAdd}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Add Button (Floating) */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowModal(true)}
        className="md:hidden fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-xl z-10"
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
