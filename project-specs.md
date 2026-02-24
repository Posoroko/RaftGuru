# RaftGuru - Project Specifications

## Overview

A simple app to help life raft servicing technicians track inflation tests and measurement deadlines.

## Work Environment

- **Location**: Hangar with foam/vinyl flooring for knee protection and raft safety
- **Floor layout**: Fixed 3x5 grid representing raft positions
- **Users**: Individual phone use or shared tablet mounted for team visibility

## Workflow

### Testing Routine

1. Inflate raft
2. Wait 30 minutes → 1st pressure measurement
3. Wait 60 minutes → 2nd pressure measurement

**⚠️ IMPORTANT: Deadlines are FIXED from inflation time**

Both deadlines are calculated once at inflation and never change:
- 1st measure = inflation time + 30 min
- 2nd measure = inflation time + 90 min (NOT "60 min after 1st measure is taken")

Example:
```
Inflate: 13:00
1st deadline: 13:30
2nd deadline: 14:30

If 1st measure taken at 13:40 (10 min late):
→ 2nd deadline stays at 14:30 (NOT pushed to 14:40)
```

If 1st measurement fails:
- Replace valves
- Reset routine with new inflation time

### Series Management

- 5-11 rafts tested per series (morning or afternoon)
- One active series at a time
- Series always completed before starting new ones
- Series can span overnight (start evening → finish next morning)
- Data persists across sessions

### Work Schedule

**39-hour week (Mon-Thu)**
```
07:30  Start (5min gym/warmup)
10:00  Pause (10min)
10:10  Back to work
12:15  Lunch
13:00  Back to work
14:00  Pause (10min)
14:10  Back to work
15:45  End of day       ← changes based on 35h/39h
```

**39-hour week (Fri) OR 35-hour week (Mon-Fri)**
```
07:30  Start (5min gym/warmup)
10:00  Pause (10min)
10:10  Back to work
12:30  End of day
```

**Schedule settings:**
- All break/lunch times are **hardcoded** (not editable)
- Only **end of day** time changes: 15:45 (39h) or 12:30 (35h/Fri)
- 35h/39h preference stored in Firebase per user

### Alarm Behavior

**Before breaks/end of day:**
- If deadline falls during pause, lunch, or after end of day → alert 5 minutes BEFORE the break starts

**During breaks:**
- NO audio alarms during pause or lunch
- Visual feedback only (flashing border stays visible)

**End of day:**
- All timers stop
- Unfinished rafts → Paused/pending mode
- Completed rafts → Keep green checkmark

**Next morning:**
- Paused rafts resume (click to start new test)
- Timers pick up where left off (if overnight test)

## Technical Approach

### Stack

- **Frontend**: Vue 3 + Vite + PWA (vite-plugin-pwa)
- **Backend**: Firebase (Firestore + Auth)
- **Hosting**: Firebase Hosting or Netlify

### Architecture

- Vue 3 with Composition API
- Composables for reusable logic
- Component-based UI
- All data operations through `useRaftStore` composable (Firebase abstraction layer)

### Authentication

- Firebase Authentication
- Login page required before accessing main app
- Auth methods: Email/password (expandable to Google, etc.)
- User session persisted

### PWA Features

- Installable on mobile/tablet
- Offline capability (service worker)
- Push notifications (future: measurement reminders)

---

## ⚠️ CRITICAL: Code Style

### Indentation
- **4 spaces** (not 2, not tabs)

### CSS Class Names
- **camelCase** for all class names: `gridBox`, `cellWide`, `rowA`
- **NO kebab-case** (can't double-click to select)
- Exception: CSS variables use kebab-case: `var(--color-blue)`

### Vue Template Style
Multi-line attributes with classes on separate lines:
```vue
<div 
    class="
        gridBox full
        flex column
    "
>
```

### ❌ DON'T:
```vue
<div class="grid-box cell-wide">  <!-- kebab-case -->
```

### ✅ DO:
```vue
<div class="gridBox cellWide">    <!-- camelCase -->
```

---

## ⚠️ CRITICAL: CSS Utility Classes

**ALWAYS use the utility classes from `src/css/` instead of writing inline styles or custom CSS properties.**

### Files to use:

**`posoroko.css`** - Layout & spacing utilities:
- Flexbox: `flex`, `column`, `row`, `justifyCenter`, `alignCenter`, `gap10`, `grow`, `shrink0`
- Grid: `centered`
- Sizing: `full`, `w100`, `h100`, `h100vh`
- Spacing: `pad5`, `pad10`, `pad15`, `pad20`, `marTop10`, `marBot20`
- Position: `relative`, `absolute`, `absoluteFull`, `absolutlyCentered`
- Text: `textAlignCenter`, `ellipsis`, `uppercase`, `weight6`
- Font sizes: `fS12`, `fS14`, `fS16`, `fS20`, etc.
- Z-index: `z_1000`, `z_2000`, etc.
- Cursor: `pointer`, `noPointer`, `noSelection`
- Debug: `r` (red border), `b` (blue border), `g` (green border)

**`typography.css`** - Fonts & text:
- Fonts: `roboto`, `caprasimo`
- Weights: `fontWeightLight`, `fontWeightBold`, etc.
- CSS variables: `--text-sm`, `--text-lg`, `--font-sans`

**`icons.css`** - Material Symbols:
- Base: `icon` class with ligature name (e.g., `<span class="icon">menu</span>`)
- Sizes: `iconXs`, `iconSm`, `iconMd`, `iconLg`, `iconXl`, `icon2xl`
- Fill: `iconFilled`, `iconOutlined`

### ❌ DON'T do this:
```css
.myComponent { padding: 10px; display: flex; gap: 10px; }
```

### ✅ DO this:
```html
<div class="flex gap10 pad10">
```

---

## UI Requirements

### Layout

#### Top Bar
- Current time display
- Menu button (hamburger icon)

#### Grid Layout (3 columns × 5 rows)

**Top Row (Row A)**
- 3 equal-width tiles: A-0, A-1, A-2
- A-0 typically holds multiple standups

**Rows B-E**
- Left column (x-0): Wide tiles for lay flat rafts
- Center column (x-1): Narrow walkway (still clickable, rarely used)
- Right column (x-2): Wide tiles for lay flat rafts
- Left and right columns equal width

```
|   A-0   |   A-1   |   A-2   |   ← equal widths
|   B-0   |B-1|     B-2       |   ← B-0/B-2 wide, B-1 narrow
|   C-0   |C-1|     C-2       |
|   D-0   |D-1|     D-2       |
|   E-0   |E-1|     E-2       |
```

#### Tile Modes
Each tile can be in one of two modes:

**Single Mode (default)**
- Holds 1 flat raft
- Standard tile display

**Multi Mode**
- Holds up to 4 small standing rafts
- Each raft independent with its own timer/state
- Tile display: 4 sideways raft icons + next deadline (text rotated)
- Click → Modal shows all 4 rafts laid flat with full data

**Mode Toggle**
- When clicking empty tile, modal has icon to toggle multi-raft mode
- Mode persists for that tile position

### States

#### Empty State
- All tiles show as empty slots
- Large "Start Series" button in center

#### Tile States
| State | Display |
|-------|---------|
| Empty | Empty slot styling |
| Active (1st measure pending) | Raft image + deadline time + visual indicator |
| Active (2nd measure pending) | Raft image + deadline time + different visual indicator |
| Paused (operating) | Raft image, no time (valve/chamber replacement in progress) |
| Complete | Raft image + green checkmark |

#### Visual Alerts
- **5 min before deadline**: Soft warning (subtle visual cue)
- **At deadline**: Hard warning + elapsed time counter
- Audio alarm (optional)

### User Flows

#### Start New Raft Test
1. Tap empty tile → Modal opens
2. Modal: "Start now?" or "Custom time?"
3. If **Now**: Tile shows 1st measure deadline (inflation time + 30min)
4. If **Custom time**: 
   - Set inflation time
   - If 1st measure time already passed → "First measure valid?"
     - **Yes** → Show 2nd measure deadline
     - **No** → "Reset test?" 
       - **Yes** → Reset with new time
       - **No** → Paused state (raft image, no time)

#### Record Measurement (at deadline)
1. Tap tile with pending measurement → Modal opens
2. Modal: "First/Second measure valid?"
3. If **Yes**:
   - 1st measure → Show 2nd measure deadline
   - 2nd measure → Complete state (green checkmark)
4. If **No**:
   - "Reset test?" 
     - **Yes** → Reset with new inflation time
     - **No** → Paused state

#### Manage Active Raft
1. Tap active raft tile → Modal opens
2. Options: "Reset now" / "Set time" / "Delete"

#### Start Paused Raft
1. Tap paused raft → Modal opens
2. "Start new test?" (same as new raft flow)

#### Complete Series
- When all rafts show green checkmark → "Start New Series" button appears

### Menu Options
- Delete current series (always available)
- Work schedule: 35h / 39h toggle
- (Future: settings, logout, etc.)

### Open Questions
- [ ] Show only next deadline OR both deadlines on tile? (Test in UI)

## Data Model

### UserPreferences (stored in Firebase per user)
```javascript
{
  userId: string,
  workWeek: '35h' | '39h'  // default: '39h'
}
```

### TileConfig (persisted separately)
```javascript
{
  position: string,     // e.g., "A-0", "B-2"
  mode: 'single' | 'multi'  // default: 'single'
}
```

### Series
```javascript
{
  id: string,           // Auto-generated
  createdAt: timestamp,
  status: 'active' | 'complete',
  rafts: Raft[]         // Array of raft objects
}
```

### Raft
```javascript
{
  id: string,           // Auto-generated
  position: string,     // e.g., "A-0", "B-2" (single) or "A-0-0", "A-0-1" (multi, index 0-3)
  serialNumber: string | null,  // Optional, can be added by user
  status: 'active-1' | 'active-2' | 'paused' | 'complete',
  inflationTime: timestamp | null,
  firstMeasureTime: timestamp | null,   // inflationTime + 30min (FIXED)
  secondMeasureTime: timestamp | null,  // inflationTime + 90min (FIXED, not sliding)
  completedAt: timestamp | null
}
```

### Position Grid
```
| A-0 | A-1 | A-2 |   ← equal width
| B-0 | B-1 | B-2 |   ← B-1 narrow (walkway)
| C-0 | C-1 | C-2 |   ← C-1 narrow (walkway)
| D-0 | D-1 | D-2 |   ← D-1 narrow (walkway)
| E-0 | E-1 | E-2 |   ← E-1 narrow (walkway)
```
- Center column (B-1 to E-1): narrow but clickable, rarely used
- Any tile can be toggled to multi mode (holds 4 rafts: position-0 to position-3)

### Notes
- No history kept. Series deleted when new one starts.
- Official records maintained on paper service sheets.

## Components

### Pages/Views
- `LoginView.vue` - Firebase auth login page
- `FloorView.vue` - Main grid view (default after login)

### Layout
- `TopBar.vue` - Current time + menu button
- `AppMenu.vue` - Slide-out menu

### Grid
- `FloorGrid.vue` - 3x5 grid container
- `RaftTile.vue` - Tile component (handles both single and multi modes)

### Modals
- `RaftModal.vue` - Single raft interactions (start, measure, reset, delete)
- `MultiRaftModal.vue` - Multi-raft tile view (shows 4 rafts laid flat with data)
- `ConfirmModal.vue` - Simple yes/no confirmations

### UI Elements
- `RaftIcon.vue` - Visual raft representation (CSS-styled)
- `TimeDisplay.vue` - Deadline time + countdown/elapsed
- `AlertBadge.vue` - Warning indicators

## Composables

- `useRaftStore.js` - All data operations (Firebase abstraction layer)
- `useTileConfig.js` - Tile mode storage (single/multi per position)
- `useAuth.js` - Firebase authentication
- `useTimer.js` - Time calculations, countdowns, alerts
- `useWorkSchedule.js` - Hardcoded break times, user's 35h/39h preference (from Firebase)
- `useModal.js` - Modal state management
