import { supabase } from '../supabase/supabase';
import { mapUserRowToData } from '../services/user.service';

/**
 * Debug utility to check all usernames in Supabase
 */
export const debugListAllUsernames = async () => {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('*');

        if (error) {
            console.error('Error listing users from Supabase:', error);
            return [];
        }

        console.log('📋 All users in Supabase:');
        console.log('Total users:', users.length);

        const mappedUsers = users.map(row => {
            const data = mapUserRowToData(row);
            const username = data.profile?.username;
            const name = data.name || data.profile?.fullName;

            console.log({
                uid: data.uid,
                name: name,
                username: username,
                hasUsername: !!username
            });

            return {
                uid: data.uid,
                username,
                name
            };
        });

        return mappedUsers;
    } catch (error) {
        console.error('Error listing users:', error);
        return [];
    }
};

if (typeof window !== 'undefined') {
    window.debugListAllUsernames = debugListAllUsernames;
}
