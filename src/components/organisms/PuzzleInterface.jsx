import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const PuzzleInterface = ({ puzzle, onSolve, onClose, onHint }) => {
  const [solution, setSolution] = useState('');
  const [patternSolution, setPatternSolution] = useState([]);
  const [coordinates, setCoordinates] = useState({ x: '', y: '' });
  const [sequenceSolution, setSequenceSolution] = useState([]);

  if (!puzzle) return null;

  const handleSubmit = () => {
    let finalSolution;
    
    switch (puzzle.type) {
      case 'code':
        finalSolution = solution;
        break;
      case 'pattern':
        finalSolution = patternSolution;
        break;
      case 'sequence':
        finalSolution = sequenceSolution;
        break;
      case 'coordinates':
        finalSolution = { x: parseInt(coordinates.x), y: parseInt(coordinates.y) };
        break;
      case 'riddle':
        finalSolution = solution;
        break;
      default:
        finalSolution = solution;
    }
    
    onSolve(finalSolution);
  };

  const isValid = () => {
    switch (puzzle.type) {
      case 'code':
        return solution.length >= 3;
      case 'pattern':
        return patternSolution.length > 0;
      case 'sequence':
        return sequenceSolution.length > 0;
      case 'coordinates':
        return coordinates.x !== '' && coordinates.y !== '';
      case 'riddle':
        return solution.trim().length > 0;
      default:
        return solution.length > 0;
    }
  };

  const renderPuzzleInput = () => {
    switch (puzzle.type) {
      case 'code':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-white/80 mb-4">Enter the code:</h4>
              <div className="flex justify-center space-x-2">
                {[...Array(4)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength="1"
                    value={solution[i] || ''}
                    onChange={(e) => {
                      const newSolution = solution.split('');
                      newSolution[i] = e.target.value;
                      setSolution(newSolution.join(''));
                      
                      // Auto-focus next input
                      if (e.target.value && i < 3) {
                        const nextInput = e.target.parentElement.children[i + 1];
                        nextInput?.focus();
                      }
                    }}
                    className="w-12 h-12 bg-surface border border-accent/50 rounded-lg text-center text-xl font-bold text-accent focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'pattern':
        const patternOptions = ['moon', 'star', 'sun', 'key'];
        return (
          <div className="space-y-4">
            <h4 className="text-white/80 text-center mb-4">Select the pattern in order:</h4>
            <div className="grid grid-cols-2 gap-3">
              {patternOptions.map((option) => (
                <motion.button
                  key={option}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (patternSolution.includes(option)) {
                      setPatternSolution(prev => prev.filter(item => item !== option));
                    } else {
                      setPatternSolution(prev => [...prev, option]);
                    }
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    patternSolution.includes(option)
                      ? 'border-accent bg-accent/20 text-accent'
                      : 'border-white/30 bg-surface text-white/70 hover:border-accent/50'
                  }`}
                >
                  <ApperIcon 
                    name={option === 'moon' ? 'Moon' : option === 'star' ? 'Star' : option === 'sun' ? 'Sun' : 'Key'} 
                    className="w-8 h-8 mx-auto mb-2" 
                  />
                  <div className="text-sm capitalize">{option}</div>
                  {patternSolution.includes(option) && (
                    <div className="text-xs text-accent mt-1">
                      #{patternSolution.indexOf(option) + 1}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
            <div className="text-center text-white/60 text-sm">
              Selected: {patternSolution.map(item => item).join(' → ')}
            </div>
          </div>
        );

      case 'sequence':
        return (
          <div className="space-y-4">
            <h4 className="text-white/80 text-center mb-4">Set the frequency sequence:</h4>
            <div className="grid grid-cols-2 gap-4">
              {[440, 523, 659, 784].map((freq, index) => (
                <motion.button
                  key={freq}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (sequenceSolution.includes(freq)) {
                      setSequenceSolution(prev => prev.filter(f => f !== freq));
                    } else {
                      setSequenceSolution(prev => [...prev, freq]);
                    }
                  }}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    sequenceSolution.includes(freq)
                      ? 'border-accent bg-accent/20 text-accent'
                      : 'border-white/30 bg-surface text-white/70 hover:border-accent/50'
                  }`}
                >
                  <div className="font-bold">{freq} Hz</div>
                  {sequenceSolution.includes(freq) && (
                    <div className="text-xs text-accent mt-1">
                      #{sequenceSolution.indexOf(freq) + 1}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
            <div className="text-center text-white/60 text-sm">
              Sequence: {sequenceSolution.join(' → ')}
            </div>
          </div>
        );

      case 'coordinates':
        return (
          <div className="space-y-4">
            <h4 className="text-white/80 text-center mb-4">Enter coordinates:</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="X Coordinate"
                type="number"
                value={coordinates.x}
                onChange={(e) => setCoordinates(prev => ({ ...prev, x: e.target.value }))}
                placeholder="0"
              />
              <Input
                label="Y Coordinate"
                type="number"
                value={coordinates.y}
                onChange={(e) => setCoordinates(prev => ({ ...prev, y: e.target.value }))}
                placeholder="0"
              />
            </div>
          </div>
        );

      case 'riddle':
        return (
          <div className="space-y-4">
            <div className="bg-primary/20 p-4 rounded-lg border border-accent/30">
              <h4 className="text-accent font-medium mb-2">Riddle:</h4>
              <p className="text-white/80 italic">
                {puzzle.riddle}
              </p>
            </div>
            <Input
              label="Your Answer"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Type your answer..."
              icon="MessageCircle"
            />
          </div>
        );

      default:
        return (
          <Input
            label="Solution"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="Enter your solution..."
          />
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-xl shadow-2xl max-w-lg w-full p-6 border border-secondary/30"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <ApperIcon name="Lock" className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white">
                {puzzle.title}
              </h2>
              <p className="text-white/60 text-sm">
                {puzzle.type.charAt(0).toUpperCase() + puzzle.type.slice(1)} Puzzle
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            icon="X"
            onClick={onClose}
            className="text-white/70 hover:text-white"
          />
        </div>

        {/* Description */}
        <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-accent/20">
          <p className="text-white/80">
            {puzzle.description}
          </p>
        </div>

        {/* Puzzle Input */}
        <div className="mb-6">
          {renderPuzzleInput()}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            onClick={onHint}
            variant="outline"
            icon="Lightbulb"
            className="flex-shrink-0"
          >
            Hint
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={!isValid()}
            variant="primary"
            icon="Check"
            className="flex-1"
          >
            Submit Solution
          </Button>
          
          <Button
            onClick={onClose}
            variant="ghost"
            className="flex-shrink-0"
          >
            Cancel
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PuzzleInterface;