import React, { useState } from 'react';

const InteractivePanel = ({ task }) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="interactive-panel">
      <div
        className="panel-summary"
        onClick={togglePanel}
        onKeyPress={(e) => e.key === 'Enter' && togglePanel()}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls={`panel-content-${task.id}`}
      >
        <h2>{task.title}</h2>
        <p>Status: {task.status}</p>
      </div>
      {isOpen && (
        <div
          className="panel-content"
          id={`panel-content-${task.id}`}
          aria-hidden={!isOpen}
        >
          <p>{task.description}</p>
          <p>Assigned to: {task.assignee ? task.assignee.displayName : 'Unassigned'}</p>
        </div>
      )}
    </div>
  );
};

export default InteractivePanel;
