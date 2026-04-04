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
    const matchesSearch = searchQuery === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
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
      return prev.map(item =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
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
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
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

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Lade Speisekarte...</div>;
  }

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, sans-serif', background: bgColor, color: textColor, minHeight: '100vh', transition: 'all 0.3s ease' }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, background: headerBg, backdropFilter: 'blur(20px)', borderBottom: `0.5px solid ${borderColor}`, zIndex: 100, padding: '12px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.3px', background: 'linear-gradient(135deg, #c41e3a, #8b1a2b)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Pizzeria Napoli</h1>
            <p style={{ fontSize: '0.7rem', color: textSecondary }}>Gevelsberger Str. 28, 45549 Sprockhövel</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Dark Mode Button mit SVG Icons */}
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              style={{ 
                background: darkMode ? '#3a3a3c' : '#e8e8ed', 
                border: 'none', 
                cursor: 'pointer', 
                padding: '8px', 
                borderRadius: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                width: '36px',
                height: '36px'
              }}
              title={darkMode ? 'Hellmodus' : 'Dunkelmodus'}
            >
              {darkMode ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>023 39 / 91 16 727</div>
              <div style={{ fontSize: '0.7rem', color: textSecondary }}>Täglich 11:00 - 22:00 Uhr</div>
            </div>
          </div>
        </div>
      </header>

      {/* Öffnungszeiten-Banner */}
      <div style={{ background: (() => { const hours = new Date().getHours(); return hours >= 11 && hours < 22; })() ? '#e8f5e9' : '#ffebee', padding: '8px 16px', textAlign: 'center', fontSize: '0.813rem', borderBottom: `0.5px solid ${borderColor}` }}>
        <span style={{ color: (() => { const hours = new Date().getHours(); return hours >= 11 && hours < 22; })() ? '#2e7d32' : '#c62828' }}>
          {(new Date().getHours() >= 11 && new Date().getHours() < 22) ? '✓ Jetzt geöffnet' : '✗ Derzeit geschlossen (11:00 - 22:00 Uhr)'}
        </span>
      </div>

      {/* Tab Navigation */}
      <div style={{ background: headerBg, backdropFilter: 'blur(10px)', borderBottom: `0.5px solid ${borderColor}`, padding: '8px 16px', position: 'sticky', top: '72px', zIndex: 99 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 8, background: darkMode ? '#3a3a3c' : '#f5f5f7', padding: 4, borderRadius: 40 }}>
            <button onClick={() => setActiveTab('home')} style={{ flex: 1, padding: '10px 16px', border: 'none', background: activeTab === 'home' ? '#c41e3a' : 'transparent', borderRadius: 32, fontSize: '0.875rem', fontWeight: 500, color: activeTab === 'home' ? 'white' : textSecondary, cursor: 'pointer' }}>Start</button>
            <button onClick={() => setActiveTab('menu')} style={{ flex: 1, padding: '10px 16px', border: 'none', background: activeTab === 'menu' ? '#c41e3a' : 'transparent', borderRadius: 32, fontSize: '0.875rem', fontWeight: 500, color: activeTab === 'menu' ? 'white' : textSecondary, cursor: 'pointer' }}>Speisekarte</button>
            <button onClick={() => setActiveTab('cart')} style={{ flex: 1, padding: '10px 16px', border: 'none', background: activeTab === 'cart' ? '#c41e3a' : 'transparent', borderRadius: 32, fontSize: '0.875rem', fontWeight: 500, color: activeTab === 'cart' ? 'white' : textSecondary, cursor: 'pointer' }}>Warenkorb{itemCount > 0 ? ` (${itemCount})` : ''}</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        {activeTab === 'home' && !showCheckout && (
          <div>
            <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderRadius: 28, marginBottom: 32, overflow: 'hidden', textAlign: 'center', padding: '48px 24px' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', marginBottom: 16 }}>Pizzeria Napoli</h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', marginBottom: 24 }}>Authentische italienische Küche · Handgemachte Pizzen</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 32 }}>
                <div><div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffd700' }}>130+</div><div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>Bewertungen</div></div>
                <div><div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffd700' }}>4.8</div><div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>Sterne</div></div>
                <div><div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffd700' }}>30-45</div><div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>Min. Lieferzeit</div></div>
              </div>
            </div>

            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 16, color: textColor }}>Unsere Meisterstücke</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {products.slice(0, 4).map(product => (
                  <div key={product.id} style={{ background: cardBg, borderRadius: 20, padding: 16, border: `1px solid ${borderColor}` }}>
                    <div style={{ fontWeight: 600, color: textColor }}>{product.name}</div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#c41e3a', marginBottom: 12 }}>{product.price.toFixed(2)} €</div>
                    <button onClick={() => addToCart(product)} style={{ width: '100%', padding: 10, background: darkMode ? '#3a3a3c' : '#f5f5f7', border: 'none', borderRadius: 12, cursor: 'pointer', color: textColor }}>In den Warenkorb</button>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setActiveTab('menu')} style={{ width: '100%', padding: 14, background: '#c41e3a', color: 'white', border: 'none', borderRadius: 40, fontWeight: 600, cursor: 'pointer' }}>Zur kompletten Speisekarte →</button>
          </div>
        )}

        {activeTab === 'menu' && !showCheckout && (
          <div>
            <div style={{ marginBottom: 24, background: darkMode ? '#3a3a3c' : '#f5f5f7', borderRadius: 30, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🔍</span>
              <input type="text" placeholder="Suchen..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, border: 'none', background: 'none', fontSize: '0.875rem', outline: 'none', color: textColor }} />
            </div>

            <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', marginBottom: 24, paddingBottom: 8 }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ padding: '8px 20px', background: selectedCategory === cat ? '#c41e3a' : 'transparent', border: selectedCategory === cat ? 'none' : `1px solid ${borderColor}`, borderRadius: 30, fontSize: '0.875rem', marginRight: 10, cursor: 'pointer', color: selectedCategory === cat ? 'white' : textColor }}>{cat}</button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {filteredProducts.map(product => (
                <div key={product.id} style={{ background: cardBg, borderRadius: 16, padding: 16, border: `1px solid ${borderColor}` }}>
                  <div style={{ fontWeight: 600, color: textColor }}>{product.name}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#c41e3a', marginBottom: 8 }}>{product.price.toFixed(2)} €</div>
                  {product.ingredients && <div style={{ fontSize: '0.7rem', color: textSecondary, marginBottom: 12 }}>{product.ingredients.slice(0, 3).join(' · ')}</div>}
                  <button onClick={() => addToCart(product)} style={{ width: '100%', padding: 10, background: darkMode ? '#3a3a3c' : '#f5f5f7', border: 'none', borderRadius: 12, cursor: 'pointer', color: textColor }}>In den Warenkorb</button>
                </div>
              ))}
            </div>
          </div>
        )}

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
                      <button onClick={() => removeFromCart(item.id)} style={{ width: 32, height: 32, borderRadius: 10, background: darkMode ? '#3a3a3c' : '#f5f5f7', border: 'none', cursor: 'pointer', color: textColor }}>−</button>
                      <span style={{ minWidth: 24, textAlign: 'center', color: textColor }}>{item.quantity}</span>
                      <button onClick={() => addToCart(item)} style={{ width: 32, height: 32, borderRadius: 10, background: darkMode ? '#3a3a3c' : '#f5f5f7', border: 'none', cursor: 'pointer', color: textColor }}>+</button>
                    </div>
                  </div>
                ))}
                <div style={{ background: cardBg, borderRadius: 20, padding: 20, marginTop: 16, border: `1px solid ${borderColor}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.125rem', marginBottom: 16, color: textColor }}><span>Gesamt</span><span style={{ color: '#c41e3a' }}>{totalPrice.toFixed(2)} €</span></div>
                  {totalPrice < 10 && (
                    <div style={{ background: darkMode ? '#3a2a2a' : '#fff3e0', borderRadius: 12, padding: 12, marginBottom: 16, textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#e65100' }}>⚠️ Mindestbestellwert 10€ für Lieferung. Aktuell fehlen {(10 - totalPrice).toFixed(2)} €</span>
                    </div>
                  )}
                  <button onClick={() => setShowCheckout(true)} disabled={totalPrice < 10} style={{ width: '100%', padding: 14, background: '#c41e3a', color: 'white', border: 'none', borderRadius: 12, fontWeight: 600, cursor: totalPrice >= 10 ? 'pointer' : 'not-allowed', opacity: totalPrice >= 10 ? 1 : 0.5 }}>Weiter zur Kasse{totalPrice < 10 ? ` (${(10 - totalPrice).toFixed(2)} € fehlen)` : ''}</button>
                </div>
              </>
            )}
          </div>
        )}

        {showCheckout && (
          <div style={{ background: cardBg, borderRadius: 24, padding: 24, border: `1px solid ${borderColor}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: textColor }}>Ihre Daten</h2>
              <button onClick={() => setShowCheckout(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: textColor }}>✕</button>
            </div>
            <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: '0.75rem', color: textSecondary, marginBottom: 6 }}>Name *</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ihr Name" style={{ width: '100%', padding: 12, border: `1px solid ${borderColor}`, borderRadius: 12, background: darkMode ? '#3a3a3c' : 'white', color: textColor }} /></div>
            <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: '0.75rem', color: textSecondary, marginBottom: 6 }}>Telefon *</label><input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Ihre Nummer" style={{ width: '100%', padding: 12, border: `1px solid ${borderColor}`, borderRadius: 12, background: darkMode ? '#3a3a3c' : 'white', color: textColor }} /></div>
            <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: '0.75rem', color: textSecondary, marginBottom: 6 }}>Adresse</label><input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Ihre Adresse" style={{ width: '100%', padding: 12, border: `1px solid ${borderColor}`, borderRadius: 12, background: darkMode ? '#3a3a3c' : 'white', color: textColor }} /></div>
            <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: '0.75rem', color: textSecondary, marginBottom: 6 }}>Lieferung</label><select value={deliveryMethod} onChange={e => setDeliveryMethod(e.target.value)} style={{ width: '100%', padding: 12, border: `1px solid ${borderColor}`, borderRadius: 12, background: darkMode ? '#3a3a3c' : 'white', color: textColor }}><option value="delivery">Lieferung</option><option value="pickup">Selbstabholung</option></select></div>
            <div style={{ marginBottom: 24 }}><label style={{ display: 'block', fontSize: '0.75rem', color: textSecondary, marginBottom: 6 }}>Anmerkungen</label><textarea rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Allergien, Wünsche" style={{ width: '100%', padding: 12, border: `1px solid ${borderColor}`, borderRadius: 12, background: darkMode ? '#3a3a3c' : 'white', color: textColor }} /></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.125rem', marginBottom: 16, color: textColor }}>Gesamt: {totalPrice.toFixed(2)} €</div>
            <button onClick={submitOrder} disabled={!form.name || !form.phone} style={{ width: '100%', padding: 14, background: '#c41e3a', color: 'white', border: 'none', borderRadius: 12, fontWeight: 600, cursor: (!form.name || !form.phone) ? 'not-allowed' : 'pointer', opacity: (!form.name || !form.phone) ? 0.5 : 1 }}>Jetzt bestellen</button>
          </div>
        )}
      </div>

      <footer style={{ background: darkMode ? '#1c1c1e' : '#f5f5f7', padding: '48px 24px 32px', marginTop: 60, borderTop: `0.5px solid ${borderColor}`, textAlign: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap', marginBottom: 32 }}>
            <div><div style={{ fontSize: '0.7rem', color: textSecondary }}>Adresse</div><div style={{ fontSize: '0.875rem', color: textColor }}>Gevelsberger Str. 28, 45549 Sprockhövel</div></div>
            <div><div style={{ fontSize: '0.7rem', color: textSecondary }}>Telefon</div><div style={{ fontSize: '0.875rem', color: textColor }}>023 39 / 91 16 727</div></div>
            <div><div style={{ fontSize: '0.7rem', color: textSecondary }}>Öffnungszeiten</div><div style={{ fontSize: '0.875rem', color: textColor }}>Täglich 11:00 - 22:00 Uhr</div></div>
            <div><div style={{ fontSize: '0.7rem', color: textSecondary }}>Lieferung</div><div style={{ fontSize: '0.875rem', color: textColor }}>Frei Haus ab 10€</div></div>
          </div>
          <div style={{ fontSize: '0.75rem', color: textSecondary, paddingTop: 24, borderTop: `0.5px solid ${borderColor}` }}>© 2024 Pizzeria Napoli. Alle Rechte vorbehalten.</div>
        </div>
      </footer>

      {showConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
          <div style={{ background: cardBg, borderRadius: 28, padding: 32, maxWidth: 320, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 8, color: textColor }}>Bestellung erhalten!</h4>
            <p style={{ color: textSecondary, marginBottom: 24 }}>Nr. #{orderNumber}</p>
            <button onClick={() => setShowConfirm(false)} style={{ padding: '10px 24px', background: '#c41e3a', color: 'white', border: 'none', borderRadius: 40, cursor: 'pointer' }}>Weiter</button>
          </div>
        </div>
      )}
    </div>
  );
}
