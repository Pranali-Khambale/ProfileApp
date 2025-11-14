import React from "react";
import { X, Mail, Phone, MapPin, Heart, Map } from "lucide-react";

const ProfileDetailsModal = ({ profile, onClose, onViewMap }) => {
  if (!profile) return null;

  const handleImageError = (e) => {
    e.target.src =
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400";
  };

  return (
    <div className="fixed inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                Profile Details
              </h2>
             
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
              title="Close details"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col items-center mb-6 pb-6 border-b">
            <div className="relative">
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-indigo-100 shadow-xl"
                onError={handleImageError}
              />
              <div className="absolute bottom-4 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{profile.name}</h3>
            <p className="text-gray-600 mt-2 text-center max-w-md">
              {profile.description}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600">📞</span>
              </div>
              Contact Information
            </h4>

            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Email Address
                </p>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-gray-800 font-medium hover:text-indigo-600 transition-colors"
                >
                  {profile.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Phone Number
                </p>
                <a
                  href={`tel:${profile.phone}`}
                  className="text-gray-800 font-medium hover:text-green-600 transition-colors"
                >
                  {profile.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">
                  Location
                </p>
                <p className="text-gray-800 font-medium">{profile.address}</p>
                <p className="text-xs text-gray-500 mt-2 font-mono">
                  {profile.lat.toFixed(4)}, {profile.lng.toFixed(4)}
                </p>
              </div>
            </div>
          </div>

          {profile.interests && profile.interests.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-pink-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800">
                  Interests & Hobbies
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 rounded-full text-sm font-medium hover:from-indigo-200 hover:to-blue-200 transition-all shadow-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              onClose();
              onViewMap(profile);
            }}
            className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all font-medium flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          >
            <Map className="w-5 h-5" />
            View Location on Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailsModal;
