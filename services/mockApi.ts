import { User, BloodRequest, BloodGroup, Sex, UserRole } from '../types';

let mockUsers: User[] = [
  { id: 'u1', name: 'John Doe', email: 'john@example.com', phone: '1234567890', bloodGroup: BloodGroup.APositive, sex: Sex.Male, locality: 'Downtown', role: UserRole.Volunteer, donations: 6 },
  { id: 'u2', name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', bloodGroup: BloodGroup.ONegative, sex: Sex.Female, locality: 'Uptown', role: UserRole.Both, donations: 12 },
  { id: 'u3', name: 'Sam Wilson', email: 'sam@example.com', phone: '1122334455', bloodGroup: BloodGroup.BPositive, sex: Sex.Male, locality: 'Downtown', role: UserRole.Volunteer, donations: 2 },
  { id: 'u4', name: 'Emily Clark', email: 'emily@example.com', phone: '5566778899', bloodGroup: BloodGroup.ABPositive, sex: Sex.Female, locality: 'Midtown', role: UserRole.Requestor, donations: 0 },
  { id: 'u5', name: 'Chris Lee', email: 'chris@example.com', phone: '1212121212', bloodGroup: BloodGroup.OPositive, sex: Sex.Other, locality: 'Downtown', role: UserRole.Volunteer, donations: 8 },
  { id: 'u6', name: 'Patricia Williams', email: 'patricia@example.com', phone: '3434343434', bloodGroup: BloodGroup.ABNegative, sex: Sex.Female, locality: 'Midtown', role: UserRole.Volunteer, donations: 1 },
  { id: 'u7', name: 'Michael Brown', email: 'michael@example.com', phone: '5656565656', bloodGroup: BloodGroup.ONegative, sex: Sex.Male, locality: 'Uptown', role: UserRole.Volunteer, donations: 4 },
];

let mockRequests: BloodRequest[] = [
  { id: 'r1', requestorId: 'u4', patientName: 'Robert Paulson', bloodGroup: BloodGroup.APositive, units: 2, hospital: 'City General Hospital', locality: 'Downtown', urgency: 'High', status: 'Open', createdAt: new Date(Date.now() - 3600000) },
  { id: 'r2', requestorId: 'u2', patientName: 'Maria Garcia', bloodGroup: BloodGroup.ONegative, units: 4, hospital: 'Uptown Medical Center', locality: 'Uptown', urgency: 'Medium', status: 'Open', createdAt: new Date(Date.now() - 86400000) },
  { id: 'r3', requestorId: 'u4', patientName: 'Peter Jones', bloodGroup: BloodGroup.BPositive, units: 1, hospital: 'City General Hospital', locality: 'Downtown', urgency: 'Low', status: 'Open', createdAt: new Date(Date.now() - 172800000) },
  { id: 'r4', requestorId: 'u4', patientName: 'Susan Bell', bloodGroup: BloodGroup.ABNegative, units: 3, hospital: 'Midtown Specialty', locality: 'Midtown', urgency: 'High', status: 'Open', createdAt: new Date(Date.now() - 259200000) },
  { id: 'r5', requestorId: 'u2', patientName: 'David Chen', bloodGroup: BloodGroup.APositive, units: 2, hospital: 'Uptown Medical Center', locality: 'Uptown', urgency: 'Medium', status: 'Closed', createdAt: new Date(Date.now() - 604800000) },
  { id: 'r6', requestorId: 'u4', patientName: 'Nancy Wheeler', bloodGroup: BloodGroup.BNegative, units: 2, hospital: 'Suburbia Community', locality: 'Suburbia', urgency: 'Medium', status: 'Open', createdAt: new Date(Date.now() - 1209600000) },
];

// Compatibility mapping for blood donations
const COMPATIBLE_DONORS: Record<BloodGroup, BloodGroup[]> = {
  [BloodGroup.APositive]: [BloodGroup.APositive, BloodGroup.ANegative, BloodGroup.OPositive, BloodGroup.ONegative],
  [BloodGroup.ANegative]: [BloodGroup.ANegative, BloodGroup.ONegative],
  [BloodGroup.BPositive]: [BloodGroup.BPositive, BloodGroup.BNegative, BloodGroup.OPositive, BloodGroup.ONegative],
  [BloodGroup.BNegative]: [BloodGroup.BNegative, BloodGroup.ONegative],
  [BloodGroup.ABPositive]: Object.values(BloodGroup), // Universal recipient
  [BloodGroup.ABNegative]: [BloodGroup.ABNegative, BloodGroup.ANegative, BloodGroup.BNegative, BloodGroup.ONegative],
  [BloodGroup.OPositive]: [BloodGroup.OPositive, BloodGroup.ONegative],
  [BloodGroup.ONegative]: [BloodGroup.ONegative], // Universal donor for RBCs
};

export const api = {
  getUsers: async (): Promise<User[]> => {
    return Promise.resolve([...mockUsers]);
  },
  getUserById: async (id: string): Promise<User | undefined> => {
    return Promise.resolve(mockUsers.find(u => u.id === id));
  },
  getRequests: async (): Promise<BloodRequest[]> => {
    return Promise.resolve([...mockRequests].sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()));
  },
  getRequestById: async (id: string): Promise<BloodRequest | undefined> => {
    return Promise.resolve(mockRequests.find(r => r.id === id));
  },
  createRequest: async (requestData: Omit<BloodRequest, 'id' | 'createdAt' | 'status'>): Promise<BloodRequest> => {
    const newRequest: BloodRequest = {
      ...requestData,
      id: `r${Date.now()}`,
      createdAt: new Date(),
      status: 'Open',
    };
    mockRequests.unshift(newRequest);
    return Promise.resolve(newRequest);
  },
  findMatches: async (request: BloodRequest): Promise<User[]> => {
    if (request.status !== 'Open') {
      return Promise.resolve([]);
    }
    const potentialDonors = mockUsers.filter(user =>
      (user.role === UserRole.Volunteer || user.role === UserRole.Both) && user.id !== request.requestorId
    );
    const compatibleGroups = COMPATIBLE_DONORS[request.bloodGroup];
    
    const matches = potentialDonors.filter(user =>
      compatibleGroups.includes(user.bloodGroup) && user.locality === request.locality
    );
    return Promise.resolve(matches);
  },
  registerUser: async (userData: Omit<User, 'id' | 'donations'>): Promise<User> => {
    const existing = mockUsers.find(u => u.email === userData.email);
    if(existing) throw new Error("User with this email already exists.");
    const newUser: User = {
        ...userData,
        id: `u${Date.now()}`,
        donations: 0,
    };
    mockUsers.push(newUser);
    return Promise.resolve(newUser);
  },
  loginUser: async(email:string): Promise<User | null> => {
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    return Promise.resolve(user || null);
  }
};