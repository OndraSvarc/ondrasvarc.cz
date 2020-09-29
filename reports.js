function csvToObject(csvUrl, headerRow, endline, separator){
  var csv = UrlFetchApp.fetch(csvUrl).getContentText("UTF-8").split(endline);
  var header = csv[headerRow - 1].split(separator);
  Logger.log(header);
  var toReturn = [];
  for (var k = headerRow; k < csv.length; k++){
    var row = csv[k].replace(String.fromCharCode(13), '');
    var obj = {};
    var cell = row.split(',');
    for (var j = 0; j < cell.length; j++){
          if(cell[j].length > 0){
            obj[(header[j]).trim()] = (cell[j]).trim();
          }
        }
    toReturn.push(obj);
  }
  return toReturn;
}

function getReports(select, from, where, during){
  select = Utilities.formatString('SELECT %s', select);
  from = Utilities.formatString('FROM %s', from);
  where = where == null ? '' : Utilities.formatString('WHERE %s', where);
  during = during[1] == undefined ? Utilities.formatString('DURING %s', during[0]) : Utilities.formatString('DURING %s, %s', during[0], during[1]);
  
  var query = [select, from, where, during].join(' ');
  var toReturn = [];
  
  Logger.log(query);
  
  var allReport = AdsApp.report(query);
  var rows = allReport.rows();
  
  while(rows.hasNext()){
    var row = rows.next();

    if(where.indexOf('EndDate') == -1 || row.EndDate != '--'){
      var rowToPush = row.formatForUpload();
    
    //Přeformátování Cost
      try{
        rowToPush.Cost = Number(rowToPush.Cost.replace(/,/g, ''));
      }catch(e){
      }
      
    //Přeformátování Budgetu
      try{
        rowToPush.Budget = Number(rowToPush.Budget.replace(/,/g, ''));
      }catch(e){
      } 
      
    //Přeformátování Avg CPC
      try{
        rowToPush['Avg. CPC'] = Number(rowToPush['Avg. CPC'].replace(/,/g, ''));
      }catch(e){
      }  
      
    //Přeformátování Imp. Share
      try{
        rowToPush['Search Impr. share'] = Number(rowToPush['Search Impr. share'].replace('%', '').replace(/,/g, '')) / 100;
      }catch(e){
      }
                
      toReturn.push(rowToPush);
    }
  }
  Logger.log(toReturn[0]);
  return toReturn;
}
