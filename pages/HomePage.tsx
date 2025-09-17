
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/mockApi';
import { BloodRequest } from '../types';
import RequestCard from '../components/RequestCard';

const HomePage: React.FC = () => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await api.getRequests();
        setRequests(data);
      } catch (error) {
        console.error("Failed to fetch requests", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div>
      <div className="text-center bg-white p-8 rounded-lg shadow-md mb-8 border border-gray-200">
        <h1 className="text-4xl font-extrabold text-brand-red mb-2">Save a Life Today</h1>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Welcome to RedPulse. Connect with donors and requestors in your area. Your donation can make a world of difference.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/request/new" className="px-6 py-3 bg-brand-red text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-transform transform hover:scale-105">
            Request Blood
          </Link>
          <Link to="/login" className="px-6 py-3 bg-brand-blue text-white font-semibold rounded-lg shadow-md hover:bg-blue-900 transition-transform transform hover:scale-105">
            Become a Donor
          </Link>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-brand-dark">Urgent Requests</h2>
      {loading ? (
        <p>Loading requests...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.length > 0 ? (
            requests.map(req => <RequestCard key={req.id} request={req} />)
          ) : (
            <p className="col-span-full text-center text-gray-500">No active requests at the moment.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
