// src/pages/TaskDetail.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById, updateTask, deleteTask } from "../services/taskService";
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  CheckCircle, 
  Calendar, 
  Edit3,
  Loader2,
  X
} from "lucide-react";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    setLoading(true);
    try {
      const data = await getTaskById(id);
      if (!data) {
        navigate("/dashboard");
        return;
      }
      setTask(data);
    } catch (error) {
      console.error("Failed to load task:", error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!task?.title.trim()) return;
    
    setSaving(true);
    try {
      await updateTask(task);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTask(task.id);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleComplete = () => {
    setTask(prev => ({
      ...prev,
      completed: !prev.completed,
      completedAt: !prev.completed ? new Date().toISOString() : null
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Loading task...</p>
        </div>
      </div>
    );
  }

  if (!task) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium p-2 rounded-lg hover:bg-white/50 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden md:inline">Back to Dashboard</span>
            <span className="md:hidden">Back</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm">
              <div className={`w-2 h-2 rounded-full ${
                task.completed ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <span className="text-sm font-medium">
                {task.completed ? 'Completed' : 'In Progress'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Task Header */}
          <div className="p-6 md:p-8 border-b border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3 mb-2"
                >
                  <Edit3 className="w-5 h-5 text-blue-500" />
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Task Details
                  </h1>
                </motion.div>
                <p className="text-gray-600 text-sm">
                  Created {new Date(task.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Complete Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleComplete}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                  task.completed
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <CheckCircle className={`w-5 h-5 ${
                  task.completed ? 'text-green-600' : 'text-gray-400'
                }`} />
                <span className="hidden md:inline">
                  {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </span>
              </motion.button>
            </div>
          </div>

          {/* Task Content */}
          <div className="p-6 md:p-8">
            {/* Title Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title
              </label>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <input
                  value={task.title}
                  onChange={(e) => setTask({ ...task, title: e.target.value })}
                  className="w-full px-4 py-3 text-lg font-medium border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter task title"
                />
              </motion.div>
            </div>

            {/* Description Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <textarea
                  value={task.description || ''}
                  onChange={(e) => setTask({ ...task, description: e.target.value })}
                  placeholder="Add a detailed description..."
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </motion.div>
            </div>

            {/* Due Date Input */}
<div className="mb-6">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Due Date
  </label>

  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.35 }}
    className="relative"
  >
    {/* <input
      type="date"
      value={task.dueDate || ""}
      onChange={(e) =>
        setTask({ ...task, dueDate: e.target.value })
      }
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
    /> */}
    <input
  type="date"
  value={task.dueDate || ""}
  onChange={(e) =>
    setTask({ ...task, dueDate: e.target.value })
  }
  disabled={task.completed}
  className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
    task.completed
      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  }`}
/>

  </motion.div>
</div>


            {/* Task Metadata */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-8 p-4 bg-gray-50 rounded-xl"
            >
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Task Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="font-medium">
                      {new Date(task.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                {task.completedAt && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Completed</p>
                      <p className="font-medium">
                        {new Date(task.completedAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col md:flex-row gap-3"
            >
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                disabled={saving || deleting}
              >
                Cancel
              </button>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={saving || deleting}
                  className="px-6 py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="hidden md:inline">Delete</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={saving || deleting || !task.title.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span className="hidden md:inline">Saving...</span>
                    </>
                  ) : (
                    <>
                      {/* <Save className="w-5 h-5" /> */}
                      <span className="hidden md:inline">Save Changes</span>
                      <span className="md:hidden">Save</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Delete Task</h3>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  disabled={deleting}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-gray-700 text-center mb-2">
                  Are you sure you want to delete this task?
                </p>
                <p className="text-sm text-gray-500 text-center">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-3 rounded-xl hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Deleting...
                    </>
                  ) : (
                    'Delete Task'
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}