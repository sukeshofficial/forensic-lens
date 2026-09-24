import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { CasesPage } from '../pages/CasesPage';
import { EvidencePage } from '../pages/EvidencePage';
import { ImageAnalysisPage } from '../pages/ImageAnalysisPage';
import { BrowserAnalysisPage } from '../pages/BrowserAnalysisPage';
import { TimelinePage } from '../pages/TimelinePage';
import {
  ReportsPage,
  SettingsPage,
} from '../pages/PlaceholderPages';

interface AppLayoutProps {
  onLoadDemo: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ onLoadDemo }) => (
  <MainLayout onLoadDemo={onLoadDemo}>
    <Outlet />
  </MainLayout>
);

export const createRouter = (onLoadDemo: () => void) =>
  createBrowserRouter([
    {
      path: '/',
      element: <AppLayout onLoadDemo={onLoadDemo} />,
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        { path: 'dashboard', element: <DashboardPage /> },
        { path: 'cases', element: <CasesPage /> },
        { path: 'evidence', element: <EvidencePage /> },
        { path: 'browser', element: <BrowserAnalysisPage /> },
        { path: 'images', element: <ImageAnalysisPage /> },
        { path: 'timeline', element: <TimelinePage /> },
        { path: 'reports', element: <ReportsPage /> },
        { path: 'settings', element: <SettingsPage /> },
        { path: '*', element: <Navigate to="/dashboard" replace /> },
      ],
    },
  ]);
