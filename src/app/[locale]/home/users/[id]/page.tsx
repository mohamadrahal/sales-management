// src/app/home/users/[id]/page.tsx
"use client";
import React from "react";
import UserProfile from "../../../components/reusables/UserProfile";

const UserProfilePage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return <UserProfile userId={Number(id)} showChangePasswordButton={false} />;
};

export default UserProfilePage;
