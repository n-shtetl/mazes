// const canvas = document.getElementById('other-canvas');
// const ctx = canvas.getContext('2d');

// let width = canvas.width = window.innerWidth * .8;
// let height = canvas.height = window.innerHeight * .3;

// const vertices = [];
// vertices.push({x: 10, y: 10})
// vertices.push({x: 30, y: 45})
// vertices.push({x: 80, y: 100})
// vertices.push({x: 40, y: 80});

// function calcWaypoints(vertices) {
//     const waypoints = [];
//     for (let i = 1; i < vertices.length; i++) {
//         let pt0 = vertices[i-1];
//         let pt1 = vertices[i];
//         let dx = pt1.x - pt0.x;
//         let dy = pt1.y - pt0.y;
//         for (let j = 0; j < 100; j++) {
//             let x = pt0.x+dx*j/100;
//             let y = pt0.y+dy*j/100; 
//             waypoints.push({x: x, y: y})
//         }
//     }
//     return waypoints;
// }

// let points = calcWaypoints(vertices);
// console.log(points);
// let t = 1;

// animate();

// function animate() {
//     if (t < points.length-1) {
//         requestAnimationFrame(animate);
//     }
//     ctx.beginPath();
//     ctx.lineWidth = 15;
//     ctx.moveTo(points[t-1].x, points[t-1].y);
//     ctx.lineTo(points[t].x, points[t].y);
//     ctx.stroke();
//     t++;
// }
