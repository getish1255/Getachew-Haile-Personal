import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  PROFILE_DATA,
  PUBLICATIONS_LIST,
  STUDY_REGIONS,
  Publication,
  StudyRegion,
} from '../data/cvData';

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
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('iqqo_admin_token');
  });

  const isAdmin = !!adminToken;

  const fetchLiveContent = async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        if (data.profile) setProfile(data.profile);
        if (Array.isArray(data.publications)) setPublications(data.publications);
        if (Array.isArray(data.studyRegions)) setStudyRegions(data.studyRegions);
        if (data.socialLinks) setSocialLinks(data.socialLinks);
        if (Array.isArray(data.photoGallery)) setPhotoGallery(data.photoGallery);
        if (data.lastUpdated) setLastUpdated(data.lastUpdated);
      }
    } catch (err) {
      console.warn('Could not fetch remote content, using baseline:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveContent();
  }, []);

  const login = async (password: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setAdminToken(data.token);
        sessionStorage.setItem('iqqo_admin_token', data.token);
        return { success: true };
      }
      return { success: false, error: data.error || 'Authentication failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Server connection error' };
    }
  };

  const logout = () => {
    setAdminToken(null);
    sessionStorage.removeItem('iqqo_admin_token');
  };

  const forgotPassword = async () => {
    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Failed to dispatch password recovery code',
      };
    }
  };

  const resetPassword = async (code: string, newPass: string) => {
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, newPassword: newPass }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setAdminToken(data.token);
        sessionStorage.setItem('iqqo_admin_token', data.token);
      }
      return data;
    } catch (err: any) {
      return { success: false, error: err.message || 'Server connection error' };
    }
  };

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${adminToken}`,
  });

  const updateProfile = async (data: Partial<ProfileData>) => {
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchLiveContent();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateSocialLinks = async (links: SocialLinks) => {
    try {
      const res = await fetch('/api/admin/social-links', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(links),
      });
      if (res.ok) {
        await fetchLiveContent();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const addPublication = async (pub: Partial<Publication>) => {
    try {
      const res = await fetch('/api/admin/publications', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(pub),
      });
      if (res.ok) {
        await fetchLiveContent();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const editPublication = async (id: number, pub: Partial<Publication>) => {
    try {
      const res = await fetch(`/api/admin/publications/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(pub),
      });
      if (res.ok) {
        await fetchLiveContent();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deletePublication = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/publications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        await fetchLiveContent();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const addStudyRegion = async (region: Partial<StudyRegion>) => {
    try {
      const res = await fetch('/api/admin/study-regions', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(region),
      });
      if (res.ok) {
        await fetchLiveContent();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const editStudyRegion = async (id: string, region: Partial<StudyRegion>) => {
    try {
      const res = await fetch(`/api/admin/study-regions/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(region),
      });
      if (res.ok) {
        await fetchLiveContent();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteStudyRegion = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/study-regions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        await fetchLiveContent();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const addPhotoGalleryItem = async (item: Partial<PhotoGalleryItem>) => {
    try {
      const res = await fetch('/api/admin/photo-gallery', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(item),
      });
      if (res.ok) {
        await fetchLiveContent();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const editPhotoGalleryItem = async (id: string, item: Partial<PhotoGalleryItem>) => {
    try {
      const res = await fetch(`/api/admin/photo-gallery/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(item),
      });
      if (res.ok) {
        await fetchLiveContent();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deletePhotoGalleryItem = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/photo-gallery/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        await fetchLiveContent();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/admin/inquiries', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return data.inquiries || [];
      }
      return [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const deleteInquiry = async (id: string) => {
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
    try {
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(backupData),
      });
      if (res.ok) {
        await fetchLiveContent();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
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
