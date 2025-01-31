const cv = document.querySelector("canvas")
const ctx = cv.getContext("2d")

var gridsquaresize = 30;
var gridwidth = 30;
var gridheight = 20;

cv.width = gridwidth*gridsquaresize;
cv.height = gridheight*gridsquaresize;

let target = [gridwidth-1, gridheight-1]
var spath = Array()
var pathexists = true

var grid = Array()
for (let y = 0; y < gridheight; y++) {
    let row = Array()
    for (let x = 0; x < gridwidth; x++)
        row.push((x != 5 || y == 5) && (y != 9 || x == 15)) // whether cell is traversable
    grid.push(row)
}

path()
draw()

function path() {
    // very inefficient BFS implementation
    let visited = Array()
    for (let y = 0; y < gridheight; y++) {
        let row = Array()
        for (let x = 0; x < gridwidth; x++)
            row.push(false)
        visited.push(row)
    }
    let fringe = Array({x:0, y:0, len:0, prev:undefined})
    let found = false
    let last
    while (fringe.length > 0) {
        fringe.sort((a,b) => b.len - a.len)
        let top
        do {
            top = fringe.pop()
        } while (fringe.length > 0 && visited[top.y][top.x] == true)
        if (top.x == target[0] && top.y == target[1]) {
            found = true;
            last = top
            break;
        }
        visited[top.y][top.x] = true
        if (top.x > 0 && visited[top.y][top.x-1] == false && grid[top.y][top.x-1] == true)
            fringe.push({x:top.x-1, y:top.y, len:top.len+1, prev:top})
        if (top.x < gridwidth-1 && visited[top.y][top.x+1] == false && grid[top.y][top.x+1] == true)
            fringe.push({x:top.x+1, y:top.y, len:top.len+1, prev:top})
        if (top.y > 0 && visited[top.y-1][top.x] == false && grid[top.y-1][top.x] == true)
            fringe.push({x:top.x, y:top.y-1, len:top.len+1, prev:top})
        if (top.y < gridheight-1 && visited[top.y+1][top.x] == false && grid[top.y+1][top.x] == true)
            fringe.push({x:top.x, y:top.y+1, len:top.len+1, prev:top})
    }
    if (found) {
        pathexists = true
        spath = Array()
        do {
            spath.push(last)
            last = last.prev
        } while (!(last.x == 0 && last.y == 0));
        document.getElementById("canvaslabel").innerText = "Length: " + spath.length
    } else {
        spath = Array()
        pathexists = false
        document.getElementById("canvaslabel").innerText = "Path obstructed"
    }
}

function draw() {
    if (pathexists == true) {
        ctx.fillStyle = "white"
    } else {
        ctx.fillStyle = "#FFCCCC"
    }
    ctx.fillRect(0, 0, cv.width, cv.height)
    ctx.fillStyle = "black"
    for (let y = 0; y < gridheight; y++) 
        for (let x = 0; x < gridwidth; x++) 
            if (grid[y][x] == false)
                ctx.fillRect(x*gridsquaresize, y*gridsquaresize, gridsquaresize, gridsquaresize)
    ctx.fillStyle = "yellow"
    ctx.fillRect(target[0]*gridsquaresize, target[1]*gridsquaresize, gridsquaresize, gridsquaresize)
    ctx.fillStyle = "green"
    ctx.fillRect(0, 0, gridsquaresize, gridsquaresize)
    if (spath.length > 0) {
        ctx.strokeStyle = "red"
        ctx.lineWidth = 2
        let start = spath[spath.length-1]
        let hgss = gridsquaresize*0.5
        ctx.moveTo(start.x*gridsquaresize + hgss, start.y*gridsquaresize + hgss)
        ctx.beginPath()
        for (let i = 0; i < spath.length; i++) {
            ctx.lineTo(spath[i].x*gridsquaresize + hgss, spath[i].y*gridsquaresize + hgss)
        }
        ctx.lineTo(hgss, hgss)
        ctx.stroke()
    }
}

cv.addEventListener("mousedown", function (e) {
    drawsquare(cv, e);
}); 

function drawsquare(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    lastchangedsquare = [x,y]
    grid[Math.floor(y/gridsquaresize)][Math.floor(x/gridsquaresize)] = (!grid[Math.floor(y/gridsquaresize)][Math.floor(x/gridsquaresize)])
    path()
    draw()
}