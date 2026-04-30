// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './context/AuthContext';

// // Layouts
// import PublicLayout   from './layouts/PublicLayout';
// import DashboardLayout from './layouts/DashboardLayout';

// // Public Pages
// import Home    from './pages/public/Home';
// import About   from './pages/public/About';
// import Contact from './pages/public/Contact';

// // Auth Pages
// import FarmerAuth   from './pages/auth/FarmerAuth';
// import BuyerAuth    from './pages/auth/BuyerAuth';
// import ProviderAuth from './pages/auth/ProviderAuth';
// import AdminLogin   from './pages/auth/AdminLogin';

// // Farmer Dashboard
// import FarmerDashboard  from './pages/farmer/Dashboard';
// import PostHarvest      from './pages/farmer/PostHarvest';
// import ViewOffers       from './pages/farmer/ViewOffers';
// import PostCrops        from './pages/farmer/PostCrops';
// import BuyerOffers      from './pages/farmer/BuyerOffers';
// import FarmerFeedback   from './pages/farmer/Feedback';
// import FarmerProfile    from './pages/farmer/Profile';

// // Provider Dashboard
// import ProviderDashboard from './pages/provider/Dashboard';
// import PostService       from './pages/provider/PostService';
// import FarmerRequests    from './pages/provider/FarmerRequests';
// import Bookings          from './pages/provider/Bookings';
// import ProviderFeedback  from './pages/provider/Feedback';
// import ProviderProfile   from './pages/provider/Profile';

// // Buyer Dashboard
// import BuyerDashboard from './pages/buyer/Dashboard';
// import CropListings   from './pages/buyer/CropListings';
// import BuyerChat      from './pages/buyer/Chat';
// import Orders         from './pages/buyer/Orders';
// import Reviews        from './pages/buyer/Reviews';
// import BuyerProfile   from './pages/buyer/Profile';

// // Admin Dashboard
// import AdminDashboard  from './pages/admin/Dashboard';
// import AdminUsers      from './pages/admin/Users';
// import AdminTransactions from './pages/admin/Transactions';
// import AdminDisputes   from './pages/admin/Disputes';
// import AdminListings   from './pages/admin/Listings';

// const ProtectedRoute = ({ children, role }) => {
//   const { user, isAuthenticated } = useAuth();
//   if (!isAuthenticated) return <Navigate to="/" replace />;
//   if (role && user?.role !== role) return <Navigate to="/" replace />;
//   return children;
// };

// export default function App() {
//   return (
//     <Routes>
//       {/* Public */}
//       <Route element={<PublicLayout />}>
//         <Route path="/"        element={<Home />} />
//         <Route path="/about"   element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//       </Route>

//       {/* Auth */}
//       <Route path="/auth/farmer"   element={<FarmerAuth />} />
//       <Route path="/auth/buyer"    element={<BuyerAuth />} />
//       <Route path="/auth/provider" element={<ProviderAuth />} />
//       <Route path="/auth/admin"    element={<AdminLogin />} />

//       {/* Farmer Dashboard */}
//       <Route path="/farmer" element={
//         <ProtectedRoute role="farmer"><DashboardLayout role="farmer" /></ProtectedRoute>
//       }>
//         <Route index             element={<FarmerDashboard />} />
//         <Route path="harvest"    element={<PostHarvest />} />
//         <Route path="offers"     element={<ViewOffers />} />
//         <Route path="crops"      element={<PostCrops />} />
//         <Route path="buyerOffers"element={<BuyerOffers />} />
//         <Route path="feedback"   element={<FarmerFeedback />} />
//         <Route path="profile"    element={<FarmerProfile />} />
//       </Route>

//       {/* Provider Dashboard */}
//       <Route path="/provider" element={
//         <ProtectedRoute role="provider"><DashboardLayout role="provider" /></ProtectedRoute>
//       }>
//         <Route index             element={<ProviderDashboard />} />
//         <Route path="service"    element={<PostService />} />
//         <Route path="requests"   element={<FarmerRequests />} />
//         <Route path="bookings"   element={<Bookings />} />
//         <Route path="feedback"   element={<ProviderFeedback />} />
//         <Route path="profile"    element={<ProviderProfile />} />
//       </Route>

//       {/* Buyer Dashboard */}
//       <Route path="/buyer" element={
//         <ProtectedRoute role="buyer"><DashboardLayout role="buyer" /></ProtectedRoute>
//       }>
//         <Route index           element={<BuyerDashboard />} />
//         <Route path="listings" element={<CropListings />} />
//         <Route path="chat"     element={<BuyerChat />} />
//         <Route path="orders"   element={<Orders />} />
//         <Route path="reviews"  element={<Reviews />} />
//         <Route path="profile"  element={<BuyerProfile />} />
//       </Route>

//       {/* Admin Dashboard */}
//       <Route path="/admin" element={
//         <ProtectedRoute role="admin"><DashboardLayout role="admin" /></ProtectedRoute>
//       }>
//         <Route index                element={<AdminDashboard />} />
//         <Route path="users"         element={<AdminUsers />} />
//         <Route path="transactions"  element={<AdminTransactions />} />
//         <Route path="disputes"      element={<AdminDisputes />} />
//         <Route path="listings"      element={<AdminListings />} />
//       </Route>

//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import PublicLayout   from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home    from './pages/public/Home';
import About   from './pages/public/About';
import Contact from './pages/public/Contact';

// Auth Pages
import FarmerAuth   from './pages/auth/FarmerAuth';
import BuyerAuth    from './pages/auth/BuyerAuth';
import ProviderAuth from './pages/auth/ProviderAuth';
import AdminLogin   from './pages/auth/AdminLogin';

// Farmer Dashboard
import FarmerDashboard  from './pages/farmer/Dashboard';
import PostHarvest      from './pages/farmer/PostHarvest';

const ProtectedRoute = ({ children, role }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/"        element={<Home />} />
        <Route path="/about"   element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Auth */}
      <Route path="/auth/farmer"   element={<FarmerAuth />} />
      <Route path="/auth/buyer"    element={<BuyerAuth />} />
      <Route path="/auth/provider" element={<ProviderAuth />} />
      <Route path="/auth/admin"    element={<AdminLogin />} />

      {/* Farmer Dashboard */}
      <Route path="/farmer" element={
        <ProtectedRoute role="farmer"><DashboardLayout role="farmer" /></ProtectedRoute>
      }>
        <Route index             element={<FarmerDashboard />} />
        <Route path="harvest"    element={<PostHarvest />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
