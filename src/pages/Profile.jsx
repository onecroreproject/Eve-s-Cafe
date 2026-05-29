// Profile.jsx
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
    Box, Container, Typography, Avatar, Button, TextField,
    Grid, Tabs, Tab, Chip, Divider, Paper, IconButton,
    Badge, useMediaQuery, useTheme,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Alert, Snackbar, Fade, Stack, FormControlLabel, Checkbox,
    CircularProgress
} from '@mui/material';
import {
    EditOutlined,
    ShoppingBagOutlined,
    LocationOnOutlined,
    LockOutlined,
    LogoutOutlined,
    CameraAltOutlined,
    CheckCircleOutlined,
    LocalShippingOutlined,
    VerifiedUserOutlined,
    StarOutlined,
    AddOutlined,
    DeleteOutlineOutlined,
    HomeOutlined,
    WorkOutlined,
    Close as CloseIcon,
    ArrowForward as ArrowForwardIcon,
    EmailOutlined,
    PhoneOutlined,
    CalendarTodayOutlined,
    KeyboardArrowDown as ArrowDownIcon,
    Inventory2Outlined as ProcessingIcon,
    LocalShippingOutlined as ShippingIcon,
    CheckCircleOutlineOutlined as DeliveredIcon,
    PendingOutlined as PendingIcon,
    RateReviewOutlined as ReviewIcon,
    CreditCardOutlined as PaymentIcon,
    PrintOutlined as PrintIcon,
    Search as SearchIcon,
    FilterListOutlined as FilterIcon,
    DownloadOutlined as DownloadIcon,
    StarBorderOutlined as StarIcon,
    Star as StarFilledIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    MonetizationOnOutlined as PriceIcon,
} from '@mui/icons-material';
import { 
    Stepper, 
    Step, 
    StepLabel, 
    LinearProgress, 
    CardMedia, 
    CardContent,
    CardActions,
    Card
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/config';

// ─── Olive Green Theme Constants ───────────────────────────────────────────────
const OLIVE_GREEN = '#556B2F';
const OLIVE_GREEN_DARK = '#4A5D23';
const OLIVE_GREEN_LIGHT = '#E8EDE0';
const OLIVE_GREEN_ULTRA = '#F4F7EF';
const CARD_BORDER = '1px solid #E5E7EB';
const BG_GRAY = '#F9FAFB';

// Helpers
function TabPanel({ value, index, children }) {
    return value === index ? <Fade in><Box sx={{ pt: 3 }}>{children}</Box></Fade> : null;
}

const getAddressIcon = (type) => {
    switch (type) {
        case 'Home': return <HomeOutlined />;
        case 'Work': return <WorkOutlined />;
        default: return <LocationOnOutlined />;
    }
};

const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);

// ─── Shared field sx ──────────────────────────────────────────────────────────
const fieldSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        backgroundColor: '#fff',
        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E5E7EB' },
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: OLIVE_GREEN },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: OLIVE_GREEN, borderWidth: '1px' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: OLIVE_GREEN },
};

const TEXT_DARK = '#1F2937';
const TEXT_GRAY = '#6B7280';
const WHITE = '#FFFFFF';

// Order components migrated to MyOrders.jsx

// Order Details Modal migrated to MyOrders.jsx

// ─── Profile Component ─────────────────────────────────────────────────────────
export default function Profile({ onLogout }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const currentUrlTab = searchParams.get('tab');
    const [tab, setTab] = useState(parseInt(currentUrlTab) || 0);
    const [prevUrlTab, setPrevUrlTab] = useState(currentUrlTab);
    const [currentUser, setCurrentUser] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
            setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
        }
        fetchUserData();
        fetchAddresses();
        fetchOrders();
    }, []);

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

    const handleDownloadInvoice = async (orderId, orderNumber) => {
        try {
            const response = await api.get(`/orders/${orderId}/invoice`, {
                responseType: 'blob',
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice-${orderNumber}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Failed to download invoice', err);
            setSnackbar({ open: true, message: 'Failed to download invoice', severity: 'error' });
        }
    };

    const fetchAddresses = async () => {
        try {
            const response = await api.get('/addresses');
            setAddresses(response.data.data);
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    };

    const fetchUserData = async () => {
        try {
            const response = await api.get('/user');
            const user = response.data.data;
            setCurrentUser(user);
            localStorage.setItem('user', JSON.stringify(user));
            setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [addressDialog, setAddressDialog] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '' });
    const [passwordForm, setPasswordForm] = useState({ current_password: '', password: '', password_confirmation: '' });
    const [newAddress, setNewAddress] = useState({ type: 'Home', address: '', phone: '' });

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            const response = await api.post('/user/update', form);
            setCurrentUser(response.data.data);
            localStorage.setItem('user', JSON.stringify(response.data.data));
            setEditing(false);
            setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
            // Dispatch event to update navbar initials if needed, or just let refresh handle it
            window.dispatchEvent(new Event('storage')); 
        } catch (error) {
            console.error("Update profile failed:", error);
            setSnackbar({ open: true, message: error.response?.data?.message || 'Update failed', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/user/update-password', passwordForm);
            setSnackbar({ open: true, message: 'Password updated successfully!', severity: 'success' });
            setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
        } catch (error) {
            console.error("Update password failed:", error);
            
            // Extract specific validation errors if they exist
            const serverErrors = error.response?.data?.errors;
            let errorMessage = error.response?.data?.message || 'Password update failed';
            
            if (serverErrors) {
                const firstErrorKey = Object.keys(serverErrors)[0];
                errorMessage = serverErrors[firstErrorKey][0]; // Show the first validation error
            }
            
            setSnackbar({ open: true, message: errorMessage, severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const [addressFormMode, setAddressFormMode] = useState('add'); // 'add' or 'edit'
    const [editingAddressId, setEditingAddressId] = useState(null);

    const handleOpenAddAddress = () => {
        setAddressFormMode('add');
        setNewAddress({ type: 'Home', address: '', phone: '', is_default: false });
        setAddressDialog(true);
    };

    const handleOpenEditAddress = (addr) => {
        setAddressFormMode('edit');
        setEditingAddressId(addr.id);
        setNewAddress({ type: addr.type, address: addr.address, phone: addr.phone || '', is_default: addr.is_default });
        setAddressDialog(true);
    };

    const handleAddAddress = async () => {
        setLoading(true);
        try {
            if (addressFormMode === 'add') {
                await api.post('/addresses', newAddress);
                setSnackbar({ open: true, message: 'Address added successfully!', severity: 'success' });
            } else {
                await api.put(`/addresses/${editingAddressId}`, newAddress);
                setSnackbar({ open: true, message: 'Address updated successfully!', severity: 'success' });
            }
            fetchAddresses();
            setAddressDialog(false);
        } catch (error) {
            console.error("Address operation failed:", error);
            setSnackbar({ open: true, message: 'Failed to save address', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAddress = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: OLIVE_GREEN,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            customClass: {
                container: 'sweet-alert-container',
            }
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/addresses/${id}`);
                setSnackbar({ open: true, message: 'Address deleted successfully!', severity: 'success' });
                fetchAddresses();
            } catch (error) {
                console.error("Delete address failed:", error);
                Swal.fire(
                    'Error!',
                    'There was a problem deleting your address.',
                    'error'
                );
            }
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await api.post(`/addresses/${id}/default`);
            setSnackbar({ open: true, message: 'Default address updated!', severity: 'success' });
            fetchAddresses();
        } catch (error) {
            console.error("Set default failed:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (onLogout) onLogout();
            navigate('/');
        }
    };

    if (!currentUser) {
        return <Box sx={{ py: 20, textAlign: 'center' }}><Typography>Loading profile...</Typography></Box>;
    }

    const userInitials = currentUser.name?.split(' ').map(n => n[0]).join('') || 'U';

    const navItems = [
        { label: 'My Profile', icon: <VerifiedUserOutlined />, idx: 0 },
        { label: 'My Orders', icon: <ShoppingBagOutlined />, idx: 1 },
        { label: 'Addresses', icon: <LocationOnOutlined />, idx: 2 },
        { label: 'Security', icon: <LockOutlined />, idx: 3 },
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: BG_GRAY, pt: { xs: 3, md: 4 }, pb: 8 }}>
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>

                {/* ── Hero Card ── */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: { xs: 3, md: 5 },
                        overflow: 'hidden',
                        mb: 4,
                        border: CARD_BORDER,
                        background: '#FFFFFF',
                    }}
                >
                    <Box sx={{ px: { xs: 2, sm: 3, md: 5 }, py: { xs: 3, sm: 4, md: 5 }, position: 'relative' }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>

                            {/* Avatar */}
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    <IconButton
                                        size="small"
                                        sx={{
                                            bgcolor: OLIVE_GREEN,
                                            width: { xs: 28, sm: 30 },
                                            height: { xs: 28, sm: 30 },
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            '&:hover': { bgcolor: OLIVE_GREEN_DARK },
                                            color: '#fff',
                                        }}
                                    >
                                        <CameraAltOutlined sx={{ fontSize: { xs: 12, sm: 14 } }} />
                                    </IconButton>
                                }
                            >
                                <Avatar
                                    sx={{
                                        width: { xs: 70, sm: 80, md: 88 },
                                        height: { xs: 70, sm: 80, md: 88 },
                                        bgcolor: OLIVE_GREEN_LIGHT,
                                        fontSize: { xs: '1.5rem', md: '2rem' },
                                        fontWeight: 900,
                                        border: '3px solid #fff',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                        color: OLIVE_GREEN,
                                        fontFamily: "'Playfair Display', serif",
                                    }}
                                >
                                    {userInitials}
                                </Avatar>
                            </Badge>

                            {/* Info */}
                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 900,
                                        color: '#1F2937',
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                                        mb: 0.5,
                                    }}
                                >
                                    {currentUser.name}
                                </Typography>
                                <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                                        <CalendarTodayOutlined sx={{ fontSize: 12, color: '#6B7280' }} />
                                        <Typography sx={{ color: '#6B7280', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                                            Member since {new Date(currentUser.created_at).toLocaleDateString()}
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                                        <EmailOutlined sx={{ fontSize: 12, color: '#6B7280' }} />
                                        <Typography sx={{ color: '#6B7280', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                                            {currentUser.email}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Box>

                            {/* Stats */}
                            <Stack direction="row" spacing={{ xs: 2, md: 3 }}>
                                <Box sx={{ textAlign: 'center', px: 2, py: 1, borderRadius: 3, bgcolor: BG_GRAY, minWidth: 80 }}>
                                    <Typography sx={{ fontWeight: 900, color: '#1F2937', fontSize: { xs: '1.2rem', md: '1.6rem' } }}>
                                        {orders.length}
                                    </Typography>
                                    <Typography sx={{ color: '#6B7280', fontSize: { xs: '0.65rem', sm: '0.7rem' }, textTransform: 'uppercase', letterSpacing: 1 }}>
                                        Orders
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center', px: 2, py: 1, borderRadius: 3, bgcolor: BG_GRAY, minWidth: 80 }}>
                                    <Typography sx={{ fontWeight: 900, color: '#1F2937', fontSize: { xs: '1.2rem', md: '1.6rem' } }}>
                                        {formatPrice(orders.reduce((sum, o) => sum + Number(o.total), 0))}
                                    </Typography>
                                    <Typography sx={{ color: '#6B7280', fontSize: { xs: '0.65rem', sm: '0.7rem' }, textTransform: 'uppercase', letterSpacing: 1 }}>
                                        Spent
                                    </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Box>
                </Paper>

                {/* ── Main Layout ── */}
                <Grid container spacing={3}>

                    {/* Desktop Sidebar */}
                    {!isMobile && (
                        <Grid size={{ xs: 12, md: 3 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: 4,
                                    border: CARD_BORDER,
                                    overflow: 'hidden',
                                    position: 'sticky',
                                    top: 100,
                                    backgroundColor: '#fff',
                                }}
                            >
                                {navItems.map((item) => (
                                    <Box
                                        key={item.label}
                                        onClick={() => setTab(item.idx)}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            px: 3,
                                            py: 2.5,
                                            cursor: 'pointer',
                                            borderLeft: tab === item.idx && item.label !== 'My Orders' ? `3px solid ${OLIVE_GREEN}` : '3px solid transparent',
                                            bgcolor: tab === item.idx && item.label !== 'My Orders' ? OLIVE_GREEN_LIGHT : 'transparent',
                                            transition: 'all 0.2s',
                                            '&:hover': { bgcolor: tab === item.idx && item.label !== 'My Orders' ? OLIVE_GREEN_LIGHT : BG_GRAY },
                                        }}
                                    >
                                        <Box sx={{ color: tab === item.idx ? OLIVE_GREEN : '#9CA3AF', display: 'flex' }}>
                                            {item.icon}
                                        </Box>
                                        <Typography sx={{
                                            fontWeight: tab === item.idx ? 800 : 600,
                                            color: tab === item.idx ? OLIVE_GREEN : '#374151',
                                            fontSize: '0.88rem',
                                        }}>
                                            {item.label}
                                        </Typography>
                                    </Box>
                                ))}
                                <Divider />
                                <Box
                                    onClick={handleLogout}
                                    sx={{
                                        display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 2.5,
                                        cursor: 'pointer', color: '#EF4444', transition: 'all 0.2s',
                                        '&:hover': { bgcolor: '#FEF2F2' },
                                    }}
                                >
                                    <LogoutOutlined sx={{ fontSize: 20 }} />
                                    <Typography sx={{ fontWeight: 700, fontSize: '0.88rem' }}>Sign Out</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    )}

                    {/* Content */}
                    <Grid size={{ xs: 12, md: 9 }}>
                        <Paper
                            elevation={0}
                            sx={{ borderRadius: 4, border: CARD_BORDER, p: { xs: 2, sm: 3, md: 4 }, backgroundColor: '#fff' }}
                        >
                            {/* Mobile Tabs */}
                            {isMobile && (
                                <Tabs
                                    value={tab}
                                    onChange={(_, v) => setTab(v)}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    sx={{
                                        borderBottom: '1px solid #E5E7EB',
                                        '& .MuiTab-root': { fontWeight: 700, fontSize: '0.75rem', minWidth: 'auto', textTransform: 'none', px: 2, color: '#6B7280' },
                                        '& .Mui-selected': { color: OLIVE_GREEN },
                                        '& .MuiTabs-indicator': { bgcolor: OLIVE_GREEN },
                                    }}
                                >
                                    {navItems.map(item => <Tab key={item.label} label={item.label} />)}
                                </Tabs>
                            )}

                            {/* ── Tab 0: Profile ── */}
                            <TabPanel value={tab} index={0}>
                                <Stack direction="row" sx={{ mb: 3, flexWrap: 'wrap', gap: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 900, fontFamily: "'Playfair Display', serif", fontSize: { xs: '1.1rem', sm: '1.25rem' }, color: '#1F2937' }}>
                                        Personal Information
                                    </Typography>
                                    <Button
                                        onClick={() => editing ? handleSaveProfile() : setEditing(true)}
                                        startIcon={editing ? <CheckCircleOutlined /> : <EditOutlined />}
                                        variant={editing ? 'contained' : 'outlined'}
                                        size="small"
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 800,
                                            fontSize: '0.75rem',
                                            borderColor: OLIVE_GREEN,
                                            color: editing ? '#fff' : OLIVE_GREEN,
                                            bgcolor: editing ? OLIVE_GREEN : 'transparent',
                                            '&:hover': { bgcolor: editing ? OLIVE_GREEN_DARK : OLIVE_GREEN_LIGHT, borderColor: OLIVE_GREEN },
                                        }}
                                    >
                                        {editing ? (loading ? 'Saving...' : 'Save Changes') : 'Edit Profile'}
                                    </Button>
                                </Stack>

                                <Grid container spacing={2.5}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth label="Full Name"
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            disabled={!editing} size="small" sx={fieldSx}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth label="Email Address" type="email"
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                            disabled={!editing} size="small" sx={fieldSx}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth label="Phone Number"
                                            value={form.phone}
                                            onChange={e => setForm({ ...form, phone: e.target.value })}
                                            disabled={!editing} size="small" sx={fieldSx}
                                        />
                                    </Grid>
                                </Grid>
                            </TabPanel>

                            {/* ── Tab 1: Orders ── */}
                            <TabPanel value={tab} index={1}>
                                <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, fontFamily: "'Playfair Display', serif", color: '#1F2937' }}>
                                    My Orders
                                </Typography>
                                
                                {loadingOrders ? (
                                    <Box sx={{ py: 10, textAlign: 'center' }}>
                                        <CircularProgress sx={{ color: OLIVE_GREEN }} />
                                        <Typography sx={{ mt: 2, color: TEXT_GRAY, fontSize: '0.85rem' }}>Retrieving your rituals...</Typography>
                                    </Box>
                                ) : orders.length > 0 ? (
                                    <Stack spacing={2}>
                                        {orders.map(order => {
                                            const statusColors = {
                                                paid: { color: '#10B981', label: 'Confirmed' },
                                                pending: { color: '#F59E0B', label: 'Processing' },
                                                failed: { color: '#EF4444', label: 'Payment Failed' },
                                                delivered: { color: '#064E3B', label: 'Delivered' }
                                            };
                                            const cfg = statusColors[order.status] || { color: '#6B7280', label: order.status };
                                            
                                            return (
                                                <Box key={order.id} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, border: CARD_BORDER, '&:hover': { borderColor: OLIVE_GREEN, bgcolor: OLIVE_GREEN_ULTRA }, transition: 'all 0.2s' }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                                                        <Box>
                                                            <Typography sx={{ fontWeight: 900, fontSize: '0.9rem', color: TEXT_DARK }}>#{order.order_number}</Typography>
                                                            <Typography sx={{ color: TEXT_GRAY, fontSize: '0.75rem', mt: 0.3 }}>
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
                                                            <Typography sx={{ fontWeight: 900, color: OLIVE_GREEN, display: 'block' }}>
                                                                ₹{Number(order.total).toLocaleString('en-IN')}
                                                            </Typography>
                                                            <Button
                                                                size="small"
                                                                startIcon={<DownloadIcon sx={{ fontSize: '1rem !important' }} />}
                                                                onClick={() => handleDownloadInvoice(order.id, order.order_number)}
                                                                sx={{ 
                                                                    mt: 1,
                                                                    color: OLIVE_GREEN, 
                                                                    fontWeight: 800, 
                                                                    fontSize: '0.65rem',
                                                                    textTransform: 'none',
                                                                    p: 0,
                                                                    minWidth: 0,
                                                                    '&:hover': { bgcolor: 'transparent', color: OLIVE_GREEN_DARK }
                                                                }}
                                                            >
                                                                Invoice
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                ) : (
                                    <Box sx={{ py: 10, textAlign: 'center', bgcolor: '#fff', borderRadius: 4, border: '1px dashed #E5E7EB' }}>
                                        <ShoppingBagOutlined sx={{ fontSize: 48, color: '#D1D5DB', mb: 2 }} />
                                        <Typography sx={{ fontWeight: 700, color: '#374151' }}>No rituals yet</Typography>
                                        <Typography variant="body2" sx={{ color: '#6B7280', mt: 0.5 }}>Your journey into botanical wellness begins with your first order.</Typography>
                                        <Button 
                                            variant="contained" 
                                            size="small"
                                            onClick={() => navigate('/shop')}
                                            sx={{ mt: 3, bgcolor: OLIVE_GREEN, borderRadius: 2, textTransform: 'none', px: 3, '&:hover': { bgcolor: OLIVE_GREEN_DARK } }}
                                        >
                                            Start Shopping
                                        </Button>
                                    </Box>
                                )}
                            </TabPanel>

                            {/* ── Tab 2: Addresses ── */}
                            <TabPanel value={tab} index={2}>
                                <Stack direction="row" sx={{ mb: 3, flexWrap: 'wrap', gap: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 900, fontFamily: "'Playfair Display', serif", fontSize: { xs: '1.1rem', sm: '1.25rem' }, color: '#1F2937' }}>
                                        Saved Addresses
                                    </Typography>
                                    <Button
                                        startIcon={<AddOutlined />}
                                        variant="outlined"
                                        size="small"
                                        onClick={handleOpenAddAddress}
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 800,
                                            borderColor: OLIVE_GREEN,
                                            color: OLIVE_GREEN,
                                            '&:hover': { bgcolor: OLIVE_GREEN_LIGHT, borderColor: OLIVE_GREEN },
                                        }}
                                    >
                                        Add New
                                    </Button>
                                </Stack>
                                <Stack spacing={2}>
                                    {addresses.map(addr => (
                                        <Box
                                            key={addr.id}
                                            sx={{
                                                p: { xs: 2, sm: 3 },
                                                borderRadius: 3,
                                                border: addr.is_default ? `1.5px solid ${OLIVE_GREEN}` : CARD_BORDER,
                                                bgcolor: addr.is_default ? OLIVE_GREEN_LIGHT : '#fff',
                                                position: 'relative',
                                            }}
                                        >
                                            {addr.is_default && (
                                                <Chip
                                                    label="Default"
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute', top: 12, right: 12,
                                                        bgcolor: OLIVE_GREEN, color: '#fff',
                                                        fontWeight: 800, fontSize: '0.65rem',
                                                    }}
                                                />
                                            )}
                                            <Stack direction="row" spacing={1.5} sx={{ mb: 1, alignItems: 'center' }}>
                                                <Box sx={{ color: OLIVE_GREEN, display: 'flex' }}>{getAddressIcon(addr.type)}</Box>
                                                <Typography sx={{ fontWeight: 900, fontSize: '0.88rem', color: '#1F2937' }}>{addr.type}</Typography>
                                            </Stack>
                                            <Typography sx={{ color: '#4B5563', fontSize: '0.82rem', lineHeight: 1.6 }}>{addr.address}</Typography>
                                            <Typography sx={{ color: '#6B7280', fontSize: '0.7rem', mt: 0.5 }}>{addr.phone}</Typography>
                                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                                <Button
                                                    size="small"
                                                    onClick={() => handleOpenEditAddress(addr)}
                                                    startIcon={<EditOutlined sx={{ fontSize: 14 }} />}
                                                    sx={{ textTransform: 'none', fontWeight: 700, color: OLIVE_GREEN, fontSize: '0.75rem', p: 0, minWidth: 0 }}
                                                >
                                                    Edit
                                                </Button>
                                                {!addr.is_default && (
                                                    <>
                                                        <Button
                                                            size="small"
                                                            onClick={() => handleSetDefault(addr.id)}
                                                            sx={{ textTransform: 'none', fontWeight: 700, color: OLIVE_GREEN, fontSize: '0.75rem', p: 0, minWidth: 0 }}
                                                        >
                                                            Set Default
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            onClick={() => handleDeleteAddress(addr.id)}
                                                            startIcon={<DeleteOutlineOutlined sx={{ fontSize: 14 }} />}
                                                            sx={{ textTransform: 'none', fontWeight: 700, color: '#EF4444', fontSize: '0.75rem', p: 0, minWidth: 0 }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </>
                                                )}
                                            </Stack>
                                        </Box>
                                    ))}
                                    {addresses.length === 0 && (
                                        <Box sx={{ py: 4, textAlign: 'center', border: '2px dashed #E5E7EB', borderRadius: 4 }}>
                                            <Typography sx={{ color: '#6B7280' }}>No addresses saved yet.</Typography>
                                        </Box>
                                    )}
                                </Stack>
                            </TabPanel>

                            {/* ── Tab 3: Security ── */}
                            <TabPanel value={tab} index={3}>
                                <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, fontFamily: "'Playfair Display', serif", fontSize: { xs: '1.1rem', sm: '1.25rem' }, color: '#1F2937' }}>
                                    Security Settings
                                </Typography>
                                <Box sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, border: CARD_BORDER, bgcolor: '#fff' }}>
                                    <Typography sx={{ fontWeight: 800, mb: 0.5, color: '#1F2937' }}>Change Password</Typography>
                                    <Typography sx={{ color: '#6B7280', fontSize: '0.78rem', mb: 2 }}>
                                        Ensure your account is safe with a strong password.
                                    </Typography>
                                    <Stack component="form" onSubmit={handleUpdatePassword} spacing={2} sx={{ maxWidth: 400 }}>
                                        <TextField 
                                            label="Current Password" type="password" size="small" fullWidth sx={fieldSx} 
                                            value={passwordForm.current_password}
                                            onChange={e => setPasswordForm({...passwordForm, current_password: e.target.value})}
                                            required
                                        />
                                        <TextField 
                                            label="New Password" type="password" size="small" fullWidth sx={fieldSx} 
                                            value={passwordForm.password}
                                            onChange={e => setPasswordForm({...passwordForm, password: e.target.value})}
                                            required
                                        />
                                        <TextField 
                                            label="Confirm New Password" type="password" size="small" fullWidth sx={fieldSx} 
                                            value={passwordForm.password_confirmation}
                                            onChange={e => setPasswordForm({...passwordForm, password_confirmation: e.target.value})}
                                            required
                                        />
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            disabled={loading}
                                            sx={{
                                                mt: 1,
                                                bgcolor: OLIVE_GREEN,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 800,
                                                alignSelf: 'flex-start',
                                                px: 3,
                                                '&:hover': { bgcolor: OLIVE_GREEN_DARK },
                                            }}
                                        >
                                            {loading ? 'Updating...' : 'Update Password'}
                                        </Button>
                                    </Stack>
                                </Box>
                            </TabPanel>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* ── Add Address Dialog ── */}
            <Dialog
                open={addressDialog}
                onClose={() => setAddressDialog(false)}
                maxWidth="sm"
                fullWidth
                slotProps={{ paper: { sx: { borderRadius: 4, p: { xs: 2, sm: 3 }, bgcolor: '#fff' } } }}
            >
                <DialogTitle sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 900, fontFamily: "'Playfair Display', serif", color: OLIVE_GREEN }}>
                        {addressFormMode === 'add' ? 'Add New Address' : 'Edit Address'}
                    </Typography>
                    <IconButton onClick={() => setAddressDialog(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <TextField
                            select
                            label="Address Type"
                            value={newAddress.type}
                            onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                            size="small"
                            fullWidth
                            slotProps={{ select: { native: true } }}
                            sx={fieldSx}
                        >
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                        </TextField>
                        <TextField
                            label="Full Address"
                            multiline
                            rows={3}
                            value={newAddress.address}
                            onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                            size="small"
                            fullWidth
                            placeholder="Street address, city, state, pincode"
                            sx={fieldSx}
                        />
                        <TextField
                            label="Phone Number"
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                            size="small"
                            fullWidth
                            placeholder="Contact number for delivery"
                            sx={fieldSx}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={newAddress.is_default} onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })} sx={{ color: OLIVE_GREEN, '&.Mui-checked': { color: OLIVE_GREEN } }} />}
                            label={<Typography sx={{ fontSize: '0.85rem' }}>Set as default address</Typography>}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button onClick={() => setAddressDialog(false)} sx={{ color: '#6B7280', textTransform: 'none', fontWeight: 600 }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddAddress}
                        variant="contained"
                        sx={{
                            bgcolor: OLIVE_GREEN,
                            textTransform: 'none',
                            fontWeight: 800,
                            borderRadius: 2,
                            '&:hover': { bgcolor: OLIVE_GREEN_DARK },
                        }}
                    >
                        {addressFormMode === 'add' ? 'Add Address' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Snackbar ── */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} sx={{ borderRadius: 2, fontWeight: 600 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
