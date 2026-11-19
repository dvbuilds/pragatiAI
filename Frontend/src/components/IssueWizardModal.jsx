import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, UploadCloud, FileText, CheckCircle, ArrowRight, AlertCircle, MapPin } from 'lucide-react';
import LocationPicker from './LocationPicker';
import { createIssue, getIssueTitle } from '../lib/issueService';
import { useLanguage } from '../i18n/LanguageContext';

const STEP_DESCRIBE = 1;
const STEP_LOCATE = 2;
const STEP_REVIEW = 3;
const STEP_DONE = 4;

export default function IssueWizardModal({ isOpen, onClose, onIssueCreated, defaultCenter }) {
  const { t } = useLanguage();
  const [step, setStep] = useState(STEP_DESCRIBE);
  const [description, setDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const [locationValue, setLocationValue] = useState(null); // { lat, lng, address }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [createdIssue, setCreatedIssue] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
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

  const goToLocationStep = () => {
    if (!description.trim()) {
      alert(t('issue.wizard.error.describe'));
      return;
    }
    setStep(STEP_LOCATE);
  };

  const goToReviewStep = () => {
    if (!locationValue) {
      alert(t('issue.wizard.error.pinLocation'));
      return;
    }
    setStep(STEP_REVIEW);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const issue = await createIssue({
        description,
        lat: locationValue.lat,
        lng: locationValue.lng,
        address: locationValue.address,
        photo: uploadedFile,
      });
      setCreatedIssue(issue);
      onIssueCreated?.(issue);
      setStep(STEP_DONE);
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || t('issue.wizard.error.submitFailed')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(STEP_DESCRIBE);
    setDescription('');
    setUploadedFile(null);
    setLocationValue(null);
    setSubmitError('');
    setCreatedIssue(null);
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
              <h2 className="text-xl font-bold text-slate-900">{t('issue.wizard.title')}</h2>
              <p className="text-xs text-slate-500">{t('issue.wizard.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t('common.close')}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 flex-grow overflow-y-auto space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center gap-4">
            <div className={`flex-grow h-2 rounded-full transition-all duration-300 ${step >= STEP_DESCRIBE ? 'bg-teal-600' : 'bg-slate-100'}`}></div>
            <div className={`flex-grow h-2 rounded-full transition-all duration-300 ${step >= STEP_LOCATE ? 'bg-teal-600' : 'bg-slate-100'}`}></div>
            <div className={`flex-grow h-2 rounded-full transition-all duration-300 ${step >= STEP_REVIEW ? 'bg-teal-600' : 'bg-slate-100'}`}></div>
            <div className={`flex-grow h-2 rounded-full transition-all duration-300 ${step >= STEP_DONE ? 'bg-teal-600' : 'bg-slate-100'}`}></div>
          </div>

          <AnimatePresence mode="wait">
            {step === STEP_DESCRIBE && (
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
                    <h3 className="font-semibold text-teal-900 text-sm">{t('issue.wizard.ai.title')}</h3>
                    <p className="text-xs text-teal-700/85 leading-relaxed mt-1">
                      {t('issue.wizard.ai.body')}
                    </p>
                  </div>
                </div>

                {/* Photo upload */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={selectFile}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    dragActive ? 'border-teal-500 bg-teal-50/50' : 'border-slate-200 hover:border-teal-300'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {uploadedFile ? (
                    <div className="flex items-center justify-center gap-2 text-slate-700">
                      <FileText className="w-4 h-4 text-teal-600" />
                      <span className="text-sm font-semibold">{uploadedFile.name}</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <UploadCloud className="w-6 h-6 mx-auto text-slate-400" />
                      <p className="text-sm text-slate-600 font-semibold">{t('issue.wizard.photo.prompt')}</p>
                      <p className="text-xs text-slate-400">{t('issue.wizard.photo.hint')}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                    {t('issue.wizard.description.label')}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-4 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all placeholder-slate-400"
                    placeholder={t('issue.wizard.description.placeholder')}
                  />
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="text-xs text-slate-500">{t('issue.wizard.suggest.label')}</span>
                    <button
                      type="button"
                      onClick={() => setDescription(t('issue.wizard.suggest.streetlight.text'))}
                      className="text-xs text-teal-700 hover:underline cursor-pointer"
                    >
                      {t('issue.wizard.suggest.streetlight.button')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDescription(t('issue.wizard.suggest.pothole.text'))}
                      className="text-xs text-teal-700 hover:underline cursor-pointer"
                    >
                      {t('issue.wizard.suggest.pothole.button')}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === STEP_LOCATE && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-teal-100 text-teal-700 rounded-lg mt-0.5">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">{t('issue.wizard.locate.title')}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                      {t('issue.wizard.locate.body')}
                    </p>
                  </div>
                </div>

                <LocationPicker
                  value={locationValue}
                  defaultCenter={defaultCenter || { lat: 22.5726, lng: 88.3639 }}
                  onChange={setLocationValue}
                />
              </motion.div>
            )}

            {step === STEP_REVIEW && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6 text-center py-4"
              >
                {isSubmitting ? (
                  <div className="py-12 space-y-4">
                    <div className="relative w-16 h-16 mx-auto">
                      <div className="absolute inset-0 border-4 border-teal-100 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-teal-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg">{t('issue.wizard.submitting.title')}</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto">
                      {t('issue.wizard.submitting.body')}
                    </p>
                  </div>
                ) : (
                  <div className="text-left space-y-6">
                    <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 space-y-4">
                      <div>
                        <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">{t('issue.wizard.review.description')}</span>
                        <p className="text-sm text-slate-700 mt-1">{description}</p>
                      </div>
                      <div className="border-t border-slate-100 pt-4">
                        <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">{t('issue.wizard.review.location')}</span>
                        <p className="text-sm text-slate-700 mt-1">
                          {locationValue?.address || `${locationValue?.lat.toFixed(5)}, ${locationValue?.lng.toFixed(5)}`}
                        </p>
                      </div>
                      {uploadedFile && (
                        <div className="border-t border-slate-100 pt-4">
                          <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">{t('issue.wizard.review.photo')}</span>
                          <p className="text-sm text-slate-700 mt-1">{uploadedFile.name}</p>
                        </div>
                      )}
                    </div>

                    {submitError && (
                      <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-lg text-rose-700 text-xs font-semibold">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {submitError}
                      </div>
                    )}

                    <div className="text-xs text-slate-400 text-center">
                      {t('issue.wizard.review.note')}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === STEP_DONE && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle className="w-8 h-8" />
                </div>

                <div className="space-y-2 max-w-sm mx-auto">
                  <h3 className="font-bold text-slate-900 text-xl">{t('issue.wizard.done.title')}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {t('issue.wizard.done.body', { department: createdIssue?.department ?? '' })}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 max-w-sm mx-auto flex items-center justify-between text-left">
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">{t('issue.wizard.done.category')}</span>
                    <span className="text-sm font-mono text-slate-800 font-bold capitalize">
                      {createdIssue ? getIssueTitle(createdIssue, t) : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">{t('issue.wizard.done.priority')}</span>
                    <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-100">
                      {createdIssue?.priority ? t(`common.priority.${createdIssue.priority}`) : ''}
                    </span>
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
                    {t('issue.wizard.done.backToPortal')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Buttons */}
        {step < STEP_DONE && (
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <button
              onClick={() => {
                if (step === STEP_LOCATE) setStep(STEP_DESCRIBE);
                else if (step === STEP_REVIEW) setStep(STEP_LOCATE);
                else onClose();
              }}
              disabled={isSubmitting}
              className="px-6 py-2.5 font-semibold text-slate-500 hover:text-slate-800 text-sm transition-colors disabled:opacity-50"
            >
              {step === STEP_DESCRIBE ? t('issue.wizard.button.cancel') : t('issue.wizard.button.back')}
            </button>
            <button
              onClick={
                step === STEP_DESCRIBE ? goToLocationStep :
                step === STEP_LOCATE ? goToReviewStep :
                handleSubmit
              }
              disabled={
                isSubmitting ||
                (step === STEP_DESCRIBE && !description.trim()) ||
                (step === STEP_LOCATE && !locationValue)
              }
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-semibold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
            >
              <span>
                {step === STEP_DESCRIBE ? t('issue.wizard.button.toLocation') : step === STEP_LOCATE ? t('issue.wizard.button.toReview') : t('issue.wizard.button.submit')}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
