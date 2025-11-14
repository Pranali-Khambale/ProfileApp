import React, { useState, useEffect } from "react";
import { Users, MapPin, TrendingUp, Activity, Loader } from "lucide-react";
import { profileAPI } from "../services/api";

const Dashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalProfiles: 0,
    locations: 0,
    activeUsers: 0,
    growthRate: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await profileAPI.getAllProfiles();
      if (response.success) {
        const profiles = response.data;

        // Calculate stats
        setStats({
          totalProfiles: profiles.length,
          locations: profiles.length, 
          activeUsers: profiles.length,
          growthRate: calculateGrowthRate(profiles),
        });

       
        const activity = generateRecentActivity(profiles);
        setRecentActivity(activity);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrowthRate = (profiles) => {
   
    const now = new Date();
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));

    const recentProfiles = profiles.filter((p) => {
      const createdDate = p.createdAt ? new Date(p.createdAt) : new Date();
      return createdDate >= lastMonth;
    });

    if (profiles.length === 0) return 0;
    return Math.round((recentProfiles.length / profiles.length) * 100);
  };

  const generateRecentActivity = (profiles) => {
    const activities = [];

    // Sort profiles by creation/update date
    const sortedProfiles = [...profiles].sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0);
      const dateB = new Date(b.updatedAt || b.createdAt || 0);
      return dateB - dateA;
    });

    // Take top 3 most recent
    sortedProfiles.slice(0, 3).forEach((profile, index) => {
      const isUpdated =
        profile.updatedAt && profile.updatedAt !== profile.createdAt;

      activities.push({
        id: profile.id,
        type: isUpdated ? "update" : "create",
        name: profile.name,
        timestamp: profile.updatedAt || profile.createdAt,
        timeAgo: getTimeAgo(profile.updatedAt || profile.createdAt),
      });
    });

    return activities;
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "Just now";

    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const handleAddProfile = () => {
    
    if (onNavigate) {
      onNavigate("about"); 
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <Users size={24} />
            <span className="text-xs  bg-gray-600 bg-opacity-20 px-2 py-1 rounded">
              Live
            </span>
          </div>
          <p className="text-sm opacity-90">Total Profiles</p>
          <p className="text-3xl font-bold mt-2">{stats.totalProfiles}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <MapPin size={24} />
            <span className="text-xs  bg-gray-600 bg-opacity-20 px-2 py-1 rounded">
              Active
            </span>
          </div>
          <p className="text-sm opacity-90">Locations</p>
          <p className="text-3xl font-bold mt-2">{stats.locations}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <Activity size={24} />
            <span className="text-xs bg-gray-600 bg-opacity-20 px-2 py-1 rounded">
              Online
            </span>
          </div>
          <p className="text-sm opacity-90">Active Users</p>
          <p className="text-3xl font-bold mt-2">{stats.activeUsers}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp size={24} />
            <span className="text-xs bg-gray-600 bg-opacity-20 px-2 py-1 rounded">
              +{stats.growthRate}%
            </span>
          </div>
          <p className="text-sm opacity-90">Growth Rate</p>
          <p className="text-3xl font-bold mt-2">{stats.growthRate}%</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h4 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleAddProfile}
            className="p-4 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium hover:shadow-md active:scale-95"
          >
            Add New Profile
          </button>
          <button
            onClick={fetchDashboardData}
            className="p-4 border-2 border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-all font-medium hover:shadow-md active:scale-95"
          >
            Refresh Stats
          </button>
          <button className="p-4 border-2 border-purple-500 text-purple-600 rounded-lg hover:bg-purple-50 transition-all font-medium hover:shadow-md active:scale-95">
            Export Data
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-gray-800">Recent Activity</h4>
          <button
            onClick={fetchDashboardData}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Refresh
          </button>
        </div>

        {recentActivity.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity size={48} className="mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
            <button
              onClick={handleAddProfile}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Add Your First Profile
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={activity.id || index}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === "create"
                      ? "bg-blue-500"
                      : activity.type === "update"
                      ? "bg-green-500"
                      : "bg-purple-500"
                  }`}
                >
                  {activity.type === "create" && (
                    <Users className="text-white" size={20} />
                  )}
                  {activity.type === "update" && (
                    <Activity className="text-white" size={20} />
                  )}
                  {activity.type === "location" && (
                    <MapPin className="text-white" size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {activity.type === "create" &&
                      `New profile added: ${activity.name}`}
                    {activity.type === "update" &&
                      `Profile updated: ${activity.name}`}
                    {activity.type === "location" &&
                      `Location verified: ${activity.name}`}
                  </p>
                  <p className="text-xs text-gray-500">{activity.timeAgo}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
