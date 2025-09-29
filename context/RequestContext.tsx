import React, { createContext, useState, useContext, ReactNode } from 'react';

type Status = 'Complete' | 'In Progress';

export interface ServiceRequest {
  id: string;
  title: string;
  status: Status;
  description?: string;
}

interface RequestContextType {
  requests: ServiceRequest[];
  addRequest: (request: Omit<ServiceRequest, 'id' | 'status'>) => void;
}

// Initial mock data
const MOCK_REQUESTS: ServiceRequest[] = [
  { id: 'r1', title: 'Kitchen Renovation', status: 'Complete' },
  { id: 'r2', title: 'House Painting', status: 'In Progress' },
];

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export function RequestProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<ServiceRequest[]>(MOCK_REQUESTS);

  const addRequest = (newRequestData: Omit<ServiceRequest, 'id' | 'status'>) => {
    const newRequest: ServiceRequest = {
      ...newRequestData,
      id: `r${Date.now()}`,
      status: 'In Progress',
    };
    setRequests((prevRequests) => [newRequest, ...prevRequests]);
  };

  return (
    <RequestContext.Provider value={{ requests, addRequest }}>
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