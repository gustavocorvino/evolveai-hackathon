import { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

/**
 * Custom hook for authentication state
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Fetch team data from Firestore
        try {
          const teamDoc = await getDoc(doc(db, 'teams', firebaseUser.uid));
          if (teamDoc.exists()) {
            setTeamData({ id: teamDoc.id, ...teamDoc.data() });
          }
        } catch (error) {
          console.error('Error fetching team data:', error);
        }
      } else {
        setUser(null);
        setTeamData(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  return { user, teamData, loading };
}
