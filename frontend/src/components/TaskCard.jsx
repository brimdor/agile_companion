import React from 'react';

function TaskCard({ task }) {
  return (
    <div className="task-card">
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
    </div>
  );
}

export default TaskCard;
