import progressData from '../mockData/progress.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProgressService {
  constructor() {
    this.progress = { ...progressData };
  }

  async getProgress() {
    await delay(200);
    return { ...this.progress };
  }

  async updateRoomStats(roomId, stats) {
    await delay(250);
    this.progress.roomStats[roomId] = {
      ...this.progress.roomStats[roomId],
      ...stats
    };
    
    // Update global stats
    if (stats.completed) {
      this.progress.totalRoomsCompleted = Object.values(this.progress.roomStats)
        .filter(room => room.completed).length;
    }
    
    return { ...this.progress };
  }

  async addAchievement(achievement) {
    await delay(200);
    if (!this.progress.achievements.find(a => a.id === achievement.id)) {
      this.progress.achievements.push({
        ...achievement,
        unlockedAt: Date.now()
      });
    }
    return { ...this.progress };
  }

  async updateGlobalStats(stats) {
    await delay(200);
    this.progress = { ...this.progress, ...stats };
    return { ...this.progress };
  }

  async incrementPlayTime(minutes) {
    await delay(100);
    this.progress.totalPlayTime += minutes;
    return { ...this.progress };
  }

  async incrementHintsUsed() {
    await delay(100);
    this.progress.totalHintsUsed += 1;
    return { ...this.progress };
  }

  async updateStreak(newStreak) {
    await delay(150);
    this.progress.currentStreak = newStreak;
    this.progress.longestStreak = Math.max(this.progress.longestStreak, newStreak);
    return { ...this.progress };
  }
}

export default new ProgressService();