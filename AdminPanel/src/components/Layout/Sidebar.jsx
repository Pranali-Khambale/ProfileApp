import React from "react";
import { Users, Menu, X, LogOut, Home } from "lucide-react";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeSection,
  setActiveSection,
  menuItems,
  onLogout,
}) => {
  const iconMap = {
    home: <Home size={20} />,
    about: <Users size={20} />,
  };

  return (
    <aside
      className={`bg-gray-900 text-white transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-20"
      } overflow-y-auto fixed h-screen`}
    >
      <div className="p-4 flex items-center justify-between sticky top-0 bg-gray-900 z-10 border-b border-gray-800">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">II</span>
            </div>
            <h1 className="text-xl font-bold">Profile</h1>
          </div>
        )}
        {!sidebarOpen && (
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">II</span>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-800 rounded transition-colors"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-3 hover:bg-gray-800 transition ${
              activeSection === item.id
                ? "bg-gray-800 border-l-4 border-blue-500"
                : ""
            }`}
            title={!sidebarOpen ? item.label : ""}
          >
            <div className="flex-shrink-0">{iconMap[item.id]}</div>
            {sidebarOpen && <span className="truncate">{item.label}</span>}
          </button>
        ))}

        <div className="border-t border-gray-800 my-4"></div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-6 py-3 hover:bg-red-600 transition text-red-400 hover:text-white"
          title={!sidebarOpen ? "Logout" : ""}
        >
          <div className="flex-shrink-0">
            <LogOut size={20} />
          </div>
          {sidebarOpen && <span>Logout</span>}
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
