import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

/**
 * Debug utility to check all usernames in Firestore
 * Run this in browser console to see all available usernames
 */
export const debugListAllUsernames = async () => {
    try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);

        console.log('📋 All users in Firestore:');
        console.log('Total users:', snapshot.size);

        snapshot.forEach((doc) => {
            const data = doc.data();
            const username = data.profile?.username;
            const name = data.name || data.profile?.fullName;

            console.log({
                uid: doc.id,
                name: name,
                username: username,
                hasUsername: !!username
            });
        });

        return snapshot.docs.map(doc => ({
            uid: doc.id,
            username: doc.data().profile?.username,
            name: doc.data().name
        }));
    } catch (error) {
        console.error('Error listing users:', error);
        return [];
    }
};

// Make it available globally for debugging
if (typeof window !== 'undefined') {
    window.debugListAllUsernames = debugListAllUsernames;
}
