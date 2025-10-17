# Invitation Page Design Update

## Overview
Updated the invitation page to match the app's design system used in signin/signup pages.

## Design Changes

### Color Scheme
**Before:**
- Purple gradient background (`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`)
- White text on gradient
- Dramatic shadows

**After:**
- Light gray background (`#f8f9fa`) - matches app design
- Dark text on light background
- Subtle shadows for depth
- Consistent with signin/signup pages

### Key Updates

#### 1. Background
- Changed from purple gradient to light gray (`#f8f9fa`)
- Maintains professional, clean look
- Better readability

#### 2. Typography
- Title: Changed from white (`color: white`) to dark (`color: #1f2937`)
- Subtitle: Changed from white to gray (`color: #6b7280`)
- All text now uses app's color palette

#### 3. Loading State
- Spinner: Changed from white to purple (`--color: #667eea`)
- Text: Now uses dark gray (`color: #4b5563`) with semibold weight

#### 4. Club Card
- Border: Added `1px solid #e5e7eb` for definition
- Shadow: Changed from dramatic (`0 20px 60px rgba(0, 0, 0, 0.3)`) to subtle (`0 1px 3px rgba(0, 0, 0, 0.1)`)
- Border radius: Reduced from `24px` to `16px` for consistency
- Avatar border: Reduced from `4px` to `3px`
- Font weights: Increased for better readability (600/700)

#### 5. Invitation Badge
- Background: Now uses gradient only on badge
- Shadow: Added `0 4px 12px rgba(102, 126, 234, 0.3)` for depth
- Maintains brand color as accent

#### 6. Action Buttons
**Accept Button:**
- Changed from green gradient to solid purple (`#667eea`)
- Matches app's primary color
- Removed heavy shadow
- Border radius: `12px` (consistent with forms)

**Decline Button:**
- Border color: `#d1d5db` (light gray)
- Text color: `#6b7280` (medium gray)
- Hover: Light background (`#f9fafb`)
- 2px border width

#### 7. Back Button
- Added back button (like signin/signup)
- Position: Top-left corner
- Color: Dark gray, hover to purple
- Icon size: 24px
- Absolute positioning with z-index

#### 8. Responsive Design
- Maintained mobile responsiveness
- Back button positioning adjusted for mobile
- Content sizing optimized for all screens

## Design System Consistency

### Colors Used (matching app)
```scss
// Backgrounds
$bg-light: #f8f9fa;
$bg-white: #ffffff;

// Text
$text-primary: #1f2937;
$text-secondary: #4b5563;
$text-tertiary: #6b7280;

// Brand
$brand-primary: #667eea;
$brand-hover: #5568d3;

// Borders
$border-light: #e5e7eb;
$border-gray: #d1d5db;
```

### Typography Scale
```scss
// Desktop
.invitation-title: 32px / 700
.invitation-subtitle: 16px / 500
.club-name: 24px / 700

// Mobile (≤768px)
.invitation-title: 28px / 700
.club-name: 22px / 700

// Small Mobile (≤480px)
.invitation-title: 24px / 700
.club-name: 20px / 700
```

### Spacing
- Border radius: 12px - 16px (consistent with forms)
- Button height: 56px (52px on mobile)
- Card padding: 40px desktop, 32px mobile
- Gap between elements: 12px - 24px

### Shadows
- Cards: `0 1px 3px rgba(0, 0, 0, 0.1)` - subtle depth
- Badge: `0 4px 12px rgba(102, 126, 234, 0.3)` - brand accent
- Avatars: `0 2px 8px rgba(0, 0, 0, 0.08)` - soft elevation

## Visual Hierarchy

1. **Primary Focus**: Invitation badge with gradient (brand accent)
2. **Secondary Focus**: Club card with white background
3. **Tertiary Focus**: Action buttons with clear CTAs
4. **Supporting Element**: Back button for navigation

## Accessibility
- High contrast text on backgrounds
- Clear button states (disabled, hover)
- Readable font sizes
- Touch-friendly button sizes (56px height)
- Sufficient spacing between interactive elements

## Result
The invitation page now seamlessly integrates with the rest of the app's design system, providing a consistent user experience from invitation through authentication and into the main application.
