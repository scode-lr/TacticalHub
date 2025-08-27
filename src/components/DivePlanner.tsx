import React, { useState } from 'react';
import { DivePlan, DiveSite, DifficultyLevel } from '../types/dive';

const DivePlanner: React.FC = () => {
  const [divePlans, setDivePlans] = useState<DivePlan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<DivePlan>>({
    date: new Date().toISOString().split('T')[0],
    plannedDepth: 0,
    plannedDuration: 0,
    divers: [],
    equipment: [],
    emergencyContacts: [],
    weatherConditions: '',
    tideInfo: ''
  });

  // Sample dive sites for demonstration
  const [diveSites] = useState<DiveSite[]>([
    {
      id: '1',
      name: 'Blue Hole',
      location: 'Belize',
      coordinates: { latitude: 17.3186, longitude: -87.5361 },
      maxDepth: 124,
      description: 'Famous circular sinkhole with stunning stalactites',
      difficulty: DifficultyLevel.ADVANCED,
      features: ['Stalactites', 'Sharks', 'Deep diving']
    },
    {
      id: '2',
      name: 'Coral Garden',
      location: 'Maldives',
      coordinates: { latitude: 3.2028, longitude: 73.2207 },
      maxDepth: 30,
      description: 'Beautiful coral formations with tropical fish',
      difficulty: DifficultyLevel.BEGINNER,
      features: ['Coral reefs', 'Tropical fish', 'Clear water']
    },
    {
      id: '3',
      name: 'Wreck of the Titanic',
      location: 'North Atlantic',
      coordinates: { latitude: 41.7325, longitude: -49.9469 },
      maxDepth: 3800,
      description: 'Historic shipwreck exploration',
      difficulty: DifficultyLevel.EXPERT,
      features: ['Historic wreck', 'Deep diving', 'Technical diving']
    }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'selectedSite') {
      const selectedSite = diveSites.find(site => site.id === value);
      setFormData(prev => ({
        ...prev,
        site: selectedSite
      }));
    } else if (name === 'plannedDepth' || name === 'plannedDuration') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDiversChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const diversList = e.target.value.split('\n').filter(diver => diver.trim() !== '');
    setFormData(prev => ({
      ...prev,
      divers: diversList
    }));
  };

  const handleEmergencyContactsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const contactsList = e.target.value.split('\n').filter(contact => contact.trim() !== '');
    setFormData(prev => ({
      ...prev,
      emergencyContacts: contactsList
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.site && formData.date) {
      const newDivePlan: DivePlan = {
        id: Date.now().toString(),
        date: formData.date!,
        site: formData.site!,
        plannedDepth: formData.plannedDepth || 0,
        plannedDuration: formData.plannedDuration || 0,
        divers: formData.divers || [],
        equipment: formData.equipment || [],
        emergencyContacts: formData.emergencyContacts || [],
        weatherConditions: formData.weatherConditions || '',
        tideInfo: formData.tideInfo || ''
      };
      
      setDivePlans(prev => [...prev, newDivePlan]);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        plannedDepth: 0,
        plannedDuration: 0,
        divers: [],
        equipment: [],
        emergencyContacts: [],
        weatherConditions: '',
        tideInfo: ''
      });
      setShowForm(false);
    }
  };

  const deleteDivePlan = (id: string) => {
    setDivePlans(prev => prev.filter(plan => plan.id !== id));
  };

  return (
    <div className="component-card">
      <h2 className="component-title">Dive Planner</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          className="btn" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Plan New Dive'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="component-card">
          <h3>New Dive Plan</h3>
          <div className="grid">
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Dive Site:</label>
              <select
                name="selectedSite"
                onChange={handleInputChange}
                required
              >
                <option value="">Select a dive site</option>
                {diveSites.map(site => (
                  <option key={site.id} value={site.id}>
                    {site.name} - {site.location} ({site.difficulty})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Planned Depth (m):</label>
              <input
                type="number"
                name="plannedDepth"
                value={formData.plannedDepth}
                onChange={handleInputChange}
                min="0"
                step="0.1"
              />
            </div>
            <div className="form-group">
              <label>Planned Duration (min):</label>
              <input
                type="number"
                name="plannedDuration"
                value={formData.plannedDuration}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Divers (one per line):</label>
            <textarea
              onChange={handleDiversChange}
              rows={3}
              placeholder="Enter diver names, one per line..."
            />
          </div>
          
          <div className="form-group">
            <label>Emergency Contacts (one per line):</label>
            <textarea
              onChange={handleEmergencyContactsChange}
              rows={3}
              placeholder="Enter emergency contact information, one per line..."
            />
          </div>
          
          <div className="grid">
            <div className="form-group">
              <label>Weather Conditions:</label>
              <input
                type="text"
                name="weatherConditions"
                value={formData.weatherConditions}
                onChange={handleInputChange}
                placeholder="e.g., Sunny, 25°C, light winds"
              />
            </div>
            <div className="form-group">
              <label>Tide Information:</label>
              <input
                type="text"
                name="tideInfo"
                value={formData.tideInfo}
                onChange={handleInputChange}
                placeholder="e.g., High tide at 14:30"
              />
            </div>
          </div>
          
          <button type="submit" className="btn">Save Dive Plan</button>
        </form>
      )}

      <div>
        <h3>Upcoming Dive Plans ({divePlans.length})</h3>
        {divePlans.length === 0 ? (
          <p>No dive plans yet. Plan your next adventure!</p>
        ) : (
          <div className="grid">
            {divePlans.map(plan => (
              <div key={plan.id} className="list-item">
                <h3>{plan.site.name}</h3>
                <p><strong>Date:</strong> {plan.date}</p>
                <p><strong>Location:</strong> {plan.site.location}</p>
                <p><strong>Planned Depth:</strong> {plan.plannedDepth}m</p>
                <p><strong>Planned Duration:</strong> {plan.plannedDuration} minutes</p>
                <p><strong>Difficulty:</strong> {plan.site.difficulty}</p>
                {plan.divers.length > 0 && (
                  <p><strong>Divers:</strong> {plan.divers.join(', ')}</p>
                )}
                {plan.weatherConditions && (
                  <p><strong>Weather:</strong> {plan.weatherConditions}</p>
                )}
                {plan.tideInfo && (
                  <p><strong>Tide:</strong> {plan.tideInfo}</p>
                )}
                <button 
                  className="btn btn-danger" 
                  onClick={() => deleteDivePlan(plan.id)}
                >
                  Delete Plan
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DivePlanner;