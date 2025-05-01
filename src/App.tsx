import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'

// Lazy loading pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const CarListingPage = lazy(() => import('./pages/CarListingPage'))
const CarDetailPage = lazy(() => import('./pages/CarDetailPage