import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '@/App.css';
import Home from '@/pages/Home';
import Signin from '@/pages/Signin';
import Signup from '@/pages/Signup';
import Logout from '@/pages/Logout';
import MyProfile from '@/pages/MyProfile';
import NotFound from '@/pages/NotFound';
import Post from '@/pages/Post';
import Stories from '@/pages/Stories';
import ChangeCountry from '@/pages/ChangeCountry';
import ResetPassword from '@/pages/ResetPassword';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/u/:username" element={<MyProfile />} />
        <Route path="/u/:username/:postId" element={<Post />} />
        <Route path="/u/:username/stories" element={<Stories />} />
        <Route path='/u/:username/changeCountry' element={<ChangeCountry />} />
        <Route path='/u/:username/resetPassword' element={<ResetPassword />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}