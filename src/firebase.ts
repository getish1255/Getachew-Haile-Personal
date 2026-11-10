import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  getDocFromServer,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with the provisioned firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Operational Error Handling conforming to Firebase Skill guidelines
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Notice:', JSON.stringify(errInfo));
  // Note: we log structured diagnostic info and can throw or return
  return errInfo;
}

// CRITICAL CONSTRAINT: Validate connection on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or initializing:', error.message);
    }
    return false;
  }
}

// Ensure anonymous auth for client requests if not already signed in
export async function ensureAuth(): Promise<void> {
  try {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }
  } catch (err) {
    console.warn('Anonymous auth initialization note:', err);
  }
}

// Global Portfolio Doc Reference
const PORTFOLIO_DOC_PATH = 'portfolio/content';

/**
 * Fetch portfolio content from Firestore
 */
export async function getRemotePortfolioContent(): Promise<any | null> {
  try {
    await ensureAuth();
    const docRef = doc(db, 'portfolio', 'content');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, PORTFOLIO_DOC_PATH);
    return null;
  }
}

/**
 * Realtime subscription to portfolio content changes across all devices
 */
export function subscribeToRemotePortfolio(
  onData: (data: any) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const docRef = doc(db, 'portfolio', 'content');
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        onData(snap.data());
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, PORTFOLIO_DOC_PATH);
      if (onError) onError(error);
    }
  );
}

/**
 * Persist portfolio content to Firestore for real-time synchronization
 */
export async function setRemotePortfolioContent(data: any): Promise<boolean> {
  try {
    await ensureAuth();
    const docRef = doc(db, 'portfolio', 'content');
    const payload = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    await setDoc(docRef, payload, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, PORTFOLIO_DOC_PATH);
    return false;
  }
}

/**
 * Submit an inquiry to Firestore
 */
export async function submitRemoteInquiry(inquiry: {
  name: string;
  email: string;
  organization?: string;
  inquiryType?: string;
  message: string;
}): Promise<string | null> {
  try {
    await ensureAuth();
    const colRef = collection(db, 'inquiries');
    const docRef = await addDoc(colRef, {
      ...inquiry,
      receivedAt: new Date().toISOString(),
      status: 'unread',
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'inquiries');
    return null;
  }
}

/**
 * Fetch inquiries for admin
 */
export async function getRemoteInquiries(): Promise<any[]> {
  try {
    await ensureAuth();
    const colRef = collection(db, 'inquiries');
    const snap = await getDocs(query(colRef, orderBy('receivedAt', 'desc')));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'inquiries');
    return [];
  }
}

/**
 * Delete an inquiry
 */
export async function deleteRemoteInquiry(id: string): Promise<boolean> {
  try {
    await ensureAuth();
    const docRef = doc(db, 'inquiries', id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `inquiries/${id}`);
    return false;
  }
}

// Run boot check
testConnection();
ensureAuth();
