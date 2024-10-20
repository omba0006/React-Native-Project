import React from 'react';
import { GiftrProvider } from './context/GiftrContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <GiftrProvider>
      <AppNavigator />
    </GiftrProvider>
  );
}
