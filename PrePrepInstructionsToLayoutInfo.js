
function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', './prepressInstructionsUrl.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(JSON.parse(xobj.responseText));
        }
    };
    xobj.send(null);
}

var _cimdDocWidth = 1103.4;
var _cimdDocHeight = 830.6999999999999;
var _widthFactor;
var _heightFactor;

var layoutFileJson = {
    "Unit": "Millimeters",
}

loadJSON(function (json) {
    _widthFactor = _cimdDocWidth / json.Pages[0].Width;
    _heightFactor = _cimdDocHeight / json.Pages[0].Height;


    Instructions = [];
    Instructions.push({
        "Type": "PushState"
    })
    Instructions.push({
        "Type": "PushState"
    })

    let strokeInfo = {
        "StrokeColor": {
            "C": 0,
            "M": 0,
            "Y": 0,
            "K": 69,
            "Opacity": 1
        },
        "StrokeWeight": 0.5
    }

    for (let i = 0; i < json.Pages[0].Instructions[0].SubPaths.length; i++) {
        if (json.Pages[0].Instructions[0].SubPaths[i]) {

            let subPaths = { "Type": "DrawShape" }
            subPaths = {
                ...subPaths, SubPaths: [{
                    StartPoint: json.Pages[0].Instructions[0].SubPaths[i].StartPoint, Operations: json.Pages[0].Instructions[0].SubPaths[i].Operations, Closed: true
                }]
            }
            subPaths = {
                ...subPaths, StrokeColor: {
                    "C": 0,
                    "M": 0,
                    "Y": 0,
                    "K": 69,
                    "Opacity": 1
                }
            }
            subPaths = { ...subPaths, StrokeWeight: 0.5 }


            subPaths.SubPaths[0].StartPoint.X = subPaths.SubPaths[0].StartPoint.X * _widthFactor;
            subPaths.SubPaths[0].StartPoint.Y = subPaths.SubPaths[0].StartPoint.Y * _heightFactor;

            for (let j = 0; j < subPaths.SubPaths[0].Operations.length; j++) {
                let path = subPaths.SubPaths[0].Operations[j];
                path.EndPoint.X = path.EndPoint.X * _widthFactor;
                path.EndPoint.Y = path.EndPoint.Y * _heightFactor;

                if (path.ControlPoint1) {
                    path.ControlPoint1.X = path.ControlPoint1.X * _widthFactor;
                    path.ControlPoint1.Y = path.ControlPoint1.Y * _heightFactor;
                }

                if (path.ControlPoint1) {
                    path.ControlPoint2.X = path.ControlPoint2.X * _widthFactor;
                    path.ControlPoint2.Y = path.ControlPoint2.Y * _heightFactor;
                }
            }

            Instructions.push(subPaths)
        }
    }

    Instructions.push({
        "Type": "DrawPdfPlaceholder",
        "PageNumber": 1,
        "Name": "PrepressOutput",
        "Position": {
            "X": _cimdDocWidth / 2,
            "Y": _cimdDocHeight / 2,
            "Width": _cimdDocWidth,
            "Height": _cimdDocHeight
        },
        "HorizontalOrientation": "Center",
        "VerticalOrientation": "Middle"
    })
    Instructions.push({
        "Type": "PopState"
    })
    Instructions.push({
        "Type": "PopState"
    })


    let page = {
        "PageNumber": 1,
        "Width": _cimdDocWidth,
        "Height": _cimdDocHeight, Instructions: Instructions
    }
    layoutFileJson.Pages = [page]

    console.log(JSON.stringify(layoutFileJson))
});

