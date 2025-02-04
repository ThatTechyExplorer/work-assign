import { 
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  serverTimestamp,
  DocumentReference,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

export interface Worksheet {
  id: string;
  title: string;
  description: string;
  sections: WorksheetSection[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
  generalInstructions: string[];
}

export interface Question {
  text: string;
  imageUrl?: string;
}

export interface WorksheetSection {
  id: string;
  title: string;
  type: string;
  marksPerQuestion: number;
  questions: Question[];
}

export const worksheetConverter = {
  toFirestore: (worksheet: Omit<Worksheet, 'id'>) => {
    return {
      ...worksheet,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
  },
  fromFirestore: (snapshot: any, options: any): Worksheet => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      title: data.title,
      description: data.description,
      sections: data.sections,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      userId: data.userId,
      generalInstructions: data.generalInstructions,
    };
  }
};

export const createWorksheet = async (
  userId: string,
  worksheet: Omit<Worksheet, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
): Promise<string> => {
  try {
    const worksheetsRef = collection(db, 'worksheets');
    const docRef = await addDoc(worksheetsRef, worksheetConverter.toFirestore({
      ...worksheet,
      userId,
    } as Omit<Worksheet, 'id'>));
    return docRef.id;
  } catch (error) {
    console.error('Error creating worksheet:', error);
    throw error;
  }
};

export const updateWorksheet = async (
  worksheetId: string,
  updates: Partial<Omit<Worksheet, 'id' | 'createdAt' | 'userId'>>
): Promise<void> => {
  try {
    const worksheetRef = doc(db, 'worksheets', worksheetId);
    await updateDoc(worksheetRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating worksheet:', error);
    throw error;
  }
};

export const deleteWorksheet = async (worksheetId: string): Promise<void> => {
  try {
    const worksheetRef = doc(db, 'worksheets', worksheetId);
    await deleteDoc(worksheetRef);
  } catch (error) {
    console.error('Error deleting worksheet:', error);
    throw error;
  }
};

export const getUserWorksheets = async (userId: string): Promise<Worksheet[]> => {
  try {
    const worksheetsRef = collection(db, 'worksheets');
    const q = query(worksheetsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    } as Worksheet));
  } catch (error) {
    console.error('Error fetching worksheets:', error);
    throw error;
  }
};

export const getWorksheet = async (worksheetId: string): Promise<Worksheet | null> => {
  try {
    const worksheetRef = doc(db, 'worksheets', worksheetId);
    const worksheetSnap = await getDoc(worksheetRef);
    
    if (!worksheetSnap.exists()) {
      return null;
    }

    return {
      ...worksheetSnap.data(),
      id: worksheetSnap.id,
    } as Worksheet;
  } catch (error) {
    console.error('Error fetching worksheet:', error);
    throw error;
  }
}; 