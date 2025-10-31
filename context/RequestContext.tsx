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

export type RequestStatus = 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  workerId?: string;
  workerName?: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  photoUrls?: string[];
}

interface RequestContextType {
  requests: ServiceRequest[];
  addRequest: (request: { title: string; description: string; photoUrls?: string[] }) => Promise<void>;
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
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Document:', doc.id, 'Data:', data);
        
        // If worker, filter to show pending or their assigned requests
        if (user.role === 'worker') {
          if (data.status === 'pending' || data.workerId === user.id) {
            requestsData.push({
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
              updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            } as ServiceRequest);
          }
        } else {
          // Client sees all their requests
          requestsData.push({
            id: doc.id,
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

  const addRequest = async (request: { title: string; description: string; photoUrls?: string[] }) => {
    if (!user) {
      throw new Error('User must be authenticated to add a request');
    }

    try {
      const newRequest = {
        title: request.title,
        description: request.description,
        clientId: user.id,
        clientName: user.firstName,
        clientEmail: user.email,
        status: 'pending' as RequestStatus,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        photoUrls: request.photoUrls || [],
      };

      await addDoc(collection(db, 'serviceRequests'), newRequest);
      console.log('Service request added successfully');
    } catch (error) {
      console.error('Error adding service request:', error);
      throw error;
    }
  };

  const updateRequestStatus = async (requestId: string, status: RequestStatus, workerId?: string) => {
    try {
      const updateData: any = {
        status,
        updatedAt: Timestamp.now(),
      };

      if (workerId) {
        const workerName = user?.firstName || 'Unknown Worker';
        updateData.workerId = workerId;
        updateData.workerName = workerName;
      }

      await updateDoc(doc(db, 'serviceRequests', requestId), updateData);
      console.log('Request status updated successfully');
    } catch (error) {
      console.error('Error updating request status:', error);
      throw error;
    }
  };

  const acceptRequest = async (requestId: string) => {
    if (!user || user.role !== 'worker') {
      throw new Error('Only workers can accept requests');
    }

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