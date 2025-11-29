# Video Embedding Feature

## Overview

The advent calendar now supports video embedding from YouTube and Vimeo. Users can add video entries to their calendar doors, and the videos will be automatically converted to embeddable format and displayed in an iframe.

## Features

- **Supported Platforms**: YouTube and Vimeo
- **Automatic URL Conversion**: Regular video URLs are automatically converted to embed URLs
- **Video Player**: Full-featured iframe player with fullscreen support
- **Responsive Design**: Video player maintains 16:9 aspect ratio

## How to Use

### Creating a Video Entry

1. Navigate to your calendar's edit page
2. Click on a day to create or edit an entry
3. Select "Video" from the Entry Type dropdown
4. Enter a YouTube or Vimeo URL in the Video URL field
   - YouTube examples:
     - `https://www.youtube.com/watch?v=VIDEO_ID`
     - `https://youtu.be/VIDEO_ID`
   - Vimeo example:
     - `https://vimeo.com/VIDEO_ID`
5. Add a title and optional content text
6. Click "Save Entry"

The URL will be automatically converted to the proper embed format when saved.

### Viewing a Video Entry

When a user opens a calendar door with a video:

1. The video player appears in the entry modal
2. The video is embedded in a responsive 16:9 player
3. Users can play, pause, and fullscreen the video
4. Optional text content appears below the video

## Technical Implementation

### Database Schema

```prisma
enum EntryType {
  TEXT
  POEM
  IMAGE
  VIDEO
}

model CalendarEntry {
  // ... other fields
  videoUrl   String?
  type       EntryType
}
```

### URL Conversion

The `convertToEmbedUrl()` function in `src/lib/videoUtils.ts` handles automatic conversion:

- **YouTube**: Converts watch URLs and short URLs to `/embed/` format
- **Vimeo**: Converts regular URLs to `player.vimeo.com/video/` format
- **Already embedded URLs**: Returns unchanged
- **Unknown formats**: Returns original URL

### API Endpoints

Both entry creation and update endpoints accept `videoUrl`:

- `POST /api/calendars/[id]/entries` - Create entry with video
- `PATCH /api/calendars/[id]/entries/[entryId]` - Update entry video

### UI Components

**Edit Page** (`src/app/calendar/[id]/edit/page.tsx`):

- Video type selector in entry type dropdown
- Conditional video URL input field with helper text
- Automatic URL conversion on save using `convertToEmbedUrl()`

**Share Page** (`src/app/share/[shareId]/page.tsx`):

- Video iframe rendering in entry modal
- Responsive aspect-video container
- Standard iframe permissions for video playback

## Browser Support

The video feature uses standard HTML5 iframe embedding, which is supported by all modern browsers:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security

- Only YouTube and Vimeo embed URLs are supported (trusted platforms)
- Iframe sandboxing with specific permissions
- No direct file uploads or arbitrary iframe sources

## Future Enhancements

Potential improvements for future versions:

- Additional video platform support (Dailymotion, etc.)
- Video thumbnail preview in edit mode
- Video autoplay/mute options
- Custom video player controls
- Video upload support (not just embedding)
