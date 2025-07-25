'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const steps = [
  { 
    label: 'User Details', 
    icon: '👤',
    title: 'Tell us about yourself',
    subtitle: 'Enter your personal information including name, date of birth, and gender.'
  },
  { 
    label: 'User Photo', 
    icon: '📸',
    title: 'Upload your profile photo',
    subtitle: 'Add a beautiful profile picture to get started with your personalized experience.'
  },
  { 
    label: 'Country', 
    icon: '🌍',
    title: 'Which country do you live in?',
    subtitle: 'Select your country to help us provide location-specific calculations.'
  },
  { 
    label: 'Location', 
    icon: '🏠',
    title: 'What\'s your exact location?',
    subtitle: 'Choose your state and district for more accurate regional data.'
  },
  { 
    label: 'Profession', 
    icon: '💼',
    title: 'What\'s your profession?',
    subtitle: 'Tell us about your work to personalize your experience.'
  },
];

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

const districtsByState = {
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Bharuch'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Sangli', 'Satara', 'Dhule'],
  'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'Oakland', 'Fresno', 'Long Beach', 'Bakersfield', 'Anaheim', 'Riverside'],
  'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Lubbock']
};

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

const generateCalendar = (month, year) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = getDaysInMonth(month + 1, year);
  const days = [];
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }
  
  return days;
};

export default function UserDetailsForm() {
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    date_of_birth: '',
    gender: '',
    country: '',
    state: '',
    district: '',
    profession: '',
    photo: null,
  });
  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  });
  const [selectedDate, setSelectedDate] = useState(null);

  const handleCountrySelect = (country) => {
    setFormData({ ...formData, country, state: '', district: '' });
    setCountrySearch(country);
    setIsCountryDropdownOpen(false);
  };

  const handleCountrySearch = (e) => {
    setCountrySearch(e.target.value);
    setFormData({ ...formData, country: e.target.value });
  };

  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDateSelect = (day) => {
    const date = new Date(calendarDate.year, calendarDate.month, day);
    setSelectedDate(date);
    const dateString = date.toISOString().split('T')[0];
    setFormData({ ...formData, date_of_birth: dateString });
    setShowCalendar(false);
  };

  const changeMonth = (direction) => {
    setCalendarDate(prev => {
      const newMonth = prev.month + direction;
      if (newMonth < 0) {
        return { month: 11, year: prev.year - 1 };
      } else if (newMonth > 11) {
        return { month: 0, year: prev.year + 1 };
      } else {
        return { ...prev, month: newMonth };
      }
    });
  };

  const nextStep = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      alert('All data submitted!');
      console.log(formData);
    }
  };

  const prevStep = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const skipToResults = () => {
    alert('Skipping to results...');
    console.log('Partial data:', formData);
  };

  const isStepCompleted = (stepIdx) => {
    switch (stepIdx) {
      case 0: return formData.name && formData.date_of_birth && formData.gender;
      case 1: return formData.photo;
      case 2: return formData.country;
      case 3: return formData.state && formData.district;
      case 4: return formData.profession;
      default: return false;
    }
  };

  const currentStep = steps[stepIndex];
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const availableStates = statesByCountry[formData.country] || [];
  const availableDistricts = districtsByState[formData.state] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="flex">
            {/* Progress Sidebar */}
            <div className="w-80 bg-gray-50 p-8">
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-gray-800 font-bold text-lg">Progress</h3>
                  <span className="text-gray-600 text-sm font-medium">{stepIndex + 1}/{steps.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-4 group">
                    <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all duration-300 ${
                      index === stepIndex 
                        ? 'bg-blue-500 scale-110 text-white' 
                        : isStepCompleted(index)
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white border-2 border-gray-200 text-gray-500'
                    }`}>
                      {isStepCompleted(index) ? (
                        <div className="text-white font-bold text-lg">✓</div>
                      ) : (
                        <div>
                          {step.icon}
                        </div>
                      )}
                    </div>
                    <div className={`transition-all duration-300 ${
                      index === stepIndex ? 'text-gray-800' : 
                      isStepCompleted(index) ? 'text-gray-600' : 'text-gray-500'
                    }`}>
                      <div className="font-semibold text-sm">{step.label}</div>
                      {index === stepIndex && (
                        <div className="text-xs text-blue-600 font-medium">Current step</div>
                      )}
                      {isStepCompleted(index) && index !== stepIndex && (
                        <div className="text-xs text-blue-500 font-medium">Completed</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
              <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                  <div className="w-20 h-20 bg-blue-500 rounded-3xl flex items-center justify-center text-3xl mb-6 mx-auto text-white">
                    {currentStep.icon}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-3 leading-tight">
                    {currentStep.title}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {currentStep.subtitle}
                  </p>
                </div>

                {/* Form Field */}
                <div className="mb-8">
                  {currentStep.label === 'User Details' && (
                    <div className="space-y-6">
                      {/* User Icon */}
                      

                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                        />
                      </div>

                      {/* Date of Birth with Calendar */}
                      <div > 
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        <div className="relative">
                         <DatePicker
                            selected={selectedDate}
                            onChange={(date) => {
                              setSelectedDate(date);
                              setFormData({ ...formData, date_of_birth: date.toISOString().split('T')[0] });
                            }}
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select" // enables dropdown instead of scrolling arrows
                            placeholderText="Select your date of birth"
                            dateFormat="dd/MM/yyyy"
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"

/>

                                                    
                        </div>

                        {showCalendar && (
                          <div className="absolute z-50 mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-xl p-4 w-80">
                            {/* Calendar Header */}
                            <div className="flex justify-between items-center mb-4">
                              <button
                                type="button"
                                onClick={() => changeMonth(-1)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                              >
                                ←
                              </button>
                              <h3 className="font-semibold text-gray-800">
                                {months[calendarDate.month]} {calendarDate.year}
                              </h3>
                              <button
                                type="button"
                                onClick={() => changeMonth(1)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                              >
                                →
                              </button>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
                                  {day}
                                </div>
                              ))}
                              {generateCalendar(calendarDate.month, calendarDate.year).map((day, index) => (
                                <div key={index} className="text-center">
                                  {day ? (
                                    <button
                                      type="button"
                                      onClick={() => handleDateSelect(day)}
                                      className="w-8 h-8 text-sm rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                    >
                                      {day}
                                    </button>
                                  ) : (
                                    <div className="w-8 h-8"></div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {['Male', 'Female', 'Other'].map((gender) => (
                            <button
                              key={gender}
                              type="button"
                              onClick={() => setFormData({ ...formData, gender })}
                              className={`p-6 text-center border-2 rounded-2xl transition-all duration-300 hover:scale-105 ${
                                formData.gender === gender
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              
                              <div className="font-semibold">{gender}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep.label === 'User Photo' && (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center">
                        <div className="w-40 h-40 bg-gray-100 rounded-full border-4 border-gray-200 flex items-center justify-center mb-6 overflow-hidden">
                          {photoPreview ? (
                            <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-gray-400 text-5xl"></div>
                          )}
                        </div>
                        
                        <label className="cursor-pointer bg-blue-500 text-white px-8 py-4 rounded-2xl font-medium hover:bg-blue-600 transition-all duration-300">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                           Upload Photo
                        </label>
                        
                        {formData.photo && (
                          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                            <p className="text-gray-700 font-medium">
                              Photo uploaded: {formData.photo.name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep.label === 'Country' && (
                    <div className="relative">
                      <div className="relative">
                        <input
                          type="text"
                          value={countrySearch}
                          onChange={handleCountrySearch}
                          onFocus={() => setIsCountryDropdownOpen(true)}
                          placeholder="Enter your country"
                          className="w-full p-4 pl-12 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      {isCountryDropdownOpen && (
                        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
                          {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                              <button
                                key={country}
                                type="button"
                                onClick={() => handleCountrySelect(country)}
                                className="w-full px-6 py-4 text-left text-gray-800 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
                              >
                                {country}
                              </button>
                            ))
                          ) : (
                            <div className="px-6 py-4 text-gray-500">No countries found</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {currentStep.label === 'Location' && (
                    <div className="space-y-6">
                      {/* State */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value, district: '' })}
                          className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                        >
                          <option value="">Select State/Province</option>
                          {availableStates.map((state) => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>

                      {/* District */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">District/City</label>
                        <select
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          disabled={!formData.state}
                          className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg disabled:opacity-50"
                        >
                          <option value="">Select District/City</option>
                          {availableDistricts.map((district) => (
                            <option key={district} value={district}>{district}</option>
                          ))}
                        </select>
                      </div>

                      {formData.state && formData.district && (
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                          <p className="text-gray-700 font-medium">
                            📍 Location: {formData.district}, {formData.state}, {formData.country}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {currentStep.label === 'Profession' && (
                    <input
                      type="text"
                      name="profession"
                      placeholder="Enter your profession"
                      value={formData.profession}
                      onChange={handleChange}
                      className="w-full p-4 pl-12 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                    />
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    {stepIndex > 0 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-100 border-2 border-gray-200 rounded-2xl text-gray-700 font-medium transition-all duration-300 hover:bg-gray-200 hover:scale-105"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Back</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2 px-8 py-3 bg-blue-500 rounded-2xl text-white font-medium transition-all duration-300 hover:bg-blue-600 hover:scale-105"
                    >
                      <span>{stepIndex < steps.length - 1 ? 'Next' : 'Finish'}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    onClick={skipToResults}
                    className="px-6 py-3 bg-gray-100 border-2 border-gray-200 rounded-2xl text-gray-700 font-medium transition-all duration-300 hover:bg-gray-200"
                  >
                    Skip to results
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}