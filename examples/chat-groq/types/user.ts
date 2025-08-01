/**
 * User type used throughout the application for both authenticated and guest users
 */
export interface User {
  id: string;
  name: string;
  email: string;
}

/**
 * Guest session type used when authentication is disabled
 */
export interface GuestSession {
  user: User;
}