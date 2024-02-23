  const buttonlist = ["input","display","abilities"];
    buttonlist.forEach(button => {
        on(`clicked:${button}`, function() {
            setAttrs({
                sheetTab: button
            });
        });
    });

    on("sheet:opened", function() {
        setAttrs({sheetTab:"display"});
    });

    on("sheet:opened", function() { 
        getAttrs(["nation","period","armouredinf","rare","spa","infsupport","rockets","recon","cav","pioneer","unreliable"], function(values) {
            let nation = values.nation;
            let nationImage = "";

            if (nation === "Germany") {
                nationImage = "https://s3.amazonaws.com/files.d20.io/images/324330922/vm_sbQZSkc81fR4CtQp57g/thumb.png?1674494502";
            }
            if (nation === "Soviet Union") {
                nationImage = "https://s3.amazonaws.com/files.d20.io/images/324272729/H0Ea79FLkZIn-3riEhuOrA/thumb.png?1674441877";
            }

            let periodText = values.period + " ";
            if (periodText === "Any ") {periodText = ""};
            
            let traits = [];
            let traitInfo = [];
            if (values.armouredinf === "1") {
                traits.push("Armoured Infantry");
                traitInfo.push("Counts as Armoured<br>Tactical Movement of 2");
            };
            if (values.rare === "1") {
                traits.push("Rare Unit")
                traitInfo.push("May not be Reorganized");
            };
            if (values.spa === "1") {
                traits.push("Self-Propelled Artillery")
                traitInfo.push("May use tactical movement without being tipped.<br>May barrage from a beach square")
            };
            if (values.is === "1") {
                traits.push("Infantry Support")
                traitInfo.push("Not vulnerable in non-open terrain.<br>Negates attacker's penalty vs. urban, mountain, bocage.")
            };
            if (values.rockets === "1") {
                traits.push("Rocket Artillery")
                traitInfo.push("Can only barrage on Offensive")
            };
            if (values.recon === "1") {
                traits.push("Recon")
                traitInfo.push("May withdraw or scout in a combat");
            };
            if (values.cav === "1") {
                traits.push("Cavalry")
                traitInfo.push("An infantry unit that may move 2 squares in a tactical phase, 6 by road movement, and may evade.")
            };
            if (values.pioneer === "1") {
                traits.push("Pioneer")
                traitInfo.push("May use pioneer effects while attacking.")
            };
            if (values.unreliable === "1") {
                traits.push("Unreliable Unit");
                traitInfo.push("Roll at the end of any phase in which it moved more than 1 square. On a 6 it takes one loss.")
            };

            let traitsDisplay = "Off";
            if (traits.length > 0) {
                traitsDisplay = "On";
            }

            setAttrs({
                "nationImage": nationImage,
                "traits0": traits[0],
                "traits1": traits[1],
                "traits2": traits[2],
                "traitsDisplay": traitsDisplay,
                "traits0Text": traitInfo[0],
                "traits1Text": traitInfo[1],
                "traits2Text": traitInfo[2],
                "periodText": periodText,
            });
        });    
    }); 


 