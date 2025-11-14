import React from "react";
import { MapPin } from "lucide-react";

const ProfileCard = ({ profile, showSummary, showDetails }) => {
  const handleImageError = (e) => {
    e.target.src =
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400";
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={profile.photo}
          alt={profile.name}
          className="w-full h-56 object-cover"
          onError={handleImageError}
        />
        <div className="absolute top-0 right-0 bg-gradient-to-l from-black/50 to-transparent w-full h-full"></div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{profile.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2 min-h-[3rem]">
          {profile.description}
        </p>

        <div className="flex items-center text-sm text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-indigo-600" />
          <span className="truncate">{profile.address}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => showSummary(profile)}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all text-sm font-medium shadow-md hover:shadow-lg"
          >
            View Map
          </button>
          <button
            onClick={() => showDetails(profile)}
            className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
