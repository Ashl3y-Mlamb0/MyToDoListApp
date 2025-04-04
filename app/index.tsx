import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect from the index route to our home page
  return <Redirect href="/home" />;
} 