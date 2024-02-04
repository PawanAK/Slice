// Home.js
import React, { useState } from 'react';
import GroupList from '../components/groups/GroupList';
import InviteToGroup from '../components/groups/InviteToGroup';
import GroupDetails from '../components/groups/GroupDetails';

const Home = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
  };

  return (
    <div>
      <h2>Welcome to Expense Split App!</h2>

      <div>
        <GroupList onSelectGroup={handleSelectGroup} />
      </div>

      {selectedGroup && (
        <div>
          <h3>Selected Group: {selectedGroup.name}</h3>
          <InviteToGroup groupId={selectedGroup._id} />
          <GroupDetails selectedGroup={selectedGroup} />
          {/* Add more components for expenses, settlements, etc. */}
        </div>
      )}
    </div>
  );
};

export default Home;
