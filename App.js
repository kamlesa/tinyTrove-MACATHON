import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './frontEnd/HomePage';
import { MapPage } from './frontEnd/MapPage';
import { ProfilePage } from './frontEnd/ProfilePage';
import { PostPage } from './frontEnd/PostPage';
import { SearchPage } from './frontEnd/Search';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/post" element={<PostPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}
