import React, { useState } from 'react';
import { Equipment, EquipmentType } from '../types/dive';

const EquipmentTracker: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Equipment>>({
    name: '',
    type: EquipmentType.OTHER,
    serialNumber: '',
    lastServiceDate: '',
    nextServiceDate: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.type) {
      const newEquipment: Equipment = {
        id: Date.now().toString(),
        name: formData.name!,
        type: formData.type!,
        serialNumber: formData.serialNumber || undefined,
        lastServiceDate: formData.lastServiceDate || undefined,
        nextServiceDate: formData.nextServiceDate || undefined
      };
      
      setEquipment(prev => [...prev, newEquipment]);
      setFormData({
        name: '',
        type: EquipmentType.OTHER,
        serialNumber: '',
        lastServiceDate: '',
        nextServiceDate: ''
      });
      setShowForm(false);
    }
  };

  const deleteEquipment = (id: string) => {
    setEquipment(prev => prev.filter(item => item.id !== id));
  };

  const getServiceStatus = (item: Equipment) => {
    if (!item.nextServiceDate) return 'No service scheduled';
    
    const nextService = new Date(item.nextServiceDate);
    const today = new Date();
    const daysUntilService = Math.ceil((nextService.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilService < 0) {
      return { status: 'Overdue', color: '#dc3545' };
    } else if (daysUntilService <= 30) {
      return { status: `Due in ${daysUntilService} days`, color: '#ffc107' };
    } else {
      return { status: `Due in ${daysUntilService} days`, color: '#28a745' };
    }
  };

  const groupedEquipment = equipment.reduce((groups, item) => {
    const type = item.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(item);
    return groups;
  }, {} as Record<EquipmentType, Equipment[]>);

  return (
    <div className="component-card">
      <h2 className="component-title">Equipment Tracker</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          className="btn" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Equipment'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="component-card">
          <h3>New Equipment</h3>
          <div className="grid">
            <div className="form-group">
              <label>Equipment Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Scubapro MK25/S600"
                required
              />
            </div>
            <div className="form-group">
              <label>Type:</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                {Object.values(EquipmentType).map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Serial Number:</label>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleInputChange}
                placeholder="Optional"
              />
            </div>
            <div className="form-group">
              <label>Last Service Date:</label>
              <input
                type="date"
                name="lastServiceDate"
                value={formData.lastServiceDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Next Service Date:</label>
              <input
                type="date"
                name="nextServiceDate"
                value={formData.nextServiceDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <button type="submit" className="btn">Add Equipment</button>
        </form>
      )}

      <div>
        <h3>Your Equipment ({equipment.length} items)</h3>
        {equipment.length === 0 ? (
          <p>No equipment tracked yet. Add your diving gear!</p>
        ) : (
          <div>
            {Object.entries(groupedEquipment).map(([type, items]) => (
              <div key={type} className="component-card">
                <h4 style={{ color: '#4a90e2', marginBottom: '15px' }}>
                  {type.charAt(0).toUpperCase() + type.slice(1)} ({items.length})
                </h4>
                <div className="grid">
                  {items.map(item => {
                    const serviceStatus = getServiceStatus(item);
                    return (
                      <div key={item.id} className="list-item">
                        <h3>{item.name}</h3>
                        {item.serialNumber && (
                          <p><strong>Serial:</strong> {item.serialNumber}</p>
                        )}
                        {item.lastServiceDate && (
                          <p><strong>Last Service:</strong> {item.lastServiceDate}</p>
                        )}
                        {item.nextServiceDate && (
                          <p>
                            <strong>Service Status:</strong> 
                            <span style={{ 
                              color: typeof serviceStatus === 'object' ? serviceStatus.color : '#e8f4fd',
                              marginLeft: '5px'
                            }}>
                              {typeof serviceStatus === 'object' ? serviceStatus.status : serviceStatus}
                            </span>
                          </p>
                        )}
                        <button 
                          className="btn btn-danger" 
                          onClick={() => deleteEquipment(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentTracker;