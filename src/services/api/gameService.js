import gameStateData from '../mockData/gameState.json';
import gameLogic from '../gameLogic.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GameService {
  constructor() {
    this.gameState = { ...gameStateData };
  }

  async getGameState() {
    await delay(100);
    return { ...this.gameState };
  }

  async startRoom(roomId) {
    await delay(200);
    this.gameState = {
      ...this.gameState,
      currentRoom: roomId,
      inventory: [],
      solvedPuzzles: [],
      examinedObjects: [],
      collectedObjects: [],
      hintsUsed: 0,
      playTime: 0,
      gameStartTime: Date.now(),
      currentHintCooldown: 0
    };
    return { ...this.gameState };
  }

  async addToInventory(objectId) {
    await delay(150);
    if (!this.gameState.inventory.includes(objectId)) {
      this.gameState.inventory.push(objectId);
      this.gameState.collectedObjects.push(objectId);
    }
    return { ...this.gameState };
  }

  async removeFromInventory(objectId) {
    await delay(150);
    this.gameState.inventory = this.gameState.inventory.filter(id => id !== objectId);
    return { ...this.gameState };
  }

  async examineObject(objectId) {
    await delay(100);
    if (!this.gameState.examinedObjects.includes(objectId)) {
      this.gameState.examinedObjects.push(objectId);
    }
    return { ...this.gameState };
  }

  async solvePuzzle(puzzleId) {
    await delay(200);
    if (!this.gameState.solvedPuzzles.includes(puzzleId)) {
      this.gameState.solvedPuzzles.push(puzzleId);
    }
    return { ...this.gameState };
  }

  async useHint() {
    await delay(150);
    this.gameState.hintsUsed += 1;
    this.gameState.currentHintCooldown = Date.now() + 30000; // 30 second cooldown
    return { ...this.gameState };
  }

  async updatePlayTime() {
    await delay(50);
    if (this.gameState.gameStartTime) {
      this.gameState.playTime = Math.floor((Date.now() - this.gameState.gameStartTime) / 1000);
    }
    return { ...this.gameState };
  }

async combineItems(item1Id, item2Id) {
    await delay(200);
    
    // Validate combination using game logic
    const validation = gameLogic.validateCombination(item1Id, item2Id, this.gameState);
    
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    // Get combination result
    const combinationResult = gameLogic.getCombinationResult(item1Id, item2Id);
    
    if (combinationResult.success) {
      // Remove consumed items from inventory
      this.gameState.inventory = this.gameState.inventory.filter(
        id => !combinationResult.consumedItems.includes(id)
      );
      
      // Add result item if specified
      if (combinationResult.resultItem) {
        this.gameState.inventory.push(combinationResult.resultItem);
        this.gameState.collectedObjects.push(combinationResult.resultItem);
      }
      
      // Add unlocked clues
      if (combinationResult.unlockedClues) {
        combinationResult.unlockedClues.forEach(clue => {
          if (!this.gameState.unlockedClues.includes(clue)) {
            this.gameState.unlockedClues.push(clue);
          }
        });
      }
      
      return { 
        ...this.gameState,
        lastCombinationResult: combinationResult
      };
    } else {
      throw new Error(combinationResult.message);
    }
  }

  async resetGame() {
    await delay(200);
    this.gameState = { ...gameStateData };
    return { ...this.gameState };
  }

  async completeRoom() {
    await delay(300);
    const completionTime = this.gameState.playTime;
    const roomId = this.gameState.currentRoom;
    
    // Reset game state
    this.gameState = { ...gameStateData };
    
    return {
      roomId,
      completionTime,
      hintsUsed: this.gameState.hintsUsed
    };
  }
}

export default new GameService();