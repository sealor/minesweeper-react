var createLinearBoard = function(length, random_func) {
  var mineFields = new Set();
  var revealedFields = new Set();
  random_func = random_func || Math.random;

  return {
    placeMine: function(position) {
      mineFields.add(position);
    },
    removeMine: function(position) {
      mineFields.delete(position);
    },
    isMine: function(position) {
      return mineFields.has(position);
    },
    revealField: function(position) {
      revealedFields.add(position);
    },
    isRevealedField: function(position) {
      return revealedFields.has(position);
    },
    swapFields: function(position1, position2) {
      var isMineAtPosition1 = this.isMine(position1);
      var isMineAtPosition2 = this.isMine(position2);
      
      if (isMineAtPosition1) {
        this.placeMine(position2);
      } else {
        this.removeMine(position2);
      }

      if (isMineAtPosition2) {
        this.placeMine(position1);
      } else {
        this.removeMine(position1);
      }
    },
    shuffle: function() {
      for (var currentIndex = 0; currentIndex < length; currentIndex++) {
        var swapIndex = Math.floor(random_func() * length);
        this.swapFields(currentIndex, swapIndex);
      }
    }
  };
};

var createCartesianBoard = function(width, height, linearBoard) {
  return {
    resolvePosition: function(x, y) {
      return y * width + x;
    },
    placeMineAtXY: function(x, y) {
      linearBoard.placeMine(this.resolvePosition(x, y));
    },
    isMineAtXY: function(x, y) {
      return linearBoard.isMine(this.resolvePosition(x, y));
    },
    isRevealedFieldAtXY: function(x, y) {
      return linearBoard.isRevealedField(this.resolvePosition(x, y));
    },
    countMinesAroundXY: function(x, y) {
      var count = 0;
      for (var dx = -1; dx <= 1; dx++)
        for (var dy = -1; dy <= 1; dy++)
          if (dx !== 0 || dy !== 0)
            if (0 <= x + dx && x + dx < width && 0 <= y + dy && y + dy < height)
              if (this.isMineAtXY(x + dx, y + dy))
                count++;
      return count;
    },
    revealFieldAtXY: function(x, y) {
      linearBoard.revealField(this.resolvePosition(x, y));

      if (this.countMinesAroundXY(x, y) === 0)
        for (var dx = -1; dx <= 1; dx++)
          for (var dy = -1; dy <= 1; dy++)
            if (dx !== 0 || dy !== 0)
              if (0 <= x + dx && x + dx < width && 0 <= y + dy && y + dy < height)
                if (!this.isRevealedFieldAtXY(x + dx, y + dy))
                  this.revealFieldAtXY(x + dx, y + dy);
    }
  };
};

