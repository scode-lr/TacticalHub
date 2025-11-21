# Club Invitation Flow

## Overview
This document describes the club invitation feature that allows users to join a club through a unique invitation link.

## Flow Description

### 1. Invitation Link
Users receive an invitation link with a unique UUID:
```
https://your-app.com/invitation/{uuid}
```

Example:
```
https://your-app.com/invitation/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

### 2. Invitation Page (`/invitation/:uuid`)
When a user clicks the invitation link, they are taken to the invitation page which:
- Displays a beautiful, centered layout with no scrolling
- Shows the club information (name, location, description, member count)
- Displays who invited them
- Shows loading state while fetching invitation details
- Handles error states (invalid/expired links)
- Provides two options:
  - **Accept Invitation** - Proceeds to player registration
  - **Decline** - Redirects to welcome page

#### Features:
- Gradient background (purple theme)
- Centered content with no scroll
- Animated loading states
- Responsive design for mobile and desktop
- Glass morphism effects

### 3. Player Registration (`/player-register`)
After accepting the invitation, users are redirected to the player registration page with query parameters:
```
/player-register?clubId=1&invitationId=a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

The registration form:
- Captures all player information
- Automatically associates the player with the club
- Includes the invitation context in the registration data

### 4. Home Page (`/app/dashboard`)
After successful registration, users are automatically redirected to the home page where they can:
- See their team dashboard
- Access club features
- View team members
- Start using the application

## Technical Implementation

### Routes
```typescript
{
  path: 'invitation/:uuid',
  loadComponent: () => import('./pages/invitation/invitation.page')
}
```

### Files Created
1. **invitation.page.ts** - Component logic with UUID handling
2. **invitation.page.html** - Centered invitation UI template
3. **invitation.page.scss** - Responsive styling with gradient background

### Key Components
- **InvitationPage**: Handles invitation display and acceptance
- **PlayerRegisterPage**: Updated to accept club context via query params

### Data Flow
```
Invitation Link (UUID) 
  → Fetch invitation details from API
  → Display club information
  → User accepts
  → Redirect to registration with clubId + invitationId
  → Submit registration with club context
  → Redirect to app home
```

## API Integration Points

### 1. Load Invitation
```typescript
GET /api/invitations/{uuid}
Response: {
  clubId: string,
  clubName: string,
  clubLocation: string,
  clubImageUrl: string,
  membersCount: number,
  description: string,
  invitedBy: string
}
```

### 2. Accept Invitation
```typescript
POST /api/invitations/{uuid}/accept
Body: { /* player registration data */ }
Response: { success: boolean }
```

### 3. Decline Invitation
```typescript
POST /api/invitations/{uuid}/decline
Response: { success: boolean }
```

## User Experience

### Desktop
- Full gradient background
- Large centered card with club information
- Clear action buttons
- Professional presentation

### Mobile
- Optimized for small screens
- Touch-friendly buttons
- Responsive typography
- No horizontal scrolling

## Error Handling
- Invalid UUID → Error message with retry option
- Expired invitation → Clear error message
- Network errors → User-friendly error display
- Failed acceptance → Retry mechanism

## Security Considerations
- UUID validation on backend
- Invitation expiry checks
- One-time use invitations (optional)
- Rate limiting on invitation endpoints
- User authentication after registration
