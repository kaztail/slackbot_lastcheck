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
    let columnValsB = sheet.getRange('B:B').getValues(); //生徒名
    let columnValsO = sheet.getRange('O:O').getValues(); //添削完了
    let columnValsQ = sheet.getRange('Q:Q').getValues(); //フォームミス
    let lastRow = columnValsB.filter(String).length; //フォームの長さ
  
    let columnValsM = sheet.getRange('M2:M').getValues(); //添削者の名前
    let name_list_bf = Array.prototype.concat.apply([], columnValsM); //添削者名を一次元へ
    let name_list = name_list_bf.filter(function (x, i, self) {
    return self.indexOf(x) === i;
  }); //添削者名の被りをなくす
    let name_list_length = name_list.length; //添削者名リストの長さ
  
  
    let name_sheet = spreadsheet.getSheetByName('slack');
    let name_sheetVals = name_sheet.getRange(2,1,name_list_length,2).getValues();
  
    var targetList = [];
    for (var i = 0; i <= name_list_length-1; i++){
      mt_name = name_sheetVals[i][1];
      readyList = [];
      for(var j = 1; j <= lastRow-1; j++){
        if(columnValsO[j][0] === false){
          if(columnValsQ[j][0] === false){
            if(columnValsM[j-1][0] == name_sheetVals[i][0]){
              st_name = sheet.getRange(j+1,2).getValue();
              st_deadline = Utilities.formatDate(sheet.getRange(j+1,6).getValue(),"Asia/Tokyo","MM/dd");  
              st_url = sheet.getRange(j+1,7).getValue();
              push_content = st_deadline + ' : ' + '<' + st_url + '|' + st_name + '>'
              Logger.log(push_content)
              readyList.push(push_content);        
            }
          }
        }
      }
      readyList.sort(); 
      output = readyList.join("\n");
      if(output != ''){
      targetList.push(mt_name + '\n' + output);
      }
    }
  
  //投稿時の最初の文章を挿入する
    let sheetUrl = 'https://docs.google.com/spreadsheets/d/1zbewYl4OVQqSXbSjQlCxwRZV-JMR9p8ausiow5sfDR4/edit#gid=1667888220';
    targetList.unshift('【期限：生徒名：出願先】管理表は'　+ '<' + sheetUrl + '|こちら>' )
  
    var final = Array.prototype.concat.apply([], targetList); 
    final = targetList.join("\n\n")
    final = final.replace(',','');
    Logger.log(final)
    return final
  }
