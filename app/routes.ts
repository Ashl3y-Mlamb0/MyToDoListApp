import React from 'react';

// This file is used to declare route types
const Routes = () => {
  // This component is never rendered but required for type safety
  return null;
};

export default Routes;

// Define app routes for type checking
declare module "expo-router" {
  namespace Route {
    interface Routes {
      // Define root routes
      "/": {};
      "/home": {};
      "/add": {};
      "/nested-stack": {};
    }
  }
} 