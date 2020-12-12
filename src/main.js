import Stack from './stack.js';
import Node from './node.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth * .8;
let height = canvas.height = window.innerHeight * .7;
let rowLength = 10;
let colLength = 8;
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
    ctx.fillText(val, coord[0]*boxWidth+30, coord[1]*boxHeight+30);

    // recur with neighbors
    if (neighbors.length === 0) return;
    else {
        for (let neighbor of neighbors) {
            drawNodeOrder(neighbor);
        }
    }
}

function whichDir(node1, node2) {
    const coord1 = node1.coord;
    const coord2 = node2.coord;
    let dir; 

    if (coord2[0]-coord1[0] === 1) dir = 'right';
    else if (coord2[0]-coord1[0] === -1) dir = 'left';
    else if (coord2[1]-coord1[1] === 1) dir = 'down';
    else dir = 'up';

    return dir;
}


function eraseBorders(path, vertices = []) {
    let { coord, neighbors } = path;

    if (neighbors.length === 0) return;
    
    for (let neighbor of neighbors) {
        // determine direction of neighbor, initialize pt1 and pt2 of edge
        let dir = whichDir(path, neighbor);
        let vertexStart, vertexEnd, line;
        // erase the correct edge
        switch (dir) {
            case 'right':
                vertexStart = { x: coord[0]*boxWidth+boxWidth, y: coord[1]*boxHeight+1 };
                vertexEnd = { x: coord[0]*boxWidth+boxWidth, y: coord[1]*boxHeight+boxHeight-1 };
                line = { vertexStart, vertexEnd, dir: "right" };
                vertices.push(line);
                break;
            case 'down': 
                vertexStart = { x: coord[0]*boxWidth+1, y: coord[1]*boxHeight+boxHeight };
                vertexEnd = { x: coord[0]*boxWidth+boxWidth-1, y: coord[1]*boxHeight+boxHeight };
                line = { vertexStart, vertexEnd, dir: "down" };
                vertices.push(line);
                break;
            case 'left':
                ctx.beginPath();
                ctx.moveTo(coord[0]*boxWidth, coord[1]*boxHeight+1);
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 10;
                ctx.lineTo(coord[0]*boxWidth, coord[1]*boxHeight+boxHeight-1);
                ctx.stroke();
                break;
            case 'up':
                ctx.beginPath();
                ctx.moveTo(coord[0]*boxWidth+1, coord[1]*boxHeight);
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 3;
                ctx.lineTo(coord[0]*boxWidth+boxWidth-1, coord[1]*boxHeight);
                ctx.stroke();
                break;
            default:
                break;
        }
        eraseBorders(neighbor, vertices);
    }
}

function calcWaypoints(pt1, pt2) {
    const waypoints = [];
    let dx = pt2.x- pt1.x;
    let dy = pt2.y - pt1.y;
    for (let j = 0; j < 100; j++) {
        let x = pt1.x+dx*j/100;
        let y = pt1.y+dy*j/100;
        waypoints.push({x: x, y: y})
    }
    return waypoints;
}

const vertices = [];
eraseBorders(path, vertices);
console.log(vertices);
let dy = 0.5;
let dx = 0.5;
let timestamp;

function animateErase() {
    for (let vertex of vertices) {
        let { vertexStart, vertexEnd } = vertex;
        console.log(vertex.dir);
        switch(vertex.dir) {
            case "right": 
                ctx.clearRect(vertexStart.x-1, vertexStart.y-1, 2, 2)
                vertexStart.y += dy;
                break;
            case "down":
                ctx.clearRect(vertexStart.x-1, vertexStart.y-1, 2, 2)
                vertexStart.x += dx;
                break;
            default: 
                break;
        }
    }
    timestamp = requestAnimationFrame(animateErase);
    if (vertices[0].vertexStart.y >= vertices[0].vertexEnd.y) cancelAnimationFrame(timestamp);
    
    // for (let vertex of vertices) {
    //     let { vertexStart, vertexEnd } = vertex;

    //     ctx.clearRect(vertexStart.x-1, vertexStart.y-1, 2, 2)

    //     vertexStart.y += dy;
    // }

    // timestamp = requestAnimationFrame(animateErase);
    // if (vertices[0].vertexStart.y >= vertices[0].vertexEnd.y) cancelAnimationFrame(timestamp);
}

animateErase(vertices);



