// App-wide constants
export const APP_NAME = 'Circl';
export const APP_TAGLINE = 'Every Colony Has A Circle 🇮🇳';
export const APP_DESCRIPTION = "India's first colony and society level social platform";

// Post categories with colors and icons
export const POST_CATEGORIES = [
  { id: 'emergency', label: 'Emergency', emoji: '🔴', color: 'badge-emergency', icon: 'AlertTriangle' },
  { id: 'power_water', label: 'Power/Water', emoji: '⚡', color: 'badge-power', icon: 'Zap' },
  { id: 'roads', label: 'Roads', emoji: '🚧', color: 'badge-power', icon: 'Construction' },
  { id: 'events', label: 'Events', emoji: '🎉', color: 'badge-events', icon: 'PartyPopper' },
  { id: 'announcements', label: 'Announcements', emoji: '📢', color: 'badge-events', icon: 'Megaphone' },
  { id: 'marketplace', label: 'Marketplace', emoji: '🛒', color: 'badge-marketplace', icon: 'ShoppingCart' },
  { id: 'business', label: 'Business', emoji: '💼', color: 'badge-business', icon: 'Briefcase' },
  { id: 'general', label: 'General', emoji: '💬', color: 'badge-general', icon: 'MessageSquare' },
  { id: 'lost_found', label: 'Lost/Found', emoji: '🐕', color: 'badge-help', icon: 'Search' },
  { id: 'help', label: 'Help', emoji: '🆘', color: 'badge-help', icon: 'HelpCircle' },
  { id: 'food', label: 'Food', emoji: '🍕', color: 'badge-food', icon: 'UtensilsCrossed' },
  { id: 'health', label: 'Health', emoji: '💊', color: 'badge-health', icon: 'Heart' },
  { id: 'education', label: 'Education', emoji: '📚', color: 'badge-education', icon: 'GraduationCap' },
];

// Location levels
export const LOCATION_LEVELS = [
  { id: 'society', label: 'Society' },
  { id: 'colony', label: 'Colony' },
  { id: 'area', label: 'Area' },
  { id: 'city', label: 'City' },
  { id: 'all', label: 'All' },
];

// Reactions
export const REACTIONS = [
  { id: 'love', emoji: '❤️', label: 'Love' },
  { id: 'haha', emoji: '😂', label: 'Haha' },
  { id: 'wow', emoji: '😮', label: 'Wow' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
  { id: 'clap', emoji: '👏', label: 'Clap' },
  { id: 'pray', emoji: '🙏', label: 'Folded Hands' },
];

// Verification levels
export const VERIFICATION_LEVELS = {
  unverified: { label: 'Unverified', badge: '🟡', color: 'text-amber-500' },
  verified: { label: 'Verified Resident', badge: '🟢', color: 'text-green-500' },
  admin: { label: 'Admin', badge: '🔵', color: 'text-blue-500' },
};

// Report categories
export const REPORT_CATEGORIES = [
  'Spam', 'Fake', 'Offensive', 'Misleading', 'Harassment', 'Other'
];

// Rate limits
export const RATE_LIMITS = {
  posts: { max: 10, window: 'hour' },
  likes: { max: 50, window: 'hour' },
  comments: { max: 20, window: 'hour' },
  aiCalls: { max: 5, window: 'day' },
  emergencyAlerts: { max: 3, window: 'day' },
  adCampaigns: { max: 1, window: 'day' },
};

// BrandLaunch AI tools
export const BRANDLAUNCH_TOOLS = [
  { id: 'brand_studio', title: 'Brand Studio', icon: 'Palette', desc: 'Create complete brand identity' },
  { id: 'profit_calculator', title: 'Profit Calculator', icon: 'Calculator', desc: 'Calculate margins & pricing' },
  { id: 'listing_generator', title: 'Multi Platform Listing', icon: 'LayoutGrid', desc: 'Generate product listings' },
  { id: 'packaging_brief', title: 'Packaging Brief', icon: 'Package', desc: 'Design packaging concepts' },
  { id: 'photo_brief', title: 'AI Photography Brief', icon: 'Camera', desc: 'Plan product photoshoots' },
  { id: 'content_calendar', title: '30 Day Content Calendar', icon: 'Calendar', desc: 'Plan social media content' },
  { id: 'launch_planner', title: 'Launch Campaign Planner', icon: 'Rocket', desc: 'Plan product launches' },
  { id: 'influencer_outreach', title: 'Influencer Outreach', icon: 'Users', desc: 'Find & reach influencers' },
  { id: 'support_bot', title: 'Customer Support Bot', icon: 'Bot', desc: 'Build support chatbot' },
  { id: 'growth_dashboard', title: 'Growth Dashboard', icon: 'TrendingUp', desc: 'Track business growth' },
  { id: 'seo_manager', title: 'SEO Manager', icon: 'Search', desc: 'Optimize search presence' },
];

// Business categories
export const BUSINESS_CATEGORIES = [
  'Restaurant', 'Grocery', 'Salon', 'Gym', 'Pharmacy', 'Clinic',
  'Electronics', 'Clothing', 'Bakery', 'Laundry', 'Pet Shop',
  'Tuition', 'Repair', 'Plumber', 'Electrician', 'Carpenter',
  'Courier', 'Printing', 'Stationery', 'Other'
];

// Emergency types
export const EMERGENCY_TYPES = [
  { id: 'fire', label: 'Fire', emoji: '🔥' },
  { id: 'flood', label: 'Flood', emoji: '🌊' },
  { id: 'medical', label: 'Medical', emoji: '🚑' },
  { id: 'theft', label: 'Theft', emoji: '🚨' },
  { id: 'earthquake', label: 'Earthquake', emoji: '🏚️' },
  { id: 'gas_leak', label: 'Gas Leak', emoji: '💨' },
  { id: 'accident', label: 'Accident', emoji: '🚗' },
  { id: 'other', label: 'Other', emoji: '⚠️' },
];

// Issue categories
export const ISSUE_CATEGORIES = [
  'Water Supply', 'Electricity', 'Road Damage', 'Garbage',
  'Noise', 'Parking', 'Security', 'Maintenance', 'Drainage',
  'Street Lights', 'Dog Menace', 'Encroachment', 'Other'
];

// Issue statuses
export const ISSUE_STATUSES = {
  open: { label: 'Open', color: 'bg-red-100 text-red-700' },
  in_progress: { label: 'In Progress', color: 'bg-amber-100 text-amber-700' },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-700' },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-700' },
};

// Marketplace conditions
export const ITEM_CONDITIONS = ['Brand New', 'Like New', 'Good', 'Fair', 'For Parts'];

// Interests for onboarding
export const INTERESTS = [
  'Community Events', 'Local News', 'Food & Recipes', 'Sports',
  'Gardening', 'Pets', 'Education', 'Health & Wellness',
  'Business Networking', 'Art & Culture', 'Tech & Gadgets',
  'Environment', 'Parenting', 'Senior Citizens', 'Yoga & Fitness',
  'Music', 'Photography', 'Travel', 'Volunteering', 'Reading'
];

// Languages
export const LANGUAGES = [
  { id: 'en', label: 'English', nativeLabel: 'English' },
  { id: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { id: 'hinglish', label: 'Hinglish', nativeLabel: 'Hinglish' },
];

// Navigation items
export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'Home', path: '/' },
  { id: 'issues', label: 'Issues', icon: 'AlertTriangle', path: '/issues' },
  { id: 'create', label: 'Create', icon: 'Plus', path: '/create', isFab: true },
  { id: 'directory', label: 'Directory', icon: 'Store', path: '/directory' },
  { id: 'profile', label: 'Profile', icon: 'User', path: '/profile' },
];
