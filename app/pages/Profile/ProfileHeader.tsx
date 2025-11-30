import React from 'react';

const ProfileHeader: React.FC = () => {
  return (
    <div className="mb-8">
      {/* <div className="text-sm text-[#a1a1a1] mb-2">
        Dashboard &gt; Profile
      </div> */}
      <h1 className="text-2xl font-semibold text-white mb-2">Profile</h1>
      <p className="text-sm text-[#a1a1a1]">
        Manage your account settings and preferences
      </p>
    </div>
  );
};

export default ProfileHeader;

