"use client";

import React from "react";
import UserProfile from "../../components/reusables/UserProfile";
import useRequireAuth from "../../hooks/useRequireAuth";

const ProfilePage: React.FC = () => {
  const { user } = useRequireAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return <UserProfile userId={user.userId} />;
};

export default ProfilePage;
