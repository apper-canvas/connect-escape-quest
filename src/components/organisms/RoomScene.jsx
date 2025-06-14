import { motion } from "framer-motion";
import { Canvas, useLoader } from "@react-three/fiber";
import React, { Suspense, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TextureLoader } from "three";
import ApperIcon from "@/components/ApperIcon";

// 3D Object Component
const Object3D = ({ object, onClick, isExamined }) => {
  const [loadError, setLoadError] = useState(false);
  
  try {
    if (object.modelPath && !loadError) {
      const gltf = useLoader(GLTFLoader, object.modelPath);
      return (
        <primitive 
          object={gltf.scene} 
          scale={0.5}
          onClick={onClick}
          onPointerOver={(e) => e.stopPropagation()}
        />
      );
    }
  } catch (error) {
    setLoadError(true);
  }
  
  return null;
};

// 2D Image Object Component
const Object2D = ({ object, onClick, isExamined }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  if (object.imageUrl && !imageError) {
    return (
      <div className="relative w-20 h-20 cursor-pointer" onClick={onClick}>
        <img
          src={object.imageUrl}
          alt={object.name}
          className={`w-full h-full object-cover rounded-lg border-2 transition-all duration-200 ${
            isExamined ? 'border-accent shadow-accent/50' : 'border-accent/50'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          style={{
            filter: isExamined ? 'brightness(1.2) saturate(1.1)' : 'brightness(1)',
            boxShadow: isExamined ? '0 0 20px rgba(212, 175, 55, 0.4)' : '0 0 10px rgba(212, 175, 55, 0.2)'
          }}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-surface/50 rounded-lg animate-pulse" />
        )}
      </div>
    );
  }
  
  return null;
};
const RoomScene = ({ room, gameState, onObjectClick, onPuzzleClick }) => {
  if (!room) return null;

  // Get inventory interaction state with safe defaults
  const selectedInventoryItem = gameState?.selectedInventoryItem || null;
  const canCombineWithSelected = selectedInventoryItem && gameState?.canCombineWith?.includes(selectedInventoryItem);

  const getObjectIcon = (category) => {
    const iconMap = {
      decoration: 'Frame',
      key: 'Key',
      furniture: 'Armchair',
      mystical: 'Sparkles',
      chemical: 'TestTube',
      technology: 'Monitor',
      document: 'FileText',
      navigation: 'Compass',
      weapon: 'Zap',
      container: 'Package'
    };
    return iconMap[category] || 'Circle';
  };

  const backgroundImages = {
    'mansion-bg': 'linear-gradient(135deg, #2C1B47 0%, #4A3B5C 30%, #1A1125 100%)',
    'lab-bg': 'linear-gradient(135deg, #1A1A2E 0%, #16213E 30%, #0F0F23 100%)',
    'ship-bg': 'linear-gradient(135deg, #8B5A2B 0%, #654321 30%, #3E2723 100%)'
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
    {/* Room Background */}
    <div
        className="absolute inset-0"
        style={{
            background: backgroundImages[room.backgroundImage] || backgroundImages["mansion-bg"]
        }} />
    {/* Room Title */}
    <motion.div
        initial={{
            opacity: 0,
            y: -20
        }}
        animate={{
            opacity: 1,
            y: 0
        }}
        className="absolute top-6 left-6 z-20">
        <h2 className="text-2xl font-display font-bold text-white mb-1">
            {room.name}
        </h2>
        <p className="text-white/70 text-sm">
            {room.theme}
        </p>
    </motion.div>
    {/* Interactive Objects */}
    <div className="absolute inset-0 z-10">
        {room.objects.map((object, index) => {
            const isCollected = gameState?.collectedObjects?.includes(object.id);
            const isExamined = gameState?.examinedObjects?.includes(object.id);

            if (isCollected && object.isCollectible)
                return null;

            return (
                <motion.div
                    key={object.id}
                    initial={{
                        opacity: 0,
                        scale: 0.8
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1
                    }}
                    transition={{
                        delay: index * 0.2
                    }}
                    className="absolute cursor-pointer group"
                    style={{
                        left: `${object.position.x}%`,
                        top: `${object.position.y}%`,
                        transform: "translate(-50%, -50%)"
                    }}
                    onClick={() => onObjectClick(object.id)}>
                    {/* Object Glow */}
                    <motion.div
                        className="absolute inset-0 rounded-lg animate-glow"
                        animate={{
                            boxShadow: [
                                "0 0 20px rgba(212, 175, 55, 0.3)",
                                "0 0 30px rgba(212, 175, 55, 0.6)",
                                "0 0 20px rgba(212, 175, 55, 0.3)"
                            ]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity
                        }} />
                    {/* Object Rendering */}
                    <motion.div
                        whileHover={{
                            scale: 1.1,
                            rotate: 2
                        }}
                        whileTap={{
                            scale: 0.95
                        }}
                        className="relative">
                        {/* Try 3D Model First */}
                        {object.modelPath && <div className="w-24 h-24">
                            <Canvas
                                camera={{
                                    position: [0, 0, 5],
                                    fov: 50
                                }}>
                                <ambientLight intensity={0.6} />
                                <pointLight position={[10, 10, 10]} intensity={0.8} />
                                <pointLight position={[-10, -10, -10]} intensity={0.3} />
                                <Suspense fallback={null}>
                                    <Object3D
                                        object={object}
                                        onClick={() => onObjectClick(object.id)}
                                        isExamined={isExamined} />
                                </Suspense>
                            </Canvas>
                        </div>}
                        {/* Fallback to 2D Image */}
                        {!object.modelPath && object.imageUrl && <Object2D
                            object={object}
                            onClick={() => onObjectClick(object.id)}
                            isExamined={isExamined} />}
                        {/* Final Fallback to Icon */}
                        {!object.modelPath && !object.imageUrl && <div
                            className={`
                    relative w-12 h-12 rounded-full flex items-center justify-center
                    border-2 border-accent bg-accent/20 backdrop-blur-sm
                    ${isExamined ? "bg-accent/40" : "bg-accent/20"}
                    transition-all duration-200
                  `}>
                            <ApperIcon name={getObjectIcon(object.category)} className="w-6 h-6 text-accent" />
                        </div>}
                    </motion.div>
                    {/* Object Label with Combination Hint */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 10
                        }}
                        whileHover={{
                            opacity: 1,
                            y: 0
                        }}
                        className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 backdrop-blur-sm rounded text-xs text-white whitespace-nowrap border z-10 ${canCombineWithSelected ? "bg-green-900/90 border-green-500/50" : "bg-surface/90 border-accent/30"}`}>
                        {canCombineWithSelected ? <div className="flex items-center">
                            <ApperIcon name="Zap" className="w-3 h-3 mr-1 text-green-400" />Combine with {selectedInventoryItem?.replace("-", " ")}
                        </div> : <div>
                            {object.name}
                            {isExamined && <ApperIcon name="Eye" className="w-3 h-3 ml-1 inline text-accent" />}
                        </div>}
                    </motion.div>
                </motion.div>
            );
        })}
    </div>
    {/* Puzzle Triggers */}
    {room.puzzles.map((puzzle, index) => {
        const isSolved = gameState?.solvedPuzzles?.includes(puzzle.id);

        const hasRequiredObjects = puzzle.requiredObjects?.every(
            objId => gameState?.examinedObjects?.includes(objId) || gameState?.collectedObjects?.includes(objId)
        );

        if (isSolved || !hasRequiredObjects)
            return null;

        return (
            <motion.div
                key={puzzle.id}
                initial={{
                    opacity: 0,
                    scale: 0
                }}
                animate={{
                    opacity: 1,
                    scale: 1
                }}
                transition={{
                    delay: 1 + index * 0.3
                }}
                className="absolute cursor-pointer group z-20"
                style={{
                    right: "10%",
                    bottom: `${20 + index * 15}%`
                }}
                onClick={() => onPuzzleClick(puzzle)}>
                {/* Puzzle Glow */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                        boxShadow: [
                            "0 0 25px rgba(212, 175, 55, 0.5)",
                            "0 0 40px rgba(212, 175, 55, 0.8)",
                            "0 0 25px rgba(212, 175, 55, 0.5)"
                        ]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity
                    }} />
                {/* Puzzle Icon */}
                <motion.div
                    whileHover={{
                        scale: 1.3,
                        rotate: 10
                    }}
                    whileTap={{
                        scale: 0.9
                    }}
                    className="relative w-16 h-16 rounded-full flex items-center justify-center bg-accent/30 border-2 border-accent backdrop-blur-sm">
                    <ApperIcon name="Lock" className="w-8 h-8 text-accent" />
                </motion.div>
                {/* Puzzle Label */}
                <motion.div
                    initial={{
                        opacity: 0,
                        x: 20
                    }}
                    whileHover={{
                        opacity: 1,
                        x: 0
                    }}
                    className="absolute right-full top-1/2 transform -translate-y-1/2 mr-3 px-3 py-2 bg-surface/90 backdrop-blur-sm rounded-lg text-sm text-white whitespace-nowrap border border-accent/30">
                    <div className="font-medium">{puzzle.title}</div>
                    <div className="text-xs text-white/70">{puzzle.description}</div>
                </motion.div>
            </motion.div>
        );
    })}
    {/* Room Completion Indicator */}
    {room.puzzles.every(p => gameState?.solvedPuzzles?.includes(p.id)) && <motion.div
        initial={{
            opacity: 0,
            scale: 0
        }}
        animate={{
            opacity: 1,
            scale: 1
        }}
        className="absolute inset-0 flex items-center justify-center z-30 bg-black/50 backdrop-blur-sm">
        <motion.div
            initial={{
                y: 20
            }}
            animate={{
                y: 0
            }}
            className="text-center">
            <motion.div
                animate={{
                    rotate: 360
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="w-24 h-24 mx-auto mb-6">
                <ApperIcon name="Trophy" className="w-full h-full text-accent" />
            </motion.div>
            <h2 className="text-4xl font-display font-bold text-accent mb-4">Room Complete!
                            </h2>
            <p className="text-white/80 text-lg">Congratulations! You've solved all puzzles.
                            </p>
        </motion.div>
    </motion.div>}
    {/* Atmospheric Particles */}
    <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent/30 rounded-full"
            style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
            }}
            animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
            }}
            transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4
            }} />)}
    </div>
</div>
  );
};

export default RoomScene;