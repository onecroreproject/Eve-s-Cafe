// navbarData.jsx
export const navLinks = [
    { name: 'Bestseller', path: '/bestseller', icon: 'LocalOfferOutlined', badge: 'HOT' },
    { name: 'Blog', path: '/blog', icon: 'AutoStoriesOutlined', badge: null },
    { name: 'Videos', path: '/videos', icon: 'PlayCircleOutlined', badge: null },
    { name: 'About', path: '/about', icon: 'InfoOutlined', badge: null },
    { name: 'Contact', path: '/contact', icon: 'ContactSupportOutlined', badge: null },
];

export const shopCategories = [
    {
        name: 'Face Care',
        path: '/shop/face-care',
        icon: 'CleanHandsOutlined',
        subCategories: [
            { name: 'Combo & Kits', path: '/shop/face-care/combo' },
            { name: 'Face gels', path: '/shop/face-care/face-wash-powder' },
            { name: 'Face Serums', path: '/shop/face-care/face-packs' },
            { name: 'Face Wash', path: '/shop/face-care/soaps' },
            { name: 'Under Eye Care', path: '/shop/face-care/body-scrubs' },
            { name: 'Lip Care', path: '/shop/face-care/lip-scrubs' },
        ]
    },
    {
        name: 'Hair Care',
        path: '/shop/hair-care',
        icon: 'SpaOutlined',
        subCategories: [
            { name: 'Combos & Kits', path: '/shop/hair-care/hair-oil' },
            { name: 'Hair Oils', path: '/shop/hair-care/hair-oil' },
            { name: 'Hair Serums', path: '/shop/hair-care/beard-oil' },
            { name: 'Hair Shampoos', path: '/shop/hair-care/shampoos' },
            { name: 'Hair Mask', path: '/shop/hair-care/hair-pack' },
        ]
    },
    {
        name: 'Body Care',
        path: '/shop/body-care',
        icon: 'SpaOutlined',
        subCategories: [
            { name: 'Combos & Kits', path: '/shop/body-care/soaps' },
            { name: 'Natural Soaps', path: '/shop/body-care/soaps' },
            { name: 'Crack Heel', path: '/shop/body-care/body-scrubs' },
            { name: 'Dark Neck', path: '/shop/body-care/body-scrubs' },
        ]
    },
    {
        name: 'Baby Care',
        path: '/shop/face-care',
        icon: 'ChildCare',
        subCategories: [
            { name: 'Combos & Kits', path: '/shop/face-care/soaps' },
            { name: 'Baby Face Wash', path: '/shop/face-care/face-wash-powder' },
            { name: 'Baby Soaps', path: '/shop/face-care/soaps' },
        ]
    },
    {
        name: 'Wellness & More',
        path: '/shop/herbal-powder',
        icon: 'SpaOutlined',
        subCategories: [
            { name: 'Herbal Teas', path: '/shop/herbal-powder' },
            { name: 'Immunity Boosters', path: '/shop/herbal-powder' },
            { name: 'Trial Kits', path: '/shop/face-care/combo' },
        ]
    },
];
