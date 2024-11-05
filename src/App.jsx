import { useState, useEffect } from "react";
import "./App.css";
import { format } from "date-fns";
import {
  getAllTasks,
  deleteTask,
  updateTaskStatus,
  updateTask,
  createTask,
} from "./Services";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newFinishTime, setNewFinishTime] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingStartDate, setEditingStartDate] = useState("");
  const [editingFinishTime, setEditingFinishTime] = useState("");
  const [editingStatus, setEditingStatus] = useState("todo");
  const [searchDate, setSearchDate] = useState("");
  const [dataSearch, setDataSearch] = useState([]);

  const addTask = async (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      const now = new Date().toISOString();
      await createTask({
        task_name: newTask.trim(),
        start_date: newStartDate,
        finish_time: newFinishTime,
      });

      setTasks([
        ...tasks,
        {
          id: Date.now(),
          task_name: newTask.trim(),
          start_date: newStartDate,
          finish_time: newFinishTime ?? null,
          status: "todo",
          createdAt: now,
          updatedAt: now,
        },
      ]);

      setNewTask("");
      setNewStartDate("");
      setNewFinishTime("");
      window.location.reload();
    }
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditingText(task.task_name);
    setEditingStartDate(task.start_date);
    setEditingFinishTime(task.finish_time);
    setEditingStatus(task.status);
  };

  const getallTasks = async () => {
    const data = await getAllTasks();
    setTasks(data.data);
  };

  const saveEdit = async () => {
    await updateTask(
      {
        task_name: editingText.trim(),
        start_date: editingStartDate,
        finish_time: editingFinishTime,
        status: editingStatus,
      },
      editingId
    );
    setTasks(
      tasks.map((task) =>
        task.id === editingId
          ? {
              ...task,
              task_name: editingText.trim(),
              start_date: editingStartDate,
              finish_time: editingFinishTime,
              status: editingStatus,
              updated_at: new Date().toISOString(),
            }
          : task
      )
    );
    setEditingId(null);
    getallTasks();
  };

  const updateStatus = async (id, status) => {
    await updateTaskStatus(status, id);
    getallTasks();
  };

  const deleteTaskById = async (id) => {
    await deleteTask(id);
    getallTasks();
    // setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleSearch = () => {
    const results = tasks.filter((item) => {
      const formattedDate = format(new Date(item.start_date), "yyyy-MM-dd");

      return formattedDate === searchDate;
    });

    setDataSearch(results);
  };

  useEffect(() => {
    getallTasks();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        บันทึกรายการประจำวัน
      </h1>

      <form onSubmit={addTask} className="mb-4 space-y-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex space-x-2">
          <input
            type="date"
            value={newStartDate}
            onChange={(e) => setNewStartDate(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="time"
            value={newFinishTime}
            onChange={(e) => setNewFinishTime(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add
          </button>
        </div>
      </form>

      <div className="mb-4">
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          ค้นหา
        </label>
        <div className="flex gap-2.5">
          <input
            type="date"
            id="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="mt-1 block  rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2.5"
          />
          <button
            onClick={() => handleSearch()}
            className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            ค้นหา
          </button>
        </div>
      </div>

      <ul className="space-y-4">
        {dataSearch.length > 0
          ? dataSearch.map((task) => (
              <li key={task.id} className="bg-gray-100 p-4 rounded-md">
                {editingId === task.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex space-x-2">
                      <input
                        type="date"
                        defaultValue={editingStartDate ?? task.start_date}
                        onChange={(e) =>
                          setEditingStartDate(e.target.value ?? task.start_date)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="time"
                        defaultValue={editingFinishTime ?? task.finish_time}
                        onChange={(e) =>
                          setEditingFinishTime(
                            e.target.value ?? task.finish_time
                          )
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={editingStatus}
                        onChange={(e) => setEditingStatus(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={saveEdit}
                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{task.task_name}</span>
                      <select
                        defaultValue={task.status}
                        onChange={(e) => updateStatus(task.id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>
                        Start:{" "}
                        {format(new Date(task.start_date), "dd MMMM yyyy")} at{" "}
                        {task.finish_time}
                      </p>
                      <p>
                        Created:{" "}
                        {format(new Date(task.created_at), "dd MMMM yyyy p")}
                      </p>
                      <p>
                        Updated:{" "}
                        {format(new Date(task.updated_at), "dd MMMM yyyy p")}
                      </p>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => startEditing(task)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTaskById(task.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))
          : tasks.map((task) => (
              <li key={task.id} className="bg-gray-100 p-4 rounded-md">
                {editingId === task.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex space-x-2">
                      <input
                        type="date"
                        defaultValue={editingStartDate ?? task.start_date}
                        onChange={(e) =>
                          setEditingStartDate(e.target.value ?? task.start_date)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="time"
                        defaultValue={editingFinishTime ?? task.finish_time}
                        onChange={(e) =>
                          setEditingFinishTime(
                            e.target.value ?? task.finish_time
                          )
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={editingStatus}
                        onChange={(e) => setEditingStatus(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={saveEdit}
                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{task.task_name}</span>
                      <select
                        defaultValue={task.status}
                        onChange={(e) => updateStatus(task.id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>
                        Start:{" "}
                        {format(new Date(task.start_date), "dd MMMM yyyy")} at{" "}
                        {task.finish_time}
                      </p>
                      <p>
                        Created:{" "}
                        {format(new Date(task.created_at), "dd MMMM yyyy p")}
                      </p>
                      <p>
                        Updated:{" "}
                        {format(new Date(task.updated_at), "dd MMMM yyyy p")}
                      </p>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => startEditing(task)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTaskById(task.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
      </ul>
    </div>
  );
}

export default App;
