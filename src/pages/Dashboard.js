import React, { useState, useEffect } from 'react';
import api from '../services/api';
import FiltersBar from '../components/FiltersBar';
import TopProductsChart from '../components/TopProductsChart';
import RevenueTrendChart from '../components/RevenueTrendChart';
import LowStockTable from '../components/LowStockTable';

export default function Dashboard() {
  const [start, setStart] = useState(new Date(new Date().setDate(new Date().getDate()-30)));
  const [end, setEnd] = useState(new Date());
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  const fetchAll = async () => {
    const qs = new URLSearchParams({
      start: start.toISOString(),
      end: end.toISOString(),
      category
    }).toString();

    try {
      const [topRes, revRes, lowRes, catsRes] = await Promise.all([
        api.get(`/api/dashboard/top-products?${qs}`),
        api.get(`/api/dashboard/revenue-trends?interval=day&${qs}`),
        api.get(`/api/dashboard/low-stock?threshold=10&${qs}`),
        api.get('/api/dashboard/categories') // optional
      ]);
      setTopProducts(topRes.data);
      setRevenue(revRes.data);
      setLowStock(lowRes.data);
      setCategories(catsRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [start, end, category]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Manager Dashboard</h2>
      <FiltersBar {...{ start, end, setStart, setEnd, category, setCategory, categories }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <TopProductsChart data={topProducts} />
        <RevenueTrendChart data={revenue} />
      </div>
      <LowStockTable items={lowStock} />
    </div>
  );
}
