// CreateGroup.js
import React, { useState } from 'react';

const CreateGroup = ({ onCreateGroup }) => {
  const [groupName, setGroupName] = useState('');

  const handleCreateGroup = () => {
    if (groupName) {
      onCreateGroup({ name: groupName });
      setGroupName('');
    }
  };

  return (
    <div>
      <h3>Create Group</h3>
      <input
        type="text"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <button onClick={handleCreateGroup}>Create Group</button>
    </div>
  );
};

export default CreateGroup;
