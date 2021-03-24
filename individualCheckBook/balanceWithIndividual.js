function refresh(value) {
    var nameList = stringMatch(value);
    Logger.log('nameList: ' + nameList);
    Logger.log('nameListLength: ' + nameList.length);
    var checkbook = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("checkBook");
    var checkbookRows = checkbook.getRange("A3:A");
    var filteredName = [];
    var bounce = 0;
    for (index of checkbookRows.getDisplayValues()) {
      if (bounce >= 10) { // to reduce iterating entire spreadsheet of empty rows
        break;
      }
      if (index[0].length > 0) {
        bounce = 0;
        filteredName.push(index[0]);
      }
      bounce += 1;
    }
    var rowIndex = 3;
    for (nameMatch of filteredName) {
      var cell = checkbook.getRange(rowIndex, 2);
      var col = rowIndex + 3;
      var sum = sumColumn(col, checkbook);
      cell.setValue(sum);
      rowIndex += 1;
    }
  
    SpreadsheetApp.flush();
  }
  
  function stringMatch(testString) {
    var split = testString.split(' ');
    var matches = [];
    var nameRegex = new RegExp('\\w+:?(?=_)');
    while (split.length > 0) {
      var k = split.shift();
      var nameMatch = nameRegex.exec(k);
      if (nameMatch) {
        matches.push(nameMatch[0]);
      }
    }
    return matches;
  }
  
  function evaluateName(name) {
    if (name.length == 0) {
      return;
    } else {
      var uppercaseName = name;
      var lowercaseName = uppercaseName.toLowerCase();
      var negativeRegex = '_-\\d+\\.?\\d*|';
      var positiveRegex = '_\\d+\\.?\\d*|';
      var concatenate1 = '_\\d+\\.?\\d*';
      var string = uppercaseName +negativeRegex + lowercaseName + negativeRegex + uppercaseName + positiveRegex + lowercaseName +concatenate1
      console.log('concatenated: ' + string);
      return string;
    }
  }
  
  function sumColumn(columnIndex, sheet) {
    var cell = sheet.getRange(3, columnIndex, sheet.getMaxRows());
    sum = 0.0;
    for (cellValue of cell.getDisplayValues()){
      if (cellValue[0]){
        var regex = new RegExp("[-\\d\\.?\\d*|\\d\\.?\\d*]+", "g");
        var str = cellValue[0];
        var money = parseFloat(regex.exec(str)[0]);
        sum += money;
      }
    }
    return sum;
    
  }
  
  function namesExisting(nameColumn) {
    var originalNames = [];
    for (individualName of nameColumn.getRange("A3:A").getDisplayValues()){
      if(individualName[0].length){
        originalNames.push(individualName[0]);
      }
    }
    return originalNames;
  }
  
  function namesFromMasterNotes(noteColumn) {
    var names = [];
    var notes = noteColumn.getRange("I4:I");
    for (individualNote of notes.getDisplayValues()){
      if(individualNote[0].length){
        var nameList = stringMatch(individualNote[0]);
        if (nameList.length){
          for (individualName of nameList) {
          names.push(individualName);
          }
        }
      }
    }
    return names;
  }
  
  function allNames () {
    // need to extract existing list;
    var nameColumn = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("checkBook");
    var originalNames = namesExisting(nameColumn);
    // Logger.log(originalNames);
    var noteColumn = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master");
    var names = namesFromMasterNotes(noteColumn);
    for (let index = 0; index < names.length; index ++) {
      names[index] = capitalizeFirstLetter(names[index]);
    }
    var extendedNameList = originalNames.concat(names);
    var uniqueNames = new Set(extendedNameList);
    uniqueNames = [...uniqueNames];
    setNames(uniqueNames);
  }
  
  function setNames(tempNames) {
    var nameSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("checkBook")
    var firstCell = nameSheet.getRange('A3:A');
    var rowIndex = firstCell.getRow();
    for (name of tempNames) {
      nameSheet.getRange(rowIndex, 1).setValue(name);
      rowIndex += 1;
    }
    var rows = firstCell.setValue;
    SpreadsheetApp.flush();
  }
  
  function capitalizeFirstLetter(name) {
    var ugh = name.charAt(0).toUpperCase() + name.slice(1);
    return ugh;
  }
  
  function isBelongColumn(cell, index) {
    return cell.getColumn() == index;
  }
  
  function onEdit(e) {
    cell = e.range;
    if (isBelongColumn(cell, 9)) {
      allNames();
      refresh(cell.getValue());
    }
  }