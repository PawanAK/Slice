// GroupList.js
import React, { useEffect } from 'react';
import { useGroup } from '../../hooks/useGroup';

const GroupList = ({ onSelectGroup }) => {
  const { groups, isLoading, error, fetchUserGroups } = useGroup();

  // Run this effect only once on component mount
  

  return (
    <div>
      <h3>Your Groups</h3>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {groups && groups.length > 0 ? (
        <div>
          {groups.map((group) => (
            <button key={group._id} onClick={() => onSelectGroup(group)}>
              {group.description}
            </button>
          ))}
        </div>
      ) : (
        <p>No groups available.</p>
      )}
    </div>
  );
};

export default GroupList;