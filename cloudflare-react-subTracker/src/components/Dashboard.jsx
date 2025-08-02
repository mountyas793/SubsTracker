import React, { useState, useEffect } from 'react';
import { Plus, Calendar, DollarSign, TrendingUp, Settings, LogOut, Trash2, Edit } from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    price: '',
    cycle: 'monthly',
    startDate: '',
    category: 'other'
  });

  useEffect(() => {
    // 模拟加载订阅数据
    const mockSubscriptions = [
      {
        id: 1,
        name: 'Netflix',
        price: 15.99,
        cycle: 'monthly',
        startDate: '2024-01-15',
        category: 'entertainment',
        color: '#E50914'
      },
      {
        id: 2,
        name: 'Spotify',
        price: 9.99,
        cycle: 'monthly',
        startDate: '2024-01-01',
        category: 'music',
        color: '#1DB954'
      },
      {
        id: 3,
        name: 'Adobe Creative Cloud',
        price: 52.99,
        cycle: 'monthly',
        startDate: '2023-12-01',
        category: 'productivity',
        color: '#FF0000'
      }
    ];
    setSubscriptions(mockSubscriptions);
  }, []);

  const calculateMonthlyCost = () => {
    return subscriptions.reduce((total, sub) => {
      if (sub.cycle === 'monthly') return total + sub.price;
      if (sub.cycle === 'yearly') return total + (sub.price / 12);
      return total;
    }, 0).toFixed(2);
  };

  const calculateYearlyCost = () => {
    return subscriptions.reduce((total, sub) => {
      if (sub.cycle === 'monthly') return total + (sub.price * 12);
      if (sub.cycle === 'yearly') return total + sub.price;
      return total;
    }, 0).toFixed(2);
  };

  const handleAddSubscription = (e) => {
    e.preventDefault();
    const newSub = {
      ...newSubscription,
      id: Date.now(),
      price: parseFloat(newSubscription.price),
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };
    setSubscriptions([...subscriptions, newSub]);
    setShowAddModal(false);
    setNewSubscription({ name: '', price: '', cycle: 'monthly', startDate: '', category: 'other' });
  };

  const handleDeleteSubscription = (id) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
  };

  const getCategoryIcon = (category) => {
    const icons = {
      entertainment: '🎬',
      music: '🎵',
      productivity: '💼',
      cloud: '☁️',
      gaming: '🎮',
      other: '📦'
    };
    return icons[category] || '📦';
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">SubsTracker</h1>
          <div className="header-actions">
            <button className="settings-btn">
              <Settings size={20} />
            </button>
            <button className="logout-btn" onClick={onLogout}>
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <h3>月度支出</h3>
              <p className="stat-value">${calculateMonthlyCost()}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <h3>年度支出</h3>
              <p className="stat-value">${calculateYearlyCost()}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <h3>活跃订阅</h3>
              <p className="stat-value">{subscriptions.length}</p>
            </div>
          </div>
        </div>

        <div className="subscriptions-section">
          <div className="section-header">
            <h2>我的订阅</h2>
            <button 
              className="add-btn"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} />
              添加订阅
            </button>
          </div>

          <div className="subscriptions-grid">
            {subscriptions.map(subscription => (
              <div key={subscription.id} className="subscription-card">
                <div className="subscription-header">
                  <div 
                    className="subscription-icon" 
                    style={{ backgroundColor: subscription.color + '20' }}
                  >
                    <span>{getCategoryIcon(subscription.category)}</span>
                  </div>
                  <div className="subscription-info">
                    <h3>{subscription.name}</h3>
                    <p className="subscription-category">{subscription.category}</p>
                  </div>
                  <div className="subscription-actions">
                    <button className="action-btn">
                      <Edit size={16} />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteSubscription(subscription.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="subscription-details">
                  <div className="subscription-price">
                    <span className="price">${subscription.price}</span>
                    <span className="cycle">/{subscription.cycle}</span>
                  </div>
                  <div className="subscription-date">
                    开始于: {new Date(subscription.startDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>添加新订阅</h2>
            <form onSubmit={handleAddSubscription}>
              <div className="form-group">
                <label>服务名称</label>
                <input
                  type="text"
                  value={newSubscription.name}
                  onChange={(e) => setNewSubscription({...newSubscription, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>价格 ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newSubscription.price}
                  onChange={(e) => setNewSubscription({...newSubscription, price: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>周期</label>
                <select
                  value={newSubscription.cycle}
                  onChange={(e) => setNewSubscription({...newSubscription, cycle: e.target.value})}
                >
                  <option value="monthly">每月</option>
                  <option value="yearly">每年</option>
                </select>
              </div>
              <div className="form-group">
                <label>开始日期</label>
                <input
                  type="date"
                  value={newSubscription.startDate}
                  onChange={(e) => setNewSubscription({...newSubscription, startDate: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>分类</label>
                <select
                  value={newSubscription.category}
                  onChange={(e) => setNewSubscription({...newSubscription, category: e.target.value})}
                >
                  <option value="entertainment">娱乐</option>
                  <option value="music">音乐</option>
                  <option value="productivity">生产力</option>
                  <option value="cloud">云服务</option>
                  <option value="gaming">游戏</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)}>
                  取消
                </button>
                <button type="submit">
                  添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;