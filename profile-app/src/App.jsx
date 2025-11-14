import React, { useState, useEffect } from "react";

import { Loader, Search, MapPin, RefreshCw } from "lucide-react";
import { profileAPI } from "./services/api";

// Components
import ProfileCard from "./components/ProfileCard";
import MapModal from "./components/MapModal";
import ProfileDetailsModal from "./components/ProfileDetailsModal";

function App() {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profiles from backend
  const fetchProfiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await profileAPI.getAllProfiles();
      if (response.success) {
        setProfiles(response.data);
        setFilteredProfiles(response.data);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
      setError(
        "Failed to load profiles. Please make sure the backend server is running."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Filter profiles
  useEffect(() => {
    let filtered = profiles;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterLocation) {
      filtered = filtered.filter((p) =>
        p.address.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    setFilteredProfiles(filtered);
  }, [searchTerm, filterLocation, profiles]);

  const showSummary = (profile) => {
    setSelectedProfile(profile);
    setShowMap(true);
    setShowProfileDetails(false);
  };

  const showDetails = (profile) => {
    setSelectedProfile(profile);
    setShowProfileDetails(true);
    setShowMap(false);
  };

  const handleViewMap = (profile) => {
    setSelectedProfile(profile);
    setShowMap(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading profiles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl"></span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Connection Error
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProfiles}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={18} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">PE</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600">
                  Profile Explorer
                </h1>
               
              </div>
            </div>
            
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Filter by location..."
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Results count */}
          
        </div>

        {/* Profile Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredProfiles.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="bg-white rounded-lg p-8 shadow-md">
                <p className="text-gray-500 text-lg mb-2">
                  No profiles found matching your criteria.
                </p>
                <p className="text-gray-400 text-sm">
                  Try adjusting your search or filter terms.
                </p>
              </div>
            </div>
          ) : (
            filteredProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                showSummary={showSummary}
                showDetails={showDetails}
              />
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {showMap && (
        <MapModal profile={selectedProfile} onClose={() => setShowMap(false)} />
      )}

      {showProfileDetails && (
        <ProfileDetailsModal
          profile={selectedProfile}
          onClose={() => setShowProfileDetails(false)}
          onViewMap={handleViewMap}
        />
      )}
    </div>
  );
}

export default App;
