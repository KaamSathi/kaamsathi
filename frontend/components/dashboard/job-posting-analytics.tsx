"use client"

import React from 'react';
import { Card } from '../ui/card';

export default function JobPostingAnalytics() {
  // TODO: Replace with real analytics data from backend when available
  return (
    <Card className="p-6 flex flex-col items-center justify-center min-h-[200px]">
      <h2 className="text-xl font-bold mb-2">Job Posting Analytics</h2>
      <p className="text-gray-500">No analytics data available.</p>
    </Card>
  );
}
