import React from "react";
import { Plus } from "lucide-react";

const Header = ({ showAdminPanel, setShowAdminPanel }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600">
              Profile Explorer
            </h1>
          </div>
          <button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>{showAdminPanel ? "Close" : "Admin"} Panel</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
