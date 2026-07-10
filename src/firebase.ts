import { initializeApp } from 'firebase/app';
import { initializeFirestore, collection, doc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId
const db = initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId || '(default)');

export { db };

export async function saveSubmission(submissionData: any) {
  const submissionsRef = collection(db, 'submissions');
  const newDocRef = doc(submissionsRef);
  
  // Clean up data to avoid undefined fields (Firestore throws error for undefined)
  const cleanedData: Record<string, any> = {};
  Object.keys(submissionData).forEach((key) => {
    const val = submissionData[key];
    if (val !== undefined && val !== null) {
      cleanedData[key] = val;
    }
  });

  const dataToSave = {
    ...cleanedData,
    createdAt: new Date().toISOString()
  };

  await setDoc(newDocRef, dataToSave);
  return newDocRef.id;
}
