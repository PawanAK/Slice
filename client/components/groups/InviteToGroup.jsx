import { useAuthContext } from '../../hooks/useAuthContext';


const sendToGroup = async (groupId, email, user) => {
  try {
    const response = await fetch(`/api/group/inviteToGroup/${groupId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      },
      body: JSON.stringify({ email: email }),
    });

    if (!response.ok) {
      throw new Error('Failed to invite user to group');
    }

    const result = await response.json();
    // Handle the result as needed
  } catch (error) {
    console.error('Error inviting user to group:', error);
    // Handle the error as needed
  }
};

import React, { useState } from 'react';


const InviteToGroup = ({ groupId }) => {
  const [email, setEmail] = useState('');
  const { user } = useAuthContext();

  const handleInvite = () => {
    sendToGroup(groupId, email,user);
    setEmail('');
  };

  return (
    <div>
      <h3>Invite to Group</h3>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleInvite}>Invite</button>
    </div>
  );
};

export default InviteToGroup;
