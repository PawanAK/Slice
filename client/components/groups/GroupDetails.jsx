// GroupDetails.js
import React from 'react';
import useUserEmail from '../../hooks/useUserEmail';

const GroupDetails = ({ selectedGroup }) => {
  const renderMembers = () => {
    if (!selectedGroup || !selectedGroup.members || selectedGroup.members.length === 0) {
      return <p>No members in this group</p>;
    }

    return (
      <div>
        <h4>Members:</h4>
        <ul>
          {selectedGroup.members.map((member) => (
            <li key={member._id}>
              {member.name} - {member.email}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <h3>Group Details</h3>
      {selectedGroup && (
        <div>
          <h4>{selectedGroup.name}</h4>
          <p>Description: {selectedGroup.description}</p>
          {renderMembers()}
        </div>
      )}
    </div>
  );
};

export default GroupDetails;
