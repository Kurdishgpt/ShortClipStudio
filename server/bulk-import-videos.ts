import { storage } from './storage';
import { readFileSync } from 'fs';

interface VideoImport {
  videoId: string;
  title: string;
  category: string; // anime, movies, funny, gaming, cybersecurity, tech
  thumbnailUrl?: string;
  caption?: string;
  soundName?: string;
}

async function bulkImportVideos() {
  console.log('Starting bulk video import...');

  // Get or create the youtube_curator user
  let curatorUser = await storage.getUserByUsername('youtube_curator');
  
  if (!curatorUser) {
    curatorUser = await storage.createUser({
      username: 'youtube_curator',
      bio: 'Curating the best videos from across the internet',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=youtube_curator',
    });
    console.log('Created youtube_curator user');
  } else {
    console.log('Using existing youtube_curator user');
  }

  // Read videos from JSON file
  const videoData: VideoImport[] = JSON.parse(
    readFileSync('./server/videos-to-import.json', 'utf-8')
  );

  console.log(`Found ${videoData.length} videos to import`);

  let imported = 0;
  let skipped = 0;

  for (const video of videoData) {
    try {
      // Create YouTube embed URL
      const videoUrl = `https://www.youtube.com/embed/${video.videoId}`;
      const thumbnailUrl = video.thumbnailUrl || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;

      // Check if video already exists by fetching all videos and comparing URLs
      const allVideos = await storage.getAllVideos();
      const exists = allVideos.some(v => v.videoUrl === videoUrl);
      
      if (exists) {
        console.log(`Skipping duplicate: ${video.title}`);
        skipped++;
        continue;
      }

      await storage.createVideo({
        userId: curatorUser.id,
        videoUrl,
        thumbnailUrl,
        caption: video.caption || video.title,
        soundName: video.soundName || 'Original Audio',
      });

      imported++;
      
      if (imported % 100 === 0) {
        console.log(`Imported ${imported} videos...`);
      }
    } catch (error) {
      console.error(`Error importing video ${video.videoId}:`, error);
    }
  }

  console.log('\n=== Import Complete ===');
  console.log(`Imported: ${imported} videos`);
  console.log(`Skipped: ${skipped} videos (duplicates)`);
  console.log(`Total in file: ${videoData.length} videos`);
}

// Run the import
bulkImportVideos()
  .then(() => {
    console.log('Import finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Import failed:', error);
    process.exit(1);
  });
