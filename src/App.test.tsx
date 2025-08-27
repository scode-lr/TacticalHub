import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders TacticalHub title', () => {
  render(<App />);
  const titleElement = screen.getByText(/TacticalHub - Multidive Manager/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders navigation buttons', () => {
  render(<App />);
  const diveLogsButton = screen.getByRole('button', { name: /Dive Logs/i });
  const divePlannerButton = screen.getByRole('button', { name: /Dive Planner/i });
  const equipmentButton = screen.getByRole('button', { name: /Equipment/i });
  const diveSitesButton = screen.getByRole('button', { name: /Dive Sites/i });
  
  expect(diveLogsButton).toBeInTheDocument();
  expect(divePlannerButton).toBeInTheDocument();
  expect(equipmentButton).toBeInTheDocument();
  expect(diveSitesButton).toBeInTheDocument();
});

test('renders dive log manager by default', () => {
  render(<App />);
  const diveLogManager = screen.getByText(/Dive Log Manager/i);
  expect(diveLogManager).toBeInTheDocument();
});
