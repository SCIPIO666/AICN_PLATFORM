
import { Outlet } from 'react-router-dom';
import Navbar from '../layouts/Navbar';
import Footer from './Footer';
export default function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Outlet /> 
      </main>
      <Footer/>
    </div>
  );
}
