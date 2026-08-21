import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import Landing from './pages/Landing'
import Explore from './pages/Explore'
import ProductDetail from './pages/ProductDetail'
import Studio from './pages/Studio'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Confirmation from './pages/Confirmation'
import Partner from './pages/Partner'
import Admin from './pages/Admin'
import Pricing from './pages/Pricing'
import HowItWorks from './pages/HowItWorks'
import Login from './pages/Login'
import Account from './pages/Account'
import Saved from './pages/Saved'
import Orders from './pages/Orders'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/partner" element={<Partner />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<RequireAuth><Account /></RequireAuth>} />
        <Route path="/saved" element={<RequireAuth><Saved /></RequireAuth>} />
        <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
