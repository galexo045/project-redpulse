import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { BloodRequest } from '../types';
import RequestCard from '../components/RequestCard';
import { BLOOD_GROUPS } from '../constants';

const HomePage: React.FC = () => {
  const [allRequests, setAllRequests] = useState<BloodRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [bloodGroupFilter, setBloodGroupFilter] = useState('');
  const [localityFilter, setLocalityFilter] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await apiService.getRequests();
        setAllRequests(data);
        setFilteredRequests(data);
      } catch (error) {
        console.error("Failed to fetch requests", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let requests = [...allRequests];

    if (bloodGroupFilter) {
      requests = requests.filter(req => req.bloodGroup === bloodGroupFilter);
    }

    if (localityFilter) {
      requests = requests.filter(req =>
        req.locality.toLowerCase().includes(localityFilter.toLowerCase())
      );
    }

    setFilteredRequests(requests);
  };

  const handleClear = () => {
    setBloodGroupFilter('');
    setLocalityFilter('');
    setFilteredRequests([...allRequests]);
  };

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

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
                <label htmlFor="locality" className="block text-sm font-medium text-gray-700">Locality</label>
                <input
                    type="text"
                    id="locality"
                    value={localityFilter}
                    onChange={(e) => setLocalityFilter(e.target.value)}
                    placeholder="e.g., Downtown, Uptown"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red"
                />
            </div>
            <div>
                <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">Blood Group</label>
                <select
                    id="bloodGroup"
                    value={bloodGroupFilter}
                    onChange={(e) => setBloodGroupFilter(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red"
                >
                    <option value="">All Groups</option>
                    {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
            </div>
            <div className="flex space-x-2">
                <button type="submit" className="flex-1 w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red">
                    Search
                </button>
                 <button type="button" onClick={handleClear} className="flex-1 w-full justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
                    Clear
                </button>
            </div>
        </form>
    </div>

      <h2 className="text-2xl font-bold mb-4 text-brand-dark">Urgent Requests</h2>
      {loading ? (
        <p>Loading requests...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.length > 0 ? (
            filteredRequests.map(req => <RequestCard key={req.id} request={req} />)
          ) : (
            <p className="col-span-full text-center text-gray-500 py-8">No requests match your criteria.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
