// src/app/home/users/components/UserProfile.tsx
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaUser, FaPhone, FaIdCard, FaKey, FaUserTag } from "react-icons/fa";
import ChangePasswordModal from "../ChangePasswordModal";
import { useTranslations } from "next-intl";
import useRequireAuth from "../../hooks/useRequireAuth";

interface UserProfileProps {
  userId: number;
  showChangePasswordButton?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  showChangePasswordButton = true,
}) => {
  const { token, loading } = useRequireAuth();
  const [userData, setUserData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const t = useTranslations("profile");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user/profile?userId=${userId}`, {
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
  }, [token, userId]);

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
          {t("title")}
        </h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <FaUser className="text-gray-500 mr-2" />
            <div>
              <strong className="block text-gray-700">{t("username")}</strong>
              <span className="block text-gray-800">{userData.username}</span>
            </div>
          </div>
          <div className="flex items-center">
            <FaUserTag className="text-gray-500 mr-2" />
            <div>
              <strong className="block text-gray-700">{t("name")}</strong>
              <span className="block text-gray-800">{userData.name}</span>
            </div>
          </div>
          <div className="flex items-center">
            <FaPhone className="text-gray-500 mr-2" />
            <div>
              <strong className="block text-gray-700">{t("mobile")}</strong>
              <span className="block text-gray-800">
                {userData.mobileNumber}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <FaIdCard className="text-gray-500 mr-2" />
            <div>
              <strong className="block text-gray-700">{t("id")}</strong>
              <span className="block text-gray-800">{userData.nationalId}</span>
            </div>
          </div>
          <div className="flex items-center">
            <FaUser className="text-gray-500 mr-2" />
            <div>
              <strong className="block text-gray-700">{t("role")}</strong>
              <span className="block text-gray-800">{userData.role}</span>
            </div>
          </div>
          <div className="flex items-center">
            <FaKey className="text-gray-500 mr-2" />
            <div>
              <strong className="block text-gray-700">{t("bcd")}</strong>
              <span className="block text-gray-800">{userData.bcdAccount}</span>
            </div>
          </div>
          <div className="flex items-center">
            <FaKey className="text-gray-500 mr-2" />
            <div>
              <strong className="block text-gray-700">{t("evo")}</strong>
              <span className="block text-gray-800">{userData.evoAppId}</span>
            </div>
          </div>
        </div>
        {showChangePasswordButton && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              {t("button")}
            </button>
          </div>
        )}
        {showModal && (
          <ChangePasswordModal onClose={() => setShowModal(false)} />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
