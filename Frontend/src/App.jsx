import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import PublicPortalPage from './pages/PublicPortalPage';
import AssistantPage from './pages/AssistantPage';
import SettingsPage from './pages/SettingsPage';
import DocumentPage from './pages/DocumentPage';
import GovernmentScheme from './pages/GovernmentScheme';
import Complaint from './pages/Complaint';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './context/AuthContext';

const PROTECTED_TABS = ['dashboard', 'portal', 'assistant', 'settings', 'documents', 'schemes', 'complaints'];
const ACTIVE_TAB_KEY = 'cp_active_tab';

// Reads whatever tab the user was last on so a refresh (F5) reopens the
// same page instead of bouncing back to the landing page.
function getInitialTab() {
  try {
    return sessionStorage.getItem(ACTIVE_TAB_KEY) || 'landing';
  } catch {
    return 'landing';
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const { user, authChecked, logout, checkAuth } = useAuth();

  // Keep sessionStorage in sync so a refresh always reopens on this tab.
  useEffect(() => {
    try {
      sessionStorage.setItem(ACTIVE_TAB_KEY, activeTab);
    } catch {
      // sessionStorage can be unavailable (privacy mode, etc.) — fine to skip
    }
  }, [activeTab]);

  // Route guard: once we know whether there's a session, bounce
  // unauthenticated visitors away from protected tabs, and send signed-in
  // users straight to their dashboard instead of the landing/login/register
  // screens (whether that's on first load or after a refresh).
  useEffect(() => {
    if (!authChecked) return;
    if (!user && PROTECTED_TABS.includes(activeTab)) {
      setActiveTab('login');
    }
    if (user && (activeTab === 'landing' || activeTab === 'login' || activeTab === 'register')) {
      setActiveTab('dashboard');
    }
  }, [authChecked, user, activeTab]);

  const handleNavigate = (tab) => {
    if (PROTECTED_TABS.includes(tab) && !user) {
      setActiveTab('login');
      return;
    }
    setActiveTab(tab);
  };

  const handleLogout = async () => {
    await logout();
    setActiveTab('landing');
  };

  // Global Active Requests State
  const [requests, setRequests] = useState([
    {
      id: 'req-parking-permit',
      title: 'Residential Parking Permit Renewal',
      status: 'In Review',
      dateSubmitted: 'Oct 12',
      type: 'parking',
      description: 'Renewing standard resident street decal for primary sedan. Verification pending with local department records.'
    },
    {
      id: 'req-tax-exemption',
      title: 'Property Tax Exemption Relief',
      status: 'Missing Info',
      dateSubmitted: 'Oct 10',
      type: 'tax',
      description: 'Needs income verification statement document to proceed with eligibility relief.'
    },
    {
      id: 'req-bin-replacement',
      title: 'Bin Replacement Request',
      status: 'Resolved',
      dateSubmitted: 'Oct 08',
      type: 'sanitation',
      description: 'Request for secondary organic recycling bin replacement. Completed by sanitation services crew on Friday morning.'
    }
  ]);

  const handleAddRequest = (newReq) => {
    setRequests(prev => [newReq, ...prev]);
  };

  const handleAssistantAddRequest = (title, type) => {
    const newReq = {
      id: `req-asst-${Date.now()}`,
      title,
      status: 'In Review',
      dateSubmitted: 'Just now',
      type,
      description: 'Form prefilled and submitted directly through CivicPulse AI Guide.'
    };
    handleAddRequest(newReq);
  };

  return (
    <div id="app-root" className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans overflow-x-hidden">
      {!authChecked ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="w-full min-h-screen"
        >
          {activeTab === 'landing' && (
            <LandingPage onNavigate={handleNavigate} />
          )}

          {activeTab === 'login' && (
            <Login onNavigate={handleNavigate} />
          )}

          {activeTab === 'register' && (
            <Register onNavigate={handleNavigate} />
          )}

          {activeTab === 'dashboard' && user && (
            <DashboardPage 
              onNavigate={handleNavigate} 
              onLogout={handleLogout}
              currentUser={user}
            />
          )}

          {activeTab === 'portal' && user && (
            <PublicPortalPage 
              onNavigate={handleNavigate}
              onLogout={handleLogout}
              currentUser={user}
            />
          )}

          {activeTab === 'assistant' && user && (
            <AssistantPage 
              onNavigate={handleNavigate}
              onLogout={handleLogout}
              currentUser={user}
              onAddRequest={handleAssistantAddRequest}
            />
          )}

          {activeTab === 'settings' && user && (
            <SettingsPage
              onNavigate={handleNavigate}
              onLogout={handleLogout}
              currentUser={user}
              onProfileUpdated={checkAuth}
            />
          )}

          {activeTab === 'documents' && user && (
            <DocumentPage
              onNavigate={handleNavigate}
              onLogout={handleLogout}
              currentUser={user}
            />
          )}

          {activeTab === 'schemes' && user && (
            <GovernmentScheme
              onNavigate={handleNavigate}
              onLogout={handleLogout}
              currentUser={user}
            />
          )}

          {activeTab === 'complaints' && user && (
            <Complaint
              onNavigate={handleNavigate}
              onLogout={handleLogout}
              currentUser={user}
            />
          )}
        </motion.div>
      </AnimatePresence>
      )}
    </div>
  );
}