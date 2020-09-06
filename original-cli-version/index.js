const fs = require("fs");

function dead_state(_width, _height)
{
    let board = [];

    for (let row = 0; row < _height; row++) {
        
        let generated_row = [];

        for (let column = 0; column < _width; column++) {
            generated_row.push(0);
        };
       
        board.push(generated_row);
    };

    return board;
};

function random_state(_width, _height) 
{

    let state = dead_state(_width, _height);

    for (let row = 0; row < _height; row++) {
        //For each row
        for (let column = 0; column < _width; column++) {
            // For each column in current row
            let rng = Math.random() * Math.floor(1);

            if (rng > 0.45) state[row][column] = 1
            else state[row][column] = 0

        };
    };

    return state;
}

function render(board) {
    // print starting line
    //console.log("-".repeat(board[0].length * 2 + 1));

    for (let row = 0; row < board.length; row++) {
        let format_row = [];
        
        for (let column = 0; column < board[row].length; column++) {

            let cur_num = board[row][column]
            
            if (cur_num === 1) format_row.push("\u25A0")
            else format_row.push(' ');
        
        };
        console.log(format_row.join(" "));
    };

    // print finishing line
    //console.log("-".repeat(board[0].length * 2 + 1));
};

function cell_check(co_ords, state) {
    /**
     * Check each value of state 
     * check up then up + right then up + left
     * check down then down + right then down + left
     * check left then right
     * 
     * if the check == 1 add to neighbor_count else do not.
     * 
     * if neighbor_count <= 1 make new state value 0
     * if neighbor_count >= 2 or <= 3 make new state value 1
     * if neighbor_count >3 make new state value 0
     * if neighbor_count == 3 then if current value 0 make new state 1
     * 
    */

    let neighbor_count = 0;

    const x = co_ords[0];
    const x_start = x - 1;

    const y = co_ords[1];
    const y_start = y - 1;

    for (let row = x_start; row <= x_start + 2; row++) {
        // check for corners
        if (row < 0 || row >= state.length) continue;

        for (let col = y_start; col <= y_start + 2; col++) {
            // check for edges
            if (col < 0 || col >= state[0].length) continue;
            // dont check current cell
            if (row === x && col === y) continue;

            if (state[row][col] === 1) neighbor_count += 1;
           
        };

    };

    // If current position is alive
    if (state[x][y] === 1) {
        if (neighbor_count <= 1) {
            return 0;
        }
        else if (neighbor_count <= 3) {
            return 1;
        }
        else return 0;

    } else {
        if (neighbor_count === 3) {
            return 1;
        }
        else return 0;
    }
};

function next_board_state(init_state) 
{
    let new_state = dead_state(init_state[0].length, init_state.length);

    // loop over intial state rows
    for (let row = 0; row < init_state.length; row++) {
        // loop over current row's columns
        for (let col = 0; col < init_state[0].length; col++) {
            new_state[row][col] = cell_check([row, col], init_state);
        };
    };

    return new_state;
};

function sleep(milliseconds) 
{
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
};

function load_board_state(path)
{
    let file = fs.readFileSync(path, 'utf8');
    let split_file = file.split('');

    let start_board = [];
    let arr = [];
    for (let n of split_file) {
        if (n === "\n" || n === "\r") {
            if (arr.length) {
                start_board.push(arr);
                arr = [];
            }
        } else {
            arr.push(parseInt(n));
        }
    };

    console.log(start_board);
    return start_board;

};

function eternal_life(init_state) 
{
    
    let next_state = init_state;
    while (true) {
        render(next_state);
        next_state = next_board_state(next_state);
        
        sleep(175);
    }
    
};

// Run in terminal 
// "Soups" - random Life pattern
// let start_board = random_state(80, 35);
// console.log(eternal_life(start_board));

// Toad life pattern
//console.log(eternal_life(load_board_state('./toad.txt')));

// gosper glider gun
console.log(eternal_life(load_board_state('./ggg.txt')));