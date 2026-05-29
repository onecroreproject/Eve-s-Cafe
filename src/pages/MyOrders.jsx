// MyOrders.jsx
import React, { useState } from 'react';
import {
    Box, Container, Typography, Avatar, Button, TextField,
    Grid, Chip, Divider, Paper, IconButton,
    Badge,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Alert, Snackbar, Fade, Stack, Stepper, Step, StepLabel,
    Collapse
} from '@mui/material';
import {
    ShoppingBagOutlined,
    CheckCircleOutlined,
    LocalShippingOutlined,
    AddOutlined,
    Close as CloseIcon,
    Search as SearchIcon,
    ArrowForward as ArrowForwardIcon,
    Inventory2Outlined as ProcessingIcon,
    LocalShippingOutlined as ShippingIcon,
    CheckCircleOutlineOutlined as DeliveredIcon,
    PendingOutlined as PendingIcon,
    KeyboardArrowDown as ArrowDownIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    FilterListOutlined as FilterIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { allOrders as mockOrders, productsMap as PRODUCTS } from '../data/products.js';

// ─── Theme Constants ────────────────────────────────────────────────────────────
const OLIVE_GREEN = '#556B2F';
const OLIVE_GREEN_DARK = '#4A5D23';
const OLIVE_GREEN_LIGHT = '#E8EDE0';
const OLIVE_GREEN_ULTRA = '#F4F7EF';
const TEXT_DARK = '#1F2937';
const TEXT_GRAY = '#6B7280';
const BG_GRAY = '#F9FAFB';
const CARD_BORDER = '1px solid #E5E7EB';
const WHITE = '#FFFFFF';

// ─── Helpers ───────────────────────────────────────────────────────────────────
const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);

const statusConfig = {
    pending: { color: OLIVE_GREEN, bg: OLIVE_GREEN_LIGHT, icon: <PendingIcon />, label: 'Pending' },
    processing: { color: OLIVE_GREEN, bg: OLIVE_GREEN_LIGHT, icon: <ProcessingIcon />, label: 'Processing' },
    shipped: { color: '#F59E0B', bg: '#FEF3C7', icon: <ShippingIcon />, label: 'Shipped' },
    delivered: { color: '#10B981', bg: '#D1FAE5', icon: <DeliveredIcon />, label: 'Delivered' },
    cancelled: { color: '#EF4444', bg: '#FEE2E2', icon: <CloseIcon />, label: 'Cancelled' },
};

const computeTotal = (items) =>
    items.reduce((sum, item) => sum + (PRODUCTS[item.pid]?.price || 0) * item.qty, 0);

// ─── OrderListItem Component ──────────────────────────────────────────────────
const OrderListItem = ({ order, onViewDetails, onWriteReview }) => {
    const [expanded, setExpanded] = useState(false);
    
    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const cfg = statusConfig[order.status] || statusConfig.pending;
    const itemCount = order.items.reduce((s, i) => s + i.qty, 0);

    const handleToggleExpand = (e) => {
        e.stopPropagation();
        setExpanded(!expanded);
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 0,
                borderRadius: 4,
                border: expanded ? `2px solid ${OLIVE_GREEN}` : CARD_BORDER,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                backgroundColor: '#fff',
                '&:hover': {
                    boxShadow: expanded ? `0 12px 32px rgba(85,107,47,0.15)` : `0 8px 24px rgba(85,107,47,0.1)`,
                    borderColor: OLIVE_GREEN,
                },
            }}
        >
            <Box 
                onClick={() => onViewDetails(order)}
                sx={{ 
                    p: { xs: 2, sm: 2.5 }, 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 2, sm: 3 }
                }}
            >
                <Box 
                    sx={{ 
                        width: { xs: 60, sm: 80 }, 
                        height: { xs: 60, sm: 80 }, 
                        borderRadius: 3, 
                        bgcolor: OLIVE_GREEN_ULTRA, 
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}
                >
                    <img 
                        src={order.productImage} 
                        alt={order.productName} 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                    />
                </Box>

                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: OLIVE_GREEN, bgcolor: OLIVE_GREEN_LIGHT, px: 1, py: 0.3, borderRadius: 1 }}>
                            {order.id}
                        </Typography>
                        <Typography variant="caption" sx={{ color: TEXT_GRAY }}>
                            {formatDate(order.date)}
                        </Typography>
                    </Stack>
                    
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            fontWeight: 700, 
                            color: TEXT_DARK, 
                            mb: 0.5,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {order.productName}
                    </Typography>

                    <Typography variant="caption" sx={{ color: TEXT_GRAY, fontWeight: 500 }}>
                        {itemCount} item{itemCount > 1 ? 's' : ''} · {formatPrice(computeTotal(order.items))}
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                    <Stack direction="column" spacing={1} alignItems="flex-end" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                        <Chip
                            icon={React.cloneElement(cfg.icon, { sx: { fontSize: '14px !important', color: `${cfg.color} !important` } })}
                            label={cfg.label}
                            size="small"
                            sx={{ bgcolor: cfg.bg, color: cfg.color, fontWeight: 800, fontSize: '0.65rem', height: 24 }}
                        />
                    </Stack>
                    
                    <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: 'none', sm: 'block' } }} />

                    <IconButton 
                        size="small" 
                        onClick={handleToggleExpand}
                        sx={{ 
                            transition: 'transform 0.3s',
                            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            bgcolor: expanded ? OLIVE_GREEN_LIGHT : 'transparent',
                            '&:hover': { bgcolor: OLIVE_GREEN_LIGHT }
                        }}
                    >
                        <ArrowDownIcon sx={{ color: OLIVE_GREEN }} />
                    </IconButton>
                </Stack>
            </Box>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Divider />
                <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: OLIVE_GREEN_ULTRA }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: OLIVE_GREEN, mb: 2, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                                Order Summary
                            </Typography>
                            <Stack spacing={1.5}>
                                {order.items.map((item, idx) => {
                                    const p = PRODUCTS[item.pid];
                                    return (
                                        <Stack key={idx} direction="row" spacing={2} alignItems="center">
                                            <Avatar src={p?.image} variant="rounded" sx={{ width: 40, height: 40, bgcolor: WHITE, border: CARD_BORDER }} />
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: TEXT_DARK }}>{p?.name}</Typography>
                                                <Typography variant="caption" sx={{ color: TEXT_GRAY }}>Qty: {item.qty} × {formatPrice(p?.price || 0)}</Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ fontWeight: 800, color: TEXT_DARK }}>{formatPrice((p?.price || 0) * item.qty)}</Typography>
                                        </Stack>
                                    );
                                })}
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, md: 5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: OLIVE_GREEN, mb: 2, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                                Actions
                            </Typography>
                            <Stack spacing={2}>
                                <Button 
                                    fullWidth 
                                    variant="contained" 
                                    size="small" 
                                    onClick={() => onViewDetails(order)}
                                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, bgcolor: OLIVE_GREEN, '&:hover': { bgcolor: OLIVE_GREEN_DARK } }}
                                >
                                    Track Order
                                </Button>
                                {order.status === 'delivered' && (
                                    <Button 
                                        fullWidth 
                                        variant="outlined" 
                                        size="small" 
                                        startIcon={<StarIcon />}
                                        onClick={() => onWriteReview(order)}
                                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, borderColor: OLIVE_GREEN, color: OLIVE_GREEN }}
                                    >
                                        Write a Review
                                    </Button>
                                )}
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Collapse>
        </Paper>
    );
};

// ─── OrderDetailsModal ────────────────────────────────────────────────────────
const OrderDetailsModal = ({ open, order, onClose }) => {
    if (!order) return null;
    const cfg = statusConfig[order.status] || statusConfig.pending;

    const timeline = order.tracking?.steps || [
        { label: 'Order Placed', date: order.date, completed: true },
        { label: 'Processing', date: null, completed: false },
        { label: 'Shipped', date: null, completed: false },
        { label: 'Out for Delivery', date: null, completed: false },
        { label: 'Delivered', date: null, completed: false },
    ];

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth
            slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: '#FAFAFA' } } }}
        >
            <DialogTitle sx={{ p: 3, bgcolor: WHITE, borderBottom: CARD_BORDER }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: TEXT_DARK }}>Order {order.id}</Typography>
                        <Typography variant="caption" sx={{ color: TEXT_GRAY }}>Placed on {new Date(order.date).toLocaleDateString()}</Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, bgcolor: WHITE, mb: 2, borderBottom: CARD_BORDER }}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                        <Box sx={{ p: 1, bgcolor: cfg.bg, borderRadius: 2, color: cfg.color }}>{cfg.icon}</Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Status: {cfg.label}</Typography>
                            <Typography variant="caption" sx={{ color: TEXT_GRAY }}>Payment Method: {order.paymentMethod}</Typography>
                        </Box>
                    </Stack>
                    <Stepper activeStep={timeline.filter(t => t.completed).length - 1} alternativeLabel>
                        {timeline.map((step, index) => (
                            <Step key={index}>
                                <StepLabel StepIconProps={{ sx: { '&.Mui-active, &.Mui-completed': { color: OLIVE_GREEN } } }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700 }}>{step.label}</Typography>
                                    <Typography variant="caption" sx={{ display: 'block', color: TEXT_GRAY, fontSize: '0.6rem' }}>{step.date || 'Pending'}</Typography>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
                <Box sx={{ p: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>Order Items</Typography>
                    <Stack spacing={2}>
                        {order.items.map((item, idx) => {
                            const p = PRODUCTS[item.pid];
                            return (
                                <Paper key={idx} variant="outlined" sx={{ p: 2, borderRadius: 2, border: CARD_BORDER, bgcolor: WHITE }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar variant="rounded" src={p?.image} sx={{ width: 60, height: 60, bgcolor: WHITE, border: CARD_BORDER }} />
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{p?.name}</Typography>
                                            <Typography variant="caption" sx={{ color: TEXT_GRAY }}>Qty: {item.qty} × {formatPrice(p?.price || 0)}</Typography>
                                        </Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{formatPrice(item.qty * (p?.price || 0))}</Typography>
                                    </Stack>
                                </Paper>
                            );
                        })}
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, bgcolor: WHITE, borderTop: CARD_BORDER }}>
                <Button onClick={onClose} variant="contained" sx={{ bgcolor: OLIVE_GREEN, borderRadius: 2, textTransform: 'none', px: 4, '&:hover': { bgcolor: OLIVE_GREEN_DARK } }}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

// ─── ReviewModal ──────────────────────────────────────────────────────────────
const ReviewModal = ({ open, order, onClose, onSubmit }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    if (!order) return null;

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            slotProps={{ paper: { sx: { borderRadius: 4, p: 1 } } }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>Write a Review</Typography>
                <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ mb: 1, color: TEXT_GRAY }}>Rate your experience with</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>{order.productName}</Typography>
                        <Stack direction="row" spacing={1} justifyContent="center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <IconButton key={star} onClick={() => setRating(star)} sx={{ color: star <= rating ? '#F59E0B' : '#D1D5DB' }}>
                                    {star <= rating ? <StarIcon sx={{ fontSize: 32 }} /> : <StarBorderIcon sx={{ fontSize: 32 }} />}
                                </IconButton>
                            ))}
                        </Stack>
                    </Box>
                    <TextField
                        fullWidth
                        label="Share your ritual experience"
                        multiline
                        rows={4}
                        placeholder="What did you like about this product?"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: 3 }
                        }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} sx={{ color: TEXT_GRAY, textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
                <Button 
                    variant="contained" 
                    onClick={() => onSubmit({ rating, comment, orderId: order.id })}
                    sx={{ bgcolor: OLIVE_GREEN, borderRadius: 2, textTransform: 'none', fontWeight: 800, px: 3, '&:hover': { bgcolor: OLIVE_GREEN_DARK } }}
                >
                    Submit Review
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// ─── Main MyOrders Page ────────────────────────────────────────────────────────
const MyOrders = () => {
    const [orders] = useState(mockOrders);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentOrder, setCurrentOrder] = useState(null);
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             order.productName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const stats = [
        { label: 'Total Orders', value: orders.length, icon: <ShoppingBagOutlined />, color: OLIVE_GREEN },
        { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: <DeliveredIcon />, color: '#10B981' },
        { label: 'In Transit', value: orders.filter(o => o.status === 'shipped').length, icon: <ShippingIcon />, color: '#F59E0B' },
        { label: 'Total Spent', value: formatPrice(orders.reduce((sum, o) => sum + computeTotal(o.items), 0)), icon: <CheckCircleOutlined />, color: '#1A3C2E' },
    ];

    const handleSubmitReview = () => {
        setReviewModalOpen(false);
        setSnackbar({ open: true, message: 'Thank you for your review!', severity: 'success' });
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: BG_GRAY, pb: 10 }}>
            {/* ── Page Header ── */}
            <Box sx={{ 
                bgcolor: OLIVE_GREEN, 
                pt: { xs: 3, md: 4 }, 
                pb: { xs: 8, md: 12 }, 
                color: '#fff', 
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Box sx={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />
                <Container maxWidth="lg">
                    <Stack spacing={1}>
                        <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 3, opacity: 0.8 }}>
                            YOUR RITUAL HISTORY
                        </Typography>
                        <Typography variant="h2" sx={{ fontWeight: 900, fontFamily: "'Playfair Display', serif", fontSize: { xs: '2.5rem', md: '4rem' } }}>
                            My Orders
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600 }}>
                            Track, manage, and review all your botanical purchases in one place.
                        </Typography>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 5 }}>
                {/* ── Stats Grid ── */}
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {stats.map((stat, i) => (
                        <Grid size={{ xs: 6, md: 3 }} key={i}>
                            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: CARD_BORDER, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 12px 32px rgba(0,0,0,0.05)' } }}>
                                <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                    {stat.icon}
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 900, color: TEXT_DARK, mb: 0.5 }}>{stat.value}</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: TEXT_GRAY, textTransform: 'uppercase', letterSpacing: 1 }}>{stat.label}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* ── Main Content ── */}
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12 }}>
                        <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 5, border: CARD_BORDER, bgcolor: '#fff' }}>
                            {/* Filter Bar */}
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 4 }}>
                                <TextField
                                    fullWidth
                                    placeholder="Search by order ID or product name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    slotProps={{ input: { startAdornment: <SearchIcon sx={{ color: TEXT_GRAY, mr: 1 }} /> } }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: BG_GRAY }
                                    }}
                                />
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: BG_GRAY } }}
                                        slotProps={{ select: { native: true } }}
                                    >
                                        <option value="all">All Status</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </TextField>
                                    <Button 
                                        variant="outlined" 
                                        sx={{ borderRadius: 3, px: 3, borderColor: '#E5E7EB', color: TEXT_DARK, textTransform: 'none', fontWeight: 700 }}
                                        startIcon={<FilterIcon />}
                                    >
                                        Filter
                                    </Button>
                                </Stack>
                            </Stack>

                            {/* Order List */}
                            <Stack spacing={2.5}>
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map(order => (
                                        <OrderListItem 
                                            key={order.id} 
                                            order={order} 
                                            onViewDetails={(o) => {
                                                setCurrentOrder(o);
                                                setOrderModalOpen(true);
                                            }}
                                            onWriteReview={(o) => {
                                                setCurrentOrder(o);
                                                setReviewModalOpen(true);
                                            }}
                                        />
                                    ))
                                ) : (
                                    <Box sx={{ py: 10, textAlign: 'center' }}>
                                        <ShoppingBagOutlined sx={{ fontSize: 64, color: '#D1D5DB', mb: 2 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: TEXT_DARK }}>No rituals found</Typography>
                                        <Typography variant="body2" sx={{ color: TEXT_GRAY }}>Try adjusting your search or filters.</Typography>
                                        <Button variant="contained" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }} sx={{ mt: 3, bgcolor: OLIVE_GREEN, borderRadius: 2, textTransform: 'none' }}>
                                            Reset Filters
                                        </Button>
                                    </Box>
                                )}
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* ── Modals ── */}
            <OrderDetailsModal 
                open={orderModalOpen} 
                order={currentOrder} 
                onClose={() => setOrderModalOpen(false)} 
            />
            <ReviewModal 
                open={reviewModalOpen} 
                order={currentOrder} 
                onClose={() => setReviewModalOpen(false)} 
                onSubmit={handleSubmitReview}
            />

            {/* ── Snackbar ── */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} sx={{ borderRadius: 3, fontWeight: 700 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MyOrders;
