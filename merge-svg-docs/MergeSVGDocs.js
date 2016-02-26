#target Illustrator  

var logging = true;

var CONST = {
    ARTBOARD_COUNT: 1,
    ARTBOARD_WIDTH:  80,
    ARTBOARD_HEIGHT: 80,
    ARTBOARD_SPACING: 16,
    ARTBOARD_ROWSxCOLS: 10,
    LOG_FILE_PATH: "~/Desktop/ai-script-log.txt",
    CHOOSE_FOLDER: "Please choose your Folder of files to place…",
    NO_SELECTION: "No selection",
    COMPOSITE_FILE_NAME: "composite.ai"
}

/*
var openDocs = [];
for (x=0; x<app.documents.length; x++) {
    openDocs.push('"' + app.documents[x].path + "/" + app.documents[x].name + '"');
    // doc = app.open(f);
}
logger("{files:[" + openDocs.join(',') + "]}");
*/

function filesToArtboards() {  
  
    // My function variables…  
    var doc, fileList, i, inFolder, mm, svgFile;  

    // Get the user to select a folder  
    inFolder = Folder.selectDialog(CONST.CHOOSE_FOLDER);  

    // Check they ain't cancelled  
    if (inFolder != null) {  

        // Gets just the SVG files…  
        fileList = inFolder.getFiles(/\.svg$/i);  

        // Make sure it has AI files in it…  
        if (fileList.length > 0) {  

            mm = 2.83464567 // Metric MM converter…  

            // Set the script to work with artboard rulers  
            app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;  

            // Add new multi-page document  
            doc = app.documents.add(
                DocumentColorSpace.RGB,  
                CONST.ARTBOARD_WIDTH, 
                CONST.ARTBOARD_HEIGHT, 
                CONST.ARTBOARD_COUNT = fileList.length,  
                DocumentArtboardLayout.GridByCol,  
                CONST.ARTBOARD_SPACING, 
                CONST.ARTBOARD_ROWSxCOLS = Math.round(Math.sqrt(fileList.length))  
           );

            // Loop thru the counter  
            for (i = 0; i < CONST.ARTBOARD_COUNT; i++) {

                // Set the active artboard rulers based on this    
                doc.artboards.setActiveArtboardIndex(i);  
                
                doc.artboards[i].name = fileList[i].name.replace(".svg", "");

                // Create group from SVG  
                svgFile = doc.groupItems.createFromFile(fileList[i]);  

                // Move relative to this artboards rulers  
                // Top Left
                
                try {
					svgFile.position = [
						Math.floor((CONST.ARTBOARD_WIDTH - svgFile.width) / 2),
						Math.floor((CONST.ARTBOARD_HEIGHT - svgFile.height) / 2) * -1
					];
                }
                catch(ex) {
					try {
					    svgFile.position = [0, 0];
					}
					catch(ex) {/*Exit Gracefully*/}
                }
                
                alignToNearestPixel(doc.selection);
                
            }; 
            
            saveFileAsAi(inFolder.path + "/" + CONST.COMPOSITE_FILE_NAME);
        };  

    };  
  
};

function saveFileAsAi(dest) {
    if (app.documents.length > 0) {
        var options = new IllustratorSaveOptions();
        var theDoc = new File(dest);
        options.compatibility = Compatibility.ILLUSTRATOR10;
        options.flattenOutput = OutputFlattening.PRESERVEAPPEARANCE;
        options.pdfCompatible = true;
        app.activeDocument.saveAs(theDoc, options);
    }
}

function alignToNearestPixel(sel) {
    
    try {
        if (typeof sel != "object") {
        
            logger(CONST.NO_SELECTION);
        } 
        else {
        
            for (i = 0 ; i < sel.length; i++) {
                sel[i].left = Math.round(sel[i].left);
                sel[i].top = Math.round(sel[i].top);
            }
            redraw();
        }
    }
    catch(ex) {
        logger(ex);
    }
}

function logger(txt) {  

    if (logging == 0) return;
    var file = new File(CONST.LOG_FILE_PATH);  
    file.open("e", "TEXT", "????");  
    file.seek(0,2);  
    $.os.search(/windows/i)  != -1 ? file.lineFeed = 'windows'  : file.lineFeed = 'macintosh';
    file.writeln("[" + new Date().toUTCString() + "] " + txt);  
    file.close();  
} 

filesToArtboards(); 