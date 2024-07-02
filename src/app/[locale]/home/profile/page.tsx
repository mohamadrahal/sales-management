"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import useRequireAuth from "../../hooks/useRequireAuth";
import ChangePasswordModal from "./components/ChangePasswordModal";
import { FaUser, FaPhone, FaIdCard, FaKey, FaUserTag } from "react-icons/fa";

const ProfilePage: React.FC = () => {
  const { token, loading } = useRequireAuth();
  const [userData, setUserData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  useEffect(() => {
    if (!loading && !token) {
      router.push("/login");
    }
  }, [token, loading, router]);

  if (loading || !userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-3xl mb-6 text-center text-secondary">
          User Profile
        </h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <FaUser className="text-gray-500 mr-2" />
            <div>
              <strong className="block text-gray-700">Username:</strong>
              <span className="block text-gray-800">{userData.username}</span>
            </div>
          </div>
          <div className="flex items-center">
            <FaUserTag className="text-gray-500 mr-2" />
            <div>
              <strong className="block text-gray-700">Name:</strong>
              <span className="block text-gray-800">{userData.name}</span>
            </div>
          </div>
          <div className="flex items-center">
            <FaPhone className="text-gray-500 mr-2" />
            <div>
              <strong className="block text-gray-700">Mobile Number:</strong>
              <span className="block text-gray-800">
                {userData.mobileNumber}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <FaIdCard className="text-gray-500 mr-2" />
            <div>
              <strong className="block text-gray-700">National ID:</strong>
              <span className="block text-gray-800">{userData.nationalId}</span>
            </div>
          </div>
          <div className="flex items-center">
            <FaUser className="text-gray-500 mr-2" />
            <div>
              <strong className="block text-gray-700">Role:</strong>
              <span className="block text-gray-800">{userData.role}</span>
            </div>
          </div>
          <div className="flex items-center">
            <FaKey className="text-gray-500 mr-2" />
            <div>
              <strong className="block text-gray-700">BCD Account:</strong>
              <span className="block text-gray-800">{userData.bcdAccount}</span>
            </div>
          </div>
          <div className="flex items-center">
            <FaKey className="text-gray-500 mr-2" />
            <div>
              <strong className="block text-gray-700">EVO App ID:</strong>
              <span className="block text-gray-800">{userData.evoAppId}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Change Password
          </button>
        </div>
        {showModal && (
          <ChangePasswordModal onClose={() => setShowModal(false)} />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
