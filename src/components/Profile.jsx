import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box, Container, Typography, Avatar, Button, TextField,
    Grid, Tabs, Tab, Chip, Divider, IconButton,
    ResponsivePaper,
    List, ListItem, ListItemText, ListItemAvatar, Badge,
    LinearProgress, Tooltip, useMediaQuery, useTheme,
    CircularProgress
} from '@mui/material';
import {
    EditOutlined,
    ShoppingBagOutlined,
    FavoriteBorderOutlined,
    LocationOnOutlined,
    LockOutlined,
    NotificationsNoneOutlined,
    LogoutOutlined,
    CameraAltOutlined,
    CheckCircleOutlined,
    LocalShippingOutlined,
    VerifiedUserOutlined,
    StarOutlined,
    AddOutlined,
    DeleteOutlineOutlined,
    HomeOutlined,
    WorkOutlined
} from '@mui/icons-material';
import api from '../api/config';

const GREEN = '#064E3B';
const GREEN_LIGHT = '#ECFDF5';
const GREEN_MID = '#D1FAE5';

// ─── Mock Data (kept for layout) ──────────────────────────────────────────────
const mockUserDefault = {
    name: 'Customer',
    email: '',
    phone: '',
    avatar: null,
    joinDate: 'Member since ...',
    tier: 'Gold',
    points: 0,
    nextTier: 2000,
    totalOrders: 0,
    totalSpent: '₹0',
};

const mockOrders = [
    { id: '#EC-8821', date: 'Apr 18, 2025', status: 'Delivered', items: 'Elixir Hair Oil × 2', total: '₹1,298', color: '#10B981' },
    { id: '#EC-8744', date: 'Apr 02, 2025', status: 'In Transit', items: 'Magic Beauty Face Oil × 1', total: '₹799', color: '#F59E0B' },
    { id: '#EC-8601', date: 'Mar 14, 2025', status: 'Delivered', items: 'Pure Aloe Vera Gel × 3', total: '₹1,350', color: '#10B981' },
    { id: '#EC-8500', date: 'Feb 28, 2025', status: 'Delivered', items: 'Rose Hip Serum × 1', total: '₹950', color: '#10B981' },
];

const mockWishlist = [
    { name: 'Kumkumadi Facial Oil', price: '₹1,199', tag: 'Bestseller' },
    { name: 'Neem & Tulsi Face Wash', price: '₹399', tag: 'New' },
    { name: 'Brahmi Hair Serum', price: '₹649', tag: null },
];

const mockAddresses = [
    { type: 'Home', icon: <HomeOutlined />, address: '12, Poes Garden, Chennai - 600086, Tamil Nadu', default: true },
    { type: 'Work', icon: <WorkOutlined />, address: '45, Anna Salai, Teynampet, Chennai - 600018, Tamil Nadu', default: false },
];

// ─── Tab Panel ────────────────────────────────────────────────────────────────
function TabPanel({ value, index, children }) {
    return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

// ─── Tier Badge ───────────────────────────────────────────────────────────────
const tierColors = { Gold: ['#F59E0B', '#FEF3C7'], Silver: ['#9CA3AF', '#F3F4F6'], Platinum: ['#7C3AED', '#EDE9FE'] };

export default function Profile({ onLogout }) {
    const theme = useTheme();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [tab, setTab] = useState(location.state?.tab || 0);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (location.state?.tab !== undefined) {
            setTab(location.state.tab);
        }
    }, [location.state]);
    const [user, setUser] = useState(mockUserDefault);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '' });

    useEffect(() => {
        fetchProfile();
        fetchOrders();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/user');
            setUser({
                ...mockUserDefault,
                ...res.data,
                joinDate: `Member since ${new Date(res.data.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`
            });
            setForm({
                name: res.data.name || '',
                email: res.data.email || '',
                phone: res.data.phone || ''
            });
        } catch (err) {
            console.error('Failed to fetch profile', err);
        }
    };

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const res = await api.get('/orders');
            setOrders(res.data.orders);
        } catch (err) {
            console.error('Failed to fetch orders', err);
        } finally {
            setLoadingOrders(false);
        }
    };

    const tierColor = tierColors[user.tier] || tierColors.Gold;
    const progressPct = Math.min((user.points / user.nextTier) * 100, 100);

    const fieldSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '&:hover fieldset': { borderColor: GREEN },
            '&.Mui-focused fieldset': { borderColor: GREEN },
        },
        '& .MuiInputLabel-root.Mui-focused': { color: GREEN },
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAF9', pt: { xs: 10, md: 14 }, pb: 8 }}>
            <Container maxWidth="lg">

                {/* ── Hero Card ── */}
                <ResponsivePaper
                    elevation={0}
                    sx={{
                        borderRadius: 5, overflow: 'hidden', mb: 4,
                        border: '1px solid rgba(0,0,0,0.06)',
                        background: `linear-gradient(135deg, ${GREEN} 0%, #0A6B52 60%, #0D7A5F 100%)`,
                    }}
                >
                    <Box sx={{ px: { xs: 3, md: 5 }, py: { xs: 4, md: 5 }, display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 3, position: 'relative', overflow: 'hidden' }}>
                        {/* BG decoration */}
                        <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />
                        <Box sx={{ position: 'absolute', bottom: -60, right: 80, width: 150, height: 150, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />

                        {/* Avatar */}
                        <Badge
                            overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                                <IconButton size="small" sx={{ bgcolor: '#fff', width: 30, height: 30, boxShadow: '0 2px 8px rgba(0,0,0,0.2)', '&:hover': { bgcolor: '#f0f0f0' } }}>
                                    <CameraAltOutlined sx={{ fontSize: 14, color: GREEN }} />
                                </IconButton>
                            }
                        >
                            <Avatar
                                sx={{
                                    width: { xs: 72, md: 88 }, height: { xs: 72, md: 88 },
                                    bgcolor: 'rgba(255,255,255,0.2)', fontSize: { xs: '1.6rem', md: '2rem' },
                                    fontWeight: 900, border: '3px solid rgba(255,255,255,0.4)',
                                    color: '#fff', fontFamily: "'Playfair Display', serif"
                                }}
                            >
                                {user.name.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                        </Badge>

                        {/* Info */}
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.5 }}>
                                <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff', fontFamily: "'Playfair Display', serif", fontSize: { xs: '1.3rem', md: '1.6rem' } }}>
                                    {user.name}
                                </Typography>
                                <Chip
                                    label={user.tier}
                                    size="small"
                                    sx={{ bgcolor: tierColor[1], color: tierColor[0], fontWeight: 900, fontSize: '0.65rem', px: 0.5 }}
                                    icon={<StarOutlined sx={{ fontSize: '12px !important', color: `${tierColor[0]} !important` }} />}
                                />
                            </Box>
                            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', mb: 2 }}>{user.joinDate}</Typography>

                            {/* Points progress */}
                            <Box sx={{ maxWidth: 320 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem', fontWeight: 700 }}>
                                        {user.points} pts
                                    </Typography>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>
                                        {user.nextTier} pts for Platinum
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate" value={progressPct}
                                    sx={{
                                        height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.15)',
                                        '& .MuiLinearProgress-bar': { bgcolor: '#FCD34D', borderRadius: 3 }
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Stats */}
                        <Box sx={{ display: 'flex', gap: { xs: 3, md: 4 }, mr: { md: 2 } }}>
                            {[{ label: 'Orders', value: orders.length }, { label: 'Spent', value: user.totalSpent }].map((s) => (
                                <Box key={s.label} sx={{ textAlign: 'center' }}>
                                    <Typography sx={{ fontWeight: 900, color: '#fff', fontSize: { xs: '1.3rem', md: '1.6rem' } }}>{s.value}</Typography>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </ResponsivePaper>

                {/* ── Main Content ── */}
                <Grid container spacing={3}>
                    {/* Sidebar (desktop) */}
                    {!isMobile && (
                        <Grid item xs={12} md={3}>
                            <ResponsivePaper elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden', position: 'sticky', top: 100 }}>
                                {[
                                    { label: 'My Profile', icon: <VerifiedUserOutlined />, idx: 0 },
                                    { label: 'My Orders', icon: <ShoppingBagOutlined />, idx: 1 },
                                    { label: 'Wishlist', icon: <FavoriteBorderOutlined />, idx: 2 },
                                    { label: 'Addresses', icon: <LocationOnOutlined />, idx: 3 },
                                    { label: 'Security', icon: <LockOutlined />, idx: 4 },
                                ].map((item) => (
                                    <Box
                                        key={item.label}
                                        onClick={() => setTab(item.idx)}
                                        sx={{
                                            display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 2,
                                            cursor: 'pointer', borderLeft: tab === item.idx ? `3px solid ${GREEN}` : '3px solid transparent',
                                            bgcolor: tab === item.idx ? GREEN_LIGHT : 'transparent',
                                            transition: 'all 0.2s',
                                            '&:hover': { bgcolor: tab === item.idx ? GREEN_LIGHT : '#F9FAFB' }
                                        }}
                                    >
                                        <Box sx={{ color: tab === item.idx ? GREEN : '#9CA3AF', display: 'flex' }}>{item.icon}</Box>
                                        <Typography sx={{ fontWeight: tab === item.idx ? 800 : 600, color: tab === item.idx ? GREEN : '#374151', fontSize: '0.88rem' }}>
                                            {item.label}
                                        </Typography>
                                    </Box>
                                ))}
                                <Divider />
                                <Box
                                    onClick={onLogout}
                                    sx={{
                                        display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 2.5,
                                        cursor: 'pointer', color: '#EF4444',
                                        '&:hover': { bgcolor: '#FEF2F2' }, transition: 'all 0.2s'
                                    }}
                                >
                                    <LogoutOutlined sx={{ fontSize: 20 }} />
                                    <Typography sx={{ fontWeight: 700, fontSize: '0.88rem' }}>Sign Out</Typography>
                                </Box>
                            </ResponsivePaper>
                        </Grid>
                    )}

                    {/* Mobile Tabs */}
                    {isMobile && (
                        <Grid item xs={12}>
                            <Tabs
                                value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto"
                                sx={{
                                    bgcolor: '#fff', borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', px: 1,
                                    '& .MuiTab-root': { fontWeight: 700, fontSize: '0.75rem', minWidth: 'auto', textTransform: 'none' },
                                    '& .Mui-selected': { color: GREEN },
                                    '& .MuiTabs-indicator': { bgcolor: GREEN }
                                }}
                            >
                                {['Profile', 'Orders', 'Wishlist', 'Addresses', 'Security'].map(l => <Tab key={l} label={l} />)}
                            </Tabs>
                        </Grid>
                    )}

                    {/* Content */}
                    <Grid item xs={12} md={9}>
                        <ResponsivePaper elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.06)', p: { xs: 3, md: 4 } }}>

                            {/* ── Tab 0: Profile ── */}
                            <TabPanel value={tab} index={0}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 900, fontFamily: "'Playfair Display', serif" }}>Personal Information</Typography>
                                    <Button
                                        onClick={() => setEditing(!editing)}
                                        startIcon={editing ? <CheckCircleOutlined /> : <EditOutlined />}
                                        variant={editing ? 'contained' : 'outlined'}
                                        sx={{
                                            borderRadius: 2, textTransform: 'none', fontWeight: 800, fontSize: '0.8rem',
                                            borderColor: GREEN, color: editing ? '#fff' : GREEN, bgcolor: editing ? GREEN : 'transparent',
                                            '&:hover': { bgcolor: editing ? '#043A2C' : GREEN_LIGHT, borderColor: GREEN }
                                        }}
                                    >
                                        {editing ? 'Save Changes' : 'Edit Profile'}
                                    </Button>
                                </Box>

                                <Grid container spacing={2.5}>
                                    {[
                                        { label: 'Full Name', key: 'name', type: 'text' },
                                        { label: 'Email Address', key: 'email', type: 'email' },
                                        { label: 'Phone Number', key: 'phone', type: 'tel' },
                                    ].map(field => (
                                        <Grid item xs={12} sm={6} key={field.key}>
                                            <TextField
                                                fullWidth label={field.label} type={field.type}
                                                value={form[field.key]}
                                                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                                disabled={!editing}
                                                size="small" sx={fieldSx}
                                                variant="outlined"
                                            />
                                        </Grid>
                                    ))}
                                </Grid>

                                <Divider sx={{ my: 4 }} />
                                <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, fontFamily: "'Playfair Display', serif" }}>Loyalty Rewards</Typography>
                                <Box sx={{ bgcolor: GREEN_LIGHT, borderRadius: 3, p: 3, border: `1px solid ${GREEN_MID}` }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Box>
                                            <Typography sx={{ fontWeight: 900, color: GREEN, fontSize: '1.4rem' }}>{mockUser.points}</Typography>
                                            <Typography sx={{ color: '#6B7280', fontSize: '0.78rem' }}>Botanical Points</Typography>
                                        </Box>
                                        <Chip label={`${mockUser.tier} Member`} sx={{ bgcolor: tierColor[1], color: tierColor[0], fontWeight: 900 }}
                                            icon={<StarOutlined sx={{ fontSize: '14px !important', color: `${tierColor[0]} !important` }} />} />
                                    </Box>
                                    <LinearProgress variant="determinate" value={progressPct}
                                        sx={{ height: 8, borderRadius: 4, bgcolor: GREEN_MID, '& .MuiLinearProgress-bar': { bgcolor: GREEN, borderRadius: 4 } }} />
                                    <Typography sx={{ mt: 1, fontSize: '0.72rem', color: '#6B7280' }}>
                                        {mockUser.nextTier - mockUser.points} more points to reach Platinum tier
                                    </Typography>
                                </Box>
                            </TabPanel>

                            {/* ── Tab 1: Orders ── */}
                            <TabPanel value={tab} index={1}>
                                <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, fontFamily: "'Playfair Display', serif" }}>My Orders</Typography>
                                
                                {loadingOrders ? (
                                    <Box sx={{ py: 10, textAlign: 'center' }}>
                                        <CircularProgress sx={{ color: GREEN }} />
                                        <Typography sx={{ mt: 2, color: '#6B7280', fontSize: '0.85rem' }}>Retrieving your rituals...</Typography>
                                    </Box>
                                ) : orders.length > 0 ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {orders.map(order => {
                                            const statusColors = {
                                                paid: { color: '#10B981', label: 'Confirmed' },
                                                pending: { color: '#F59E0B', label: 'Processing' },
                                                failed: { color: '#EF4444', label: 'Payment Failed' },
                                                delivered: { color: '#064E3B', label: 'Delivered' }
                                            };
                                            const cfg = statusColors[order.status] || { color: '#6B7280', label: order.status };
                                            
                                            return (
                                                <Box key={order.id} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', '&:hover': { borderColor: GREEN, bgcolor: GREEN_LIGHT }, transition: 'all 0.2s' }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                                                        <Box>
                                                            <Typography sx={{ fontWeight: 900, fontSize: '0.9rem' }}>#{order.order_number}</Typography>
                                                            <Typography sx={{ color: '#9CA3AF', fontSize: '0.75rem', mt: 0.3 }}>
                                                                {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </Typography>
                                                            <Typography sx={{ fontSize: '0.82rem', mt: 1, color: '#374151', fontWeight: 600 }}>
                                                                {order.items.map(item => `${item.product?.name} × ${item.quantity}`).join(', ')}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ textAlign: 'right' }}>
                                                            <Chip 
                                                                label={cfg.label} 
                                                                size="small" 
                                                                sx={{ bgcolor: `${cfg.color}18`, color: cfg.color, fontWeight: 800, fontSize: '0.72rem', mb: 0.5, textTransform: 'capitalize' }} 
                                                            />
                                                            <Typography sx={{ fontWeight: 900, color: GREEN, display: 'block' }}>
                                                                ₹{Number(order.total).toLocaleString('en-IN')}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                ) : (
                                    <Box sx={{ py: 10, textAlign: 'center', bgcolor: '#fff', borderRadius: 4, border: '1px dashed rgba(0,0,0,0.1)' }}>
                                        <ShoppingBagOutlined sx={{ fontSize: 48, color: '#D1D5DB', mb: 2 }} />
                                        <Typography sx={{ fontWeight: 700, color: '#374151' }}>No rituals yet</Typography>
                                        <Typography variant="body2" sx={{ color: '#6B7280', mt: 0.5 }}>Your journey into botanical wellness begins with your first order.</Typography>
                                        <Button 
                                            variant="contained" 
                                            size="small"
                                            onClick={() => window.location.href = '/shop'}
                                            sx={{ mt: 3, bgcolor: GREEN, borderRadius: 2, textTransform: 'none', px: 3 }}
                                        >
                                            Start Shopping
                                        </Button>
                                    </Box>
                                )}
                            </TabPanel>

                            {/* ── Tab 2: Wishlist ── */}
                            <TabPanel value={tab} index={2}>
                                <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, fontFamily: "'Playfair Display', serif" }}>Saved Items</Typography>
                                <Grid container spacing={2}>
                                    {mockWishlist.map(item => (
                                        <Grid item xs={12} sm={6} md={4} key={item.name}>
                                            <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', textAlign: 'center', '&:hover': { borderColor: GREEN, transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(6,78,59,0.08)' }, transition: 'all 0.25s' }}>
                                                <Box sx={{ width: 60, height: 60, borderRadius: 3, bgcolor: GREEN_LIGHT, mx: 'auto', mb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <FavoriteBorderOutlined sx={{ color: GREEN, fontSize: 22 }} />
                                                </Box>
                                                {item.tag && <Chip label={item.tag} size="small" sx={{ bgcolor: GREEN, color: '#fff', fontWeight: 800, fontSize: '0.6rem', mb: 1 }} />}
                                                <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 0.5 }}>{item.name}</Typography>
                                                <Typography sx={{ color: GREEN, fontWeight: 900, mb: 1.5 }}>{item.price}</Typography>
                                                <Button fullWidth variant="contained" size="small"
                                                    sx={{ bgcolor: GREEN, borderRadius: 2, textTransform: 'none', fontWeight: 800, fontSize: '0.75rem', '&:hover': { bgcolor: '#043A2C' } }}>
                                                    Add to Cart
                                                </Button>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </TabPanel>

                            {/* ── Tab 3: Addresses ── */}
                            <TabPanel value={tab} index={3}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 900, fontFamily: "'Playfair Display', serif" }}>Saved Addresses</Typography>
                                    <Button startIcon={<AddOutlined />} variant="outlined" size="small"
                                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 800, borderColor: GREEN, color: GREEN, '&:hover': { bgcolor: GREEN_LIGHT, borderColor: GREEN } }}>
                                        Add New
                                    </Button>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {mockAddresses.map(addr => (
                                        <Box key={addr.type} sx={{ p: 3, borderRadius: 3, border: addr.default ? `1.5px solid ${GREEN}` : '1px solid rgba(0,0,0,0.08)', bgcolor: addr.default ? GREEN_LIGHT : '#fff', position: 'relative' }}>
                                            {addr.default && <Chip label="Default" size="small" sx={{ position: 'absolute', top: 12, right: 12, bgcolor: GREEN, color: '#fff', fontWeight: 800, fontSize: '0.65rem' }} />}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                                <Box sx={{ color: GREEN, display: 'flex' }}>{addr.icon}</Box>
                                                <Typography sx={{ fontWeight: 900, fontSize: '0.88rem' }}>{addr.type}</Typography>
                                            </Box>
                                            <Typography sx={{ color: '#4B5563', fontSize: '0.82rem', lineHeight: 1.6 }}>{addr.address}</Typography>
                                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                                <Button size="small" startIcon={<EditOutlined sx={{ fontSize: 14 }} />}
                                                    sx={{ textTransform: 'none', fontWeight: 700, color: GREEN, fontSize: '0.75rem', p: 0, minWidth: 0 }}>Edit</Button>
                                                {!addr.default && (
                                                    <Button size="small" startIcon={<DeleteOutlineOutlined sx={{ fontSize: 14 }} />}
                                                        sx={{ textTransform: 'none', fontWeight: 700, color: '#EF4444', fontSize: '0.75rem', p: 0, minWidth: 0 }}>Delete</Button>
                                                )}
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </TabPanel>

                            {/* ── Tab 4: Security ── */}
                            <TabPanel value={tab} index={4}>
                                <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, fontFamily: "'Playfair Display', serif" }}>Security Settings</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Box sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
                                        <Typography sx={{ fontWeight: 800, mb: 0.5 }}>Change Password</Typography>
                                        <Typography sx={{ color: '#9CA3AF', fontSize: '0.78rem', mb: 2 }}>Ensure your account is safe with a strong password.</Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxWidth: 380 }}>
                                            {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                                                <TextField key={label} label={label} type="password" size="small" fullWidth sx={fieldSx} />
                                            ))}
                                            <Button variant="contained" sx={{ mt: 1, bgcolor: GREEN, borderRadius: 2, textTransform: 'none', fontWeight: 800, alignSelf: 'flex-start', px: 3, '&:hover': { bgcolor: '#043A2C' } }}>
                                                Update Password
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </TabPanel>

                        </ResponsivePaper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
