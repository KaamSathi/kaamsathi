import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './page';
import Applications from './applications/page';
import Construction from './categories/construction/page';
import Delivery from './categories/delivery/page';
import Dashboard from './dashboard/page';
import FindJobs from './find-jobs/page';
import Jobs from './jobs/page';
import Messages from './messages/page';
import PostJob from './post-job/page';
import Profile from './profile/page';
import { AuthContext } from '../contexts/auth-context';

// Mock next/navigation useRouter and usePathname for test environment
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => '/',
}));

const mockAuth = {
  user: { id: 'worker1', name: 'Test User', phone: '1234567890', role: 'worker' as 'worker' },
  token: 'mock-token',
  isAuthenticated: true,
  loading: false,
  sendOTP: jest.fn(),
  verifyOTP: jest.fn(),
  updateUser: jest.fn(),
  logout: jest.fn(),
  refreshToken: jest.fn(),
};

function withAuthProvider(children: React.ReactNode) {
  return <AuthContext.Provider value={mockAuth}>{children}</AuthContext.Provider>;
}

describe('Navigation Integration', () => {
  it('renders Home page without error', () => {
    render(withAuthProvider(<Home />));
    expect(screen.getByText(/KaamSathi/i)).toBeInTheDocument();
  });
  it('renders Applications page without error', () => {
    render(withAuthProvider(<Applications />));
    expect(screen.getByText(/Applications|applied|status/i)).toBeInTheDocument();
  });
  it('renders Construction category page without error', () => {
    render(withAuthProvider(<Construction />));
    expect(screen.getAllByText(/construction/i).length).toBeGreaterThan(0);
  });
  it('renders Delivery category page without error', () => {
    render(withAuthProvider(<Delivery />));
    expect(screen.getAllByText(/delivery/i).length).toBeGreaterThan(0);
  });
  it('renders Dashboard page without error', () => {
    render(withAuthProvider(<Dashboard />));
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });
  it('renders Find Jobs page without error', () => {
    render(withAuthProvider(<FindJobs />));
    expect(screen.getByText(/find jobs|search/i)).toBeInTheDocument();
  });
  it('renders Jobs page without error', () => {
    render(withAuthProvider(<Jobs />));
    expect(screen.getByText(/jobs|open positions|job listings/i)).toBeInTheDocument();
  });
  it('renders Messages page without error', () => {
    render(withAuthProvider(<Messages />));
    expect(screen.getByText(/messages|conversations|inbox/i)).toBeInTheDocument();
  });
  it('renders Post Job page without error', () => {
    render(withAuthProvider(<PostJob />));
    expect(screen.getByText(/post a job|create job/i)).toBeInTheDocument();
  });
  it('renders Profile page without error', () => {
    render(withAuthProvider(<Profile />));
    expect(screen.getByText(/profile|my profile/i)).toBeInTheDocument();
  });
}); 