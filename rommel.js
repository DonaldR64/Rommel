const Rommel = (() => {
    const version = "2024.2.28"

    if (!state.Rommel || state.Rommel == []) {state.Rommel = {}};

    const pageInfo = {name: "",page: "",gridType: "",scale: 0,width: 0,height: 0};




    const UnitArray = {};
    const EdgeArray = [];
    const GridMap = [];

    class Point {
        constructor(x,y) {
            this.x = x;
            this.y = y;
        }
    };

    class Grid {
        constructor(c,r) {
            let x = (c*210) + 105;
            let y = (r*210) + 105;
            let pt = new Point(x,y);
            let labels = ["A","B","C","D","E","F","G","H","I","J","K","L"];
            let label;
            let textLabel,numLabel;
            let markerText = false;
            let markerNum = false;
            if (x<EdgeArray[0] || x>EdgeArray[1]) {
                label = "Offboard";
            } else {
                let e = Math.floor(EdgeArray[0]/210);
                numLabel = (c-e).toString();
                textLabel = labels[r];
                label = textLabel + numLabel;
                markerNum = (numLabel === "1") ? true:false;
                markerText = (textLabel === "A") ? true:false;
            }
            this.markerNum = markerNum;
            this.markerText = markerText;
            this.label = label;            
            this.centre = pt;
            this.terrain = [];
            this.tokenIDs = [];
            this.objectives = [];
        }
    }








    const BuildMap = () => {
        LoadPage();
        //AddTerrain();
        //builds a grid map, using larger squares of 3 squares each
        let columns = Math.floor(pageInfo.width/210);
        let rows = Math.floor(pageInfo.height/210);
        for (let r=0;r<rows;r++) {
            let grids = [];
            for (let c=0;c<columns;c++) {
                grids.push(new Grid(c,r));
            }
            GridMap.push(grids);
        }
        if (state.Rommel.mapIDs.includes(Campaign().get("playerpageid")) === false) {
            PlaceGridLines();
            state.Rommel.mapIDs.push(Campaign().get("playerpageid"));
        }



    }

    const LoadPage = () => {
        pageInfo.page = getObj('page', Campaign().get("playerpageid"));
        pageInfo.name = pageInfo.page.get("name");
        pageInfo.scale = pageInfo.page.get("snapping_increment");
        pageInfo.width = pageInfo.page.get("width")*70;
        pageInfo.height = pageInfo.page.get("height")*70;
        let edges = findObjs({_pageid: Campaign().get("playerpageid"),_type: "path",layer: "map",stroke: "#d5a6bd",});    
        let c = pageInfo.width/2;
        for (let i=0;i<edges.length;i++) {
            EdgeArray.push(edges[i].get("left"));
        }
        if (EdgeArray.length <2) {
            sendChat("","Add Edge(s) to map and reload API");
        } else if (EdgeArray.length === 2) {
            if (EdgeArray[0] > c) {
                let temp = edgeArray[0];
                EdgeArray[0] = edgeArray[1];
                EdgeArray[1] = temp;
            } 
        } else if (EdgeArray.length > 2) {
            sendChat("","Error with > 2 edges, Fix and Reload API");
        }
    }



    const PlaceGridLines = () => {
        let x = pageInfo.width/3;
        let y = pageInfo.height/3;
        for (let i=1;i<x;i++) {
            let x1 = i*210;
            let width = 0;
            let height = pageInfo.height-2;
            let left = width/2;
            let top = height/2;
            let path = [["M",x1,1],["L",x1,pageInfo.height-1]];
            path = path.toString();
            let newLine = createObj("path", {   
                _pageid: Campaign().get("playerpageid"),
                _path: path,
                layer: "map",
                fill: "#000000",
                stroke: "#000000",
                stroke_width: 5,
                left: left,
                top: top,
                width: width,
                height: height,
            });
        }
        for (let i=1;i<y;i++) {
            let y1 = i*210;
            let width = pageInfo.width-2;
            let height = 0;
            let left = width/2;
            let top = height/2;
            let path = [["M",1,y1],["L",pageInfo.width-1,y1]];
            path = path.toString();
            let newLine = createObj("path", {   
                _pageid: Campaign().get("playerpageid"),
                _path: path,
                layer: "map",
                fill: "#000000",
                stroke: "#000000",
                stroke_width: 5,
                left: left,
                top: top,
                width: width,
                height: height,
            });
        }
        _.each(GridMap,column => {
            _.each(column,square => {
                let text;
                if (square.markerText === true) {
                    text = square.label.replace("A","");
                    let y = square.centre.y - 70;
                    obj = createObj("text",{
                        left: square.centre.x,
                        top: y,
                        font_size: 36,
                        font_family: "Candal",
                        pageid: Campaign().get("playerpageid"),
                        layer: "map",
                        text: text,
                    });
                    toFront(obj);
                }
                if (square.markerNum === true) {
                    text = square.label.replace("1","");
                    let x = square.centre.x - 70;
                    obj = createObj("text",{
                        left: x,
                        top: square.centre.y,
                        font_size: 36,
                        font_family: "Candal",
                        pageid: Campaign().get("playerpageid"),
                        layer: "map",
                        text: text,
                    });
                    toFront(obj);
                }
            })
        });
    }


    const ClearState = () => {
        sendChat("","State Cleared");
        state.Rommel.info = {






        }




    }



    const ClearMarkers = () => {
        let paths = findObjs({type: 'path',layer:"map"});
log(paths)
        _.each(paths,path => {
            if (path.get("fill") === "#000000") {
                path.remove();
            }
        })
        let markers = findObjs({type: 'text', layer: "map"});
        _.each(markers,mark => {
            mark.remove();
            /*
            if (mark.get("font_family") === "Candal") {
                mark.remove();
            }
            */
        })
    }


    

    const handleInput = (msg) => {
        if (msg.type !== "api") {
            return;
        }
        let args = msg.content.split(";");
        log(args)
        switch(args[0]) {
            case '!Dump':
                log("STATE");
                log(state.Rommel);
                log("Edge Array")
                log(EdgeArray)
                log("Grid Map");
                log(GridMap)
                log("Unit Array");
                log(UnitArray)
                break;
            case '!ClearState':
                ClearState();
                break;
            case '!ClearMapIDs':
                state.Rommel.mapIDs = [];
                break;
            case '!ClearMarkers':
                ClearMarkers();
                break;

                                        
        }
    };

    const registerEventHandlers = () => {
        on('chat:message', handleInput);
        //on('change:graphic',changeGraphic);
    };

    on('ready', () => {
        log("==> Rommel Version: " + version + " <==")
        BuildMap();
        log("Map Built")      
        sendChat("","API Ready")
        registerEventHandlers();
    });

    return {
        // Public interface here
    };
})();
