import { doc, getDoc, setDoc, deleteDoc, collection, onSnapshot, query, orderBy, getDocFromServer } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './firebase';
import { ClinicianProfile, HistoryItem, ClinicalReport } from '../types';
import { handleFirestoreError, OperationType } from './firestoreErrors';

/**
 * Validates connection to Firestore at initial boot
 */
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration or network.");
    }
  }
}

/**
 * Ensures or creates a clinician user profile in Firestore
 */
export async function syncClinicianProfile(user: User): Promise<ClinicianProfile> {
  const userDocRef = doc(db, 'users', user.uid);
  const path = `users/${user.uid}`;

  try {
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as ClinicianProfile;
    }

    const newProfile: ClinicianProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'Clinician',
      role: 'clinician',
      department: 'Clinical Documentation Review',
      createdAt: new Date().toISOString()
    };

    await setDoc(userDocRef, newProfile);
    return newProfile;
  } catch (error) {
    return handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Saves a clinical document report to the clinician's Firestore profile
 */
export async function saveReportToFirestore(userId: string, item: HistoryItem): Promise<void> {
  const path = `users/${userId}/reports/${item.id}`;
  const reportDocRef = doc(db, 'users', userId, 'reports', item.id);

  try {
    const payload = {
      id: item.id,
      userId: userId,
      title: item.title.slice(0, 300),
      filename: item.filename.slice(0, 200),
      snippet: item.snippet.slice(0, 1000),
      status: item.status,
      report_summary: item.report.report_summary.slice(0, 10000),
      sourceType: item.report.sourceType,
      createdAt: item.date,
      // Store report payload for full pre-filled retrieval
      reportJson: JSON.stringify(item.report)
    };

    await setDoc(reportDocRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Deletes a report from the clinician's Firestore profile
 */
export async function deleteReportFromFirestore(userId: string, reportId: string): Promise<void> {
  const path = `users/${userId}/reports/${reportId}`;
  const reportDocRef = doc(db, 'users', userId, 'reports', reportId);

  try {
    await deleteDoc(reportDocRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Subscribes to the clinician's reports in Firestore
 */
export function subscribeToClinicianReports(
  userId: string,
  onReports: (reports: HistoryItem[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = `users/${userId}/reports`;
  const reportsCollection = collection(db, 'users', userId, 'reports');

  const unsubscribe = onSnapshot(
    reportsCollection,
    (snapshot) => {
      const items: HistoryItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        let fullReport: ClinicalReport;
        
        if (data.reportJson) {
          try {
            fullReport = JSON.parse(data.reportJson);
          } catch (e) {
            fullReport = {
              id: data.id,
              title: data.title,
              sourceType: data.sourceType || 'text',
              filename: data.filename,
              fileSnippet: data.snippet,
              report_summary: data.report_summary,
              created_at: data.createdAt,
              status: data.status,
              metrics: {
                totalSectionsFound: 11,
                requiresReviewCount: data.status === 'requires_review' ? 1 : 0,
                inconsistencyCount: data.status === 'flagged' ? 1 : 0,
                missingCount: 0
              },
              sections: {
                'Patient Info': [],
                'Symptoms': [],
                'Diagnoses': [],
                'Medications': [],
                'Vitals': [],
                'Allergies': [],
                'Observations': [],
                'Concerns': [],
                'Missing Info': [],
                'Inconsistencies': [],
                'Requires Review': []
              }
            };
          }
        } else {
          fullReport = {
            id: data.id,
            title: data.title,
            sourceType: data.sourceType || 'text',
            filename: data.filename,
            fileSnippet: data.snippet,
            report_summary: data.report_summary,
            created_at: data.createdAt,
            status: data.status,
            metrics: {
              totalSectionsFound: 11,
              requiresReviewCount: 0,
              inconsistencyCount: 0,
              missingCount: 0
            },
            sections: {
              'Patient Info': [],
              'Symptoms': [],
              'Diagnoses': [],
              'Medications': [],
              'Vitals': [],
              'Allergies': [],
              'Observations': [],
              'Concerns': [],
              'Missing Info': [],
              'Inconsistencies': [],
              'Requires Review': []
            }
          };
        }

        items.push({
          id: data.id,
          title: data.title,
          filename: data.filename,
          snippet: data.snippet,
          date: data.createdAt,
          status: data.status,
          report: fullReport
        });
      });

      // Sort by date descending
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      onReports(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );

  return unsubscribe;
}
