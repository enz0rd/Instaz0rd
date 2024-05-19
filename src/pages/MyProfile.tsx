import Header from '@/components/Header';
import UserPosts from '@/components/UserPosts';
import UserProfile from '@/components/UserProfile';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default function MyProfile() {
    return (
        <div>
            <Header />
            <UserProfile />
            <UserPosts /> 
        </div>
    );
}
