import roomsData from '../mockData/rooms.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class RoomService {
  constructor() {
    this.rooms = [...roomsData];
  }

  async getAll() {
    await delay(300);
    return [...this.rooms];
  }

  async getById(id) {
    await delay(200);
    const room = this.rooms.find(room => room.id === id);
    if (!room) {
      throw new Error(`Room with id ${id} not found`);
    }
    return { ...room };
  }

  async updateRoom(id, updates) {
    await delay(250);
    const roomIndex = this.rooms.findIndex(room => room.id === id);
    if (roomIndex === -1) {
      throw new Error(`Room with id ${id} not found`);
    }
    
    this.rooms[roomIndex] = { ...this.rooms[roomIndex], ...updates };
    return { ...this.rooms[roomIndex] };
  }

  async unlockRoom(id) {
    await delay(200);
    const room = await this.updateRoom(id, { isLocked: false });
    return room;
  }

  async completeRoom(id, completionTime) {
    await delay(300);
    const room = this.rooms.find(r => r.id === id);
    const updates = {
      isCompleted: true,
      bestTime: room.bestTime ? Math.min(room.bestTime, completionTime) : completionTime
    };
    
    // Unlock next room based on completion order
    if (id === 'abandoned-mansion') {
      await this.unlockRoom('secret-lab');
    } else if (id === 'secret-lab') {
      await this.unlockRoom('pirate-ship');
    }
    
    return await this.updateRoom(id, updates);
  }

  async getObjectById(roomId, objectId) {
    await delay(150);
    const room = await this.getById(roomId);
    const object = room.objects.find(obj => obj.id === objectId);
    if (!object) {
      throw new Error(`Object with id ${objectId} not found in room ${roomId}`);
    }
    return { ...object };
  }

  async updateObject(roomId, objectId, updates) {
    await delay(200);
    const roomIndex = this.rooms.findIndex(room => room.id === roomId);
    if (roomIndex === -1) {
      throw new Error(`Room with id ${roomId} not found`);
    }

    const objectIndex = this.rooms[roomIndex].objects.findIndex(obj => obj.id === objectId);
    if (objectIndex === -1) {
      throw new Error(`Object with id ${objectId} not found in room ${roomId}`);
    }

    this.rooms[roomIndex].objects[objectIndex] = {
      ...this.rooms[roomIndex].objects[objectIndex],
      ...updates
    };

    return { ...this.rooms[roomIndex].objects[objectIndex] };
  }

  async getPuzzleById(roomId, puzzleId) {
    await delay(150);
    const room = await this.getById(roomId);
    const puzzle = room.puzzles.find(p => p.id === puzzleId);
    if (!puzzle) {
      throw new Error(`Puzzle with id ${puzzleId} not found in room ${roomId}`);
    }
    return { ...puzzle };
  }

  async solvePuzzle(roomId, puzzleId) {
    await delay(300);
    const roomIndex = this.rooms.findIndex(room => room.id === roomId);
    if (roomIndex === -1) {
      throw new Error(`Room with id ${roomId} not found`);
    }

    const puzzleIndex = this.rooms[roomIndex].puzzles.findIndex(p => p.id === puzzleId);
    if (puzzleIndex === -1) {
      throw new Error(`Puzzle with id ${puzzleId} not found in room ${roomId}`);
    }

    this.rooms[roomIndex].puzzles[puzzleIndex].isSolved = true;
    return { ...this.rooms[roomIndex].puzzles[puzzleIndex] };
  }
}

export default new RoomService();