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
    // i denotes node order and will be the node value
    let i = 1;

    // keep track of visited squares
    const visited = {};
    visited[start.coord] = true;

    // make stack for backtracking
    const stack = new Stack();
    stack.push(start);

    // start moving randomly and backtracking upon hitting a visited square
    while (!stack.isEmpty()) {
        let curNode = stack.peek();
        visited[curNode.coord] = true;
        let dir = chooseDir(curNode, visited);

        // if chooseDir returns null we've hit a deadend:
        // pop the stack and see if there's a free square adjacent now
        if (!dir) {
            stack.pop();
            continue;
        }

        // otherwise we can now move forward
        let nextNode = new Node(++i, dir);
        stack.push(nextNode);
        curNode.neighbors.push(nextNode);
    }

    return start;
}

// helper function for buildPath
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

// this function's for debugging purposes
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

// helper function for determining two node's directional relation
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


function eraseBorders(path, lines = []) {
    let { coord, neighbors } = path;

    if (neighbors.length === 0) return;
    
    for (let neighbor of neighbors) {
        // determine direction of neighbor, initialize pt1 and pt2 of edge
        let dir = whichDir(path, neighbor);
        let waypoints, pt1, pt2, line;
        // erase the correct edge
        switch (dir) {
            case 'right':
                ctx.beginPath();
                ctx.moveTo(coord[0]*boxWidth+boxWidth, coord[1]*boxHeight+1);
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 10;
                ctx.lineTo(coord[0]*boxWidth+boxWidth, coord[1]*boxHeight+boxHeight-1);
                ctx.stroke();
                break;
            case 'down': 
                ctx.beginPath();
                ctx.moveTo(coord[0]*boxWidth+1, coord[1]*boxHeight+boxHeight);
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 10;
                ctx.lineTo(coord[0]*boxWidth+boxWidth-1, coord[1]*boxHeight+boxHeight-1);
                ctx.stroke();
                // lineStart = { x: coord[0]*boxWidth+1, y: coord[1]*boxHeight+boxHeight-1};
                // lineEnd = { x: coord[0]*boxWidth+boxWidth-1, y: coord[1]*boxHeight+boxHeight-1 };
                // line = { lineStart, lineEnd, dir: "right" };
                // lines.push(line);
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
        eraseBorders(neighbor, lines);
    }
}

const lines = [];
let timestamp;
eraseBorders(path, lines);

ctx.beginPath();
ctx.moveTo(300, 300);
ctx.strokeStyle = "red";
ctx.lineWidth = 10;
ctx.lineTo(400, 300);
ctx.stroke();




function calcWaypoints(pt1, pt2) {
    let waypoints = [],
          dx = pt2.x- pt1.x,
          dy = pt2.y - pt1.y;

    // break up the line into 100 point objects and put'em in an array
    for (let j = 0; j < 100; j++) {
        let x = pt1.x+dx*j/100;
        let y = pt1.y+dy*j/100;
        waypoints.push({x: x, y: y})
    }
    // connect each point and the one ahead of it together to make many tiny lines
    // nothing to connect the last point so it maps as undefined so we pop it at the end
    waypoints = waypoints.map((point, i) => {
        if (i === waypoints.length-1) return;
        const line = { pt1: point, pt2: waypoints[i+1] };
        return line;
    })
    waypoints.pop();
    return waypoints;
}

let fps = 10;


















// function animateErase() {
//     for (let vertex of vertices) {
//         let { vertexStart, vertexEnd } = vertex;
//         console.log(vertex.dir);
//         switch(vertex.dir) {
//             case "right": 
//                 ctx.clearRect(vertexStart.x-1, vertexStart.y-1, 2, 2)
//                 vertexStart.y += dy;
//                 break;
//             case "down":
//                 ctx.clearRect(vertexStart.x-1, vertexStart.y-1, 2, 2)
//                 vertexStart.x += dx;
//                 break;
//             default: 
//                 break;
//         }
//     }
    // timestamp = requestAnimationFrame(animateErase);
    // if (vertices[0].vertexStart.y >= vertices[0].vertexEnd.y) cancelAnimationFrame(timestamp);
    
    // for (let vertex of vertices) {
    //     let { vertexStart, vertexEnd } = vertex;

    //     ctx.clearRect(vertexStart.x-1, vertexStart.y-1, 2, 2)

    //     vertexStart.y += dy;
    // }

    // timestamp = requestAnimationFrame(animateErase);
    // if (vertices[0].vertexStart.y >= vertices[0].vertexEnd.y) cancelAnimationFrame(timestamp);
// }

// animateErase(vertices);

 
