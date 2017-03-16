function Point(x, y) {
    this.x = x;
    this.y = y;
}

var loadStartImage=function() {
    $.get("http://localhost:5000/givemejpegurls", function(data) {
        $(".currentImage").attr("src", "http://localhost:5000" + data[0]);
        setImageClickFunction();
    });
};

var getElementRelativeCoords = function(item, event) {
    var elemRect = item.getBoundingClientRect();
    var absX = event.clientX - elemRect.left;
    var absY = event.clientY - elemRect.top;

    return new Point(absX, absY);
}

var setImageClickFunction = function() {
    var item = document.querySelector(".currentImage");
    $(".currentImage").click(function(event) {
        var absPos = getElementRelativeCoords(item, event);
        var elemRect = item.getBoundingClientRect();
        var height = elemRect.height;
        var width = elemRect.width;
        // var absX = event.clientX - elemRect.left;
        // var absY = event.clientY - elemRect.top;
        var normX = absPos.x / width;
        var normY = absPos.y / height;
        console.log(normX + ',' + normY);
    });
};

window.onload = loadStartImage;
