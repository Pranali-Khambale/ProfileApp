import React from "react";
import { X, MapPin, ExternalLink } from "lucide-react";

const MapModal = ({ profile, onClose }) => {
  if (!profile) return null;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${profile.lat},${profile.lng}`;

  return (
    <div className="fixed inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
        <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-indigo-50 to-blue-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Location - {profile.name}
            </h2>
           
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-white rounded-full"
            title="Close map"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-5 mb-6 border border-indigo-100">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-1">Address</p>
                <p className="text-gray-700">{profile.address}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-indigo-200">
              <div className="bg-white p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Latitude</p>
                <p className="font-mono text-sm text-gray-800 font-medium">
                  {profile.lat.toFixed(6)}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Longitude</p>
                <p className="font-mono text-sm text-gray-800 font-medium">
                  {profile.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </div>

          <div className="relative w-full h-96 bg-gray-200 rounded-xl overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${profile.lat},${profile.lng}&zoom=15`}
              allowFullScreen
              title={`Map location for ${profile.name}`}
            />
          </div>

          <div className="mt-6">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md hover:shadow-lg"
            >
              <ExternalLink className="w-5 h-5" />
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
