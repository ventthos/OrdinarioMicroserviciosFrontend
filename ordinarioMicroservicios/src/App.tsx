import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './presentation/layouts/MainLayout';
import { ProductListView } from './presentation/views/ProductListView';
import { OrderListView } from './presentation/views/OrderListView';
import { OrderDetailView } from './presentation/views/OrderDetailView';
import { OrderSearchView } from './presentation/views/OrderSearchView';
import { ShipmentListView } from './presentation/views/ShipmentListView';
import { globalStyles } from './presentation/theme';
import './App.css';

function App() {
  return (
    <>
      <style>{globalStyles}</style>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/inventory" replace />} />
            <Route path="/inventory" element={<ProductListView />} />
            <Route path="/orders" element={<OrderListView />} />
            <Route path="/orders/:id" element={<OrderDetailView />} />
            <Route path="/search" element={<OrderSearchView />} />
            <Route path="/shipments" element={<ShipmentListView />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
