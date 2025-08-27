import React, { useState } from 'react';
import { DiveSite, DifficultyLevel } from '../types/dive';

const DiveSiteInfo: React.FC = () => {
  const [diveSites, setDiveSites] = useState<DiveSite[]>([
    {
      id: '1',
      name: 'Blue Hole',
      location: 'Belize',
      coordinates: { latitude: 17.3186, longitude: -87.5361 },
      maxDepth: 124,
      description: 'Famous circular sinkhole with stunning stalactites and diverse marine life. This UNESCO World Heritage site offers an unforgettable diving experience.',
      difficulty: DifficultyLevel.ADVANCED,
      features: ['Stalactites', 'Sharks', 'Deep diving', 'Crystal clear water']
    },
    {
      id: '2',
      name: 'Coral Garden',
      location: 'Maldives',
      coordinates: { latitude: 3.2028, longitude: 73.2207 },
      maxDepth: 30,
      description: 'Beautiful coral formations with an abundance of tropical fish. Perfect for underwater photography and relaxed diving.',
      difficulty: DifficultyLevel.BEGINNER,
      features: ['Coral reefs', 'Tropical fish', 'Clear water', 'Photography opportunities']
    },
    {
      id: '3',
      name: 'SS Yongala Wreck',
      location: 'Australia',
      coordinates: { latitude: -19.3031, longitude: 147.6197 },
      maxDepth: 28,
      description: 'Historic steamship wreck teeming with marine life. One of the best wreck dives in the world.',
      difficulty: DifficultyLevel.INTERMEDIATE,
      features: ['Historic wreck', 'Marine life', 'Sharks', 'Rays']
    },
    {
      id: '4',
      name: 'Silfra Fissure',
      location: 'Iceland',
      coordinates: { latitude: 64.2558, longitude: -20.1239 },
      maxDepth: 63,
      description: 'Dive between continental plates in crystal clear glacial water. Visibility exceeds 100 meters.',
      difficulty: DifficultyLevel.INTERMEDIATE,
      features: ['Continental plates', 'Glacial water', 'Exceptional visibility', 'Unique geology']
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [selectedSite, setSelectedSite] = useState<DiveSite | null>(null);
  const [formData, setFormData] = useState<Partial<DiveSite>>({
    name: '',
    location: '',
    coordinates: { latitude: 0, longitude: 0 },
    maxDepth: 0,
    description: '',
    difficulty: DifficultyLevel.BEGINNER,
    features: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'latitude' || name === 'longitude') {
      setFormData(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates!,
          [name]: parseFloat(value) || 0
        }
      }));
    } else if (name === 'maxDepth') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else if (name === 'features') {
      const featuresArray = value.split(',').map(feature => feature.trim()).filter(feature => feature !== '');
      setFormData(prev => ({
        ...prev,
        features: featuresArray
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.location && formData.coordinates) {
      const newDiveSite: DiveSite = {
        id: Date.now().toString(),
        name: formData.name!,
        location: formData.location!,
        coordinates: formData.coordinates!,
        maxDepth: formData.maxDepth || 0,
        description: formData.description || '',
        difficulty: formData.difficulty || DifficultyLevel.BEGINNER,
        features: formData.features || []
      };
      
      setDiveSites(prev => [...prev, newDiveSite]);
      setFormData({
        name: '',
        location: '',
        coordinates: { latitude: 0, longitude: 0 },
        maxDepth: 0,
        description: '',
        difficulty: DifficultyLevel.BEGINNER,
        features: []
      });
      setShowForm(false);
    }
  };

  const deleteDiveSite = (id: string) => {
    setDiveSites(prev => prev.filter(site => site.id !== id));
    if (selectedSite?.id === id) {
      setSelectedSite(null);
    }
  };

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case DifficultyLevel.BEGINNER:
        return '#28a745';
      case DifficultyLevel.INTERMEDIATE:
        return '#ffc107';
      case DifficultyLevel.ADVANCED:
        return '#fd7e14';
      case DifficultyLevel.EXPERT:
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  return (
    <div className="component-card">
      <h2 className="component-title">Dive Sites Information</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          className="btn" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Dive Site'}
        </button>
        {selectedSite && (
          <button 
            className="btn btn-secondary" 
            onClick={() => setSelectedSite(null)}
            style={{ marginLeft: '10px' }}
          >
            Close Details
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="component-card">
          <h3>New Dive Site</h3>
          <div className="grid">
            <div className="form-group">
              <label>Site Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Rainbow Reef"
                required
              />
            </div>
            <div className="form-group">
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Fiji"
                required
              />
            </div>
            <div className="form-group">
              <label>Latitude:</label>
              <input
                type="number"
                name="latitude"
                value={formData.coordinates?.latitude}
                onChange={handleInputChange}
                step="0.000001"
                placeholder="e.g., -17.7134"
                required
              />
            </div>
            <div className="form-group">
              <label>Longitude:</label>
              <input
                type="number"
                name="longitude"
                value={formData.coordinates?.longitude}
                onChange={handleInputChange}
                step="0.000001"
                placeholder="e.g., 178.8650"
                required
              />
            </div>
            <div className="form-group">
              <label>Max Depth (m):</label>
              <input
                type="number"
                name="maxDepth"
                value={formData.maxDepth}
                onChange={handleInputChange}
                min="0"
                step="0.1"
              />
            </div>
            <div className="form-group">
              <label>Difficulty Level:</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
              >
                {Object.values(DifficultyLevel).map(level => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Describe the dive site..."
            />
          </div>
          
          <div className="form-group">
            <label>Features (comma-separated):</label>
            <input
              type="text"
              name="features"
              onChange={handleInputChange}
              placeholder="e.g., Coral reefs, Sharks, Wreck, Clear water"
            />
          </div>
          
          <button type="submit" className="btn">Add Dive Site</button>
        </form>
      )}

      {selectedSite && (
        <div className="component-card">
          <h3>{selectedSite.name}</h3>
          <div className="grid">
            <div>
              <p><strong>Location:</strong> {selectedSite.location}</p>
              <p><strong>Coordinates:</strong> {selectedSite.coordinates.latitude.toFixed(6)}, {selectedSite.coordinates.longitude.toFixed(6)}</p>
              <p><strong>Max Depth:</strong> {selectedSite.maxDepth}m</p>
              <p>
                <strong>Difficulty:</strong> 
                <span style={{ 
                  color: getDifficultyColor(selectedSite.difficulty),
                  marginLeft: '5px',
                  fontWeight: 'bold'
                }}>
                  {selectedSite.difficulty.charAt(0).toUpperCase() + selectedSite.difficulty.slice(1)}
                </span>
              </p>
            </div>
            <div>
              <p><strong>Features:</strong></p>
              <ul style={{ textAlign: 'left', color: '#e8f4fd' }}>
                {selectedSite.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
          <p><strong>Description:</strong> {selectedSite.description}</p>
        </div>
      )}

      <div>
        <h3>Available Dive Sites ({diveSites.length})</h3>
        {diveSites.length === 0 ? (
          <p>No dive sites available. Add some dive sites to explore!</p>
        ) : (
          <div className="grid">
            {diveSites.map(site => (
              <div key={site.id} className="list-item">
                <h3>{site.name}</h3>
                <p><strong>Location:</strong> {site.location}</p>
                <p><strong>Max Depth:</strong> {site.maxDepth}m</p>
                <p>
                  <strong>Difficulty:</strong> 
                  <span style={{ 
                    color: getDifficultyColor(site.difficulty),
                    marginLeft: '5px',
                    fontWeight: 'bold'
                  }}>
                    {site.difficulty.charAt(0).toUpperCase() + site.difficulty.slice(1)}
                  </span>
                </p>
                <p><strong>Features:</strong> {site.features.slice(0, 3).join(', ')}{site.features.length > 3 ? '...' : ''}</p>
                <div>
                  <button 
                    className="btn" 
                    onClick={() => setSelectedSite(site)}
                  >
                    View Details
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => deleteDiveSite(site.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiveSiteInfo;