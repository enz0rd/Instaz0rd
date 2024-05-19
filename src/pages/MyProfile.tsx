import Header from '@/components/Header';
import UserProfile from '@/components/UserProfile';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default function Logout() {

    return (
        <div>
            <Header />
            <UserProfile />
            {/* <UserPosts />  */}
        </div>
    );
}
