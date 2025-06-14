import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { roomService, gameService, progressService } from '@/services';
import RoomScene from '@/components/organisms/RoomScene';
import InventoryBar from '@/components/organisms/InventoryBar';
import ObjectInspector from '@/components/organisms/ObjectInspector';
import PuzzleInterface from '@/components/organisms/PuzzleInterface';
import HintButton from '@/components/molecules/HintButton';
import GameHeader from '@/components/molecules/GameHeader';
import ApperIcon from '@/components/ApperIcon';

const GameRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [selectedObject, setSelectedObject] = useState(null);
  const [activePuzzle, setActivePuzzle] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const [currentHintLevel, setCurrentHintLevel] = useState(0);

  // Game timer
  const [gameTime, setGameTime] = useState(0);

  useEffect(() => {
    const loadRoom = async () => {
      setLoading(true);
      setError(null);
      try {
        const roomData = await roomService.getById(roomId);
        const gameStateData = await gameService.startRoom(roomId);
        setRoom(roomData);
        setGameState(gameStateData);
      } catch (err) {
        setError(err.message || 'Failed to load room');
        toast.error('Failed to load room');
      } finally {
        setLoading(false);
      }
    };
    loadRoom();
  }, [roomId]);

  // Game timer effect
  useEffect(() => {
    if (!gameState) return;
    
    const timer = setInterval(() => {
      setGameTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState]);

  const handleObjectClick = async (objectId) => {
    try {
      const object = await roomService.getObjectById(roomId, objectId);
      await gameService.examineObject(objectId);
      setSelectedObject(object);
      
      // Update game state to reflect examination
      const updatedGameState = await gameService.getGameState();
      setGameState(updatedGameState);
    } catch (err) {
      toast.error('Failed to examine object');
    }
  };

  const handleCollectObject = async (objectId) => {
    try {
      await gameService.addToInventory(objectId);
      await roomService.updateObject(roomId, objectId, { isCollected: true });
      
      // Update local room state
      setRoom(prev => ({
        ...prev,
        objects: prev.objects.map(obj => 
          obj.id === objectId ? { ...obj, isCollected: true } : obj
        )
      }));
      
      const updatedGameState = await gameService.getGameState();
      setGameState(updatedGameState);
      
      toast.success(`Collected: ${room.objects.find(obj => obj.id === objectId)?.name}`);
      setSelectedObject(null);
    } catch (err) {
      toast.error('Failed to collect object');
    }
  };

  const handleCombineItems = async (item1Id, item2Id) => {
    try {
      // Find objects that can be combined
      const item1 = room.objects.find(obj => obj.id === item1Id);
      const item2 = room.objects.find(obj => obj.id === item2Id);
      
      if (item1?.combinesWith.includes(item2Id) || item2?.combinesWith.includes(item1Id)) {
        await gameService.combineItems(item1Id, item2Id);
        const updatedGameState = await gameService.getGameState();
        setGameState(updatedGameState);
        
        toast.success('Items combined successfully!');
        
        // Check if combination reveals a puzzle
        const combinedObject = item1.combinesWith.includes(item2Id) ? item1 : item2;
        if (combinedObject.revealsClue) {
          toast.info(combinedObject.revealsClue);
        }
      } else {
        toast.warning('These items cannot be combined');
      }
    } catch (err) {
      toast.error('Failed to combine items');
    }
  };

  const handlePuzzleAttempt = async (puzzleId, solution) => {
    try {
      const puzzle = room.puzzles.find(p => p.id === puzzleId);
      const isCorrect = checkSolution(puzzle, solution);
      
      if (isCorrect) {
        await gameService.solvePuzzle(puzzleId);
        await roomService.solvePuzzle(roomId, puzzleId);
        
        // Update local room state
        setRoom(prev => ({
          ...prev,
          puzzles: prev.puzzles.map(p => 
            p.id === puzzleId ? { ...p, isSolved: true } : p
          )
        }));
        
        const updatedGameState = await gameService.getGameState();
        setGameState(updatedGameState);
        
        toast.success(puzzle.rewardText || 'Puzzle solved!');
        setActivePuzzle(null);
        
        // Check if room is complete
        const allPuzzlesSolved = room.puzzles.every(p => 
          p.id === puzzleId || p.isSolved
        );
        
        if (allPuzzlesSolved) {
          handleRoomComplete();
        }
      } else {
        toast.error('Incorrect solution. Try again!');
      }
    } catch (err) {
      toast.error('Failed to submit puzzle solution');
    }
  };

  const checkSolution = (puzzle, solution) => {
    switch (puzzle.type) {
      case 'code':
        return solution === puzzle.solution;
      case 'pattern':
        return JSON.stringify(solution) === JSON.stringify(puzzle.solution);
      case 'sequence':
        return JSON.stringify(solution) === JSON.stringify(puzzle.solution);
      case 'coordinates':
        return solution.x === puzzle.solution.x && solution.y === puzzle.solution.y;
      case 'riddle':
        return solution.toLowerCase().trim() === puzzle.solution.toLowerCase();
      default:
        return false;
    }
  };

  const handleRoomComplete = async () => {
    try {
      const completionData = await gameService.completeRoom();
      await roomService.completeRoom(roomId, gameTime);
      await progressService.updateRoomStats(roomId, {
        completed: true,
        bestTime: gameTime,
        attempts: 1,
        hintsUsed: gameState.hintsUsed
      });
      
      toast.success('🎉 Room completed! Well done!');
      
      // Navigate back to rooms after a delay
      setTimeout(() => {
        navigate('/rooms');
      }, 3000);
    } catch (err) {
      toast.error('Failed to complete room');
    }
  };

  const handleHintRequest = async (puzzleId) => {
    try {
      await gameService.useHint();
      const updatedGameState = await gameService.getGameState();
      setGameState(updatedGameState);
      
      const puzzle = room.puzzles.find(p => p.id === puzzleId);
      const hintText = puzzle.hints[currentHintLevel] || puzzle.hints[puzzle.hints.length - 1];
      
      toast.info(hintText);
      setCurrentHintLevel(prev => Math.min(prev + 1, puzzle.hints.length - 1));
    } catch (err) {
      toast.error('Failed to get hint');
    }
  };

  const handleExitRoom = () => {
    if (window.confirm('Are you sure you want to exit? Progress will be lost.')) {
      navigate('/rooms');
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <ApperIcon name="Loader2" className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
          <p className="text-white/70 text-lg">Loading escape room...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h2 className="text-2xl font-display text-white mb-4">Room Not Found</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/rooms')}
            className="px-6 py-3 bg-accent text-background font-semibold rounded-lg"
          >
            Back to Rooms
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Game Header */}
      <GameHeader
        roomName={room.name}
        gameTime={gameTime}
        hintsUsed={gameState?.hintsUsed || 0}
        onExit={handleExitRoom}
      />

      {/* Main Game Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Room Scene */}
        <div className="flex-1 relative">
          <RoomScene
            room={room}
            gameState={gameState}
            onObjectClick={handleObjectClick}
            onPuzzleClick={setActivePuzzle}
          />
          
          {/* Hint Button */}
          <div className="absolute top-4 right-4">
            <HintButton
              onHintRequest={handleHintRequest}
              cooldownEnd={gameState?.currentHintCooldown}
              disabled={!activePuzzle}
            />
          </div>
        </div>
      </div>

      {/* Inventory Bar */}
      <InventoryBar
        inventory={gameState?.inventory || []}
        roomObjects={room?.objects || []}
        onCombineItems={handleCombineItems}
        onUseItem={(itemId) => console.log('Use item:', itemId)}
      />

      {/* Modals */}
      <AnimatePresence>
        {selectedObject && (
          <ObjectInspector
            object={selectedObject}
            onCollect={selectedObject.isCollectible ? () => handleCollectObject(selectedObject.id) : null}
            onClose={() => setSelectedObject(null)}
          />
        )}

        {activePuzzle && (
          <PuzzleInterface
            puzzle={activePuzzle}
            onSolve={(solution) => handlePuzzleAttempt(activePuzzle.id, solution)}
            onClose={() => setActivePuzzle(null)}
            onHint={() => handleHintRequest(activePuzzle.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameRoom;