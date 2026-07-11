import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, UploadCloud, FileText, CheckCircle, ArrowRight } from 'lucide-react';

export default function IssueWizardModal({ isOpen, onClose, onIssueCreated }) {
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Mock AI categorization state
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiCategorized, setAiCategorized] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const selectFile = () => {
    fileInputRef.current?.click();
  };

  const handleContinue = () => {
    if (step === 1) {
      if (!description.trim()) {
        alert("Please describe what's happening.");
        return;
      }
      setAiAnalyzing(true);
      setStep(2);
      
      // Simulate AI categorization
      setTimeout(() => {
        setAiAnalyzing(false);
        const descLower = description.toLowerCase();
        let category = 'other';
        let department = 'Department of Public Works';
        let priority = 'Medium';

        if (descLower.includes('pothole') || descLower.includes('road') || descLower.includes('street') || descLower.includes('pave')) {
          category = 'pothole';
          department = 'Bureau of Streets & Repair';
          priority = 'High';
        } else if (descLower.includes('light') || descLower.includes('dark') || descLower.includes('lamp')) {
          category = 'lighting';
          department = 'Department of Electrical Services';
          priority = 'Medium';
        } else if (descLower.includes('trash') || descLower.includes('bin') || descLower.includes('garbage') || descLower.includes('sanitation')) {
          category = 'sanitation';
          department = 'Sanitation & Solid Waste Division';
          priority = 'Medium';
        } else if (descLower.includes('loud') || descLower.includes('noise') || descLower.includes('sound') || descLower.includes('music')) {
          category = 'noise';
          department = 'Code Enforcement & Environmental Health';
          priority = 'Low';
        }

        setAiCategorized({
          category,
          department,
          priority,
          coordinates: {
            top: `${Math.floor(Math.random() * 40) + 30}%`,
            left: `${Math.floor(Math.random() * 40) + 30}%`,
          }
        });
      }, 1500);

    } else if (step === 2) {
      // Create issue and advance to step 3
      const newIssue = {
        id: `marker-${Date.now()}`,
        title: aiCategorized.category === 'pothole' ? 'Pothole Report' : 
               aiCategorized.category === 'lighting' ? 'Streetlight Issue' : 
               aiCategorized.category === 'sanitation' ? 'Trash/Sanitation Report' : 
               aiCategorized.category === 'noise' ? 'Noise Compliant' : 'Civic Inquiry',
        description: description,
        status: 'active',
        type: aiCategorized.category,
        top: aiCategorized.coordinates.top,
        left: aiCategorized.coordinates.left,
        timeReported: 'Just now'
      };
      onIssueCreated(newIssue);
      setStep(3);
    }
  };

  const handleReset = () => {
    setStep(1);
    setDescription('');
    setUploadedFile(null);
    setAiCategorized(null);
  };

  if (!isOpen) return null;

  return (
    <div id="wizard-overlay" className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-teal-50 text-teal-600 p-2.5 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Report a New Issue</h2>
              <p className="text-xs text-slate-500">AI-Assisted Dispatch Center</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 flex-grow overflow-y-auto space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center gap-4">
            <div className={`flex-grow h-2 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-teal-600' : 'bg-slate-100'}`}></div>
            <div className={`flex-grow h-2 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-teal-600' : 'bg-slate-100'}`}></div>
            <div className={`flex-grow h-2 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-teal-600' : 'bg-slate-100'}`}></div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                {/* AI banner */}
                <div className="bg-teal-50/50 border border-teal-100/60 rounded-2xl p-5 flex items-start gap-4">
                  <div className="p-1.5 bg-teal-100 text-teal-700 rounded-lg mt-0.5">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-teal-900 text-sm">AI Smart Categorization</h3>
                    <p className="text-xs text-teal-700/85 leading-relaxed mt-1">
                      Upload a photo or write in natural language. Our AI will automatically determine the category, identify the department, and assign dispatch priority.
                    </p>
                  </div>
                </div>

                {/* Upload Section */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2.5">Upload Photo (Optional)</label>
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={selectFile}
                    className={`border-2 border-dashed rounded-2xl h-44 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      dragActive 
                        ? 'border-teal-500 bg-teal-50/20' 
                        : uploadedFile 
                        ? 'border-slate-300 bg-slate-50' 
                        : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {uploadedFile ? (
                      <div className="text-center p-4">
                        <FileText className="w-10 h-10 text-teal-600 mx-auto mb-2" />
                        <span className="font-medium text-sm text-slate-800 block truncate max-w-[250px]">
                          {uploadedFile.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Ready
                        </span>
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                        <span className="font-semibold text-slate-700 text-sm block">
                          Drag and drop or click to upload
                        </span>
                        <span className="text-xs text-slate-400 mt-1 block">
                          Supports PNG, JPG up to 10MB
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Describe what's happening
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-4 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all placeholder-slate-400"
                    placeholder="Example: Large pothole appearing near the intersection of 4th and Main. It is causing cars to swerve..."
                  />
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="text-xs text-slate-500">Quick suggests:</span>
                    <button 
                      type="button"
                      onClick={() => setDescription("Streetlight is blinking repeatedly near 12 Oak Ave, causing it to be pitch black at night.")}
                      className="text-xs text-teal-700 hover:underline cursor-pointer"
                    >
                      💡 Blinking Streetlight
                    </button>
                    <button 
                      type="button"
                      onClick={() => setDescription("Large deep pothole on West Gate Road, left-bound lane. Multiple cars swerving.")}
                      className="text-xs text-teal-700 hover:underline cursor-pointer"
                    >
                      🚗 Deep Pothole
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6 text-center py-4"
              >
                {aiAnalyzing ? (
                  <div className="py-12 space-y-4">
                    <div className="relative w-16 h-16 mx-auto">
                      <div className="absolute inset-0 border-4 border-teal-100 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-teal-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg">AI Smart Parsing...</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto">
                      Analyzing your description and matching with municipal code databases.
                    </p>
                  </div>
                ) : (
                  <div className="text-left space-y-6">
                    <div className="bg-teal-50/50 border border-teal-100/60 rounded-2xl p-5 flex items-start gap-4">
                      <Sparkles className="w-5 h-5 text-teal-600 mt-1" />
                      <div>
                        <h3 className="font-bold text-teal-900 text-sm">Classification Completed</h3>
                        <p className="text-xs text-teal-700 mt-0.5">
                          CivicPulse AI successfully matched your report to the correct department guidelines.
                        </p>
                      </div>
                    </div>

                    <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Matched Category</span>
                          <span className="text-sm font-semibold text-slate-800 capitalize">
                            {aiCategorized?.category}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Priority Assessment</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            aiCategorized?.priority === 'High' 
                              ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                              : aiCategorized?.priority === 'Medium'
                              ? 'bg-amber-50 text-amber-700 border border-amber-100'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          }`}>
                            {aiCategorized?.priority}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-4">
                        <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Assigned Dispatch Department</span>
                        <span className="text-sm font-semibold text-slate-800 block mt-1">
                          {aiCategorized?.department}
                        </span>
                      </div>

                      <div className="border-t border-slate-100 pt-4">
                        <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Citizen Description</span>
                        <p className="text-sm text-slate-600 mt-1 italic">
                          "{description}"
                        </p>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 text-center">
                      Our system pre-filled all internal codes. Click "Confirm & Dispatch" to submit.
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle className="w-8 h-8" />
                </div>
                
                <div className="space-y-2 max-w-sm mx-auto">
                  <h3 className="font-bold text-slate-900 text-xl">Issue Logged & Dispatched</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Thank you! The {aiCategorized?.department} has been notified. A crew is scheduled to investigate.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 max-w-sm mx-auto flex items-center justify-between text-left">
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">Incident ID</span>
                    <span className="text-sm font-mono text-slate-800 font-bold">#CP-{Math.floor(1000 + Math.random() * 9000)}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">Status</span>
                    <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-100">Scheduled</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      handleReset();
                      onClose();
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-xl text-sm transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Back to Portal
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Buttons */}
        {step < 3 && (
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <button
              onClick={step === 2 ? handleReset : onClose}
              disabled={aiAnalyzing}
              className="px-6 py-2.5 font-semibold text-slate-500 hover:text-slate-800 text-sm transition-colors disabled:opacity-50"
            >
              {step === 2 ? 'Back' : 'Cancel'}
            </button>
            <button
              onClick={handleContinue}
              disabled={aiAnalyzing || (step === 1 && !description.trim())}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-semibold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
            >
              <span>{step === 2 ? 'Confirm & Dispatch' : 'Continue to Categorization'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
