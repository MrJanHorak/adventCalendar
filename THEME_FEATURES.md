# Calendar Theme & Styling Features

## Overview

The advent calendar now supports comprehensive theming and styling options at the calendar level, allowing you to customize the overall look and feel of your shared calendar pages.

## Features Added

### 1. Theme Presets

Six pre-built holiday themes to choose from:

- **Classic Christmas**: Traditional red and green with snowflakes
- **Winter Wonderland**: Icy blues and whites for a snowy atmosphere
- **Festive Gold**: Elegant gold and deep green luxury theme
- **Cozy Cabin**: Warm browns and rustic reds
- **Modern Minimal**: Clean and contemporary design with dots
- **Candy Cane**: Sweet peppermint pink and white stripes

### 2. Customizable Theme Elements

#### Colors

- **Background Color**: Set the main page background color
- **Text Color**: Control all text colors on the calendar
- **Primary Color**: Used for unopened calendar doors (accent color)
- **Secondary Color**: Used for opened/completed doors

#### Background Patterns

Choose from decorative patterns:

- None (solid color)
- Snowflakes (subtle winter pattern)
- Stars (holiday star pattern)
- Woodgrain (rustic texture)
- Dots (minimal modern pattern)
- Diagonal Stripes (candy cane style)

#### Effects

- **Animated Snowflakes**: Toggle falling snowflakes animation on/off

### 3. Where to Customize

#### During Calendar Creation

When creating a new calendar (`/calendar/create`):

1. Enter calendar title and description
2. Select a theme preset from the grid
3. Click "Create Calendar"

#### After Calendar Creation

When editing a calendar (`/calendar/[id]/edit`):

1. Click the "🎨 Calendar Theme & Styling" section to expand
2. Choose a preset or customize colors individually
3. Select a background pattern
4. Toggle snowflakes on/off
5. Click "💾 Save Theme Settings"

### 4. How It Works

#### Database Schema

New fields added to the `Calendar` model:

```prisma
theme               String?  @default("classic")
backgroundColor     String?  @default("#f9fafb")
backgroundPattern   String?  @default("none")
primaryColor        String?  @default("#dc2626")
secondaryColor      String?  @default("#16a34a")
textColor           String?  @default("#111827")
snowflakesEnabled   Boolean  @default(true)
customDecoration    String?
```

#### Theme Application

- Themes are applied to the public share page (`/share/[shareId]`)
- The entire page background, text colors, and door colors reflect your theme
- Both viewer and owner preview modes respect theme settings
- Entry-level formatting (from previous features) works independently

### 5. Theme Presets Library

Located in `/src/lib/themes.ts`:

- `themePresets`: Array of all available theme configurations
- `getThemePreset()`: Retrieve a specific theme by ID
- `getThemeStyles()`: Convert theme to CSS styles with background patterns

## API Updates

### Create Calendar

`POST /api/calendars`

```json
{
  "title": "My Calendar",
  "description": "Optional description",
  "theme": "winter-wonderland",
  "backgroundColor": "#eff6ff",
  "backgroundPattern": "snowflakes",
  "primaryColor": "#3b82f6",
  "secondaryColor": "#60a5fa",
  "textColor": "#1e3a8a",
  "snowflakesEnabled": true
}
```

### Update Calendar Theme

`PATCH /api/calendars/[id]`

```json
{
  "theme": "festive-gold",
  "backgroundColor": "#fffbeb",
  "primaryColor": "#eab308",
  "secondaryColor": "#15803d",
  "textColor": "#713f12",
  "backgroundPattern": "stars",
  "snowflakesEnabled": false
}
```

## UI Components

### Create Page

- Grid of theme preset cards with visual color previews
- Preset selection updates calendar theme on creation

### Edit Page

- Collapsible theme editor section
- Preset selector with descriptions
- Color pickers for all theme colors (with hex input)
- Background pattern dropdown
- Snowflakes toggle checkbox
- Save button to persist changes

### Share Page

- Applies theme background color and pattern to entire page
- Uses theme colors for calendar title and text
- Door buttons use primary/secondary colors for unopened/opened states
- Conditional snowflakes rendering based on theme setting
- Entry formatting remains independent and layered on top

## Best Practices

1. **Choose a Preset First**: Start with a preset that's close to your vision
2. **Customize Gradually**: Make incremental color adjustments
3. **Test Both Modes**: Use "Preview as Viewer" and "Owner Preview" to see results
4. **Consider Readability**: Ensure text color contrasts well with background
5. **Save Often**: Theme changes only take effect after clicking save

## Combining with Entry Formatting

Theme settings work alongside entry-level formatting:

- **Theme**: Controls the overall page appearance (background, doors, text)
- **Entry Formatting**: Controls individual entry content (fonts, borders, shadows)
- Both systems are independent and complementary
- Entry backgrounds can override theme background within the content area

## Future Enhancements

Potential additions:

- Custom CSS injection field
- More background patterns (geometric, holiday-specific)
- Gradient backgrounds
- Door animation styles
- Theme preview before saving
- Import/export theme configurations
