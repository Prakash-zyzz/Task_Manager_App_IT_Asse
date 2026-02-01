import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Trash2, Clock } from "lucide-react";

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
    >
      <div className="flex items-start gap-4">
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggle(task.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            task.completed
              ? "bg-green-500 border-green-500"
              : "border-gray-300 hover:border-green-400"
          }`}
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </motion.button>

        
        <div className="flex-1 min-w-0">
          <Link 
            to={`/tasks/${task.id}`}
            className="block hover:no-underline"
          >
            <h3
              className={`text-lg font-medium transition-all hover:text-blue-600 ${
                task.completed
                  ? "text-gray-500 line-through"
                  : "text-gray-800"
              }`}
            >
              {task.title}
            </h3>
          </Link>
          
          {task.description && (
            <p className="text-gray-600 text-sm mt-1">{task.description}</p>
          )}
          
          
          <div className="flex items-center gap-3 mt-3">
            {task.dueDate && (
  <div
    className={`flex items-center gap-1 text-xs font-medium ${
      !task.completed && new Date(task.dueDate) < new Date()
        ? "text-red-600"
        : "text-gray-500"
    }`}
  >
    <Clock className="w-3 h-3" />
    Due: {new Date(task.dueDate).toLocaleDateString()}
  </div>
)}

 {task.completed && (
    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
      Completed
    </span>
  )}

            {task.priority && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                task.priority === 'high' 
                  ? 'bg-red-100 text-red-700' 
                  : task.priority === 'medium'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {task.priority}
              </span>
            )}
          </div>
        </div>

        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(task.id)}
          className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          title="Delete task"
        >
          <Trash2 className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}