import React, { useState } from "react";

import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import Dashboard from "./components/Dashboard";
import ProfileManagement from "./components/ProfileManagement";
import Login from "./components/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [openAddProfileModal, setOpenAddProfileModal] = useState(false);

  const menuItems = [
    { id: "home", label: "Dashboard" },
    { id: "about", label: "Profile Management" },
  ];

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      setIsAuthenticated(false);
      setActiveSection("home");
    }
  };

  const handleNavigateToAddProfile = () => {
    setActiveSection("about");
    setOpenAddProfileModal(true);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <Dashboard
            onNavigate={setActiveSection}
            onAddProfile={handleNavigateToAddProfile}
          />
        );
      case "about":
        return (
          <ProfileManagement
            openAddModal={openAddProfileModal}
            setOpenAddModal={setOpenAddProfileModal}
          />
        );
      default:
        return (
          <Dashboard
            onNavigate={setActiveSection}
            onAddProfile={handleNavigateToAddProfile}
          />
        );
    }
  };

  const getHeaderTitle = () => {
    const item = menuItems.find((m) => m.id === activeSection);
    return item ? item.label : "Dashboard";
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        menuItems={menuItems}
        onLogout={handleLogout}
      />

      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <Header
          title={getHeaderTitle()}
          subtitle={`Manage your ${getHeaderTitle().toLowerCase()}`}
        />

        <main className="flex-1 overflow-y-auto bg-gray-100">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
