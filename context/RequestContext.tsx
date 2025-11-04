import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  updateDoc, 
  doc,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export type RequestStatus = 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  location?: {
    address: string;
    city: string;
    suburb?: string;
  };
  workerId?: string;
  workerName?: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  photoUrls?: string[];
}

interface RequestContextType {
  requests: ServiceRequest[];
  addRequest: (request: { 
    title: string; 
    description: string; 
    photoUrls?: string[];
    clientPhone: string;
    location: {
      address: string;
      city: string;
      suburb?: string;
    };
  }) => Promise<void>;
  updateRequestStatus: (requestId: string, status: RequestStatus, workerId?: string) => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  loading: boolean;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export function RequestProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      console.log('No user, clearing requests');
      setRequests([]);
      setLoading(false);
      return;
    }

    console.log('Setting up listener for user:', user.id, 'role:', user.role);

    let q;
    
    if (user.role === 'worker') {
      // Workers see all pending requests OR requests assigned to them
      console.log('Worker query: fetching all requests');
      q = query(
        collection(db, 'serviceRequests')
      );
    } else {
      // Clients see only their own requests
      console.log('Client query: fetching requests for clientId:', user.id);
      q = query(
        collection(db, 'serviceRequests'),
        where('clientId', '==', user.id)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Snapshot received, size:', snapshot.size);
      const requestsData: ServiceRequest[] = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        console.log('Document:', docSnapshot.id, 'Data:', data);
        
        // If worker, filter to show pending or their assigned requests
        if (user.role === 'worker') {
          if (data.status === 'pending' || data.workerId === user.id) {
            requestsData.push({
              id: docSnapshot.id,
              ...data,
              createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
              updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            } as ServiceRequest);
          }
        } else {
          // Client sees all their requests
          requestsData.push({
            id: docSnapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          } as ServiceRequest);
        }
      });
      console.log('Final requests array:', requestsData.length, 'items');
      setRequests(requestsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching requests:', error);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up listener');
      unsubscribe();
    };
  }, [user]);

  const uploadImageToFirebase = async (uris: string[]) => {
    const urls: string[] = [];

    for (const uri of uris) {
      try {
        console.log('Uploading image:', uri);
        const response = await fetch(uri);
        const blob = await response.blob();

        const fileName = `requests/${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.jpg`;

        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(storageRef);
        
        console.log('Image uploaded successfully:', downloadUrl);
        urls.push(downloadUrl);
      } catch (err) {
        console.error('Error uploading image:', err);
      }
    }

    return urls;
  }

  const addRequest = async (request: { 
    title: string; 
    description: string; 
    photoUrls?: string[];
    clientPhone: string;
    location: {
      address: string;
      city: string;
      suburb?: string;
    };
  }) => {
    if (!user) {
      throw new Error('User must be authenticated to add a request');
    }

    try {
      console.log('Adding request with photos:', request.photoUrls?.length || 0);

      let uploadedUrls: string[] = [];
      if (request.photoUrls && request.photoUrls.length > 0) {
        console.log('Uploading images to Firebase Storage...');
        uploadedUrls = await uploadImageToFirebase(request.photoUrls);
        console.log('Images uploaded, URLs:', uploadedUrls);
      }

      const newRequest = {
        title: request.title,
        description: request.description,
        clientId: user.id,
        clientName: user.firstName,
        clientEmail: user.email,
        clientPhone: request.clientPhone,
        location: request.location,
        status: 'pending' as RequestStatus,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        photoUrls: uploadedUrls, // Use uploaded URLs from Firebase Storage
      };

      const docRef = await addDoc(collection(db, 'serviceRequests'), newRequest);
      console.log('Service request added successfully with ID:', docRef.id);
    } catch (error) {
      console.error('Error adding service request:', error);
      throw error;
    }
  };

  const updateRequestStatus = async (requestId: string, status: RequestStatus, workerId?: string) => {
    try {
      console.log('Updating request status:', { requestId, status, workerId });
      
      const updateData: any = {
        status,
        updatedAt: Timestamp.now(),
      };

      if (workerId) {
        const workerName = user?.firstName || 'Unknown Worker';
        updateData.workerId = workerId;
        updateData.workerName = workerName;
      }

      const docRef = doc(db, 'serviceRequests', requestId);
      await updateDoc(docRef, updateData);
      console.log('Request status updated successfully to:', status);
    } catch (error) {
      console.error('Error updating request status:', error);
      throw error;
    }
  };

  const acceptRequest = async (requestId: string) => {
    if (!user || user.role !== 'worker') {
      throw new Error('Only workers can accept requests');
    }

    console.log('Worker accepting request:', requestId);
    await updateRequestStatus(requestId, 'accepted', user.id);
  };

  return (
    <RequestContext.Provider
      value={{
        requests,
        addRequest,
        updateRequestStatus,
        acceptRequest,
        loading,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
}

export function useRequests() {
  const context = useContext(RequestContext);
  if (context === undefined) {
    throw new Error('useRequests must be used within a RequestProvider');
  }
  return context;
}