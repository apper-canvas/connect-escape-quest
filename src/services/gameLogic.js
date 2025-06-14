// Game Logic Service - Handles item combinations and clue unlocking
class GameLogicService {
  constructor() {
    // Define valid item combinations and their results
    this.combinations = {
      // Key combinations
      'ancient-key,mysterious-box': {
        success: true,
        resultItem: 'opened-box',
        unlockedClues: ['hidden-chamber-location'],
        message: 'The ancient key opens the mysterious box, revealing a hidden map!'
      },
      'rusty-key,locked-drawer': {
        success: true,
        resultItem: 'drawer-contents',
        unlockedClues: ['safe-combination'],
        message: 'The rusty key unlocks the drawer, revealing important documents!'
      },
      
      // Chemical combinations
      'red-potion,blue-potion': {
        success: true,
        resultItem: 'purple-elixir',
        unlockedClues: ['potion-master-secret'],
        message: 'The potions combine to create a powerful purple elixir!'
      },
      'chemical-vial,test-tube': {
        success: true,
        resultItem: 'mixed-solution',
        unlockedClues: ['laboratory-password'],
        message: 'The chemicals react, revealing a hidden message!'
      },
      
      // Document combinations
      'torn-page-1,torn-page-2': {
        success: true,
        resultItem: 'complete-journal',
        unlockedClues: ['secret-passage-code'],
        message: 'The torn pages form a complete journal entry!'
      },
      'map-fragment-1,map-fragment-2': {
        success: true,
        resultItem: 'treasure-map',
        unlockedClues: ['treasure-location'],
        message: 'The map fragments reveal the location of hidden treasure!'
      },
      
      // Mystical combinations
      'crystal-shard,magic-staff': {
        success: true,
        resultItem: 'powered-staff',
        unlockedClues: ['portal-activation'],
        message: 'The crystal energizes the staff with mystical power!'
      },
      'spell-scroll,magic-ink': {
        success: true,
        resultItem: 'activated-spell',
        unlockedClues: ['summoning-ritual'],
        message: 'The ink brings the spell to life!'
      },
      
      // Tool combinations
      'hammer,chisel': {
        success: true,
        resultItem: 'stone-carving-tools',
        unlockedClues: ['hidden-symbol-meaning'],
        message: 'The tools can be used together to reveal hidden symbols!'
      },
      'rope,grappling-hook': {
        success: true,
        resultItem: 'climbing-gear',
        unlockedClues: ['upper-floor-access'],
        message: 'Perfect climbing equipment for reaching high places!'
      }
    };
  }

  // Check if two items can be combined
  canCombine(item1Id, item2Id) {
    const combinationKey1 = `${item1Id},${item2Id}`;
    const combinationKey2 = `${item2Id},${item1Id}`;
    
    return this.combinations[combinationKey1] || this.combinations[combinationKey2] || null;
  }

  // Get combination result
  getCombinationResult(item1Id, item2Id) {
    const result = this.canCombine(item1Id, item2Id);
    if (result) {
      return {
        ...result,
        consumedItems: [item1Id, item2Id]
      };
    }
    
    return {
      success: false,
      message: 'These items cannot be combined together.',
      consumedItems: []
    };
  }
// Get all possible combinations for an item
  getPossibleCombinations(itemId) {
    const combinations = [];
    
    Object.keys(this.combinations).forEach(key => {
      const items = key.split(',');
      if (items.includes(itemId)) {
        const otherItem = items.find(item => item !== itemId);
        combinations.push({
          requiredItem: otherItem,
          result: this.combinations[key]
        });
      }
    });
    
    return combinations;
  }

  // Get combination hints for better user guidance
  getCombinationHints(itemId) {
    const hints = [];
    const possibleCombinations = this.getPossibleCombinations(itemId);
    
    possibleCombinations.forEach(combo => {
      hints.push({
        targetItem: combo.requiredItem,
        hint: `Try combining with ${combo.requiredItem.replace('-', ' ')}`
      });
    });
    
    return hints;
  }

  // Check if an inventory item can combine with a room object
  canCombineWithRoomObject(inventoryItemId, roomObjectId) {
    // Check both directions for combinations
    const combinationKey1 = `${inventoryItemId},${roomObjectId}`;
    const combinationKey2 = `${roomObjectId},${inventoryItemId}`;
    
    return this.combinations[combinationKey1] || this.combinations[combinationKey2] || null;
  }

  // Validate if inventory item can combine with room object
  validateRoomObjectCombination(inventoryItemId, roomObjectId, gameState, roomObjects) {
    // Check if inventory item exists in player's inventory
    if (!gameState.inventory.includes(inventoryItemId)) {
      return {
        valid: false,
        message: 'This item is not in your inventory.'
      };
    }

    // Check if room object exists and is accessible
    const roomObject = roomObjects.find(obj => obj.id === roomObjectId);
    if (!roomObject) {
      return {
        valid: false,
        message: 'Room object not found.'
      };
    }

    // Check if room object has been examined (requirement for combination)
    if (!gameState.examinedObjects.includes(roomObjectId)) {
      return {
        valid: false,
        message: 'You need to examine this object first before attempting to combine items with it.'
      };
    }

    // Check combination rules
    const combination = this.canCombineWithRoomObject(inventoryItemId, roomObjectId);
    if (!combination) {
      return {
        valid: false,
        message: `The ${inventoryItemId.replace('-', ' ')} cannot be used with the ${roomObject.name.toLowerCase()}.`
      };
    }

    return {
      valid: true,
      combination
    };
  }

  // Validate if combination is logically possible
  validateCombination(item1Id, item2Id, gameState) {
    // Check if both items are in inventory
    if (!gameState.inventory.includes(item1Id) || !gameState.inventory.includes(item2Id)) {
      return {
        valid: false,
        message: 'Both items must be in your inventory to combine them.'
      };
    }

    // Check if items are the same
    if (item1Id === item2Id) {
      return {
        valid: false,
        message: 'Cannot combine an item with itself.'
      };
    }

    // Check combination rules
    const combination = this.canCombine(item1Id, item2Id);
    if (!combination) {
      return {
        valid: false,
        message: 'These items cannot be combined together. Try examining objects in the room for clues about what items work together.'
      };
    }

    return {
      valid: true,
      combination
    };
  }

  // Get contextual hints for failed combinations
  getContextualHint(item1Id, item2Id) {
    const item1Hints = this.getCombinationHints(item1Id);
    const item2Hints = this.getCombinationHints(item2Id);
    
    if (item1Hints.length > 0) {
      return `${item1Id.replace('-', ' ')} can be combined with: ${item1Hints.map(h => h.targetItem.replace('-', ' ')).join(', ')}`;
    }
    
    if (item2Hints.length > 0) {
      return `${item2Id.replace('-', ' ')} can be combined with: ${item2Hints.map(h => h.targetItem.replace('-', ' ')).join(', ')}`;
    }
    
    return 'Look around the room for objects that might work with your inventory items.';
  }
}

export default new GameLogicService();