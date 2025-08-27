import React, { useState } from 'react';
import { DiveLog } from '../types/dive';

const DiveLogManager: React.FC = () => {
  const [diveLogs, setDiveLogs] = useState<DiveLog[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<DiveLog>>({
    date: new Date().toISOString().split('T')[0],
    location: '',
    depth: 0,
    duration: 0,
    airTemperature: 20,
    waterTemperature: 20,
    visibility: 10,
    notes: '',
    equipment: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'depth' || name === 'duration' || name === 'airTemperature' || 
              name === 'waterTemperature' || name === 'visibility' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.location && formData.date) {
      const newDiveLog: DiveLog = {
        id: Date.now().toString(),
        date: formData.date!,
        location: formData.location!,
        depth: formData.depth || 0,
        duration: formData.duration || 0,
        airTemperature: formData.airTemperature || 20,
        waterTemperature: formData.waterTemperature || 20,
        visibility: formData.visibility || 10,
        notes: formData.notes || '',
        equipment: formData.equipment || []
      };
      
      setDiveLogs(prev => [...prev, newDiveLog]);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        location: '',
        depth: 0,
        duration: 0,
        airTemperature: 20,
        waterTemperature: 20,
        visibility: 10,
        notes: '',
        equipment: []
      });
      setShowForm(false);
    }
  };

  const deleteDiveLog = (id: string) => {
    setDiveLogs(prev => prev.filter(log => log.id !== id));
  };

  return (
    <div className="component-card">
      <h2 className="component-title">Dive Log Manager</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          className="btn" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Dive Log'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="component-card">
          <h3>New Dive Log</h3>
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
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Great Barrier Reef"
                required
              />
            </div>
            <div className="form-group">
              <label>Max Depth (m):</label>
              <input
                type="number"
                name="depth"
                value={formData.depth}
                onChange={handleInputChange}
                min="0"
                step="0.1"
              />
            </div>
            <div className="form-group">
              <label>Duration (min):</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Air Temperature (°C):</label>
              <input
                type="number"
                name="airTemperature"
                value={formData.airTemperature}
                onChange={handleInputChange}
                step="0.1"
              />
            </div>
            <div className="form-group">
              <label>Water Temperature (°C):</label>
              <input
                type="number"
                name="waterTemperature"
                value={formData.waterTemperature}
                onChange={handleInputChange}
                step="0.1"
              />
            </div>
            <div className="form-group">
              <label>Visibility (m):</label>
              <input
                type="number"
                name="visibility"
                value={formData.visibility}
                onChange={handleInputChange}
                min="0"
                step="0.1"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Notes:</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Describe your dive experience..."
            />
          </div>
          <button type="submit" className="btn">Save Dive Log</button>
        </form>
      )}

      <div>
        <h3>Your Dive Logs ({diveLogs.length})</h3>
        {diveLogs.length === 0 ? (
          <p>No dive logs yet. Add your first dive!</p>
        ) : (
          <div className="grid">
            {diveLogs.map(log => (
              <div key={log.id} className="list-item">
                <h3>{log.location}</h3>
                <p><strong>Date:</strong> {log.date}</p>
                <p><strong>Depth:</strong> {log.depth}m</p>
                <p><strong>Duration:</strong> {log.duration} minutes</p>
                <p><strong>Water Temp:</strong> {log.waterTemperature}°C</p>
                <p><strong>Visibility:</strong> {log.visibility}m</p>
                {log.notes && <p><strong>Notes:</strong> {log.notes}</p>}
                <button 
                  className="btn btn-danger" 
                  onClick={() => deleteDiveLog(log.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiveLogManager;