import React, { useState, useEffect } from "react";
import uuid from "react-uuid";

const initialTasks = [
  { id: uuid(), title: "Task 1", completed: false, priority: "low" },
  { id: uuid(), title: "Task 2", completed: false, priority: "medium" },
  { id: uuid(), title: "Task 3", completed: false, priority: "high" },
];

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : initialTasks;
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const [taskInput, setTaskInput] = useState("");
  const [priorityInput, setPriorityInput] = useState("low");
  const [editingTaskId, setEditingTaskId] = useState(null);

  const addTask = () => {
    if (taskInput.trim()) {
      setTasks([
        ...tasks,
        {
          id: uuid(),
          title: taskInput,
          completed: false,
          priority: priorityInput,
        },
      ]);
      setTaskInput("");
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handlePriorityChange = (e) => {
    setPriorityInput(e.target.value);
  };

  const handleEdit = (taskId) => {
    setEditingTaskId(taskId);
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setTaskInput(taskToEdit.title);
    setPriorityInput(taskToEdit.priority);
  };

  const updateTask = () => {
    if (taskInput.trim()) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId
            ? { ...task, title: taskInput, priority: priorityInput }
            : task
        )
      );
      setTaskInput("");
      setEditingTaskId(null);
    }
  };

  const cancelEdit = () => {
    setTaskInput("");
    setPriorityInput("low");
    setEditingTaskId(null);
  };

  const filteredTasks = tasks.filter((task) => task.priority === priorityInput);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-4">Todo List</h1>
      <div className="flex mb-4">
        <input
          type="text"
          className="border border-gray-300 p-2 mr-2 flex-1"
          placeholder="Add new task..."
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <select
          value={priorityInput}
          onChange={handlePriorityChange}
          className="border border-gray-300 p-2"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        {editingTaskId ? (
          <>
            <button
              className="bg-green-500 text-white px-4 py-2 ml-2"
              onClick={updateTask}
            >
              Update
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 ml-2"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2 ml-2"
            onClick={addTask}
          >
            Add Task
          </button>
        )}
      </div>
      <div>
        <div className="mb-4">
          Total Tasks: {totalTasks} | Completed Tasks: {completedTasks}
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th># Name</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className={task.completed ? "line-through text-gray-500" : ""}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      className="mr-2"
                    />
                    {task.title}
                  </td>
                  <td>
                    <div className={`text-${task.priority}-500`}>
                      {task.priority}
                    </div>
                  </td>
                  <td className="flex  gap-4">
                    <button className="bg-blue-500 text-white px-4 py-2 ml-2" onClick={() => handleEdit(task.id)}>Edit</button>
                    <button className="bg-blue-500 text-white px-4 py-2 ml-2" onClick={() => deleteTask(task.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
