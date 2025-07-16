import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobCard from './job-card';
import { AuthContext } from '../contexts/auth-context';

describe('JobCard', () => {
  it('renders job title', () => {
    const job = {
      id: '1',
      title: 'Test Job',
      description: 'Test Description',
      category: 'Test Category',
      location: {
        address: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456',
      },
      type: 'Full Time',
      salary: {
        type: 'Monthly',
        min: 1000,
        max: 2000,
        currency: 'INR',
        isNegotiable: false,
      },
      requirements: {
        experience: '1 year',
        skills: ['Skill1'],
        education: 'High School',
      },
      employer: {
        id: 'emp1',
        name: 'Test Employer',
        companyName: 'Test Co',
        avatar: '',
        rating: { average: 4.5 },
        isVerified: true,
      },
      status: 'open',
      priority: 'normal',
      isUrgent: false,
      views: 0,
      currentApplications: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      formattedSalary: '₹1,000 - ₹2,000',
      locationString: 'Test City, Test State',
      daysSincePosted: 1,
    };
    const mockAuth = {
      user: { id: 'worker1', name: 'Test User', phone: '1234567890', role: 'worker' },
      token: 'mock-token',
      isAuthenticated: true,
      loading: false,
      sendOTP: jest.fn(),
      verifyOTP: jest.fn(),
      updateUser: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
    };
    render(
      <AuthContext.Provider value={mockAuth}>
        <JobCard job={job} />
      </AuthContext.Provider>
    );
    expect(screen.getByText('Test Job')).toBeInTheDocument();
  });
}); 