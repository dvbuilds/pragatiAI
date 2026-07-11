import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import PublicPortalPage from './pages/PublicPortalPage';
import AssistantPage from './pages/AssistantPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');

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

  // Global Map Issues State
  const [issues, setIssues] = useState([
    {
      id: 'marker-pothole',
      title: 'Main St. Pothole',
      description: 'Deep road fissure reported near lane dividing marker. Damaging tires.',
      status: 'active',
      type: 'pothole',
      top: '58%',
      left: '42%',
      timeReported: '2 hours ago'
    },
    {
      id: 'marker-lighting',
      title: 'Lighting Resolved: Oak Ave',
      description: 'Replaced flickering bulb and sensor unit at intersection streetlight.',
      status: 'resolved',
      type: 'lighting',
      top: '42%',
      left: '66%',
      timeReported: 'Yesterday'
    },
    {
      id: 'marker-utilities',
      title: 'Utilities: Power Substation Overload',
      description: 'Substation failure in progress. Electrical technicians actively rerouting local grids.',
      status: 'active',
      type: 'lighting',
      top: '28%',
      left: '28%',
      timeReported: 'Just now'
    },
    {
      id: 'marker-trash',
      title: 'Sanitation: Trash Overflow',
      description: 'Unscheduled overflow reported at central greenway waste collection bin.',
      status: 'active',
      type: 'sanitation',
      top: '72%',
      left: '54%',
      timeReported: '3 hours ago'
    }
  ]);

  const handleAddRequest = (newReq) => {
    setRequests(prev => [newReq, ...prev]);
  };

  const handleUpdateRequest = (id, updated) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, ...updated } : req));
  };

  const handleAddIssue = (newIssue) => {
    setIssues(prev => [newIssue, ...prev]);
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
            <LandingPage onNavigate={setActiveTab} />
          )}

          {activeTab === 'dashboard' && (
            <DashboardPage 
              onNavigate={setActiveTab} 
              requests={requests}
              onAddRequest={handleAddRequest}
              onUpdateRequest={handleUpdateRequest}
            />
          )}

          {activeTab === 'portal' && (
            <PublicPortalPage 
              onNavigate={setActiveTab}
              issues={issues}
              onAddIssue={handleAddIssue}
            />
          )}

          {activeTab === 'assistant' && (
            <AssistantPage 
              onNavigate={setActiveTab}
              onAddRequest={handleAssistantAddRequest}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
