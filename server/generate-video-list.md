# Quick Guide: Adding 5000 Videos

## Step-by-Step Process

### 1. Collect Video IDs

Visit YouTube and search for videos in each category. For each video you want to add:

**From URL:** `https://www.youtube.com/watch?v=dQw4w9WgXcQ`  
**Extract ID:** `dQw4w9WgXcQ` (the part after `v=`)

### 2. Category Distribution (Example for 5000 videos)

- **Anime**: ~1000 videos
  - Shounen anime (Naruto, One Piece, Dragon Ball)
  - Slice of life
  - Mecha anime
  - Anime AMVs
  - Anime reviews

- **Movies**: ~800 videos
  - Movie trailers
  - Movie scenes
  - Behind the scenes
  - Movie analysis
  - Classic films

- **Funny Moments**: ~1200 videos
  - Fail compilations
  - Pranks
  - Memes
  - Stand-up comedy
  - Viral videos

- **Gaming**: ~1500 videos (including 18+)
  - FPS games (COD, Valorant, CS:GO)
  - RPGs
  - Speedruns
  - Gaming fails
  - Esports highlights
  - Mature-rated games

- **Cybersecurity**: ~250 videos
  - Ethical hacking tutorials
  - Security news
  - Penetration testing
  - Bug bounty
  - Security tools

- **Tech**: ~250 videos
  - Product reviews
  - Coding tutorials
  - Tech news
  - Unboxing
  - How-to guides

### 3. Format Template

```json
{
  "videoId": "YOUR_VIDEO_ID_HERE",
  "title": "Video Title from YouTube",
  "category": "anime",
  "caption": "Engaging caption with emojis! 🔥",
  "soundName": "Original Audio"
}
```

### 4. Popular Channel Recommendations

**Anime:**
- Crunchyroll Collection
- Funimation
- Aniplex USA
- Toei Animation

**Gaming:**
- IGN
- GameSpot
- Jacksepticeye
- PewDiePie
- Markiplier

**Tech:**
- Marques Brownlee (MKBHD)
- Linus Tech Tips
- Unbox Therapy
- Dave2D

**Cybersecurity:**
- NetworkChuck
- John Hammond
- LiveOverflow
- IppSec

### 5. Automation Tip

You can use a spreadsheet to organize your videos:

| Video ID | Title | Category | Caption | Sound Name |
|----------|-------|----------|---------|------------|
| dQw4w9WgXcQ | Rick Roll | funny | Classic! 😂 | Never Gonna Give You Up |

Then convert to JSON using online converters or a script.

### 6. Import Command

Once your `videos-to-import.json` file is ready:

```bash
tsx server/bulk-import-videos.ts
```

The script will:
- ✅ Check for duplicates
- ✅ Create thumbnails automatically
- ✅ Show progress every 100 videos
- ✅ Handle errors gracefully

## Pro Tips

1. **Use YouTube Search Filters**: Filter by upload date, duration, features
2. **Browse Playlists**: Find curated collections
3. **Check Trending**: Popular content performs well
4. **Mix Content Types**: Variety keeps users engaged
5. **Update Regularly**: Add new viral videos as they appear

## Legal Note

Make sure you're only adding videos that are:
- Publicly available on YouTube
- Not violating copyright
- Appropriate for your audience
- Following YouTube's Terms of Service

## Need Help?

The script handles all the technical parts:
- Generates embed URLs
- Creates thumbnails
- Prevents duplicates
- Tracks progress

You just need to provide the video IDs! 🎬
