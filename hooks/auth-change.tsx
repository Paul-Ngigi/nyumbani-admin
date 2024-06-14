import { IUser } from "@/interfaces/user.interface";

// Define a type for the callback function that will be called on auth state changes
type AuthStateChangedCallback = (user: IUser | null) => void;

// Function to add an observer for user sign-in state changes
export function observeAuthState(
  callback: AuthStateChangedCallback
): () => void {
  // Helper function to retrieve user data from session storage
  const getSessionUser = (): IUser | null => {
    const userString = sessionStorage.getItem('user');
    if (userString) {
      try {
        // Parse the user data from JSON
        const user = JSON.parse(userString);
        return user;
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  };

  // Initial callback with the current user state
  callback(getSessionUser());

  // Function to handle storage event
  const handleStorageEvent = (event: StorageEvent) => {
    if (event.storageArea === sessionStorage && event.key === 'user') {
      // Notify callback when user item in session storage changes
      callback(getSessionUser());
    }
  };

  // Add event listener to listen for changes in session storage
  window.addEventListener('storage', handleStorageEvent);

  // Return a function that can be used to unsubscribe from the observer
  return () => {
    // Remove the event listener when no longer needed
    window.removeEventListener('storage', handleStorageEvent);
  };
}
