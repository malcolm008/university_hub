/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { api, handleApiError } from '../services/api'; // ✅ FIXED: Correct import path

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AppContext = createContext();

// Session duration: 30 days in milliseconds
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000;

// Helper function to safely parse API responses
const safeParseResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  const text = await response.text();
  return {
    success: false,
    message: text || 'Server error occurred',
    status: response.status,
  };
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const statsCache = useRef({});
  const isLoadingRegistrations = useRef(false);
  const isLoadingAmbassadors = useRef(false);
  const isDashboardInitialized = useRef(false);
  const isAmbassadorDashboardInitialized = useRef(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [ambassadors, setAmbassadors] = useState([
    { id: 'amb_1', name: 'Malcolm Mwakitwange', slug: 'malcolm', active: true, email: 'malcolm@university.edu' },
    { id: 'amb_2', name: 'Sarah Johnson', slug: 'sarah', active: true, email: 'sarah@university.edu' },
    { id: 'amb_3', name: 'David Chen', slug: 'david', active: true, email: 'david@university.edu' },
  ]);
  const [proofs, setProofs] = useState([]);
  const [toast, setToast] = useState({ message: '', type: '', show: false });
  const [isLoading, setIsLoading] = useState(false);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, show: true });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  }, []);

  const clearUserData = useCallback(() => {
    setUser(null);
    setToken(null);
    setSessionExpiry(null);
    setRegistrations([]);
    setProofs([]);
  
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('sessionExpiry');
    sessionStorage.removeItem('lastRegistration');

    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  }, []);

  const isSessionValid = useCallback(() => {
    if (!sessionExpiry) return false;
    return new Date().getTime() < sessionExpiry;
  }, [sessionExpiry]);

  const refreshSession = useCallback(() => {
    const newExpiry = new Date().getTime() + SESSION_DURATION;
    setSessionExpiry(newExpiry);
    localStorage.setItem('sessionExpiry', newExpiry.toString());
  }, [SESSION_DURATION]);

  // ✅ Load user from token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedSessionExpiry = localStorage.getItem('sessionExpiry');

    if (storedSessionExpiry) {
      const expiry = parseInt(storedSessionExpiry);
      if (new Date().getTime() > expiry) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('sessionExpiry');
        setIsInitialized(true);
        return;
      }
      setSessionExpiry(expiry);
    }

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      api.auth.getMe(storedToken)
        .then(response => {
          if (response.success) {
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('sessionExpiry');
            setToken(null);
            setUser(null);
          }
          setIsInitialized(true);
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('sessionExpiry');
          setToken(null);
          setUser(null);
          setIsInitialized(true);
        });
    } else {
      setIsInitialized(true);
    }
  }, []);

  // ✅ Session monitoring effect
  useEffect(() => {
    if (!user || !isInitialized) return;

    const handleUserActivity = () => {
      refreshSession();
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity);
    });

    const interval = setInterval(() => {
      if (!isSessionValid()) {
        setTimeout(() => {
          clearUserData();
          showToast('Session expired. Please login again.', 'error');
        }, 0);
      }
    }, 60000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
      clearInterval(interval);
    };
  }, [user, isInitialized, refreshSession, isSessionValid, clearUserData, showToast]);

  const login = useCallback(async (email, password, rememberMe = true) => {
    setIsLoading(true);
    try {
      const response = await api.auth.login({ email, password });
      
      if (response.success) {
        const userData = response.user;
        const tokenData = response.token;
        
        setUser(userData);
        setToken(tokenData);
        
        localStorage.setItem('token', tokenData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        if (rememberMe) {
          const expiry = new Date().getTime() + SESSION_DURATION;
          setSessionExpiry(expiry);
          localStorage.setItem('sessionExpiry', expiry.toString());
        } else {
          setSessionExpiry(null);
          localStorage.removeItem('sessionExpiry');
        }
        
        showToast(`Welcome back, ${userData.name}!`, 'success');
        return { success: true, user: userData };
      } else {
        let errorMessage = response.message || 'Login failed';
        if (response.status === 429) {
          errorMessage = 'Too many login attempts. Please wait 15 minutes.';
        } else if (response.status === 401) {
          errorMessage = 'Invalid email or password.';
        }
        showToast(errorMessage, 'error');
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      showToast(errorMsg.message, 'error');
      return { success: false, message: errorMsg.message };
    } finally {
      setIsLoading(false);
    }
  }, [showToast, SESSION_DURATION]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      if (token) {
        await api.auth.logout(token);
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      clearUserData();
      showToast('Logged out successfully', 'info');
      setIsLoading(false);
    }
  }, [token, clearUserData, showToast]);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      const response = await api.auth.register(userData);
      if (response.success) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        const expiry = new Date().getTime() + SESSION_DURATION;
        setSessionExpiry(expiry);
        localStorage.setItem('sessionExpiry', expiry.toString());
        
        showToast('Registration successful!', 'success');
        return { success: true, user: response.user };
      } else {
        showToast(response.message || 'Registration failed', 'error');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      showToast(errorMsg.message, 'error');
      return { success: false, message: errorMsg.message };
    } finally {
      setIsLoading(false);
    }
  }, [showToast, SESSION_DURATION]);

  const addRegistration = useCallback(async (data) => {
    setIsLoading(true);
    try {
      const response = await api.registrations.create(data);
      if (response.success) {
        setRegistrations(prev => [response.registration, ...prev]);
        showToast('Registration successful!', 'success');
        return { success: true, registration: response.registration };
      } else {
        showToast(response.message || 'Registration failed', 'error');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      showToast(errorMsg.message, 'error');
      return { success: false, message: errorMsg.message };
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const submitProof = useCallback(async (registrationId, proofData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('registrationId', registrationId);
      if (proofData.referenceNumber) formData.append('referenceNumber', proofData.referenceNumber);
      if (proofData.notes) formData.append('notes', proofData.notes);
      if (proofData.file) formData.append('file', proofData.file);
      
      const response = await api.proofs.submit(token, formData);
      if (response.success) {
        setProofs(prev => [...prev, response.proof]);
        showToast('Proof submitted successfully!', 'success');
        return { success: true, proof: response.proof };
      } else {
        showToast(response.message || 'Proof submission failed', 'error');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      showToast(errorMsg.message, 'error');
      return { success: false, message: errorMsg.message };
    } finally {
      setIsLoading(false);
    }
  }, [token, showToast]);

  const validateReferral = useCallback(async (registrationId) => {
    setIsLoading(true);
    try {
      const response = await api.proofs.validate(token, registrationId);
      if (response.success) {
        setRegistrations(prev => 
          prev.map(r => 
            r.id === registrationId ? { ...r, validated: true, proofStatus: 'validated' } : r
          )
        );
        showToast('Referral validated successfully!', 'success');
        return { success: true };
      } else {
        showToast(response.message || 'Validation failed', 'error');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      showToast(errorMsg.message, 'error');
      return { success: false, message: errorMsg.message };
    } finally {
      setIsLoading(false);
    }
  }, [token, showToast]);

  const loadRegistrations = useCallback(async (slug = null) => {
    console.log('🔵 loadRegistrations called with slug:', slug);
    
    // Prevent duplicate calls using ref
    if (isLoadingRegistrations.current) {
      console.log('⏳ Registrations already loading, skipping...');
      return { success: false, message: 'Already loading' };
    }

    isLoadingRegistrations.current = true;
    setIsLoading(true);

    try {
      let response;
      if (slug) {
        response = await api.registrations.getByAmbassador(token, slug);
      } else {
        response = await api.registrations.getAll(token);
      }
      
      if (response.success) {
        setRegistrations(response.registrations || []);
        return { success: true, registrations: response.registrations };
      } else {
        showToast(response.message || 'Failed to load registrations', 'error');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      showToast(errorMsg.message, 'error');
      return { success: false, message: errorMsg.message };
    } finally {
      setIsLoading(false);
      isLoadingRegistrations.current = false;
    }
  }, [token, showToast]);

  const loadAmbassadors = useCallback(async (includeInactive = false) => {
    console.log('🟢 loadAmbassadors called with includeInactive:', includeInactive);
    
    // Prevent duplicate calls using ref
    if (isLoadingAmbassadors.current) {
      console.log('⏳ Ambassadors already loading, skipping...');
      return { success: false, message: 'Already loading' };
    }

    isLoadingAmbassadors.current = true;
    setIsLoading(true);

    try {
      const response = await api.ambassadors.getAll(token, includeInactive);
      if (response.success) {
        setAmbassadors(response.ambassadors);
        return { success: true, ambassadors: response.ambassadors };
      } else {
        showToast(response.message || 'Failed to load ambassadors', 'error');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      showToast(errorMsg.message, 'error');
      return { success: false, message: errorMsg.message };
    } finally {
      setIsLoading(false);
      isLoadingAmbassadors.current = false;
    }
  }, [token, showToast]);

  const initializeDashboard = useCallback(async () => {
    if (isDashboardInitialized.current) {
      console.log('Dashboard already initialized globally, skipping...');
      return { success: true, alreadyInitialized: true };
    }

    console.log('AppContext: Initializing dashboard for the first time');
    isDashboardInitialized.current = true;

    try {
      await Promise.all([
        loadRegistrations(),
        loadAmbassadors(),
      ]);
      console.log('Dahboard initialization complete');
      return { success: true };
    } catch (error) {
      console.error('Dashboard initialization failed:', error);
      isDashboardInitialized.current = false;
      return { success: false, error };
    }
  }, [loadRegistrations, loadAmbassadors]);

  const initializeAmbassadorDashboard = useCallback(async (slug) => {
    if (isAmbassadorDashboardInitialized.current) {
      console.log('Ambassador dashboard already initialized globally, skipping...');
      return { success: true, alreadyInitialized: true };
    }

    console.log('AppContext: Initializing ambassador dashboard for the first time');
    isAmbassadorDashboardInitialized.current = true;

    try {
      await loadRegistrations(slug);
      console.log('Ambassador dashboard initialization complete');
      return { success: true };
    } catch (error) {
      console.error('Ambassador dashboard initialization failed:', error);
      isAmbassadorDashboardInitialized.current = false;
      return { success: false, error };
    }
  }, [loadRegistrations]);

  const resetDashboardInitialization = useCallback(() => {
    isDashboardInitialized.current = false;
    console.log('Dashboard initialization reset');
  })

  const createAmbassador = useCallback(async (ambassadorData) => {
    setIsLoading(true);
    try {
      const response = await api.ambassadors.create(token, ambassadorData);
      if (response.success) {
        setAmbassadors(prev => [...prev, response.ambassador]);
        showToast('Ambassador created successfully!', 'success');
        return { success: true, ambassador: response.ambassador };
      } else {
        showToast(response.message || 'Failed to create ambassador', 'error');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      showToast(errorMsg.message, 'error');
      return { success: false, message: errorMsg.message };
    } finally {
      setIsLoading(false);
    }
  }, [token, showToast]);

  const updateAmbassador = useCallback(async (id, ambassadorData) => {
    setIsLoading(true);
    try {
      const response = await api.ambassadors.update(token, id, ambassadorData);
      if (response.success) {
        setAmbassadors(prev => 
          prev.map(a => a.id === id ? { ...a, ...response.ambassador } : a)
        );
        showToast('Ambassador updated successfully!', 'success');
        return { success: true, ambassador: response.ambassador };
      } else {
        showToast(response.message || 'Failed to update ambassador', 'error');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      showToast(errorMsg.message, 'error');
      return { success: false, message: errorMsg.message };
    } finally {
      setIsLoading(false);
    }
  }, [token, showToast]);

  const deleteAmbassador = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const response = await api.ambassadors.delete(token, id);
      if (response.success) {
        setAmbassadors(prev => prev.filter(a => a.id !== id));
        showToast('Ambassador deleted successfully!', 'success');
        return { success: true };
      } else {
        showToast(response.message || 'Failed to delete ambassador', 'error');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      showToast(errorMsg.message, 'error');
      return { success: false, message: errorMsg.message };
    } finally {
      setIsLoading(false);
    }
  }, [token, showToast]);

  const toggleAmbassadorStatus = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const response = await api.ambassadors.toggleStatus(token, id);
      if (response.success) {
        setAmbassadors(prev => 
          prev.map(a => a.id === id ? { ...a, isActive: response.isActive } : a)
        );
        showToast(response.message, 'success');
        return { success: true, isActive: response.isActive };
      } else {
        showToast(response.message || 'Failed to toggle status', 'error');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      showToast(errorMsg.message, 'error');
      return { success: false, message: errorMsg.message };
    } finally {
      setIsLoading(false);
    }
  }, [token, showToast]);

  const getReferralsByAmbassador = useCallback((slug) => {
    return registrations.filter(r => r.referrerSlug === slug);
  }, [registrations]);

  const getStatsForAmbassador = useCallback((slug) => {
    const cacheKey = `stats-${slug}`;
    if (statsCache.current[cacheKey]) {
      return statsCache.current[cacheKey];
    }

    const refs = getReferralsByAmbassador(slug);
    const total = refs.length;
    const submitted = refs.filter(r => r.proofStatus === 'submitted').length;
    const pending = total - submitted;
    const validated = refs.filter(r => r.validated).length;
    const rate = total > 0 ? Math.round((submitted / total) * 100) : 0;

    const result = { total, submitted, pending, validated, rate };
    statsCache.current[cacheKey] = result;   

    return result;
  }, [getReferralsByAmbassador]);

  useEffect(() => {
    statsCache.current = {};
  }, [registrations]);

  const getAmbassadorBySlug = useCallback((slug) => {
    return ambassadors.find(a => a.slug === slug);
  }, [ambassadors]);

  const getRegistrationById = useCallback((id) => {
    return registrations.find(r => r.id === id);
  }, [registrations]);

  const getProofByRegistrationId = useCallback((regId) => {
    return proofs.find(p => p.registrationId === regId);
  }, [proofs]);

  const value = useMemo(() => ({
    user,
    setUser,
    token,
    registrations,
    setRegistrations,
    ambassadors,
    setAmbassadors,
    proofs,
    setProofs,
    isLoading,
    setIsLoading,
    sessionExpiry,
    isSessionValid,
    isInitialized,
    login,
    logout,
    register,
    refreshSession,
    clearUserData,
    addRegistration,
    submitProof,
    validateReferral,
    loadRegistrations,
    loadAmbassadors,        
    createAmbassador,        
    updateAmbassador,      
    deleteAmbassador,       
    toggleAmbassadorStatus,  
    initializeDashboard,
    initializeAmbassadorDashboard,
    resetDashboardInitialization,
    getReferralsByAmbassador,
    getStatsForAmbassador,
    getAmbassadorBySlug,
    getRegistrationById,
    getProofByRegistrationId,
    showToast,
    toast,
  }), [
    user,
    token,
    registrations,
    ambassadors,
    proofs,
    isLoading,
    sessionExpiry,
    isSessionValid,
    isInitialized,
    login,
    logout,
    register,
    refreshSession,
    clearUserData,
    addRegistration,
    submitProof,
    validateReferral,
    loadRegistrations,
    loadAmbassadors,
    createAmbassador,
    updateAmbassador,
    deleteAmbassador,
    toggleAmbassadorStatus,
    initializeDashboard,
    initializeAmbassadorDashboard,
    resetDashboardInitialization,
    getReferralsByAmbassador,
    getStatsForAmbassador,
    getAmbassadorBySlug,
    getRegistrationById,
    getProofByRegistrationId,
    showToast,
    toast,
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};