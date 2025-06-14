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
        message: 'These items cannot be combined together.'
      };
    }

    return {
      valid: true,
      combination
    };
  }
}

export default new GameLogicService();