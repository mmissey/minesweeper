/**
*   Mine Sweeper
*   Marc Missey
*   Nov 2013    
*/


(function() {
    var DEFAULT_BOARD_SIZE = 8;
    var DEFAULT_CELL_SIZE = 50;

    function Board(size, cellSize) {
        this.board = [];
        if(parseInt(size) > 0){
            this.size = parseInt(size)
        }else{
            this.size = DEFAULT_BOARD_SIZE;
        }
        this.cellSize = cellSize || DEFAULT_CELL_SIZE;
        this.numMines = Math.floor((this.size * this.size) / 6.4);
        $('#mines').text(this.numMines);
        for (var i = 0; i < this.size; i++) { //for each row,
            this.board.push(new Array(this.size)); // add an array of size cells
        }

        $('#gameContainer').css({
            'width': (this.cellSize * this.size) + 'px',
            'height': (this.cellSize * this.size) + 'px'
        });

        this.placeMines = function() {
            for (var i = 0; i < this.numMines; i++) { //Big-O 9*numMines
                var row = Math.floor(Math.random() * this.size);
                var col = Math.floor(Math.random() * this.size);
                var check = [-1, 0, 1];
                if (this.board[row][col] !== 'M') {
                    this.board[row][col] = 'M';
                    for (var j in check) {
                        var rowDiff = check[j];
                        if ((row === 0 && rowDiff === -1) || //for the first row, don't check up one row
                            (row === this.size - 1 && rowDiff === 1)) { //for the last row, don't check down one row
                            continue;
                        }
                        for (var k in check) {
                            var colDiff = check[k];
                            if ((col === 0 && colDiff === -1) || //for the first col, don't check left one column. 
                                (col === this.size - 1 && colDiff === 1) || //for the last col, don't check right one column. 
                                (rowDiff === 0 && colDiff === 0) || //Don't check the one that we know is a bomb 
                                (this.board[row + rowDiff][col + colDiff] === 'M')) {
                                continue;
                            }
                            this.board[row + rowDiff][col + colDiff] = this.board[row + rowDiff][col + colDiff] + 1 || 1;
                        }
                    }
                } else {
                    i--; //if it's already a bomb, deincrement so it'll run again
                }
            };
        };

        /**
Creates all of the rows and cells. 
Attaches click callback and saves the data
*/
        this.draw = function() {
            for (var i = 0; i < this.size; i++) {
                var row = $('#gameContainer').append('<div class="row">').css({
                    'width': this.size*50 +'px',
                    'height' : this.size*50 +'px'
                });
                var mineNum = 0;
                var that = this;
                for (var j = 0; j < this.size; j++) {
                    mineNum = (this.board[i][j] || 0);
                    row.append($('<div class="cell mine' + mineNum + ' hidden">') //classes with diff styles based on mineNum
                        .html('<span class="cellData">' + mineNum + '</span>')
                        .on('click', function(event) {
                            that.cellClick.call(this, that.size);
                        }).data({ //attach the data to the dom
                            'mines': mineNum,
                            'row': i,
                            'col': j
                        }));
                }
            }
        }

        this.clear = function(){
            for(var i=0;i<this.size;i++){
                for(var j=0;j<this.size;j++){
                    this.board[i][j] = 0;
                }  
            }
            $('.cell').remove();
        }
        /**
    Reveals the cell you clicked on and if it's a 0, click all the adjacent
*/
        this.cellClick = function(boardSize) {
            var cell = $(this);

            if (cell.hasClass('hidden')) {
                cell.removeClass('hidden');

                var row = cell.data('row');
                var col = cell.data('col');
                var mines = cell.data('mines');
                var index = row * boardSize + col;
                var check = [-boardSize-1, -boardSize, -boardSize+1, //all of the other cells to click if it's a 0;
                            -1,                                 1,
                            boardSize-1,  boardSize, boardSize+1
                ];
                if (col === 0) {
                    check = [-boardSize, -boardSize+1,
                                                 1,
                        boardSize, boardSize+1
                    ];
                } else if (col === boardSize - 1) {
                    check = [-boardSize-1, -boardSize,
                             -1,
                            boardSize-1,  boardSize
                    ];
                }
                if (mines === 0) {
                    var cells = $('.cell');
                    $.each(check, function(i, v) { //click on all of the adjacent cells
                        $(cells[index + v]).click();
                    })
                }else if(mines === 'M'){
                    $("#gameContainer").addClass("gameover");
                    alert("You lose!");
                    $('.cell').removeClass('hidden');
                }

            }
        }

    }


    var board = new Board();
    board.placeMines();
    board.draw();
    $("#restart").on('click', newGame);
    $("#validate").on('click', validate);
    $("#cheat").on('click', cheat);
    function newGame(){
        var size = $('#boardSize').val();
        board = new Board(size);
        board.clear();
        board.placeMines();
        board.draw();
    }

    function validate(){
        if($('.hidden').length === board.numMines){
            alert('Congratulations you won!');
            newGame();
        }else{
            alert("Nope. You haven't won yet!");
        }
    }
    function cheat(){
        $('.mineM').find('.cellData').css({
            'display': 'inline',
            'color' : "#DDDDDD"
        });
    }
})();