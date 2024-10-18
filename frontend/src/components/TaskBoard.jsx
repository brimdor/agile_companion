import React, { useEffect, useState } from 'react';
import InteractivePanel from './InteractivePanel';

function TaskBoard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('/tasks', {
        headers: { 'Authorization': localStorage.getItem('token') }
      });
      const data = await response.json();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Task Board</h1>
      <div className="task-board">
        {tasks.map(task => (
          <InteractivePanel key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default TaskBoard;
