# TikTok-Style Short Video Application - Design Guidelines

## Design Approach
**Reference-Based Approach:** Draw directly from TikTok's proven mobile-first design patterns, optimized for rapid content consumption and engagement.

## Typography System

**Font Family:** 
- Primary: Inter or SF Pro Display (web-safe alternative: system-ui)
- Weights: 400 (regular), 600 (semibold), 700 (bold)

**Hierarchy:**
- Username/Creator: 15px, semibold
- Video captions: 14px, regular
- Interaction counts: 12px, regular  
- Button labels: 14px, semibold
- Profile bios: 14px, regular
- Tab labels: 11px, semibold

## Layout System

**Spacing Units:** Use Tailwind units of 1, 2, 3, 4, 6, 8, 12, 16
- Component padding: p-4
- Icon spacing: gap-3, gap-4
- Section margins: mb-6, mb-8
- Button padding: px-6, py-3

**Grid Structure:**
- Full viewport height for video feed (100vh sections)
- Profile grid: grid-cols-3 for video thumbnails
- Discover page: grid-cols-2 with 1-unit gap

## Core Components

### Video Feed Container
- Full-screen vertical scrolling container
- Each video occupies exactly 100vh
- Snap-scroll behavior between videos
- Video player fills entire viewport minus safe areas

### Video Overlay Controls (Right Side Stack)
Positioned absolutely, right-4, centered vertically:
- Profile avatar (48px circle) with follow button (+) overlay
- Like button with count below (stacked vertically, gap-6)
- Comment button with count
- Share button with count
- More options (three dots)
Each icon 40px with centered alignment

### Video Information (Bottom Left)
Absolute positioning, bottom-20, left-4:
- Creator username (bold)
- Video caption (max 2 lines, truncated with "more")
- Sound/audio info with music icon
- Spacing: gap-2 between elements

### Bottom Navigation Bar
Fixed bottom navigation, 60px height:
- 5 icons evenly distributed: Home, Discover, Create (+), Inbox, Profile
- Create button: larger circular button (56px) elevated above bar
- Icon size: 24px, active state with indicator
- Safe area padding for mobile devices

### Video Player Controls
- Tap to pause/play (no visible controls)
- Double-tap right side for like (heart animation)
- Sound toggle (bottom right, small icon)
- Progress indicator (thin line at bottom)

### Profile Page Layout
Header section:
- Profile avatar: 96px circle, centered
- Username and handle below avatar
- Follow/Message buttons: full-width buttons with gap-2
- Stats row: Followers, Following, Likes (centered, gap-8)
- Bio text: max-w-md, centered

Content tabs:
- Videos / Liked tabs with underline indicator
- Video grid: 3 columns, square thumbnails with play count overlay

### Comment Section (Overlay)
Slides up from bottom (60% viewport height):
- Rounded top corners (rounded-t-3xl)
- Comments list with scrolling
- Each comment: avatar (32px) + username + text + timestamp
- Reply indentation: pl-12
- Fixed input at bottom with avatar, text field, post button

### Discover/Search Page
- Search bar at top: rounded-full, px-4, py-2
- Trending section: horizontal scroll of video previews
- Category chips: horizontal scroll, pill-shaped buttons
- Video grid: 2 columns, rectangular thumbnails (9:16 ratio)

### Upload Interface
- Full-screen modal
- Video preview: centered, max 70vh
- Trim controls below preview
- Caption input: textarea, rounded-2xl, p-4
- Privacy toggles and settings
- Post button: fixed bottom right

## Component Specifications

**Buttons:**
- Primary actions: rounded-lg, px-6, py-3, semibold text
- Icon buttons: 40px circle for main actions, 32px for secondary
- Follow buttons: rounded-md, px-8, py-2

**Input Fields:**
- Comment input: rounded-full, pl-4, pr-12 (with send button)
- Search: rounded-full, pl-10 (icon), py-2
- Text areas: rounded-2xl, p-4

**Cards/Thumbnails:**
- Video thumbnails: aspect-ratio-9/16, rounded-lg
- Profile cards: rounded-xl, p-4

## Icons
Use Heroicons (outline style for inactive, solid for active states):
- heart, chat-bubble, paper-airplane, ellipsis-horizontal
- home, magnifying-glass, plus-circle, bell, user-circle
- musical-note, volume-x/volume-2

## Animations
**Strategic Use Only:**
- Like button: scale pulse on tap
- Video transitions: smooth snap scrolling
- Comment slide: slide-up animation (300ms)
- Tab indicator: slide animation (200ms)
- Heart explosion on double-tap (TikTok signature)

## Images
**No traditional hero images.** This is a content-driven app where user-generated videos ARE the visual content. Profile avatars and video thumbnails are the primary images, sourced from user uploads or placeholder services.