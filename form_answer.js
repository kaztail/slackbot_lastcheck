function doPost(e) {

    try {
      const json = JSON.parse(e.postData.getDataAsString());
      if (json.type == "url_verification") {
  
        return ContentService.createTextOutput(json.challenge);  
        
      }
    }
    catch (ex) {
  
  Logger.log(ex);
  } 
  
  try {
      const json = JSON.parse(e.postData.getDataAsString());
      const reaction = json.event.reaction;
      // const data = JSON.stringify(e.postData.getDataAsString());
      // const value = data.event.value;
  
  if (reaction == "あっくん_いいね") {
  autoNotice();
  }
  
        }   
  catch (e) {
  
  Logger.log(e);
  
  }
  
  }
  
  //`<@U02DCSR0EHW>` + 
  
  
  function autoNotice() {
  
    // 定期的に通知する内容を記載
    let contents = String(generateMessage());
    let url = PropertiesService.getScriptProperties().getProperty("aoi_hoge");
  
  
    // リクエスト内容を整形
    const options =
    {
      "method" : "post",
      "contentType" : "application/json",
      "payload" : JSON.stringify(
        {
          "text" : contents,
          link_names: 1
        }
      )
    };
    //投稿先
    UrlFetchApp.fetch(url, options);
  
  }
  
  
  
  function generateMessage(){
    let id = '1zbewYl4OVQqSXbSjQlCxwRZV-JMR9p8ausiow5sfDR4';
    let spreadsheet = SpreadsheetApp.openById(id);
    let sheet = spreadsheet.getSheetByName('フォームの回答 1');
    let columnValsB = sheet.getRange('B:B').getValues();
    let columnValsL = sheet.getRange('O:O').getValues();
    let columnValsN = sheet.getRange('Q:Q').getValues();
    let lastRow = columnValsB.filter(String).length;
  
  //投稿内容のリスト化
  
    var targetList = [];
    for(var i = 2; i <= lastRow-1; i++){
      if (columnValsL[i][0] === false){
        if(columnValsN[i][0] === false){
          targetDataA = sheet.getRange(i+1,2).getValue();
          // targetDataB = sheet.getRange(i+1,4).getValue();
          targetDataC = Utilities.formatDate(sheet.getRange(i+1,6).getValue(),"Asia/Tokyo","MM/dd");  
          targetDataD = sheet.getRange(i+1,7).getValue();
          title = 'url'
          targetList.push(targetDataC + '：' + '<'+ targetDataD + '|' + targetDataA + '>');
          targetList.sort();
        };
      };
    };
  
  //投稿内容の最終整形
    let sheetUrl = 'https://docs.google.com/spreadsheets/d/1zbewYl4OVQqSXbSjQlCxwRZV-JMR9p8ausiow5sfDR4/edit#gid=1667888220';
    targetList.unshift('【期限：生徒名：出願先】管理表は'　+ '<' + sheetUrl + '|こちら>' )
    output = targetList.join("\n")
    return output
  }
  