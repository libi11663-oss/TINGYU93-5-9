import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, query, orderBy } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId
const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export { db };

export async function saveSubmission(submissionData: any) {
  const collectionName = submissionData.role === 'advertiser' ? 'advertiser_submissions' : 'submissions';
  const submissionsRef = collection(db, collectionName);
  const newDocRef = doc(submissionsRef);
  
  // Clean up data to avoid undefined fields (Firestore throws error for undefined)
  const cleanedData: Record<string, any> = {};
  Object.keys(submissionData).forEach((key) => {
    const val = submissionData[key];
    if (val !== undefined && val !== null) {
      cleanedData[key] = val;
    }
  });

  // Convert deliveryPlatform code to human-readable strings for the CRM and database views
  let platformText = cleanedData.deliveryPlatform || '';
  if (platformText === 'both') {
    platformText = 'Foodpanda, Uber Eats';
  } else if (platformText === 'uber') {
    platformText = 'Uber Eats';
  } else if (platformText === 'panda') {
    platformText = 'Foodpanda';
  } else if (platformText === 'foodomo') {
    platformText = 'foodomo';
  } else if (platformText === 'lalamove') {
    platformText = 'Lalamove';
  }

  const dataToSave = {
    ...cleanedData,
    // Ensure both camelCase and snake_case are present to support different CRM/schema expectations
    scooterModel: cleanedData.scooterModel || '',
    scooter_model: cleanedData.scooterModel || '',
    deliveryPlatform: platformText,
    delivery_platform: platformText,
    licensePlate: cleanedData.licensePlate || '',
    license_plate: cleanedData.licensePlate || '',
    dailyHours: cleanedData.dailyHours || '',
    daily_hours: cleanedData.dailyHours || '',
    weeklyDays: cleanedData.weeklyDays || '',
    weekly_days: cleanedData.weeklyDays || '',
    bankAccount: cleanedData.bankAccount || '',
    bank_account: cleanedData.bankAccount || '',
    createdAt: new Date().toISOString()
  };

  await setDoc(newDocRef, dataToSave);
  return newDocRef.id;
}

export async function getSubmissions() {
  const submissionsRef = collection(db, 'submissions');
  const q = query(submissionsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  const docs: any[] = [];
  querySnapshot.forEach((doc) => {
    docs.push({ id: doc.id, ...doc.data() });
  });
  return docs;
}

