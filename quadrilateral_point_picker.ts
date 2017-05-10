interface Point {
    x: number;
    y: number;
}

interface MultiPoints extends Array<Point>{}

let corners:MultiPoints = [
    {x: 0, y: 0},
    {x: 1, y: 0},
    {x: 0, y: 1},
    {x: 1, y: 1}
];

let appState:AppState;

class AppState {
    identifiers: string[];
    currentIndex: number = 0;
    server: string = "http://localhost:5000";
    constructor(data) {
        this.identifiers = data.map(function(obj){return obj["identifier"];});
        console.log("Identifiers: " + this.identifiers);
        this.updateCorners();
    }
    currentImageURL(): URL {
        let cur_img_url = new URL(this.server
                                  + "/items/"
                                  + this.identifiers[this.currentIndex]
                                  + "/raw");
        console.log("Current image url: " + cur_img_url);
        return cur_img_url;
    }
    updateCorners() {
      let getURL = this.server
                    + "/overlays"
                    + '/quadrilateral_points/'
                    + this.identifiers[this.currentIndex];
      $.ajax({
          type: 'GET',
          url: getURL,
          success: function(data) {
            console.log(data.length);
            if (data.length !== 4) {
                corners = [
                    {x: 0, y: 0},
                    {x: 1, y: 0},
                    {x: 0, y: 1},
                    {x: 1, y: 1}
                ];
            } else {
                corners = data;
            }
            console.log(JSON.stringify(corners));
            drawCorners(corners);
          },
      });
    }
    updateProgressBar() {
        let human_index = this.currentIndex + 1;
        let progress_str = "Progress: " + human_index + "/" + this.identifiers.length;
        console.log(progress_str);
        document.querySelector("#progressBar").innerHTML = progress_str;
    }
    is_done(): boolean {
        if (this.currentIndex == this.identifiers.length) {
            document.querySelector("#progressBar").innerHTML = "Done!  &#128512;";
            return true;
        }
        return false;
    }
    nextImageURL(): URL {
        this.currentIndex += 1;
        return this.currentImageURL();
    }
    persistInOverlay(corners: MultiPoints) {
      let putURL = this.server
                    + "/overlays"
                    + '/quadrilateral_points/'
                    + this.identifiers[this.currentIndex];
      console.log('persistInOverlay', JSON.stringify(corners), putURL);
      $.ajax({
          type: 'PUT',
          url: putURL,
          data: JSON.stringify(corners),
          success: function(data) {
              console.log("Success!");
              let imageURL = appState.nextImageURL();
              console.log(imageURL);
              drawImageFromURL(imageURL);
              appState.updateProgressBar();
              appState.updateCorners();
              console.log("end of success");
          },
          contentType: "application/json"
      });
  }
}

let drawImageFromURL = function(imageURL: URL) {
    let c = <HTMLCanvasElement>document.getElementById("imgCanvas");
    let ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    let img = new Image();
    img.src = String(imageURL);
    img.addEventListener('load', function() {
        ctx.drawImage(img, 0, 0, 800, 600);
    });
}

let initialiseAppState = function() {
    $.get("http://localhost:5000/items", function(data) {
        appState = new AppState(data["_embedded"]["items"]);
        let imageURL = appState.currentImageURL();
        drawImageFromURL(imageURL);
    });
}

let getElementRelativeCoords = function(item, event): Point {
    let elemRect = item.getBoundingClientRect();
    let absX = event.clientX - elemRect.left;
    let absY = event.clientY - elemRect.top;
    return {"x": absX, "y": absY};
}

let getElementNormCoords = function(item, event): Point {
    let elemRect = item.getBoundingClientRect();
    let absPos = getElementRelativeCoords(item, event);
    let height = elemRect.height;
    let width = elemRect.width;
    let normX = absPos.x / width;
    let normY = absPos.y / height;

    return {"x": normX, "y": normY};
}

let magnitude = function(p: Point): number {
    return Math.sqrt(p.x * p.x + p.y * p.y);
}

let distance = function(p1: Point, p2: Point): number {
    let diff:Point = {"x": p1.x - p2.x, "y": p1.y - p2.y};
    return magnitude(diff);
}

let drawCircle = function(p: Point) {
    let c = <HTMLCanvasElement>document.getElementById("pointsCanvas");
    let ctx = c.getContext('2d');
    ctx.beginPath();
    ctx.arc(p.x * c.width, p.y * c.height, 5, 0, 2*Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
}

let drawCorners = function(corners: MultiPoints) {
    let c = <HTMLCanvasElement>document.getElementById("pointsCanvas");
    let ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    for (let c of this.corners) {
        drawCircle(c);
    }
}

let moveCorner = function(p: Point, corners: MultiPoints): MultiPoints {
        console.log("Called Corners update", p);
        let minDist = 2;
        let minIndex = 0;
        for (let i in corners) {
            let dist = distance(p, corners[i]);
            if (dist < minDist) {
                minDist = dist;
                minIndex = Number(i);
            }
        }
        console.log(minIndex, minDist);
        corners[minIndex] = p;
        drawCorners(corners);
        return corners;
}

let setupCanvas = function() {
    let item = document.querySelector("#imgCanvas");
    $("#pointsCanvas").click(function(event) {
        let normCoords:Point = getElementNormCoords(item, event);
        console.log("Clicked: " + JSON.stringify(normCoords));
        corners = moveCorner(normCoords, corners);
    });
};

let setupKeyBindings = function() {
    document.addEventListener('keydown', function(event) {
        if (event.keyCode == 39 &&  !appState.is_done()) {
            appState.persistInOverlay(corners);
        }
    });
}


let main = function() {
    console.log("Running main function");
    initialiseAppState();
    setupCanvas();
    drawCorners(corners);
    setupKeyBindings();
}

window.onload = main;