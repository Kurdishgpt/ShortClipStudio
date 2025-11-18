# How to Bulk Import 5000 YouTube Videos

This guide will help you manually add 5000 YouTube videos across different categories to your TikTok-style app!

## Categories to Add
- Anime
- Movies
- Funny Moments
- Gaming (18+ and regular)
- Cybersecurity
- Tech Videos

## Quick Start

### Step 1: Prepare Your Video List

Edit the `server/videos-to-import.json` file and add your YouTube videos. Each video needs:

```json
{
  "videoId": "VIDEO_ID_FROM_YOUTUBE",
  "title": "Video Title",
  "category": "anime | movies | funny | gaming | cybersecurity | tech",
  "caption": "Your creative caption with emojis!",
  "soundName": "Original Audio or Sound Name"
}
```

### Step 2: How to Get YouTube Video ID

From a YouTube URL like: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

The video ID is: `dQw4w9WgXcQ` (the part after `v=`)

### Step 3: Run the Import Script

```bash
tsx server/bulk-import-videos.ts
```

## Example Video Entry

```json
{
  "videoId": "dQw4w9WgXcQ",
  "title": "Rick Astley - Never Gonna Give You Up",
  "category": "funny",
  "caption": "Classic Rick Roll - Never gonna give you up! 😂",
  "soundName": "Never Gonna Give You Up"
}
```

## Category Examples

### Anime Videos
- Attack on Titan clips
- Demon Slayer battles
- My Hero Academia moments
- Anime AMVs
- Anime compilations

### Movies
- Movie trailers
- Movie clips
- Behind the scenes
- Movie reviews
- Classic movie moments

### Funny Moments
- Fail compilations
- Pranks
- Comedy sketches
- Viral memes
- Funny animals

### Gaming
- Gameplay highlights
- Game reviews
- Esports moments
- Gaming tutorials
- Funny gaming moments

### Cybersecurity
- Security tutorials
- Hacking demonstrations
- Security news
- CTF walkthroughs
- Security tool reviews

### Tech Videos
- Product reviews
- Tech news
- Coding tutorials
- Tech unboxing
- Tech comparisons

## Tips for Finding 5000 Videos

1. **Search YouTube** for category-specific content
2. **Use popular channels** in each category
3. **Look for compilations** (they count as 1 video but have multiple clips)
4. **Browse trending** videos in each category
5. **Check YouTube playlists** for bulk video ideas

## Script Features

✅ **Automatically creates** YouTube embed URLs  
✅ **Generates thumbnails** from YouTube  
✅ **Prevents duplicates** - won't import the same video twice  
✅ **Progress tracking** - shows import status every 100 videos  
✅ **Error handling** - continues even if one video fails  

## Video Template

Copy this template and fill it out 5000 times, or create a spreadsheet and generate JSON:

```json
[
  {
    "videoId": "",
    "title": "",
    "category": "anime",
    "caption": "",
    "soundName": "Original Audio"
  }
]
```

## Need More Help?

The script will:
- Show you how many videos it found
- Tell you which videos are duplicates
- Display import progress
- Show final statistics

Happy importing! 🎬
