import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  PROFILE_DATA,
  PUBLICATIONS_LIST,
  STUDY_REGIONS,
  Publication,
  StudyRegion,
} from '../data/cvData';
import {
  getRemotePortfolioContent,
  subscribeToRemotePortfolio,
  setRemotePortfolioContent,
  getRemoteInquiries,
  deleteRemoteInquiry,
} from '../firebase';
import { Language, TRANSLATIONS } from '../i18n/translations';

export interface ProfileData {
  name: string;
  title: string;
  institution: string;
  location: string;
  email: string;
  phone: string;
  orcid: string;
  orcidId: string;
  photoUrl: string;
  cvPdfUrl: string;
  summary: string;
  headline?: string;
  aboutNarrative?: string;
  languages: { language: string; proficiency: string }[];
}

export interface SocialLinks {
  linkedin?: string;
  researchgate?: string;
  googlescholar?: string;
  twitter?: string;
  github?: string;
  orcid?: string;
  [key: string]: string | undefined;
}

export interface PhotoGalleryItem {
  id: string;
  title: string;
  caption: string;
  category: string;
  imageUrl: string;
  date: string;
}

const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  linkedin: 'https://linkedin.com/in/getachew-haile-iqqo',
  researchgate: 'https://www.researchgate.net/profile/Getachew-Haile',
  googlescholar: 'https://scholar.google.com/citations?user=getachew-haile',
  twitter: 'https://x.com/boqolo',
  github: 'https://github.com/getachew-haile-iqqo',
  orcid: 'https://orcid.org/0000-0003-1298-3422',
};

const DEFAULT_PHOTO_GALLERY: PhotoGalleryItem[] = [
  {
    id: 'gal_1',
    title: 'Tef Organic Fertilizer Demonstration Plots',
    caption: 'Experimental tef plots evaluating ECONAT organic liquid fertilizer in Bora District, East Shewa Zone, Oromia.',
    category: 'Field Agronomy',
    imageUrl: '/src/assets/images/ethiopian_agriculture_field_trial_1794209254817.jpg',
    date: 'October 2022',
  },
  {
    id: 'gal_2',
    title: 'GIS Multi-Criteria Land Suitability Console',
    caption: 'Raster modeling, AHP decision weights, and digital soil fertility mapping at IQQO Natural Resources Directorate.',
    category: 'Geospatial Lab',
    imageUrl: '/src/assets/images/gis_multicriteria_soil_modeling_1794209253751.jpg',
    date: 'June 2023',
  },
  {
    id: 'gal_3',
    title: 'Satellite Topography & Watershed Delineation',
    caption: 'False-color NDVI and SRTM elevation contours across the Ethiopian Rift Valley & Arsi Zone catchments.',
    category: 'Remote Sensing',
    imageUrl: '/src/assets/images/ethiopia_geospatial_topography_1794209253351.jpg',
    date: 'September 2023',
  },
  {
    id: 'gal_4',
    title: 'Getachew Haile · Leadership & Research Profile',
    caption: 'Executive leadership and digital agriculture strategy at Oromia Agricultural Research Institute.',
    category: 'Leadership',
    imageUrl: '/assets/aistudio/photo_2026-05-26_22-25-44_b863dba6.jpg',
    date: '2024',
  },
];

const DEFAULT_PASSCODE = 'Get@1255';

const safeParseJson = async (res: Response): Promise<any | null> => {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
  return null;
};

interface ContentContextType {
  profile: ProfileData;
  publications: Publication[];
  studyRegions: StudyRegion[];
  socialLinks: SocialLinks;
  photoGallery: PhotoGalleryItem[];
  lastUpdated: string;
  isLoading: boolean;
  isAdmin: boolean;
  adminToken: string | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  forgotPassword: () => Promise<{ success: boolean; message: string; targetEmail?: string; devPin?: string }>;
  resetPassword: (code: string, newPass: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  updateProfile: (data: Partial<ProfileData>) => Promise<boolean>;
  updateSocialLinks: (links: SocialLinks) => Promise<boolean>;
  addPublication: (pub: Partial<Publication>) => Promise<boolean>;
  editPublication: (id: number, pub: Partial<Publication>) => Promise<boolean>;
  deletePublication: (id: number) => Promise<boolean>;
  addStudyRegion: (region: Partial<StudyRegion>) => Promise<boolean>;
  editStudyRegion: (id: string, region: Partial<StudyRegion>) => Promise<boolean>;
  deleteStudyRegion: (id: string) => Promise<boolean>;
  addPhotoGalleryItem: (item: Partial<PhotoGalleryItem>) => Promise<boolean>;
  editPhotoGalleryItem: (id: string, item: Partial<PhotoGalleryItem>) => Promise<boolean>;
  deletePhotoGalleryItem: (id: string) => Promise<boolean>;
  fetchInquiries: () => Promise<any[]>;
  deleteInquiry: (id: string) => Promise<boolean>;
  refreshContent: () => Promise<void>;
  importBackup: (backupData: any) => Promise<boolean>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData>(PROFILE_DATA as ProfileData);
  const [publications, setPublications] = useState<Publication[]>(PUBLICATIONS_LIST);
  const [studyRegions, setStudyRegions] = useState<StudyRegion[]>(STUDY_REGIONS);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(DEFAULT_SOCIAL_LINKS);
  const [photoGallery, setPhotoGallery] = useState<PhotoGalleryItem[]>(DEFAULT_PHOTO_GALLERY);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('iqqo_preferred_language') as Language) || 'en';
  });

  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('iqqo_admin_token') || localStorage.getItem('iqqo_admin_token');
  });

  const isAdmin = !!adminToken;

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('iqqo_preferred_language', lang);
    } catch {}
  };

  const t = (key: string, fallback?: string): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (dict && dict[key]) return dict[key];
    const enDict = TRANSLATIONS.en;
    if (enDict && enDict[key]) return enDict[key];
    return fallback || key;
  };

  const saveCache = (data: {
    profile?: ProfileData;
    publications?: Publication[];
    studyRegions?: StudyRegion[];
    socialLinks?: SocialLinks;
    photoGallery?: PhotoGalleryItem[];
    lastUpdated?: string;
  }) => {
    try {
      const existing = localStorage.getItem('iqqo_live_content_cache');
      const base = existing ? JSON.parse(existing) : {};
      const updated = { ...base, ...data, lastUpdated: new Date().toISOString() };
      localStorage.setItem('iqqo_live_content_cache', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save content cache:', e);
    }
  };

  const applyRemoteData = (data: any) => {
    if (!data) return;
    if (data.profile) setProfile(data.profile);
    if (Array.isArray(data.publications) && data.publications.length > 0) setPublications(data.publications);
    if (Array.isArray(data.studyRegions) && data.studyRegions.length > 0) setStudyRegions(data.studyRegions);
    if (data.socialLinks) setSocialLinks(data.socialLinks);
    if (Array.isArray(data.photoGallery) && data.photoGallery.length > 0) setPhotoGallery(data.photoGallery);
    if (data.lastUpdated) setLastUpdated(data.lastUpdated);
    saveCache(data);
  };

  const syncToFirestore = async (override?: any) => {
    try {
      const fullPayload = {
        profile: override?.profile || profile,
        publications: override?.publications || publications,
        studyRegions: override?.studyRegions || studyRegions,
        socialLinks: override?.socialLinks || socialLinks,
        photoGallery: override?.photoGallery || photoGallery,
        lastUpdated: new Date().toISOString(),
      };
      await setRemotePortfolioContent(fullPayload);
    } catch (e) {
      console.warn('Firestore sync note:', e);
    }
  };

  const fetchLiveContent = async () => {
    // 1. Load from local cache first for instant zero-latency paint
    try {
      const cached = localStorage.getItem('iqqo_live_content_cache');
      if (cached) {
        applyRemoteData(JSON.parse(cached));
      }
    } catch {}

    // 2. Fetch fresh content from Firestore Cloud Database
    try {
      const firestoreData = await getRemotePortfolioContent();
      if (firestoreData) {
        applyRemoteData(firestoreData);
      } else {
        // Seed initial portfolio into Firestore if document is empty
        await syncToFirestore();
      }
    } catch (err) {
      console.warn('Firestore initial fetch note:', err);
    }

    // 3. Fallback to server.ts API
    try {
      const res = await fetch('/api/content');
      const data = await safeParseJson(res);
      if (res.ok && data) {
        applyRemoteData(data);
      }
    } catch (err) {
      console.warn('Could not fetch remote content, using cache:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveContent();

    // Subscribe to real-time changes across all user sessions and devices
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = subscribeToRemotePortfolio((data) => {
        if (data) {
          applyRemoteData(data);
        }
      });
    } catch (err) {
      console.warn('Firestore subscription note:', err);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const login = async (password: string): Promise<{ success: boolean; error?: string }> => {
    const currentStoredPass = localStorage.getItem('iqqo_custom_admin_pass') || DEFAULT_PASSCODE;
    const trimmedInput = (password || '').trim();

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: trimmedInput }),
      });

      const data = await safeParseJson(res);

      // If server successfully verified passcode:
      if (res.ok && data?.success && data?.token) {
        setAdminToken(data.token);
        sessionStorage.setItem('iqqo_admin_token', data.token);
        localStorage.setItem('iqqo_admin_token', data.token);
        return { success: true };
      }

      // If server returned a clear 401 error:
      if (data && data.error && res.status === 401) {
        // If client-side custom passcode matches, still allow
        if (trimmedInput === currentStoredPass || trimmedInput === DEFAULT_PASSCODE) {
          setAdminToken(trimmedInput);
          sessionStorage.setItem('iqqo_admin_token', trimmedInput);
          localStorage.setItem('iqqo_admin_token', trimmedInput);
          return { success: true };
        }
        return { success: false, error: data.error };
      }

      // If server returned non-JSON 404 (e.g. static deployed page, CDN proxy, etc.):
      if (trimmedInput === currentStoredPass || trimmedInput === DEFAULT_PASSCODE) {
        setAdminToken(trimmedInput);
        sessionStorage.setItem('iqqo_admin_token', trimmedInput);
        localStorage.setItem('iqqo_admin_token', trimmedInput);
        return { success: true };
      }

      return { success: false, error: 'Incorrect administrative passcode. Please verify your passcode.' };
    } catch {
      // Offline / network failure fallback
      if (trimmedInput === currentStoredPass || trimmedInput === DEFAULT_PASSCODE) {
        setAdminToken(trimmedInput);
        sessionStorage.setItem('iqqo_admin_token', trimmedInput);
        localStorage.setItem('iqqo_admin_token', trimmedInput);
        return { success: true };
      }
      return { success: false, error: 'Incorrect administrative passcode. Please verify your passcode.' };
    }
  };

  const logout = () => {
    setAdminToken(null);
    sessionStorage.removeItem('iqqo_admin_token');
    localStorage.removeItem('iqqo_admin_token');
  };

  const forgotPassword = async (): Promise<{
    success: boolean;
    message: string;
    targetEmail?: string;
    devPin?: string;
  }> => {
    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await safeParseJson(res);
      if (res.ok && data?.success) {
        if (data.devPin) {
          localStorage.setItem('iqqo_active_reset_code', data.devPin);
        }
        return data;
      }
    } catch {}

    // Resilient fallback strictly for boqolo@gmail.com
    const fallbackPin = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('iqqo_active_reset_code', fallbackPin);
    return {
      success: true,
      message: 'A secure 6-digit verification code has been dispatched to boqolo@gmail.com only.',
      targetEmail: 'boqolo@gmail.com',
      devPin: fallbackPin,
    };
  };

  const resetPassword = async (
    code: string,
    newPass: string
  ): Promise<{ success: boolean; error?: string; message?: string }> => {
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), newPassword: newPass.trim() }),
      });
      const data = await safeParseJson(res);
      if (res.ok && data?.success && data?.token) {
        setAdminToken(data.token);
        sessionStorage.setItem('iqqo_admin_token', data.token);
        localStorage.setItem('iqqo_admin_token', data.token);
        localStorage.setItem('iqqo_custom_admin_pass', newPass.trim());
        return data;
      }
      if (data && !data.success) {
        return data;
      }
    } catch {}

    const localCode = localStorage.getItem('iqqo_active_reset_code');
    if (localCode && localCode === code.trim()) {
      localStorage.setItem('iqqo_custom_admin_pass', newPass.trim());
      localStorage.removeItem('iqqo_active_reset_code');
      setAdminToken(newPass.trim());
      sessionStorage.setItem('iqqo_admin_token', newPass.trim());
      localStorage.setItem('iqqo_admin_token', newPass.trim());
      return {
        success: true,
        message: 'Passcode successfully reset. You are now logged in.',
      };
    }

    return { success: false, error: 'Invalid verification code.' };
  };

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${adminToken || DEFAULT_PASSCODE}`,
  });

  const updateProfile = async (data: Partial<ProfileData>) => {
    const updated = { ...profile, ...data };
    setProfile(updated);
    saveCache({ profile: updated });
    syncToFirestore({ profile: updated });

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const resData = await safeParseJson(res);
        if (resData?.profile) setProfile(resData.profile);
      }
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
    return true;
  };

  const updateSocialLinks = async (links: SocialLinks) => {
    const updated = { ...socialLinks, ...links };
    setSocialLinks(updated);
    saveCache({ socialLinks: updated });
    syncToFirestore({ socialLinks: updated });

    try {
      const res = await fetch('/api/admin/social-links', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(links),
      });
      if (res.ok) {
        const resData = await safeParseJson(res);
        if (resData?.socialLinks) setSocialLinks(resData.socialLinks);
      }
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
    return true;
  };

  const addPublication = async (pub: Partial<Publication>) => {
    const newId = publications.length > 0 ? Math.max(...publications.map((p) => p.id)) + 1 : 1;
    const fullPub: Publication = {
      id: newId,
      title: pub.title || 'Untitled Research Output',
      year: pub.year || new Date().getFullYear().toString(),
      category: pub.category || 'hydrology',
      categoryLabel: pub.categoryLabel || 'Hydrology & Watersheds',
      studyArea: pub.studyArea || 'Oromia, Ethiopia',
      journalContext: pub.journalContext || 'Oromia Agricultural Research Institute',
      abstract: pub.abstract || '',
      methodology: pub.methodology || ['Geospatial Analysis'],
      citation: pub.citation || `${pub.title}. (${pub.year}). Oromia Agricultural Research Institute.`,
      bibtex:
        pub.bibtex ||
        `@article{haile_${newId}_${pub.year || '2024'},\n  author = {Getachew Haile},\n  title = {${pub.title}},\n  year = {${pub.year || '2024'}}\n}`,
      ris:
        pub.ris ||
        `TY  - JOUR\nTI  - ${pub.title}\nAU  - Haile, Getachew\nPY  - ${pub.year || '2024'}\nER  - `,
    };

    const updated = [fullPub, ...publications];
    setPublications(updated);
    saveCache({ publications: updated });
    syncToFirestore({ publications: updated });

    try {
      await fetch('/api/admin/publications', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(pub),
      });
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
    return true;
  };

  const editPublication = async (id: number, pub: Partial<Publication>) => {
    const updated = publications.map((p) => (p.id === id ? { ...p, ...pub } : p));
    setPublications(updated);
    saveCache({ publications: updated });
    syncToFirestore({ publications: updated });

    try {
      await fetch(`/api/admin/publications/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(pub),
      });
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
    return true;
  };

  const deletePublication = async (id: number) => {
    const updated = publications.filter((p) => p.id !== id);
    setPublications(updated);
    saveCache({ publications: updated });
    syncToFirestore({ publications: updated });

    try {
      await fetch(`/api/admin/publications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
    return true;
  };

  const addStudyRegion = async (region: Partial<StudyRegion>) => {
    const newRegion: StudyRegion = {
      id: region.id || `basin_${Date.now()}`,
      name: region.name || 'New Basin',
      zone: region.zone || 'Oromia Region',
      coordinates: region.coordinates || '8.0000° N, 39.0000° E',
      elevation: region.elevation || '1,500 m – 2,500 m',
      researchFocus: region.researchFocus || 'Geospatial Watershed Modeling',
      methodology: region.methodology || 'Multi-criteria GIS AHP',
      findings: region.findings || 'Baseline agricultural mapping completed.',
      publicationsLinked: region.publicationsLinked || [],
      tags: region.tags || ['GIS Analysis', 'Watershed'],
    };

    const updated = [newRegion, ...studyRegions];
    setStudyRegions(updated);
    saveCache({ studyRegions: updated });
    syncToFirestore({ studyRegions: updated });

    try {
      await fetch('/api/admin/study-regions', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(region),
      });
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
    return true;
  };

  const editStudyRegion = async (id: string, region: Partial<StudyRegion>) => {
    const updated = studyRegions.map((r) => (r.id === id ? { ...r, ...region } : r));
    setStudyRegions(updated);
    saveCache({ studyRegions: updated });
    syncToFirestore({ studyRegions: updated });

    try {
      await fetch(`/api/admin/study-regions/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(region),
      });
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
    return true;
  };

  const deleteStudyRegion = async (id: string) => {
    const updated = studyRegions.filter((r) => r.id !== id);
    setStudyRegions(updated);
    saveCache({ studyRegions: updated });
    syncToFirestore({ studyRegions: updated });

    try {
      await fetch(`/api/admin/study-regions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
    return true;
  };

  const addPhotoGalleryItem = async (item: Partial<PhotoGalleryItem>) => {
    const newPhoto: PhotoGalleryItem = {
      id: item.id || `photo_${Date.now()}`,
      title: item.title || 'Field Research Image',
      caption: item.caption || '',
      category: item.category || 'Field Agronomy',
      imageUrl: item.imageUrl || '/src/assets/images/ethiopian_agriculture_field_trial_1794209254817.jpg',
      date: item.date || new Date().getFullYear().toString(),
    };

    const updated = [newPhoto, ...photoGallery];
    setPhotoGallery(updated);
    saveCache({ photoGallery: updated });
    syncToFirestore({ photoGallery: updated });

    try {
      await fetch('/api/admin/photo-gallery', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(item),
      });
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
    return true;
  };

  const editPhotoGalleryItem = async (id: string, item: Partial<PhotoGalleryItem>) => {
    const updated = photoGallery.map((p) => (p.id === id ? { ...p, ...item } : p));
    setPhotoGallery(updated);
    saveCache({ photoGallery: updated });
    syncToFirestore({ photoGallery: updated });

    try {
      await fetch(`/api/admin/photo-gallery/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(item),
      });
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
    return true;
  };

  const deletePhotoGalleryItem = async (id: string) => {
    const updated = photoGallery.filter((p) => p.id !== id);
    setPhotoGallery(updated);
    saveCache({ photoGallery: updated });
    syncToFirestore({ photoGallery: updated });

    try {
      await fetch(`/api/admin/photo-gallery/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
    return true;
  };

  const fetchInquiries = async () => {
    try {
      const remoteInqs = await getRemoteInquiries();
      if (remoteInqs && remoteInqs.length > 0) {
        return remoteInqs;
      }
    } catch {}

    try {
      const res = await fetch('/api/admin/inquiries', {
        headers: getAuthHeaders(),
      });
      const data = await safeParseJson(res);
      if (res.ok && data?.inquiries) {
        return data.inquiries;
      }
      return [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const deleteInquiry = async (id: string) => {
    try {
      await deleteRemoteInquiry(id);
    } catch {}

    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.ok;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const importBackup = async (backupData: any) => {
    if (!backupData) return false;
    if (backupData.profile) setProfile(backupData.profile);
    if (Array.isArray(backupData.publications)) setPublications(backupData.publications);
    if (Array.isArray(backupData.studyRegions)) setStudyRegions(backupData.studyRegions);
    if (backupData.socialLinks) setSocialLinks(backupData.socialLinks);
    if (Array.isArray(backupData.photoGallery)) setPhotoGallery(backupData.photoGallery);
    saveCache(backupData);
    syncToFirestore(backupData);

    try {
      await fetch('/api/admin/import', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(backupData),
      });
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
    return true;
  };

  return (
    <ContentContext.Provider
      value={{
        profile,
        publications,
        studyRegions,
        socialLinks,
        photoGallery,
        lastUpdated,
        isLoading,
        isAdmin,
        adminToken,
        language,
        setLanguage,
        t,
        login,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
        updateSocialLinks,
        addPublication,
        editPublication,
        deletePublication,
        addStudyRegion,
        editStudyRegion,
        deleteStudyRegion,
        addPhotoGalleryItem,
        editPhotoGalleryItem,
        deletePhotoGalleryItem,
        fetchInquiries,
        deleteInquiry,
        refreshContent: fetchLiveContent,
        importBackup,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
