import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { progressService, roomService } from '@/services';
import ApperIcon from '@/components/ApperIcon';
import LoadingSkeleton from '@/components/atoms/LoadingSkeleton';
import ErrorState from '@/components/molecules/ErrorState';
import StatsCard from '@/components/molecules/StatsCard';
import AchievementCard from '@/components/molecules/AchievementCard';
import RoomProgressCard from '@/components/molecules/RoomProgressCard';

const Progress = () => {
  const [progress, setProgress] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProgress = async () => {
      setLoading(true);
      setError(null);
      try {
        const [progressData, roomsData] = await Promise.all([
          progressService.getProgress(),
          roomService.getAll()
        ]);
        setProgress(progressData);
        setRooms(roomsData);
      } catch (err) {
        setError(err.message || 'Failed to load progress');
        toast.error('Failed to load progress');
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, []);

  const formatTime = (seconds) => {
    if (!seconds) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const calculateCompletionPercentage = () => {
    if (!progress || !rooms.length) return 0;
    return Math.round((progress.totalRoomsCompleted / rooms.length) * 100);
  };

  const getAverageTime = () => {
    if (!progress) return 0;
    const completedRooms = Object.values(progress.roomStats).filter(room => room.completed);
    if (completedRooms.length === 0) return 0;
    const totalTime = completedRooms.reduce((sum, room) => sum + (room.bestTime || 0), 0);
    return Math.round(totalTime / completedRooms.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <LoadingSkeleton height="h-10" width="w-48" className="mx-auto mb-4" />
            <LoadingSkeleton height="h-6" width="w-64" className="mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <LoadingSkeleton key={i} height="h-24" className="rounded-xl" />
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LoadingSkeleton height="h-96" className="rounded-xl" />
            <LoadingSkeleton height="h-96" className="rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <ErrorState 
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Your Progress
          </h1>
          <p className="text-white/70 text-lg">
            Track your escape room achievements and statistics
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatsCard
            icon="Trophy"
            label="Rooms Completed"
            value={progress?.totalRoomsCompleted || 0}
            total={rooms.length}
            color="accent"
          />
          
          <StatsCard
            icon="Clock"
            label="Total Play Time"
            value={formatTime(progress?.totalPlayTime || 0)}
            subtitle="Hours played"
            color="info"
          />
          
          <StatsCard
            icon="Lightbulb"
            label="Hints Used"
            value={progress?.totalHintsUsed || 0}
            subtitle="Total hints"
            color="warning"
          />
          
          <StatsCard
            icon="Target"
            label="Completion Rate"
            value={`${calculateCompletionPercentage()}%`}
            subtitle="Overall progress"
            color="success"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Room Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-surface rounded-xl p-6 border border-secondary/20"
          >
            <div className="flex items-center space-x-3 mb-6">
              <ApperIcon name="Map" className="w-6 h-6 text-accent" />
              <h2 className="text-xl font-display font-semibold text-white">
                Room Progress
              </h2>
            </div>
            
            <div className="space-y-4">
              {rooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <RoomProgressCard
                    room={room}
                    stats={progress?.roomStats[room.id]}
                    formatTime={formatTime}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-surface rounded-xl p-6 border border-secondary/20"
          >
            <div className="flex items-center space-x-3 mb-6">
              <ApperIcon name="Award" className="w-6 h-6 text-accent" />
              <h2 className="text-xl font-display font-semibold text-white">
                Achievements
              </h2>
            </div>
            
            {progress?.achievements?.length > 0 ? (
              <div className="space-y-4">
                {progress.achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <AchievementCard achievement={achievement} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center py-8"
              >
                <ApperIcon name="Medal" className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-white/70 font-medium mb-2">No achievements yet</h3>
                <p className="text-white/50 text-sm">
                  Complete escape rooms to unlock achievements!
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Additional Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-surface rounded-xl p-6 border border-secondary/20"
        >
          <div className="flex items-center space-x-3 mb-6">
            <ApperIcon name="BarChart3" className="w-6 h-6 text-accent" />
            <h2 className="text-xl font-display font-semibold text-white">
              Performance Summary
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-2">
                {formatTime(getAverageTime())}
              </div>
              <div className="text-white/70 text-sm">Average Completion Time</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-success mb-2">
                {progress?.currentStreak || 0}
              </div>
              <div className="text-white/70 text-sm">Current Streak</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-info mb-2">
                {progress?.longestStreak || 0}
              </div>
              <div className="text-white/70 text-sm">Longest Streak</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Progress;