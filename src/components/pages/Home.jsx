import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { roomService } from '@/services';
import ApperIcon from '@/components/ApperIcon';
import RoomCard from '@/components/organisms/RoomCard';
import LoadingSkeleton from '@/components/atoms/LoadingSkeleton';
import ErrorState from '@/components/molecules/ErrorState';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRooms = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await roomService.getAll();
        setRooms(result);
      } catch (err) {
        setError(err.message || 'Failed to load rooms');
        toast.error('Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };
    loadRooms();
  }, []);

  const handleStartRoom = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (room.isLocked) {
      toast.warning('Complete previous rooms to unlock this one!');
      return;
    }
    navigate(`/room/${roomId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <LoadingSkeleton height="h-12" width="w-64" className="mx-auto mb-4" />
            <LoadingSkeleton height="h-6" width="w-96" className="mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <LoadingSkeleton height="h-80" className="rounded-xl" />
              </motion.div>
            ))}
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative px-6 py-16 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <ApperIcon 
              name="KeyRound" 
              className="w-20 h-20 text-accent mx-auto mb-4 animate-float" 
            />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-display font-bold text-white mb-6"
          >
            Welcome to <span className="text-accent">Escape Quest</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Immerse yourself in mysterious virtual escape rooms. Solve puzzles, 
            uncover secrets, and test your wits in beautifully crafted environments.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 text-sm text-white/60 mb-12"
          >
            <div className="flex items-center space-x-2">
              <ApperIcon name="Clock" size={16} />
              <span>15-45 minutes per room</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Users" size={16} />
              <span>Single player experience</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Lightbulb" size={16} />
              <span>Progressive hint system</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Rooms Grid */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-display font-semibold text-white text-center mb-4">
              Choose Your Adventure
            </h2>
            <p className="text-white/70 text-center max-w-2xl mx-auto">
              Each room offers unique challenges and immersive storytelling. 
              Complete rooms in order to unlock new mysteries.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.2 }}
              >
                <RoomCard 
                  room={room}
                  onStart={() => handleStartRoom(room.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;