import img1 from '../assets/recentproducts/537.jpg';
import img2 from '../assets/recentproducts/538.jpg';
import img3 from '../assets/recentproducts/539.jpg';
import img4 from '../assets/recentproducts/540.jpg';
import img5 from '../assets/recentproducts/542.jpg';
import img6 from '../assets/recentproducts/544.jpg';
import img7 from '../assets/recentproducts/545.jpg';
import img8 from '../assets/recentproducts/546.jpg';

// Bestseller Images
import b1 from '../assets/bestseller/bestseller1.jpg';
import b2 from '../assets/bestseller/bestseller2.jpg';
import b3 from '../assets/bestseller/bestseller3.jpg';
import b4 from '../assets/bestseller/bestseller4.jpg';

/* ─── Shared Base Data ─── */
const DEFAULT_HIGHLIGHTS = [
  { icon: '🌿', title: '100% Botanical', desc: 'Sourced from organic forest farms' },
  { icon: '🧪', title: 'Ayurvedic Formulated', desc: 'Ancient wisdom meet modern science' },
  { icon: '🏺', title: 'Micro-Batched', desc: 'Crafted in small batches for freshness' },
  { icon: '♻️', title: 'Zero Waste', desc: 'Eco-friendly sustainable packaging' },
];

const DEFAULT_REVIEWS = [
  { name: 'Aditi V.', rating: 5, date: '15 Apr 2025', text: 'This has become a staple in my daily ritual. The scent is incredibly calming.' },
  { name: 'Rahul S.', rating: 4, date: '22 Mar 2025', text: 'Very effective and natural. You can feel the quality of the ingredients.' },
];

/* ─── Product Repository ─── */
export const allProducts = [
  { 
    id: 1, 
    name: "Elixir Hair Oil - Youth Revitalising", 
    category: "Hair Care", 
    price: "₹899.00", 
    mrp: "₹1,199.00",
    image: b1, 
    tag: "Best Seller",
    subCategory: "Hair Oil",
    subSlug: "hair-oil",
    description: "Our signature potent blend of rare Ayurvedic herbs designed to revitalize the scalp and promote lush, youthful hair growth.",
    subtitle: "Sacred Scalp Elixir",
    rating: 5.0,
    reviewCount: 32,
    images: [b1, img1, img2],
    ingredients: [
      { name: 'Brahmi Extract', pct: '15%' },
      { name: 'Bringraj Oil', pct: '20%' },
      { name: 'Virgin Coconut Oil', pct: '40%' },
    ],
    highlights: DEFAULT_HIGHLIGHTS,
    howToUse: ["Apply to dry scalp and hair.", "Massage gently with fingertips.", "Leave for 2 hours or overnight.", "Wash with a mild shampoo."],
    specs: [["Hair Type", "All Types"], ["Benefit", "Revitalizing"]],
    reviews: DEFAULT_REVIEWS,
    options: [
      { label: '100 ml', price: 220, mrp: 275, perUnit: '₹2.20/ml' },
      { label: '200 ml', price: 400, mrp: 500, perUnit: '₹2.00/ml' },
      { label: '500 ml', price: 900, mrp: 1125, perUnit: '₹1.80/ml' },
    ]
  },
  { 
    id: 2, 
    name: "Magic Beauty Face Oil with Gold Flakes", 
    category: "Face Care", 
    price: "₹1,249.00", 
    mrp: "₹1,599.00",
    image: b2, 
    tag: "Best Seller",
    subCategory: "Face Packs", 
    subSlug: "face-packs",
    description: "Infused with genuine 24K gold flakes, this radiant oil deeply nourishes to leave skin with a luminous, youthful glow.",
    subtitle: "Ancestral Radiance Oil",
    rating: 4.9,
    reviewCount: 32,
    images: [b2, img3, img4],
    ingredients: [
      { name: '24K Gold Flakes', pct: '1%'},
      { name: 'Saffron Extract', pct: '2%'},
      { name: 'Kumkumadi Oil', pct: '10%'},
    ],
    highlights: DEFAULT_HIGHLIGHTS,
    howToUse: ["Cleanse your face.", "Apply 2-3 drops.", "Massage in upward strokes until absorbed."],
    specs: [["Skin Type", "Glow-seeking"], ["Usage", "Nightly"]],
    reviews: DEFAULT_REVIEWS,
    options: [
      { label: '15 ml', price: 450, mrp: 550, perUnit: '₹30.00/ml' },
      { label: '30 ml', price: 800, mrp: 1000, perUnit: '₹26.66/ml' },
    ]
  },
  { 
    id: 3, 
    name: "Pure Aloe Vera Gel - Soothing & Hydrating", 
    category: "Face Care", 
    price: "₹450.00", 
    mrp: "₹599.00",
    image: b3, 
    tag: "Best Seller",
    subCategory: "Soaps", 
    subSlug: "soaps",
    description: "99% pure organic Aloe Vera gel that provides instant cooling and deep hydration for sun-stressed or dry skin.",
    subtitle: "Botanical Hydration Mist",
    rating: 4.8,
    reviewCount: 32,
    images: [b3, img5, img6],
    ingredients: [
      { name: 'Organic Aloe Vera', pct: '99%'},
      { name: 'Vitamin E', pct: '0.5%'},
    ],
    highlights: DEFAULT_HIGHLIGHTS,
    howToUse: ["Apply liberally on face and body.", "Great as a post-sun treatment.", "Can be used as a light moisturizer."],
    specs: [["Texture", "Non-greasy Gel"], ["Pureness", "99% Organic"]],
    reviews: DEFAULT_REVIEWS,
    options: [
      { label: '100 g', price: 200, mrp: 250, perUnit: '₹2.00/g' },
      { label: '200 g', price: 360, mrp: 450, perUnit: '₹1.80/g' },
    ]
  },
  { 
    id: 4, 
    name: "Herbal Protein Powder - Natural Growth", 
    category: "Herbal Powder", 
    price: "₹650.00", 
    mrp: "₹849.00",
    image: b4, 
    tag: "Top Rated",
    subCategory: "Hair Pack",
    subSlug: "hair-pack",
    description: "A traditional blend of forest-harvested herbs that strengthen hair roots and provide natural protein to the follicles.",
    subtitle: "Follicle Nutrition Ritual",
    rating: 5.0,
    reviewCount: 32,
    images: [b4, img7, img8],
    ingredients: [
      { name: 'Amala Powder', pct: '20%'},
      { name: 'Shikakai', pct: '15%'},
      { name: 'Hibiscus Petals', pct: '10%'},
    ],
    highlights: DEFAULT_HIGHLIGHTS,
    howToUse: ["Mix with water or curd to make a paste.", "Apply to scalp and hair.", "Leave for 30-45 minutes.", "Rinse with normal water."],
    specs: [["Type", "Wash-off Pack"], ["Benefit", "Protein Boost"]],
    reviews: DEFAULT_REVIEWS
  },
  { 
    id: 5, 
    name: "Rose Petal Face Pack", 
    category: "Face Care", 
    price: "₹499.00", 
    mrp: "₹649.00",
    image: img5, 
    tag: "Best Seller",
    subCategory: "Face Packs",
    subSlug: "face-packs",
    description: "Sun-dried rose petals and sandalwood to brighten and soothe tired skin.",
    subtitle: "Luminous Skin Ritual",
    rating: 4.8,
    reviewCount: 245,
    images: [img5, img7, img1],
    ingredients: [
      { name: 'Rose Petals', pct: '45%' },
      { name: 'Kaolin Clay', pct: '30%' },
      { name: 'Sandalwood', pct: '10%' },
    ],
    highlights: DEFAULT_HIGHLIGHTS,
    howToUse: ["Mix with rose water.", "Apply for 15 minutes until dry.", "Wash with cool water."],
    specs: [["Effect", "Brightening"], ["Skin Type", "Sensitive to Normal"]],
    reviews: DEFAULT_REVIEWS
  },
  { 
    id: 6, 
    name: "Brahmi Hair Tonic", 
    category: "Hair Care", 
    price: "₹625.00", 
    mrp: "₹799.00",
    image: img6, 
    tag: "Limited",
    subCategory: "Hair Oil",
    subSlug: "hair-oil",
    description: "Potent Brahmi infusion designed to calm the scalp and promote thick hair density.",
    subtitle: "Neurological Scalp Therapy",
    rating: 4.6,
    reviewCount: 112,
    images: [img6, img8, img2],
    ingredients: [
      { name: 'Brahmi', pct: '8.0%' },
      { name: 'Peppermint', pct: '2.0%' },
      { name: 'Almond Oil', pct: '40%' },
    ],
    highlights: DEFAULT_HIGHLIGHTS,
    howToUse: ["Apply to scalp at night.", "Massage in circular motions.", "Wash next morning."],
    specs: [["Focus", "Density"], ["Nature", "Non-greasy"]],
    reviews: DEFAULT_REVIEWS
  },
  { 
    id: 7, 
    name: "Lemon Zest Scrub", 
    category: "Body Care", 
    price: "₹350.00", 
    mrp: "₹449.00",
    image: img7, 
    tag: "Fresh",
    subCategory: "Body Scrubs",
    subSlug: "body-scrubs",
    description: "Zesty morning scrub to awaken your senses and exfoliate dead skin cells with natural citrus acids.",
    subtitle: "Citrus Awakening Ritual",
    rating: 4.5,
    reviewCount: 67,
    images: [img7, img1, img3],
    ingredients: [
      { name: 'Lemon Peel', pct: '5.0%' },
      { name: 'Sugar Crystals', pct: '35%' },
      { name: 'Jojoba Oil', pct: '10%' },
    ],
    highlights: DEFAULT_HIGHLIGHTS,
    howToUse: ["Use in shower.", "Exfoliate gently.", "Rinse with lukewarm water."],
    specs: [["Aroma", "Zesty Lemon"], ["Benefit", "Energy Boost"]],
    reviews: DEFAULT_REVIEWS
  },
  { 
    id: 8, 
    name: "Neem Detox Powder", 
    category: "Herbal Powder", 
    price: "₹320.00", 
    mrp: "₹399.00",
    image: img8, 
    tag: "Organic",
    subCategory: "Neem Powder",
    subSlug: "neem",
    description: "Highly potent Neem powder for skin detoxification and fungal protection rituals.",
    subtitle: "Antifungal Skin Defense",
    rating: 4.8,
    reviewCount: 198,
    images: [img8, img2, img4],
    ingredients: [{ name: 'Pure Neem', pct: '100%' }],
    highlights: DEFAULT_HIGHLIGHTS,
    howToUse: ["Mix with water for spot treatment.", "Apply to acne or dry patches.", "Rinse after 20 mins."],
    specs: [["Medical Grade", "Yes"], ["Source", "Forest Collected"]],
    reviews: DEFAULT_REVIEWS
  },
  {
    id: 9,
    name: "Hibiscus & Aloe Shampoo",
    category: "Hair Care",
    price: "₹549.00",
    mrp: "₹699.00",
    image: b2,
    tag: "New",
    subCategory: "Shampoo",
    subSlug: "shampoo",
    description: "A gentle, sulfate-free shampoo that cleanses without stripping natural oils, leaving hair soft and hydrated.",
    subtitle: "Hydrating Scalp Wash",
    rating: 4.8,
    reviewCount: 32,
    images: [b2, img3, img4],
    ingredients: [
      { name: 'Hibiscus Extract', pct: '20%'},
      { name: 'Aloe Vera Juice', pct: '30%'}
    ],
    highlights: DEFAULT_HIGHLIGHTS,
    reviews: DEFAULT_REVIEWS
  },
  {
    id: 10,
    name: "Sandalwood Silk Conditioner",
    category: "Hair Care",
    price: "₹625.00",
    mrp: "₹799.00",
    image: b1,
    tag: "Premium",
    subCategory: "Conditioner",
    subSlug: "conditioner",
    description: "A luxurious conditioner that detangles and smooths hair while imparting a divine sandalwood fragrance.",
    subtitle: "Silk Smoothing Ritual",
    rating: 4.9,
    reviewCount: 32,
    images: [b1, img5, img6],
    ingredients: [
      { name: 'Sandalwood Oil', pct: '5%'},
      { name: 'Silk Proteins', pct: '10%'}
    ],
    highlights: DEFAULT_HIGHLIGHTS,
    reviews: DEFAULT_REVIEWS
  },
  {
    id: 11,
    name: "Brahmi Scalp Serum",
    category: "Hair Care",
    price: "₹1,150.00",
    mrp: "₹1,450.00",
    image: b3,
    tag: "Top Rated",
    subCategory: "Hair Serum",
    subSlug: "hair-serum",
    description: "Concentrated serum that targets the roots to strengthen hair and improve overall scalp health.",
    subtitle: "Root Strengthening Tonic",
    rating: 5.0,
    reviewCount: 32,
    images: [b3, img7, img8],
    ingredients: [
      { name: 'Brahmi Extract', pct: '25%'}
    ],
    highlights: DEFAULT_HIGHLIGHTS,
    reviews: DEFAULT_REVIEWS
  },
  {
    id: 12,
    name: "Natural Charcoal Soap",
    category: "Body Care",
    price: "₹199.00",
    mrp: "₹299.00",
    image: b4,
    tag: "Trending",
    subCategory: "Natural Soaps",
    subSlug: "natural-soaps",
    description: "Handcrafted charcoal soap that draws out impurities and leaves your skin feeling fresh and detoxified.",
    subtitle: "Detox Bar Ritual",
    rating: 4.7,
    reviewCount: 32,
    images: [b4, img1, img2],
    ingredients: [
      { name: 'Activated Charcoal', pct: '10%'}
    ],
    highlights: DEFAULT_HIGHLIGHTS,
    reviews: DEFAULT_REVIEWS
  }
];

/* ─── Product Mapping for Orders ─── */
export const productsMap = {
  1: { name: 'Elixir Hair Oil – Youth Revitalising', category: 'Hair Care', price: 899, image: b1 },
  2: { name: 'Magic Beauty Face Oil with Gold Flakes', category: 'Skin Care', price: 1249, image: b2 },
  3: { name: 'Pure Aloe Vera Gel', category: 'Skin Care', price: 450, image: b3 },
  4: { name: 'Herbal Protein Powder – Natural Growth', category: 'Herbal Powder', price: 650, image: b4 },
  5: { name: 'Rose Petal Face Pack', category: 'Skin Care', price: 499, image: img5 },
  6: { name: 'Brahmi Hair Tonic', category: 'Hair Care', price: 625, image: img6 },
  7: { name: 'Lemon Zest Scrub', category: 'Body Care', price: 350, image: img7 },
  8: { name: 'Neem Detox Powder', category: 'Herbal Powder', price: 320, image: img8 },
  9: { name: 'Hibiscus & Aloe Shampoo', category: 'Hair Care', price: 549, image: b2 },
  10: { name: 'Sandalwood Silk Conditioner', category: 'Hair Care', price: 625, image: b1 },
  11: { name: 'Brahmi Scalp Serum', category: 'Hair Care', price: 1150, image: b3 },
  12: { name: 'Natural Charcoal Soap', category: 'Body Care', price: 199, image: b4 },
};

/* ─── Detailed Orders ─── */
export const allOrders = [
  {
      id: 'ORD-1001',
      date: '2024-03-15T10:30:00',
      status: 'delivered',
      paymentMethod: 'Credit Card',
      productName: 'Natural Beauty Products Set',
      productImage: b1,
      shippingAddress: {
          name: 'Priya Sharma',
          address: '123 Green Avenue, Koramangala',
          city: 'Bangalore',
          pincode: '560034',
          phone: '+91 98765 43210',
      },
      items: [
          { pid: 1, qty: 2 },
          { pid: 3, qty: 1 },
          { pid: 2, qty: 1 },
      ],
      tracking: {
          status: 'delivered',
          steps: [
              { label: 'Order Placed', date: '2024-03-15', completed: true },
              { label: 'Processing', date: '2024-03-16', completed: true },
              { label: 'Shipped', date: '2024-03-17', completed: true },
              { label: 'Out for Delivery', date: '2024-03-18', completed: true },
              { label: 'Delivered', date: '2024-03-19', completed: true },
          ],
      },
      reviewSubmitted: false,
  },
  {
      id: 'ORD-1002',
      date: '2024-03-10T14:20:00',
      status: 'shipped',
      paymentMethod: 'UPI',
      productName: 'Lavender & Coconut Hair Combo',
      productImage: b2,
      shippingAddress: {
          name: 'Priya Sharma',
          address: '123 Green Avenue, Koramangala',
          city: 'Bangalore',
          pincode: '560034',
          phone: '+91 98765 43210',
      },
      items: [
          { pid: 9, qty: 2 },
          { pid: 10, qty: 1 },
      ],
      tracking: {
          status: 'shipped',
          steps: [
              { label: 'Order Placed', date: '2024-03-10', completed: true },
              { label: 'Processing', date: '2024-03-11', completed: true },
              { label: 'Shipped', date: '2024-03-12', completed: true },
              { label: 'Out for Delivery', date: null, completed: false },
              { label: 'Delivered', date: null, completed: false },
          ],
      },
      reviewSubmitted: false,
  },
  {
      id: 'ORD-1003',
      date: '2024-03-18T09:15:00',
      status: 'processing',
      paymentMethod: 'Debit Card',
      productName: 'Complete Beauty Gift Set',
      productImage: b3,
      shippingAddress: {
          name: 'Priya Sharma',
          address: '123 Green Avenue, Koramangala',
          city: 'Bangalore',
          pincode: '560034',
          phone: '+91 98765 43210',
      },
      items: [
          { pid: 5, qty: 1 },
          { pid: 6, qty: 1 },
          { pid: 7, qty: 1 },
      ],
      tracking: {
          status: 'processing',
          steps: [
              { label: 'Order Placed', date: '2024-03-18', completed: true },
              { label: 'Processing', date: null, completed: false },
              { label: 'Shipped', date: null, completed: false },
              { label: 'Out for Delivery', date: null, completed: false },
              { label: 'Delivered', date: null, completed: false },
          ],
      },
      reviewSubmitted: false,
  },
  {
      id: 'ORD-1004',
      date: '2024-03-05T11:45:00',
      status: 'delivered',
      paymentMethod: 'Credit Card',
      productName: 'Vitamin C Brightening Serum',
      productImage: b4,
      shippingAddress: {
          name: 'Priya Sharma',
          address: '123 Green Avenue, Koramangala',
          city: 'Bangalore',
          pincode: '560034',
          phone: '+91 98765 43210',
      },
      items: [
          { pid: 11, qty: 1 },
      ],
      tracking: {
          status: 'delivered',
          steps: [
              { label: 'Order Placed', date: '2024-03-05', completed: true },
              { label: 'Processing', date: '2024-03-06', completed: true },
              { label: 'Shipped', date: '2024-03-07', completed: true },
              { label: 'Out for Delivery', date: '2024-03-08', completed: true },
              { label: 'Delivered', date: '2024-03-09', completed: true },
          ],
      },
      reviewSubmitted: true,
  },
  {
      id: 'ORD-1005',
      date: '2024-03-12T16:20:00',
      status: 'shipped',
      paymentMethod: 'UPI',
      productName: 'Keratin Hair Repair Mask',
      productImage: img1,
      shippingAddress: {
          name: 'Priya Sharma',
          address: '123 Green Avenue, Koramangala',
          city: 'Bangalore',
          pincode: '560034',
          phone: '+91 98765 43210',
      },
      items: [
          { pid: 4, qty: 2 },
      ],
      tracking: {
          status: 'shipped',
          steps: [
              { label: 'Order Placed', date: '2024-03-12', completed: true },
              { label: 'Processing', date: '2024-03-13', completed: true },
              { label: 'Shipped', date: '2024-03-14', completed: true },
              { label: 'Out for Delivery', date: null, completed: false },
              { label: 'Delivered', date: null, completed: false },
          ],
      },
      reviewSubmitted: false,
  },
  {
      id: 'ORD-1006',
      date: '2024-03-20T13:10:00',
      status: 'processing',
      paymentMethod: 'Debit Card',
      productName: 'Complete Skincare Essentials Kit',
      productImage: img2,
      shippingAddress: {
          name: 'Priya Sharma',
          address: '123 Green Avenue, Koramangala',
          city: 'Bangalore',
          pincode: '560034',
          phone: '+91 98765 43210',
      },
      items: [
          { pid: 2, qty: 1 },
          { pid: 5, qty: 1 },
          { pid: 7, qty: 2 },
      ],
      tracking: {
          status: 'processing',
          steps: [
              { label: 'Order Placed', date: '2024-03-20', completed: true },
              { label: 'Processing', date: null, completed: false },
              { label: 'Shipped', date: null, completed: false },
              { label: 'Out for Delivery', date: null, completed: false },
              { label: 'Delivered', date: null, completed: false },
          ],
      },
      reviewSubmitted: false,
  },
  {
      id: 'ORD-1007',
      date: '2024-03-08T09:30:00',
      status: 'delivered',
      paymentMethod: 'Credit Card',
      productName: 'Natural Lip & Body Set',
      productImage: img3,
      shippingAddress: {
          name: 'Priya Sharma',
          address: '123 Green Avenue, Koramangala',
          city: 'Bangalore',
          pincode: '560034',
          phone: '+91 98765 43210',
      },
      items: [
          { pid: 8, qty: 1 },
          { pid: 12, qty: 2 },
      ],
      tracking: {
          status: 'delivered',
          steps: [
              { label: 'Order Placed', date: '2024-03-08', completed: true },
              { label: 'Processing', date: '2024-03-09', completed: true },
              { label: 'Shipped', date: '2024-03-10', completed: true },
              { label: 'Out for Delivery', date: '2024-03-11', completed: true },
              { label: 'Delivered', date: '2024-03-12', completed: true },
          ],
      },
      reviewSubmitted: false,
  },
  {
      id: 'ORD-1008',
      date: '2024-03-14T15:45:00',
      status: 'delivered',
      paymentMethod: 'UPI',
      productName: 'Face Care Duo Pack',
      productImage: img4,
      shippingAddress: {
          name: 'Priya Sharma',
          address: '123 Green Avenue, Koramangala',
          city: 'Bangalore',
          pincode: '560034',
          phone: '+91 98765 43210',
      },
      items: [
          { pid: 3, qty: 1 },
          { pid: 5, qty: 1 },
      ],
      tracking: {
          status: 'delivered',
          steps: [
              { label: 'Order Placed', date: '2024-03-14', completed: true },
              { label: 'Processing', date: '2024-03-15', completed: true },
              { label: 'Shipped', date: '2024-03-16', completed: true },
              { label: 'Out for Delivery', date: '2024-03-17', completed: true },
              { label: 'Delivered', date: '2024-03-18', completed: true },
          ],
      },
      reviewSubmitted: false,
  },
];

/* ─── Profile Data ─── */
export const mockUser = {
  name: 'Priya Sharma',
  email: 'priya.sharma@gmail.com',
  phone: '+91 98765 43210',
  avatar: null,
  joinDate: 'March 2023',
  totalOrders: 8,
  totalSpent: 15540,
};

export const mockProfileOrders = [
  {
      id: '#EC-8821', date: 'Apr 18, 2025', status: 'Delivered',
      items: 'Elixir Hair Oil × 2', total: 1798, statusColor: '#556B2F',
      tracking: 'DEL-123456',
  },
  {
      id: '#EC-8744', date: 'Apr 02, 2025', status: 'In Transit',
      items: 'Magic Beauty Face Oil × 1', total: 1249, statusColor: '#F59E0B',
      tracking: 'DEL-789012', expected: 'Apr 05, 2025',
  },
  {
      id: '#EC-8601', date: 'Mar 14, 2025', status: 'Delivered',
      items: 'Pure Aloe Vera Gel × 3', total: 1350, statusColor: '#556B2F',
      tracking: 'DEL-345678',
  },
  {
      id: '#EC-8500', date: 'Feb 28, 2025', status: 'Delivered',
      items: 'Brahmi Scalp Serum × 1', total: 1150, statusColor: '#556B2F',
      tracking: 'DEL-901234',
  },
];

export const mockAddresses = [
  {
      id: 1, type: 'Home',
      address: '12, Poes Garden, Chennai - 600086, Tamil Nadu',
      phone: '+91 98765 43210', default: true,
  },
  {
      id: 2, type: 'Work',
      address: '45, Anna Salai, Teynampet, Chennai - 600018, Tamil Nadu',
      phone: '+91 98765 43211', default: false,
  },
];

/* ─── Package Options Library ─── */
export const packageOptions = {
  // We'll use a generic set for most, but allow custom ones
  default: [
    { label: '100 g', price: 200, mrp: 250, perUnit: '₹2.00/g' },
    { label: '200 g', price: 360, mrp: 450, perUnit: '₹1.80/g' },
    { label: '500 g', price: 800, mrp: 1000, perUnit: '₹1.60/g' },
  ],
  liquids: [
    { label: '100 ml', price: 220, mrp: 275, perUnit: '₹2.20/ml' },
    { label: '200 ml', price: 400, mrp: 500, perUnit: '₹2.00/ml' },
    { label: '500 ml', price: 900, mrp: 1125, perUnit: '₹1.80/ml' },
  ]
};
