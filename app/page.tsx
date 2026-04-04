'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  ingredients: string[];
}

interface CartItem extends Product {
  quantity: number;
}

const API_URL = 'https://pizzeria-backend-api.onrender.com';

function SkeletonLoader() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <div style={{ height: 300, background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: 28, marginBottom: 32 }}></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ height: 180, background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: 20 }}></div>
        ))}
      </div>
      <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'cart'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '' });
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const isOpen = () => {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 11 && hours < 22;
  };

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = [...new Set(products.map(p => p.category))];
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const filteredProducts = products.filter(p => {
    const matchesCategory = p.category === selectedCategory;
    const matchesSearch = searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const highlights = products.filter(p => p.category === 'Pizzen' || p.category === 'Nudelgerichte').slice(0, 4);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing?.quantity === 1) {
        return prev.filter(item => item.id !== id);
      }
      return prev.map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item);
    });
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const submitOrder = async () => {
    if (!form.name || !form.phone) {
      alert('Bitte Name und Telefon eingeben');
      return;
    }
    const res = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: form.name,
        customerPhone: form.phone,
        customerAddress: form.address,
        deliveryMethod,
        paymentMethod,
        items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
        total: totalPrice,
        notes: form.notes
      })
    });
    const data = await res.json();
    if (data.success) {
      setOrderNumber(data.orderNumber);
      setCart([]);
      setShowCheckout(false);
      setShowConfirm(true);
      setForm({ name: '', phone: '', address: '', notes: '' });
      setActiveTab('home');
    }
  };

  const bgColor = darkMode ? '#1c1c1e' : '#f5f5f7';
  const cardBg = darkMode ? '#2c2c2e' : 'white';
  const textColor = darkMode ? '#ffffff' : '#1d1d1f';
  const textSecondary = darkMode ? '#8e8e93' : '#86868b';
  const borderColor = darkMode ? '#3a3a3c' : '#e8e8ed';
  const headerBg = darkMode ? 'rgba(28,28,30,0.98)' : 'rgba(255,255,255,0.98)';

  if (loading) return <SkeletonLoader />;

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, sans-serif', background: bgColor, color: textColor, minHeight: '100vh', transition: 'background 0.3s, color 0.3s' }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, background: headerBg, backdropFilter: 'blur(20px)', borderBottom: `0.5px solid ${borderColor}`, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.3px', color: '#c41e3a' }}>Pizzeria Napoli</h1>
            <p style={{ fontSize: '0.7rem', color: textSecondary }}>Gewölbeger Straße 28, 45549 Sprockhövel</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setDarkMode(!darkMode)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 20, fontSize: '0.75rem', fontWeight: 500, color: textColor }}>{darkMode ? 'Hell' : 'Dunkel'}</button>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>023 39 / 91 16 727</div>
              <div style={{ fontSize: '0.7rem', color: textSecondary }}>Täglich 11:00 - 22:00 Uhr</div>
            </div>
          </div>
        </div>
      </header>

      {/* Öffnungszeiten-Banner */}
      <div style={{ background: isOpen() ? '#e8f5e9' : '#ffebee', padding: '8px 16px', textAlign: 'center', fontSize: '0.813rem', borderBottom: `0.5px solid ${borderColor}` }}>
        <span style={{ color: isOpen() ? '#2e7d32' : '#c62828' }}>{isOpen() ? '✓ Jetzt geöffnet' : '✗ Derzeit geschlossen (11:00 - 22:00 Uhr)'}</span>
      </div>

      {/* Tab Navigation */}
      <div style={{ background: headerBg, backdropFilter: 'blur(10px)', borderBottom: `0.5px solid ${borderColor}`, padding: '8px 16px', position: 'sticky', top: '80px', zIndex: 99 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 8, background: darkMode ? '#3a3a3c' : '#f5f5f7', padding: 4, borderRadius: 40 }}>
            <button onClick={() => setActiveTab('home')} style={{ flex: 1, padding: '10px 16px', border: 'none', background: activeTab === 'home' ? '#c41e3a' : 'transparent', borderRadius: 32, fontSize: '0.875rem', fontWeight: 500, color: activeTab === 'home' ? 'white' : textSecondary, cursor: 'pointer' }}>Start</button>
            <button onClick={() => setActiveTab('menu')} style={{ flex: 1, padding: '10px 16px', border: 'none', background: activeTab === 'menu' ? '#c41e3a' : 'transparent', borderRadius: 32, fontSize: '0.875rem', fontWeight: 500, color: activeTab === 'menu' ? 'white' : textSecondary, cursor: 'pointer' }}>Speisekarte</button>
            <button onClick={() => setActiveTab('cart')} style={{ flex: 1, padding: '10px 16px', border: 'none', background: activeTab === 'cart' ? '#c41e3a' : 'transparent', borderRadius: 32, fontSize: '0.875rem', fontWeight: 500, color: activeTab === 'cart' ? 'white' : textSecondary, cursor: 'pointer' }}>Warenkorb{itemCount > 0 ? ` (${itemCount})` : ''}</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        {/* HOME TAB */}
        {activeTab === 'home' && !showCheckout && (
          <div>
            {/* Hero mit dezentem Rot */}
            <div style={{ background: 'linear-gradient(135deg, #f5f0eb 0%, #e8e0d8 100%)', borderRadius: 28, marginBottom: 32, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#2d2d2d', marginBottom: 16, letterSpacing: '-0.02em' }}>Pizzeria Napoli</h1>
                <p style={{ color: '#5a5a5a', fontSize: '1rem', marginBottom: 24 }}>Authentische italienische Küche · Handgemachte Pizzen</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 32 }}>
                  <div><div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#c41e3a' }}>130+</div><div style={{ fontSize: '0.7rem', color: '#6a6a6a' }}>Bewertungen</div></div>
                  <div><div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#c41e3a' }}>4.8</div><div style={{ fontSize: '0.7rem', color: '#6a6a6a' }}>Sterne</div></div>
                  <div><div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#c41e3a' }}>30-45</div><div style={{ fontSize: '0.7rem', color: '#6a6a6a' }}>Min. Lieferzeit</div></div>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 16, color: textColor }}>Unsere Meisterstücke</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {highlights.map(product => (
                  <div key={product.id} style={{ background: cardBg, borderRadius: 20, padding: 16, border: `1px solid ${borderColor}`, transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4, color: textColor }}>{product.name}</div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#c41e3a', marginBottom: 12 }}>{product.price.toFixed(2)} €</div>
                    <button onClick={() => addToCart(product)} style={{ width: '100%', padding: 10, background: darkMode ? '#3a3a3c' : '#f5f5f7', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 500, color: textColor }} onMouseEnter={e => e.currentTarget.style.background = darkMode ? '#4a4a4c' : '#e8e8ed'} onMouseLeave={e => e.currentTarget.style.background = darkMode ? '#3a3a3c' : '#f5f5f7'}>In den Warenkorb</button>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setActiveTab('menu')} style={{ width: '100%', padding: 14, background: '#c41e3a', color: 'white', border: 'none', borderRadius: 40, fontWeight: 600, cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = '#a31a2f'} onMouseLeave={e => e.currentTarget.style.background = '#c41e3a'}>Zur kompletten Speisekarte →</button>
          </div>
        )}

        {/* MENU TAB */}
        {activeTab === 'menu' && !showCheckout && (
          <div>
            <div style={{ marginBottom: 24, background: darkMode ? '#3a3a3c' : '#f5f5f7', borderRadius: 30, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={textSecondary} strokeWidth="2"><circle cx="10" cy="10" r="7"/><line x1="21" y1="21" x2="15" y2="15"/></svg>
              <input type="text" placeholder="Suchen..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, border: 'none', background: 'none', fontSize: '0.875rem', outline: 'none', color: textColor }} />
            </div>

            <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', marginBottom: 24, paddingBottom: 8 }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ padding: '8px 20px', background: selectedCategory === cat ? '#c41e3a' : 'transparent', border: selectedCategory === cat ? 'none' : `1px solid ${borderColor}`, borderRadius: 30, fontSize: '0.875rem', fontWeight: 500, color: selectedCategory === cat ? 'white' : textColor, marginRight: 10, cursor: 'pointer' }}>{cat}</button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {filteredProducts.map(product => (
                <div key={product.id} style={{ background: cardBg, borderRadius: 16, padding: 16, border: `1px solid ${borderColor}` }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ fontWeight: 600, marginBottom: 4, color: textColor }}>{product.name}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#c41e3a', marginBottom: 8 }}>{product.price.toFixed(2)} €</div>
                  {product.ingredients && <div style={{ fontSize: '0.7rem', color: textSecondary, marginBottom: 12, lineHeight: 1.4 }}>{product.ingredients.slice(0, 3).join(' · ')}</div>}
                  <button onClick={() => addToCart(product)} style={{ width: '100%', padding: 10, background: darkMode ? '#3a3a3c' : '#f5f5f7', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 500, color: textColor }} onMouseEnter={e => e.currentTarget.style.background = darkMode ? '#4a4a4c' : '#e8e8ed'} onMouseLeave={e => e.currentTarget.style.background = darkMode ? '#3a3a3c' : '#f5f5f7'}>In den Warenkorb</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CART TAB - gekürzt */}
        {activeTab === 'cart' && !showCheckout && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 16, color: textColor }}>Ihr Warenkorb</h2>
            <div style={{ background: darkMode ? '#3a2a2a' : '#fef5f0', borderLeft: '4px solid #c41e3a', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c41e3a" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <div>
                  <strong style={{ color: '#c41e3a' }}>Aktuell nur telefonische Bestellungen</strong>
                  <div style={{ fontSize: '0.875rem', color: textSecondary, marginTop: 4 }}>Bitte rufen Sie uns an unter <strong style={{ color: '#c41e3a' }}>023 39 / 91 16 727</strong></div>
                </div>
              </div>
            </div>
            <div style={{ background: darkMode ? '#2a3a2a' : '#e8f5e9', borderRadius: 12, padding: 12, marginBottom: 20, textAlign: 'center' }}>
              <span style={{ fontSize: '0.813rem', color: '#2e7d32' }}>🚚 Lieferung frei Haus ab 10€ Bestellwert</span>
            </div>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: cardBg, borderRadius: 24, border: `1px solid ${borderColor}` }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🛒</div>
                <p style={{ color: textSecondary }}>Ihr Warenkorb ist leer</p>
                <button onClick={() => setActiveTab('menu')} style={{ marginTop: 16, padding: '10px 20px', background: '#c41e3a', color: 'white', border: 'none', borderRadius: 30, cursor: 'pointer' }}>Zur Speisekarte</button>
              </div>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: cardBg, borderRadius: 16, padding: 16, marginBottom: 8, border: `1px solid ${borderColor}` }}>
                    <div><div style={{ fontWeight: 600, color: textColor }}>{item.name}</div><div style={{ color: '#c41e3a', fontSize: '0.875rem' }}>{item.price.toFixed(2)} €</div></div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <button onClick={() => removeFromCart(item.id)} style={{ width: 32, height: 32, borderRadius: 10, background: darkMode ? '#3a3a3c' : '#f5f5f7', border: 'none', cursor: 'pointer', fontSize: '1.125rem', color: textColor }}>−</button>
                      <span style={{ minWidth: 24, textAlign: 'center', color: textColor }}>{item.quantity}</span>
                      <button onClick={() => addToCart(item)} style={{ width: 32, height: 32, borderRadius: 10, background: darkMode ? '#3a3a3c' : '#f5f5f7', border: 'none', cursor: 'pointer', fontSize: '1.125rem', color: textColor }}>+</button>
                    </div>
                  </div>
                ))}
                <div style={{ background: cardBg, borderRadius: 20, padding: 20, marginTop: 16, border: `1px solid ${borderColor}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.125rem', marginBottom: 16, color: textColor }}><span>Gesamt</span><span style={{ color: '#c41e3a' }}>{totalPrice.toFixed(2)} €</span></div>
                  {totalPrice < 10 && <div style={{ background: darkMode ? '#3a2a2a' : '#fff3e0', borderRadius: 12, padding: 12, marginBottom: 16, textAlign: 'center' }}><span style={{ fontSize: '0.75rem', color: '#e65100' }}>⚠️ Mindestbestellwert 10€ für Lieferung. Aktuell fehlen {(10 - totalPrice).toFixed(2)} €</span></div>}
                  <button onClick={() => setShowCheckout(true)} disabled={totalPrice < 10} style={{ width: '100%', padding: 14, background: '#c41e3a', color: 'white', border: 'none', borderRadius: 12, fontWeight: 600, cursor: totalPrice >= 10 ? 'pointer' : 'not-allowed', opacity: totalPrice >= 10 ? 1 : 0.5 }}>Weiter zur Kasse{totalPrice < 10 ? ` (${(10 - totalPrice).toFixed(2)} € fehlen)` : ''}</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* CHECKOUT */}
        {showCheckout && (
          <div style={{ background: cardBg, borderRadius: 24, padding: 24, border: `1px solid ${borderColor}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: textColor }}>Ihre Daten</h2>
              <button onClick={() => setShowCheckout(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: textColor }}>✕</button>
            </div>
            <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: textSecondary, marginBottom: 6 }}>Name *</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ihr vollständiger Name" style={{ width: '100%', padding: 12, border: `1px solid ${borderColor}`, borderRadius: 12, fontSize: '0.875rem', background: darkMode ? '#3a3a3c' : 'white', color: textColor }} /></div>
            <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: textSecondary, marginBottom: 6 }}>Telefon *</label><input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Für Rückfragen" style={{ width: '100%', padding: 12, border: `1px solid ${borderColor}`, borderRadius: 12, fontSize: '0.875rem', background: darkMode ? '#3a3a3c' : 'white', color: textColor }} /></div>
            <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: textSecondary, marginBottom: 6 }}>Adresse</label><input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Straße, Hausnummer, PLZ, Ort" style={{ width: '100%', padding: 12, border: `1px solid ${borderColor}`, borderRadius: 12, fontSize: '0.875rem', background: darkMode ? '#3a3a3c' : 'white', color: textColor }} /></div>
            <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: textSecondary, marginBottom: 6 }}>Lieferung / Abholung</label><select value={deliveryMethod} onChange={e => setDeliveryMethod(e.target.value)} style={{ width: '100%', padding: 12, border: `1px solid ${borderColor}`, borderRadius: 12, fontSize: '0.875rem', background: darkMode ? '#3a3a3c' : 'white', color: textColor }}><option value="delivery">Lieferung (frei Haus ab 10€)</option><option value="pickup">Selbstabholung</option></select></div>
            <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: textSecondary, marginBottom: 6 }}>Zahlungsmethode</label><select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{ width: '100%', padding: 12, border: `1px solid ${borderColor}`, borderRadius: 12, fontSize: '0.875rem', background: darkMode ? '#3a3a3c' : 'white', color: textColor }}><option value="cash">Bar bei Lieferung</option><option value="card">Karte vor Ort</option></select></div>
            <div style={{ marginBottom: 24 }}><label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: textSecondary, marginBottom: 6 }}>Anmerkungen</label><textarea rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Allergien, Wünsche, etc." style={{ width: '100%', padding: 12, border: `1px solid ${borderColor}`, borderRadius: 12, fontSize: '0.875rem', fontFamily: 'inherit', background: darkMode ? '#3a3a3c' : 'white', color: textColor }} /></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.125rem', marginBottom: 16, color: textColor }}><span>Gesamt</span><span style={{ color: '#c41e3a' }}>{totalPrice.toFixed(2)} €</span></div>
            <button onClick={submitOrder} disabled={!form.name || !form.phone} style={{ width: '100%', padding: 14, background: '#c41e3a', color: 'white', border: 'none', borderRadius: 12, fontWeight: 600, cursor: (!form.name || !form.phone) ? 'not-allowed' : 'pointer', opacity: (!form.name || !form.phone) ? 0.5 : 1 }}>Jetzt bestellen</button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ background: darkMode ? '#1c1c1e' : '#f5f5f7', padding: '48px 24px 32px', marginTop: 60, borderTop: `0.5px solid ${borderColor}`, textAlign: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap', marginBottom: 32 }}>
            <div><div style={{ fontSize: '0.7rem', color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Adresse</div><div style={{ fontSize: '0.875rem', color: textColor }}>Gewölbeger Straße 28, 45549 Sprockhövel</div></div>
            <div><div style={{ fontSize: '0.7rem', color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Telefon</div><div style={{ fontSize: '0.875rem', color: textColor }}>023 39 / 91 16 727</div></div>
            <div><div style={{ fontSize: '0.7rem', color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Öffnungszeiten</div><div style={{ fontSize: '0.875rem', color: textColor }}>Täglich 11:00 - 22:00 Uhr</div></div>
            <div><div style={{ fontSize: '0.7rem', color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Lieferung</div><div style={{ fontSize: '0.875rem', color: textColor }}>Frei Haus ab 10€</div></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
            <a href="#" style={{ fontSize: '0.75rem', color: textSecondary, textDecoration: 'none' }}>Impressum</a><span style={{ color: textSecondary }}>|</span>
            <a href="#" style={{ fontSize: '0.75rem', color: textSecondary, textDecoration: 'none' }}>Datenschutz</a><span style={{ color: textSecondary }}>|</span>
            <a href="#" style={{ fontSize: '0.75rem', color: textSecondary, textDecoration: 'none' }}>AGB</a>
          </div>
          <div style={{ fontSize: '0.75rem', color: textSecondary, paddingTop: 24, borderTop: `0.5px solid ${borderColor}` }}>© 2024 Pizzeria Napoli. Alle Rechte vorbehalten.</div>
        </div>
      </footer>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
          <div style={{ background: cardBg, borderRadius: 28, padding: 32, maxWidth: 320, textAlign: 'center' }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#c41e3a" strokeWidth="2" style={{ margin: '0 auto 16px' }}><path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 8, color: textColor }}>Bestellung erhalten!</h4>
            <p style={{ color: textSecondary, marginBottom: 24 }}>Ihre Bestellnummer: <strong style={{ color: '#c41e3a' }}>#{orderNumber}</strong></p>
            <button onClick={() => setShowConfirm(false)} style={{ padding: '10px 24px', background: '#c41e3a', color: 'white', border: 'none', borderRadius: 40, cursor: 'pointer', fontWeight: 500 }}>Weiter shoppen</button>
          </div>
        </div>
      )}
    </div>
  );
}
