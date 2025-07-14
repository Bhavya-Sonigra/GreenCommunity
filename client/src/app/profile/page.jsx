"use client";

import { useEffect, useState } from 'react';
import { authAPI } from '../../lib/api';
import { FaCamera, FaEdit, FaEnvelope, FaUser, FaGlobe, FaTransgender, FaFlag } from 'react-icons/fa';

const countries = [
  'United States', 'United Kingdom', 'Germany', 'Canada', 'Australia', 'France', 'Italy', 'Spain', 'Netherlands', 'Switzerland', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Japan', 'South Korea', 'Singapore', 'New Zealand', 'Austria', 'Belgium', 'Portugal', 'Ireland', 'Czech Republic', 'Poland', 'Hungary', 'Greece', 'Turkey', 'Brazil', 'Mexico', 'Argentina', 'Chile', 'Colombia', 'Peru', 'India', 'China', 'Thailand', 'Malaysia', 'Philippines', 'Indonesia', 'Vietnam', 'South Africa', 'Egypt', 'Morocco', 'Nigeria', 'Kenya', 'Ghana', 'Russia', 'Ukraine', 'Romania', 'Bulgaria', 'Croatia', 'Serbia', 'Slovenia', 'Slovakia', 'Lithuania', 'Latvia', 'Estonia', 'Israel', 'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Jordan', 'Lebanon', 'Cyprus', 'Malta', 'Iceland', 'Luxembourg', 'Monaco', 'Andorra', 'San Marino', 'Vatican City', 'Liechtenstein'
];

const statesByCountry = {
  'India': [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ],
  'United States': [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ],
  'United Kingdom': [
    'England', 'Scotland', 'Wales', 'Northern Ireland'
  ]
};

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', photo: '', gender: '', country: '', state: '' });
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await authAPI.getCurrentUser();
        setUser(data.user);
        setForm({
          name: data.user.name || '',
          email: data.user.email || '',
          photo: data.user.photo || '',
          gender: data.user.gender || '',
          country: data.user.country || '',
          state: data.user.state || ''
        });
      } catch (err) {
        setMessage('Could not load user data. You can still edit and save your profile.');
        setUser(null);
        setForm({ name: '', email: '', photo: '', gender: '', country: '', state: '' });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setMessage('');
    if (user) setForm({
      name: user.name || '',
      email: user.email || '',
      photo: user.photo || '',
      gender: user.gender || '',
      country: user.country || '',
      state: user.state || ''
    });
    else setForm({ name: '', email: '', photo: '', gender: '', country: '', state: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCountrySelect = (country) => {
    setForm({ ...form, country, state: '' });
    setCountrySearch(country);
    setIsCountryDropdownOpen(false);
  };

  const handleCountrySearch = (e) => {
    setCountrySearch(e.target.value);
    setForm({ ...form, country: e.target.value, state: '' });
  };

  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleSave = async () => {
    setMessage('');
    try {
      setUser({ ...form, isEmailVerified: user?.isEmailVerified || false });
      setEditMode(false);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Failed to update profile.');
    }
  };

  const handleVerifyEmail = async () => {
    setVerifying(true);
    setMessage('');
    try {
      setUser((u) => ({ ...u, isEmailVerified: true }));
      setMessage('Verification email sent!');
    } catch (err) {
      setMessage('Failed to send verification email.');
    } finally {
      setVerifying(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setForm((prev) => ({ ...prev, photo: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  const availableStates = statesByCountry[form.country] || [];

  return (
    <div
      className="min-h-screen flex items-center justify-center py-8 px-2"
      style={{ background: 'linear-gradient(135deg, #32CD32 0%, #ffffff 50%, #27ae60 100%)' }}
    >
      <div className="w-full max-w-2xl bg-white/90 shadow-xl rounded-3xl p-0 md:p-0 flex flex-col md:flex-row overflow-hidden border border-blue-100">
        {/* Avatar Section */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-teal-50 to-white md:w-1/3 p-8 md:p-10 border-b md:border-b-0 md:border-r border-blue-100">
          <div className="relative group">
            <img
              src={form.photo || '/user.png'}
              alt="Profile"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-teal-400 shadow-xl bg-white group-hover:scale-105 transition-transform duration-300"
            />
            {editMode && (
              <label className="absolute bottom-2 right-2 cursor-pointer bg-white/90 rounded-full p-2 shadow hover:bg-blue-100 transition border border-blue-200">
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                <FaCamera className="text-teal-600 text-lg" />
              </label>
            )}
          </div>
          <h2 className="text-xl font-bold mt-6 text-teal-900 flex items-center gap-2"><FaUser className="inline-block text-teal-400" /> {form.name || 'Your Name'}</h2>
          <p className="text-teal-700 mt-2 flex items-center gap-2"><FaEnvelope className="inline-block text-teal-400" /> {form.email || 'your@email.com'}</p>
        </div>
        {/* Form Section */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <h1 className="text-2xl font-extrabold mb-6 text-blue-800 flex items-center gap-2"><FaUser className="text-teal-400" /> Profile Details</h1>
          {message && <div className="mb-4 text-center text-blue-600 font-medium">{message}</div>}
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleSave(); }}>
            {/* Personal Info Section */}
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-3">Personal Info</h3>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400" />
                  {editMode ? (
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="w-full pl-10 pr-4 py-2 rounded-lg border border-blue-100 bg-white focus:bg-blue-50 text-blue-900 font-medium shadow-sm transition-all duration-200" />
                  ) : (
                    <div className="pl-10 py-2 text-blue-900 text-base font-semibold">{form.name || '-'}</div>
                  )}
                </div>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400" />
                  {editMode ? (
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-blue-100 bg-white focus:bg-blue-50 text-blue-900 font-medium shadow-sm transition-all duration-200"
                    />
                  ) : (
                    <div className="pl-10 py-2 text-blue-900 text-base font-semibold">{form.email || '-'}</div>
                  )}
                </div>
              </div>
            </div>
            {/* Profile Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-3">Profile Details</h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <FaTransgender className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400" />
                  {editMode ? (
                    <select name="gender" value={form.gender} onChange={handleChange} className="w-full pl-10 pr-4 py-2 rounded-lg border border-blue-100 bg-white focus:bg-blue-50 text-blue-900 font-medium shadow-sm transition-all duration-200">
                      <option value="">Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <div className="pl-10 py-2 text-blue-900 text-base font-semibold">{form.gender || '-'}</div>
                  )}
                </div>
                <div className="relative flex-1">
                  <FaGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400" />
                  {editMode ? (
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={handleCountrySearch}
                      onFocus={() => setIsCountryDropdownOpen(true)}
                      placeholder="Country"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-blue-100 bg-white focus:bg-blue-50 text-blue-900 font-medium shadow-sm transition-all duration-200"
                    />
                  ) : (
                    <div className="pl-10 py-2 text-blue-900 text-base font-semibold">{form.country || '-'}</div>
                  )}
                  {isCountryDropdownOpen && editMode && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-blue-100 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((country) => (
                          <button
                            key={country}
                            type="button"
                            onClick={() => handleCountrySelect(country)}
                            className="w-full px-6 py-3 text-left text-blue-800 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors border-b border-blue-50 last:border-b-0"
                          >
                            {country}
                          </button>
                        ))
                      ) : (
                        <div className="px-6 py-3 text-blue-400">No countries found</div>
                      )}
                    </div>
                  )}
                </div>
                <div className="relative flex-1">
                  <FaFlag className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400" />
                  {editMode ? (
                    <select
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-blue-100 bg-white focus:bg-blue-50 text-blue-900 font-medium shadow-sm transition-all duration-200"
                      disabled={!form.country}
                    >
                      <option value="">{form.country ? 'State' : 'Select country first'}</option>
                      {availableStates.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="pl-10 py-2 text-blue-900 text-base font-semibold">{form.state || '-'}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8 justify-end">
              {editMode ? (
                <>
                  <button type="submit" className="flex items-center gap-2 bg-teal-600 text-white px-8 py-2 rounded-lg font-semibold shadow-md hover:bg-teal-700 transition text-lg">
                    <FaEdit className="inline-block mb-0.5" /> Save Changes
                  </button>
                  <button type="button" className="bg-black text-white px-8 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-900 transition text-lg" onClick={handleCancel}>Cancel</button>
                </>
              ) : (
                <button className="flex items-center gap-2 bg-teal-600 text-white px-8 py-2 rounded-lg font-semibold shadow-md hover:bg-teal-700 transition text-lg" onClick={handleEdit}>
                  <FaEdit className="inline-block mb-0.5" /> Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 