
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/mockApi';
import { BloodRequest, User } from '../types';
import { useAuth } from '../hooks/useAuth';
import VolunteerProfileCard from '../components/VolunteerProfileCard';
import Notification from '../components/Notification';

const RequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [request, setRequest] = useState<BloodRequest | null>(null);
  const [matches, setMatches] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'info' } | null>(null);

  const fetchRequestDetails = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const reqData = await api.getRequestById(id);
      if (reqData) {
        setRequest(reqData);
        if (currentUser && currentUser.id === reqData.requestorId) {
          const matchData = await api.findMatches(reqData);
          setMatches(matchData);
        }
      }
    } catch (error) {
      console.error("Failed to fetch details", error);
    } finally {
      setLoading(false);
    }
  }, [id, currentUser]);

  useEffect(() => {
    fetchRequestDetails();
  }, [fetchRequestDetails]);

  const handleNotify = (volunteer: User) => {
    // Simulate email notification
    console.log(`Simulating email to ${volunteer.email} for request ${request?.id}`);
    setNotification({ message: `A notification has been sent to ${volunteer.name}'s registered email.`, type: 'info' });
  };
  
  if (loading) return <p className="text-center">Loading request details...</p>;
  if (!request) return <p className="text-center">Request not found.</p>;

  const isOwner = currentUser?.id === request.requestorId;

  return (
    <div className="max-w-4xl mx-auto">
        {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-start mb-4">
                 <h1 className="text-3xl font-bold text-brand-dark">Request for {request.patientName}</h1>
                 <span className={`text-sm font-bold px-3 py-1 rounded-full ${request.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{request.status}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8 text-gray-700">
                <p><strong>Blood Group Required:</strong> <span className="text-2xl font-bold text-brand-red">{request.bloodGroup}</span></p>
                <p><strong>Units:</strong> <span className="font-bold">{request.units}</span></p>
                <p><strong>Location:</strong> <span className="font-bold">{request.hospital}</span></p>
                <p><strong>Locality:</strong> <span className="font-bold">{request.locality}</span></p>
            </div>

            {isOwner && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4 border-b-2 border-brand-red pb-2">Potential Donors</h2>
                    {matches.length > 0 ? (
                        <div className="space-y-4">
                            {matches.map(volunteer => (
                                <VolunteerProfileCard key={volunteer.id} volunteer={volunteer} onNotify={handleNotify} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border">No volunteers found matching this specific request's criteria in your locality. You can expand your search or wait for new volunteers to sign up.</p>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};

export default RequestDetailsPage;
