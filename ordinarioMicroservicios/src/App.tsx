import React, { useState } from 'react';
import './App.css';
import { ProductListView } from './presentation/views/ProductListView';
import { OrderSearchView } from './presentation/views/OrderSearchView';
import { OrderListView } from './presentation/views/OrderListView';
import { OrderDetailView } from './presentation/views/OrderDetailView';

function App() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'search'>('inventory');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleViewDetail = (id: string) => {
    setSelectedOrderId(id);
    setShowDetail(true);
  };

  const handleBackToList = () => {
    setShowDetail(false);
    setSelectedOrderId(null);
  };

  const renderContent = () => {
    if (showDetail && selectedOrderId) {
      return <OrderDetailView orderId={selectedOrderId} onBack={handleBackToList} />;
    }

    switch (activeTab) {
      case 'inventory':
        return <ProductListView />;
      case 'orders':
        return <OrderListView onViewDetail={handleViewDetail} />;
      case 'search':
        return <OrderSearchView />;
      default:
        return <ProductListView />;
    }
  };

  return (
    <div className="App">
      <nav style={styles.nav}>
        <button 
          onClick={() => { setActiveTab('inventory'); setShowDetail(false); }}
          style={{ 
            ...styles.navBtn, 
            borderBottom: activeTab === 'inventory' ? '3px solid #4ecca3' : 'none',
            color: activeTab === 'inventory' ? '#4ecca3' : '#fff'
          }}
        >
          INVENTARIO
        </button>
        <button 
          onClick={() => { setActiveTab('orders'); setShowDetail(false); }}
          style={{ 
            ...styles.navBtn, 
            borderBottom: activeTab === 'orders' ? '3px solid #4ecca3' : 'none',
            color: activeTab === 'orders' ? '#4ecca3' : '#fff'
          }}
        >
          ÓRDENES
        </button>
        <button 
          onClick={() => { setActiveTab('search'); setShowDetail(false); }}
          style={{ 
            ...styles.navBtn, 
            borderBottom: activeTab === 'search' ? '3px solid #4ecca3' : 'none',
            color: activeTab === 'search' ? '#4ecca3' : '#fff'
          }}
        >
          BÚSQUEDA
        </button>
      </nav>

      {renderContent()}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    padding: '20px',
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderBottom: '1px solid rgba(78, 204, 163, 0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  navBtn: {
    background: 'none',
    border: 'none',
    padding: '10px 20px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
    letterSpacing: '2px'
  }
};

export default App;
