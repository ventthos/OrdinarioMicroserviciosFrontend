import React, { useState } from 'react';
import './App.css';
import { ProductListView } from './presentation/views/ProductListView';
import { OrderSearchView } from './presentation/views/OrderSearchView';

function App() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');

  return (
    <div className="App">
      <nav style={styles.nav}>
        <button 
          onClick={() => setActiveTab('inventory')}
          style={{ 
            ...styles.navBtn, 
            borderBottom: activeTab === 'inventory' ? '3px solid #4ecca3' : 'none',
            color: activeTab === 'inventory' ? '#4ecca3' : '#fff'
          }}
        >
          INVENTARIO
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          style={{ 
            ...styles.navBtn, 
            borderBottom: activeTab === 'orders' ? '3px solid #4ecca3' : 'none',
            color: activeTab === 'orders' ? '#4ecca3' : '#fff'
          }}
        >
          ÓRDENES
        </button>
      </nav>

      {activeTab === 'inventory' ? <ProductListView /> : <OrderSearchView />}
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
