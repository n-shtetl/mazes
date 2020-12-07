import Stack from './stack.js';
import Node from './node.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth * .8;
let height = canvas.height = window.innerHeight * .6;
let rowLength = 10;
let colLength = 10;
let boxWidth = width/rowLength;
let boxHeight = height/colLength;


// handle window resizing
function resize() {
    width = canvas.width = window.innerWidth * .8;
    height = canvas.height = window.innerHeight * .6;
    drawGraph();
}
window.addEventListener('resize', resize);

// divide canvas into squares
function drawGraph() {
    for (let i = 0; i < rowLength; i++) {
        for (let j = 0; j < colLength; j++) {
            ctx.strokeRect(i*boxWidth,j*boxHeight,boxWidth,boxHeight);
        }
    }
    
}
drawGraph();

// determine order of path starting at 0,0
const start = new Node(1, [0,0]);
function buildPath(start) {
    // i denotes node order
    let i = 1;

    // keep track of visited squares
    const visited = {};
    visited[start.coord] = true;

    // make stack for backtracking
    const stack = new Stack();
    stack.push(start);

    while (!stack.isEmpty()) {
        let curNode = stack.peek();
        visited[curNode.coord] = true;
        let dir = chooseDir(curNode, visited);

        if (!dir) {
            stack.pop();
            continue;
        }

        let nextNode = new Node(++i, dir);
        stack.push(nextNode);
        curNode.neighbors.push(nextNode);
    }
    return start;
}

function chooseDir(node, visited) {
    let x = node.coord[0];
    let y = node.coord[1];
    let possibleDirs = [ [x+1, y], [x-1, y],
                         [x, y+1], [x, y-1] ];

    // filter out illegal coords and visited squares
    possibleDirs = possibleDirs.filter(coord => {
        return coord[0] >= 0 && coord[0] < rowLength && 
               coord[1] >= 0 && coord[1] < colLength &&
               !visited[coord]
    });

    // if filtered arr is empty then path is done or time to backtrack
    if (possibleDirs.length === 0) return null; 

    // otherwise return random viable dir
    return possibleDirs[Math.floor(Math.random()*possibleDirs.length)];
}

let path = buildPath(start);

function drawNodeOrder(path) {
    let { val, coord, neighbors } = path;

    // draw curNode val
    ctx.font = '10px serif'
    ctx.fillText(val, coord[0]*boxWidth, coord[1]*boxHeight+30);

    // recur with neighbors
    if (neighbors.length === 0) return;
    else {
        for (let neighbor of neighbors) {
            drawNodeOrder(neighbor);
        }
    }
}

function eraseBorders(path) {
    let { val, coord, neighbors } = path;

    if (neighbors.length === 0) return;
    
    for (let neighbor of neighbors) {
        // determine direction of neighbor
        let dir;
        let { nCoord } = neighbor;
        if (nCoord[0]-coord[0] === 1) {
            
        }
        
    }
}



// ctx.beginPath();
// ctx.moveTo(boxWidth, 1);
// ctx.strokeStyle = "#ffffff";
// ctx.lineWidth = 3;
// ctx.lineTo(boxWidth, boxHeight-1);

// ctx.stroke();


// ctx.beginPath();
// ctx.moveTo(boxWidth/2, 0);
// ctx.strokeStyle = "#ffffff";
// ctx.lineWidth = 50;
// ctx.lineTo(boxWidth/2, boxHeight*colLength);
// ctx.stroke();
// console.log(path);
drawNodeOrder(path);



