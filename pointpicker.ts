class Point2D {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    dist(p: Point2D) {
        var diff = new Point2D(p.x - this.x, p.y - this.y);
        return diff.magnitude();

    }
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}

class Corners {
    topLeft: Point2D = new Point2D(0, 0);
    topRight: Point2D = new Point2D(1, 0);
    bottomLeft: Point2D = new Point2D(0, 1);
    bottomRight: Point2D = new Point2D(1, 1);
    corners: Point2D[] = [this.topLeft, this.topRight, this.bottomLeft, this.bottomRight];
    update(p: Point2D) {
        console.log("Called Corners update", p);
        let minDist = 2;
        let minIndex = 0;
        // for (var i = 0; i < this.corners.length; i++) {
        for (let i in this.corners) {
            let dist = p.dist(this.corners[i]);
            if (dist < minDist) {
                minDist = dist;
                minIndex = Number(i);
            }
        }
        console.log(minIndex, minDist);
    }
}

var corners;

let loadStartImage=function() {
    corners = new Corners();
    $.get("http://localhost:5000/givemejpegurls", function(data) {
        $(".currentImage").attr("src", "http://localhost:5000" + data[0]);
        setImageClickFunction();
    });
};

let getElementRelativeCoords = function(item, event) {
    let elemRect = item.getBoundingClientRect();
    let absX = event.clientX - elemRect.left;
    let absY = event.clientY - elemRect.top;

    return new Point2D(absX, absY);
}

let getElementNormCoords = function(item, event) {
    let elemRect = item.getBoundingClientRect();
    let absPos = getElementRelativeCoords(item, event);
    let height = elemRect.height;
    let width = elemRect.width;
    let normX = absPos.x / width;
    let normY = absPos.y / height;

    return new Point2D(normX, normY);
}

let setImageClickFunction = function() {
    let item = document.querySelector(".currentImage");
    $(".currentImage").click(function(event) {
        let normCoords = getElementNormCoords(item, event);
        corners.update(normCoords);
        console.log(normCoords.x + ',' + normCoords.y);
    });
};

window.onload = loadStartImage;
