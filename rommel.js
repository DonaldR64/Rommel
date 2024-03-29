const Rommel = (() => {
    const version = "2024.2.29"

    if (!state.Rommel || state.Rommel == []) {state.Rommel = {}};

    const pageInfo = {name: "",page: "",gridType: "",scale: 0,width: 0,height: 0};
    const TerrainNames = ["Desert Town","Desert Hill","Woods","Water"];
    const Axis = ["Germany","Italy","Japan"];

    const Colours = {
        red: "#ff0000",
        blue: "#00ffff",
        yellow: "#ffff00",
        green: "#00ff00",
        purple: "#800080",
        black: "#000000",
        darkblue: "#0000ff",
    }
    let outputCard = {title: "",subtitle: "",nation: "",body: [],buttons: [],};

    var UnitArray = {};
    var ElementArray = {};
    var EdgeArray,GridMap,SupplyPoints,Objectives;

    const Nations = {
        "Soviet Union": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/372890060/d9Xvvn6MTQA4bOVieBVxcg/thumb.png?1703639776",
            "backgroundColour": "#FF0000",
            "titlefont": "Anton",
            "fontColour": "#000000",
            "borderColour": "#FFFF00",
            "borderStyle": "5px groove",
            "dice": "Soviet",
        },
        "Germany": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/329415788/ypEgv2eFi-BKX3YK6q_uOQ/thumb.png?1677173028",
            "backgroundColour": "#000000",
            "titlefont": "Bokor",
            "fontColour": "#FFFFFF",
            "borderColour": "#000000",
            "borderStyle": "5px double",
            "dice": "Germany",
        },
        "UK": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/330506939/YtTgDTM3q7p8m0fJ4-E13A/thumb.png?1677713592",
            "backgroundColour": "#0A2065",
            "titlefont": "Merriweather",
            "fontColour": "#FFFFFF",
            "borderColour": "#BC2D2F",
            "borderStyle": "5px groove",
            "dice": "UK",
        },
        "USA": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/327595663/Nwyhbv22KB4_xvwYEbL3PQ/thumb.png?1676165491",
            "backgroundColour": "#006400",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#006400",
            "borderStyle": "5px double",
            "dice": "USA",
        },
        "Canada": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/381473103/jnulRv5tzfstQs-K_VsVmQ/thumb.png?1708654212",
            "backgroundColour": "#C43C2C",
            "titlefont": "Arial",
            "fontColour": "#FFFFFF",
            "borderColour": "#C43C2C",
            "borderStyle": "5px groove",
            "dice": "Canada",
        },
        "Italy": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/381473374/BxV9mm4UWzurm2seaoyqng/thumb.png?1708654356",
            "backgroundColour": "#40904E",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#EA3323",
            "borderStyle": "5px double",
            "dice": "Italy",
        },




        "Neutral": {
            "image": "",
            "backgroundColour": "#FFFFFF",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#00FF00",
            "borderStyle": "5px ridge",
            "dice": "Neutral",
        },
    

    }

    class Point {
        constructor(x,y) {
            this.x = x;
            this.y = y;
        }
    };

    class Grid {
        constructor(c,r) {
            let gridCoord = {
                column: c,
                row: r,
            }
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
                label = gridReference(gridCoord)
                markerNum = (label.charAt(0) === "A") ? true:false;
                markerText = (label.charAt(1) === "1" && label.length === 2) ? true:false;
            }
            this.label = label;            
            this.centre = pt;
            this.terrain = [];
            this.tokenIDs = [];
            this.markerNum = markerNum;
            this.markerText = markerText;
        }
    }

    class Unit {
        constructor(id,elementID) {
            let token = findObjs({_type:"graphic", id: id})[0];
            let char = getObj("character", token.get("represents")); 
            let name = char.get("name");
            let attributeArray = AttributeArray(char.id);
            let nation = attributeArray.nation;
            let player = (Axis.includes(nation)) ? 0:1;
            let armour = parseInt(attributeArray.armour) || 0;
            let range = parseInt(attributeArray.range) || 0;
            let artillery = parseInt(attributeArray.barrage) || 0;
            let traits = attributeArray.traits || " ";
            traits = traits.toString();

            let type = attributeArray.type;
            let track = attributeArray.track;
            track = track.split("/");
            track = track.map(s => {
                let att,def,s2;
                if (s.includes("-")) {
                    s2 = s.split("-");
                    att = parseInt(s2[0]);
                    def = parseInt(s2[1]);
                } else {
                    att = def = parseInt(s);
                }
                let info = {
                    attack: att,
                    defense: def,
                }
                return info;
            })
            track.push(0);
            track.reverse();

            let hp = track.length - 1;
            name = name.replace(nation + " ","");

            let element = ElementArray[elementID];
            let elementColour = element.colour || "transparent";
            token.set({
                name: name,
                aura1_color: elementColour,
                aura1_radius: 50,
                aura1_square: true, 
                tint_color: "transparent",
                showplayers_bar1: true,
                bar1_value: hp,
                bar1_max: hp,
                showname: true,
                tooltip: element.name,
                show_tooltip: true,
            });

            let location = new Point(token.get("left"),token.get("top"));
            let gridCoord = pointToGrid(location);
log(name)
log(location)
log(gridCoord)

            this.id = id;
            this.token = token;
            this.name = name;
            this.type = type;
            this.nation = nation;
            this.player = player;
            this.elementID = elementID;
            this.track = track;
            this.armour = armour;
            this.range = range;
            this.artillery = artillery;
            this.traits = traits;

            this.location = gridCoord;

            UnitArray[id] = this;
            state.Rommel.info.units[id] = elementID; //used in rebuild



        }


    }


    class Element {
        constructor(id,name,nation,colour) {
            let player = (Axis.includes(nation)) ? 0:1;
            let elementColours = [[Colours.red,Colours.black,Colours.darkblue,Colours.yellow],[Colours.blue,Colours.green,Colours.purple,Colours.white]];
            let elementColour = colour;
            let hq = false;
            let elementNum = state.Rommel.info.elementNumbers[player];
            if (!colour) {
                if (name.includes("HQ") || name.includes("Corps")) {
                    elementColour = "transparent";
                    hq = true;
                } else {
                    elementColour = elementColours[player][elementNum] || "transparent";
                    state.Rommel.info.elementNumbers[player]++;
                }
            }

            this.name = name;
            this.id = id;
            this.player = player;
            this.nation = nation;
            this.colour = elementColour;
            this.hq = hq;
            ElementArray[id] = this;
            let elementInfo = {
                name: name,
                colour: elementColour,
            }
            state.Rommel.info.elements[id] = elementInfo;
        }
    }















    const pointToGrid = (point) => {
        let gridCoord = {
            column: Math.round((Math.round(point.x) - 105) / 210),
            row: Math.round((Math.round(point.y) - 105) / 210),
        }
        return gridCoord;
    }

    const gridReference = (gridCoord) => {
        let labels = ["A","B","C","D","E","F","G","H","I","J","K","L"];
        let textLabel = labels[gridCoord.row];
        let e = Math.floor(EdgeArray[0]/210);
        let numLabel = (gridCoord.column-e).toString();
        let label = textLabel + numLabel;
        return label;
    }

    const pointDistance = (pt1,pt2) => {
        let x2 = (pt2.x - pt1.x) * (pt2.x - pt1.x);
        let y2= (pt2.y - pt1.y) * (pt2.y - pt1.y);
        let distance = Math.sqrt(x2 + y2);
        return distance;
    }

    const Attribute = (character,attributename) => {
        //Retrieve Values from Character Sheet Attributes
        let attributeobj = findObjs({type:'attribute',characterid: character.id, name: attributename})[0]
        let attributevalue = "";
        if (attributeobj) {
            attributevalue = attributeobj.get('current');
        }
        return attributevalue;
    }

    const AttributeArray = (characterID) => {
        let aa = {}
        let attributes = findObjs({_type:'attribute',_characterid: characterID});
        for (let j=0;j<attributes.length;j++) {
            let name = attributes[j].get("name")
            let current = attributes[j].get("current")   
            if (!current || current === "") {current = " "} 
            aa[name] = current;
        }
        return aa;
    }

    const ButtonInfo = (phrase,action) => {
        let info = {
            phrase: phrase,
            action: action,
        }
        outputCard.buttons.push(info);
    }

    const SetupCard = (title,subtitle,nation) => {
        outputCard.title = title;
        outputCard.subtitle = subtitle;
        outputCard.nation = nation;
        outputCard.body = [];
        outputCard.buttons = [];
        outputCard.inline = [];
    }

    const PlaySound = (name) => {
        let sound = findObjs({type: "jukeboxtrack", title: name})[0];
        if (sound) {
            sound.set({playing: true,softstop:false});
        }
    };

    const DisplayDice = (roll,tablename,size) => {
        roll = roll.toString();
        if (!tablename) {
            tablename = "Neutral";
        }
        let table = findObjs({type:'rollabletable', name: tablename})[0];
        let obj = findObjs({type:'tableitem', _rollabletableid: table.id, name: roll })[0];        
        let avatar = obj.get('avatar');
        let out = "<img width = "+ size + " height = " + size + " src=" + avatar + "></img>";
        return out;
    };


    const PrintCard = (id) => {
        let output = "";
        if (id) {
            let playerObj = findObjs({type: 'player',id: id})[0];
            let who = playerObj.get("displayname");
            output += `/w "${who}"`;
        } else {
            output += "/desc ";
        }

        if (!outputCard.nation || !Nations[outputCard.nation]) {
            outputCard.nation = "Neutral";
        }

        //start of card
        output += `<div style="display: table; border: ` + Nations[outputCard.nation].borderStyle + " " + Nations[outputCard.nation].borderColour + `; `;
        output += `background-color: #EEEEEE; width: 100%; text-align: center; `;
        output += `border-radius: 1px; border-collapse: separate; box-shadow: 5px 3px 3px 0px #aaa;;`;
        output += `"><div style="display: table-header-group; `;
        output += `background-color: ` + Nations[outputCard.nation].backgroundColour + `; `;
        output += `background-image: url(` + Nations[outputCard.nation].image + `), url(` + Nations[outputCard.nation].image + `); `;
        output += `background-position: left,right; background-repeat: no-repeat, no-repeat; background-size: contain, contain; align: center,center; `;
        output += `border-bottom: 2px solid #444444; "><div style="display: table-row;"><div style="display: table-cell; padding: 2px 2px; text-align: center;"><span style="`;
        output += `font-family: ` + Nations[outputCard.nation].titlefont + `; `;
        output += `font-style: normal; `;

        let titlefontsize = "1.4em";
        if (outputCard.title.length > 12) {
            titlefontsize = "1em";
        }

        output += `font-size: ` + titlefontsize + `; `;
        output += `line-height: 1.2em; font-weight: strong; `;
        output += `color: ` + Nations[outputCard.nation].fontColour + `; `;
        output += `text-shadow: none; `;
        output += `">`+ outputCard.title + `</span><br /><span style="`;
        output += `font-family: Arial; font-variant: normal; font-size: 13px; font-style: normal; font-weight: bold; `;
        output += `color: ` +  Nations[outputCard.nation].fontColour + `; `;
        output += `">` + outputCard.subtitle + `</span></div></div></div>`;

        //body of card
        output += `<div style="display: table-row-group; ">`;

        let inline = 0;

        for (let i=0;i<outputCard.body.length;i++) {
            let out = "";
            let line = outputCard.body[i];
            if (!line || line === "") {continue};
            line = line.replace(/\[hr(.*?)\]/gi, '<hr style="width:95%; align:center; margin:0px 0px 5px 5px; border-top:2px solid $1;">');
            line = line.replace(/\[\#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})\](.*?)\[\/[\#]\]/g, "<span style='color: #$1;'>$2</span>"); // [#xxx] or [#xxxx]...[/#] for color codes. xxx is a 3-digit hex code
            line = line.replace(/\[[Uu]\](.*?)\[\/[Uu]\]/g, "<u>$1</u>"); // [U]...[/u] for underline
            line = line.replace(/\[[Bb]\](.*?)\[\/[Bb]\]/g, "<b>$1</b>"); // [B]...[/B] for bolding
            line = line.replace(/\[[Ii]\](.*?)\[\/[Ii]\]/g, "<i>$1</i>"); // [I]...[/I] for italics
            let lineBack = (i % 2 === 0) ? "#D3D3D3" : "#EEEEEE";
            let fontColour = "#000000";
            let index1 = line.indexOf("%%");
            if (index1 > -1) {
                let index2 = line.lastIndexOf("%%") + 2;
                let substring = line.substring(index1,index2);
                let nation = substring.replace(/%%/g,"");
                line = line.replace(substring,"");
                lineBack = Nations[nation].backgroundColour;
                fontColour = Nations[nation].fontColour;
            }    
            out += `<div style="display: table-row; background: ` + lineBack + `;; `;
            out += `"><div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
            out += `"><span style="line-height: normal; color: ` + fontColour + `; `;
            out += `"> <div style='text-align: center; display:block;'>`;
            out += line + `</div></span></div></div>`;                
            
            output += out;
        }

        //buttons
        if (outputCard.buttons.length > 0) {
            for (let i=0;i<outputCard.buttons.length;i++) {
                let out = "";
                let info = outputCard.buttons[i];
                out += `<div style="display: table-row; background: #FFFFFF;; `;
                out += `"><div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                out += `"><span style="line-height: normal; color: #000000; `;
                out += `"> <div style='text-align: center; display:block;'>`;
                out += `<a style ="background-color: ` + Nations[outputCard.nation].backgroundColour + `; padding: 5px;`
                out += `color: ` + Nations[outputCard.nation].fontColour + `; text-align: center; vertical-align: middle; border-radius: 5px;`;
                out += `border-color: ` + Nations[outputCard.nation].borderColour + `; font-family: Tahoma; font-size: x-small; `;
                out += `"href = "` + info.action + `">` + info.phrase + `</a></div></span></div></div>`;
                output += out;
            }
        }

        output += `</div></div><br />`;
        sendChat("",output);
        outputCard = {title: "",subtitle: "",nation: "",body: [],buttons: [],};
    }

    const BuildMap = () => {
        LoadPage();
        GridMap = [];
        SupplyPoints = ["",""];
        Objectives = [[],[]];
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
        AddTerrain();
        RebuildArrays();




    }

    const LoadPage = () => {
        pageInfo.page = getObj('page', Campaign().get("playerpageid"));
        pageInfo.name = pageInfo.page.get("name");
        pageInfo.scale = pageInfo.page.get("snapping_increment");
        pageInfo.width = pageInfo.page.get("width")*70;
        pageInfo.height = pageInfo.page.get("height")*70;
        let edges = findObjs({_pageid: Campaign().get("playerpageid"),_type: "path",layer: "map",stroke: "#d5a6bd",});    
        let c = pageInfo.width/2;
        EdgeArray = [];
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
                stroke_width: 3,
                left: left,
                top: top,
                width: width,
                height: height,
            });
            toFront(newLine);
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
                stroke_width: 3,
                left: left,
                top: top,
                width: width,
                height: height,
            });
            toFront(newLine);
        }
        _.each(GridMap,column => {
            _.each(column,square => {
                let text;
                if (square.markerNum === true) {
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
                if (square.markerText === true) {
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

    const AddTerrain = () => {
        let mapObjs = findObjs({type: 'graphic',layer:"map"});
        _.each(mapObjs,mapObj => {
            let mapChar = getObj("character", mapObj.get("represents")); 
            if (mapChar) {
                let name = mapChar.get("name");
                let nation = Attribute(mapChar,"nation");
                let pt = new Point(mapObj.get("left"),mapObj.get("top"));
                if (pt.x <= pageInfo.width && pt.y <= pageInfo.height) {
                    let gridCoord = pointToGrid(pt);
                    if (GridMap[gridCoord.row][gridCoord.column]) {
                        if (TerrainNames.includes(name)) {
                            GridMap[gridCoord.row][gridCoord.column].terrain.push(name);
                        }
                        if (name.includes("Objective")) {
                            if (nation) {
                                let player = (Axis.includes(nation)) ? 0:1;
                                if (state.Rommel.info.nations[player].includes(nation) === false) {
                                    state.Rommel.info.nations[player].push(nation);
                                }
                                Objectives[player].push(gridCoord);
                            }
                        }
                        if (name.includes("Supply")) {
                            if (nation) {
                                let player = (Axis.includes(nation)) ? 0:1;
                                if (state.Rommel.info.nations[player].includes(nation) === false) {
                                    state.Rommel.info.nations[player].push(nation);
                                }
                                SupplyPoints[player] = gridCoord;
                            }
                        }
                    }
                } 
            }
        })
    }

    const stringGen = () => {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 6; i++) {
            text += possible.charAt(Math.floor(randomInteger(possible.length)));
        }
        return text;
    };

    const RollD6 = (msg) => {
        let Tag = msg.content.split(";");
        PlaySound("Dice");
        let roll = randomInteger(6);
        if (Tag.length === 1) {
            let playerID = msg.playerid;
            let nation = "Neutral";
            if (state.Rommel.info.players[playerID] === undefined) {
                if (msg.selected) {
                    let id = msg.selected[0]._id;
                    if (id) {
                        let tok = findObjs({_type:"graphic", id: id})[0];
                        let char = getObj("character", tok.get("represents")); 
                        nation = Attribute(char,"nation");
                        player = (Axis.includes(nation)) ? 0:1;
                        state.Rommel.info.players[playerID] = player;
                    }
                }
            } else {
                player = parseInt(state.Rommel.info.players[playerID]);
                nation = state.Rommel.info.nations[player][0];
            }
            let res = "/direct " + DisplayDice(roll,Nations[nation].dice,40);
            sendChat("player|" + playerID,res);
        } else {
            //functions
        }
    }

    const ClearState = () => {
        sendChat("","State Cleared");
        state.Rommel.info = {
            elementNumbers: [0,0],
            nations: [[],[]],
            players: {}, //indexed by playerID, indicates which side they're on
            units: {}, //used in rebuild, has elementID, index by unitID
            elements: {}, //used in rebuild, has element names and colours, indexed by elementID
            turn: 0,
            phase: "End",
            maxTurns: 0,
            startingPlayer: 0,
            secondPlayer: 1,
            ops: [0,0],

        }
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "objects",
        });
        _.each(tokens,token => {
            token.set({
                name: "",
                aura1_color: "transparent",
                aura1_radius: 0,
                aura1_square: true, 
                tint_color: "transparent",
                showplayers_bar1: true,
                bar1_value: 0,
                bar1_max: 0,
                showname: true,
                tooltip: "",
                show_tooltip: true,
            });
        });
        BuildMap();
    }

    const MapInfo = () => {
        let objectives = [[],[]];
        for (let p=0;p<2;p++) {
            for (let i=0;i<Objectives[p].length;i++)  {
                objectives[p].push(gridReference(Objectives[p][i]));
            }
        }
        SetupCard("Map Notes","","Neutral");
        for (let p=0;p<2;p++) {
            let nations = state.Rommel.info.nations[p].toString();
            nations = nations.replace(/,/g , " + ");
            outputCard.body.push("[U]" + nations + "[/u]");
            outputCard.body.push("Objectives: " + objectives[p].toString());
            outputCard.body.push("Supply Point: " + gridReference(SupplyPoints[p]));
            if (p===0){outputCard.body.push("[hr]")};
        }
        PrintCard();
    }

    const TokenInfo = (msg) => {
        if (!msg.selected) {return};
        let id = msg.selected[0]._id;
        let unit = UnitArray[id];
        if (!unit) {
            sendChat("","Not in Array");
        } else {
            let element = ElementArray[unit.elementID];
            let grid = GridMap[unit.location.row][unit.location.column];

            SetupCard(unit.name,element.name,unit.nation);
            outputCard.body.push(unit.type + " Unit - " + grid.label);
            let hp = parseInt(unit.token.get("bar1_value"));
            let max = parseInt(unit.token.get("bar1_max"));
            let out = "Strength: " + hp;
            if (hp === max) {
                out += " (Max)";
            } 
            outputCard.body.push(out);
            let combatValue = unit.track[hp];
            if (combatValue.attack === combatValue.defense) {
                outputCard.body.push("Combat Value: " + combatValue.attack);
            } else {
                outputCard.body.push("Attack Combat Value: " + combatValue.attack);
                outputCard.body.push("Defense Combat Value: " + combatValue.defense);
            }


            if (unit.type === "Armour") {
                let av = unit.armour;
                outputCard.body.push("Armour Value: " + av);
            }
            if (unit.type === "Artillery") {
                let range = unit.range;
                let artillery = unit.artillery;
                outputCard.body.push("Artillery Range: " + range);
                outputCard.body.push("Barrage Value: " + artillery);
            }
            if (unit.traits !== " ") {
                outputCard.body.push("Traits: " + unit.traits);
            }

            let terrain = "In " + grid.terrain.toString() + " Terrain"
            if (grid.terrain.length === 0) {
                if (grid.label === "Offboard") {
                    terrain = "Offboard";
                } else {
                    terrain = "In the Open";
                }
            }
            outputCard.body.push(terrain);
            PrintCard();
        }
    }

    const RebuildArrays = () => {
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "objects",
        });
        _.each(tokens,token => {
            let char = getObj("character", token.get("represents")); 
            if (char) {


                let nation = Attribute(char,"nation");
                let player = (Axis.includes(nation)) ? 0:1;
                if (state.Rommel.info.nations[player].includes(nation) === false) {
                    state.Rommel.info.nations[player].push(nation);
                }
                let elementID = state.Rommel.info.units[token.id];
                if (elementID) {
                    element = ElementArray[elementID];
                    if (!element) {
                        let elementName = state.Rommel.info.elements[elementID].name;
                        let elementColour = state.Rommel.info.elements[elementID].colour;
                        element = new Element(elementID,elementName,nation,elementColour);
                    }
                    let unit = new Unit(token.id,elementID);
                }
            }

        });
        log("Arrays Rebuilt")




    }


    const NextPhase = () => {
        let phase = state.Rommel.info.phase;
        let turn = state.Rommel.info.turn;
        let phases = ["Start","Road","Tactical","End"];
        let phaseNumber = phases.indexOf(phase);
        phaseNumber++;
        if (phaseNumber >= phases.length) {
            phaseNumber = 0;
        } 
        phase = phases[phaseNumber];
        NextPhase2(turn,phase);
    }

    const NextPhase2 = (turn,phase) => {
        state.Rommel.info.phase = phase;
        let even = (turn % 2  === 0) ? true:false;
        let startingPlayer = state.Rommel.info.startingPlayer;
        let secondPlayer = state.Rommel.info.secondPlayer;
        let currentPlayer = (even === false) ? startingPlayer:secondPlayer;
        SetupCard("Turn " + turn,phase + " Phase",state.Rommel.info.nations[currentPlayer][0]);
        if (phase === "Start") {
            state.Rommel.info.turn++;
            turn++;
            currentPlayer = (currentPlayer === 0) ? 1:0;
            SetupCard("Turn " + turn,phase + " Phase",state.Rommel.info.nations[currentPlayer][0]);
            let maxTurns = state.Rommel.info.maxTurns;
            if (turn > maxTurns) {
                SetupCard("End of Game","","Neutral");
                outputCard.body.push("Game ends on Turns");
                PrintCard();
                return;
            }
            ButtonInfo("Standard OPS Roll","!OPS;" + currentPlayer + ";Standard");
            ButtonInfo("Reset OPS","!OPS;" + currentPlayer + ";Reset");
            ResetUnits(currentPlayer);
        } else if (phase === "Road") {





        } else if (phase === "Tactical") {




        } else if (phase === "End") {






        }














        PrintCard();

    }













    const UnitCreation = (msg) => {
        let Tag = msg.content.split(";");
        let elementName = Tag[1];
        let elementID = stringGen();
        let refToken = findObjs({_type:"graphic", id: msg.selected[0]._id})[0];
        let refChar = getObj("character", refToken.get("represents")); 
        let nation = Attribute(refChar,"nation");
        let player = (Axis.includes(nation)) ? 0:1;
        if (state.Rommel.info.nations[player].includes(nation) === false) {
            state.Rommel.info.nations[player].push(nation);
        }
        let element = new Element(elementID,elementName,nation);
        for (let i=0;i<msg.selected.length;i++) {
            let id = msg.selected[i]._id
            let unit = new Unit(id,elementID);
        }
        sendChat("",elementName + " Created");
    }

    const StartGame = (msg) => {
        let Tag = msg.content.split(";");
        let startingPlayer = parseInt(Tag[1]);
        let maxTurns = parseInt(Tag[2]);
        let axisOps = parseInt(Tag[3]);
        let alliedOps = parseInt(Tag[4]);

        state.Rommel.info.startingPlayer = startingPlayer;
        state.Rommel.info.secondPlayer = (startingPlayer === 0) ? 1:0;
        state.Rommel.info.maxTurns = maxTurns;
        state.Rommel.info.turn = 0;
        state.Rommel.info.ops[0] = axisOps;
        state.Rommel.info.ops[1] = alliedOps;
        NextPhase2(0,"Start");
    }

    const ResetUnits = (player) => {
        _.each(UnitArray,unit => {
            if (unit.player === player) {
                unit.token.set("tint_color","transparent");
            }
        })
    }

    const OPS = (msg) => {
        let Tag = msg.content.split(";");
        let player = Tag[1];
        let mode = Tag[2];
        let dice = (mode === "Standard") ? 6:3;
        let startOPS = parseInt(state.Rommel.info.ops[player]);
        let nation = state.Rommel.info.nations[player][0]
        SetupCard("OPS Rolls",dice + " Dice",nation);
        let newOPS = 0;
        let dd = [];
        let rolls = [];
        for (let i=0;i<dice;i++) {
            let roll = randomInteger(6);
            rolls.push(roll);
            dd.push(DisplayDice(roll,Nations[nation].dice,24))
            if (roll > 1) {newOPS++};
        }
        dd.sort();
        dd = dd.toString();
        dd = dd.replace(/,/g , " ");
        let extra = "";
        let endOPS = Math.min(10,startOPS + newOPS);
        if (endOPS === 10) {extra = " (Max)"};
        state.Rommel.info.ops[player] = endOPS;
        outputCard.body.push(dd);
        outputCard.body.push("Starting OPS: " + startOPS);
        outputCard.body.push(newOPS + " OPS Gained");
        outputCard.body.push("[hr]");
        outputCard.body.push("OPS Total: " + endOPS + extra);
        if (mode === "Reset") {
            outputCard.body.push("Board Reset");
            //ResetBoard(player);
        }
        outputCard.body.push("[hr]");
        outputCard.body.push("Active Player may now play any Event Cards");

        PrintCard();
    }






    const ClearMarkers = () => {
        let paths = findObjs({type: 'path',layer:"map"});
        _.each(paths,path => {
            if (path.get("fill") === "#000000") {
                path.remove();
            }
        })
        let markers = findObjs({type: 'text', layer: "map"});
        _.each(markers,mark => {
            if (mark.get("font_family") === "Candal") {
                mark.remove();
            }
        })
    }



    const changeGraphic = (tok,prev) => {
        if (tok.get('subtype') === "token") {
            let unit = UnitArray[tok.id];
            if (unit) {
                if ((tok.get("left") !== prev.left) || (tok.get("top") !== prev.top)) {
                    let newLocation = new Point(tok.get("left"),tok.get("top"));
                    newLocation = pointToGrid(newLocation);
                    if (newLocation.column !== unit.location.column || newLocation.row !== unit.location.row) {
                        log(tok.get("name") + " moving");
                        unit.location = newLocation;
                    }
                };
                if (tok.get("rotation") !== prev.rotation) {
                    tok.set("rotation",prev.rotation);
                }
            }
        };
    };
    















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
                log("Grid Map");
                log(GridMap)
                log("Unit Array");
                log(UnitArray)
                log("Element Array");
                log(ElementArray);
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
            case '!MapInfo':
                MapInfo();
                break;  
            case '!UnitCreation':
                UnitCreation(msg);    
                break;
            case '!RollD6':
                RollD6(msg);
                break;
            case '!TokenInfo':
                TokenInfo(msg);
                break;
            case '!StartGame':
                StartGame(msg);
                break;
            case '!NextPhase':
                NextPhase();
                break;
            case '!OPS':
                OPS(msg);
                break;
        }
    };

    const registerEventHandlers = () => {
        on('chat:message', handleInput);
        on('change:graphic',changeGraphic);
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
