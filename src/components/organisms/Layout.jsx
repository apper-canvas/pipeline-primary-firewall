import React, { useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import { AuthContext } from "../../App";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { isAuthenticated } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={handleSidebarClose}
        onLogout={handleLogout}
      />
      
      <div className="lg:ml-64">
        <Header 
          onMenuClick={handleMenuClick}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onLogout={handleLogout}
        />
        
        <main className="min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;