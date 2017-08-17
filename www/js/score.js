

function showScore(){

    $("#score_list").empty();

    $.ajax({
        url: "https://"+ getter('kintoneSubdomain') + ".cybozu.com/k/v1/records.json",
        method: 'GET',
        headers: {
            "X-Cybozu-API-Token":getter('kintoneToken')
        },
        data:{
            "app":getter('kintoneAppId'),
            "query":"order by スマイル desc "
        }
    }).done(function(data) {
        
        // 検索結果を表示
        showKintoneResult(data.records);
    
    }).fail(function(XMLHttpRequest, textStatus, errorThrown) {

        alert(XMLHttpRequest.status);
        alert(textStatus);
        alert(errorThrown);

    });

}
function showKintoneResult(pRec){
    
    //console.log(JSON.stringify(pRec));
    
    var fd = document.createDocumentFragment();
    var list = document.getElementById('score_list');
    
    for (var i=0;i<pRec.length;i++){
        var wRec = pRec[i];

        //console.log(JSON.stringify(wRec));
        //console.log(JSON.stringify(wRec["顔写真"]));
        //console.log(JSON.stringify(wRec["顔写真"]["value"][0].fileKey));
        var wFileKey = wRec["顔写真"]["value"][0].fileKey;

        var row = document.createElement('ons-row');
        var col1 = document.createElement('ons-col');
        var col2 = document.createElement('ons-col');
        var img = document.createElement('img');
    
        img.setAttribute('src','http://date.ict.miyagi.jp/wp-content/uploads/2017/03/02yuzuru_ishimori_main.jpg');
        img.setAttribute("width","60px");
        col1.setAttribute('width','70px');
        col1.appendChild(img);
        
        
        
        col2.innerHTML = wRec["スマホ一覧タイトル"]["value"] + " [id=" + wRec["$id"]["value"] +"]" ;
        
        // パラメータを増やす時はindex.html のscriptを修正
        var wOpt = "{id:"+wRec['$id']['value']+",title:'"+wRec['スマホ一覧タイトル']['value']+"',filekey:'" + wFileKey + "'}";
        
        col2.setAttribute("onclick","nav.pushPage('score_detail.html',"+ wOpt +");");
        
        
        row.appendChild(col1);
        row.appendChild(col2);
        
        fd.appendChild(row);
    }    
    list.appendChild(fd);
    // ons.compile(list);
    
}


function showScoreDetail(pId,pTitle,pFileKey){
    
    console.log("filekey:"+pFileKey);
    console.log("title:"+pTitle);
    //alert(pId);
    $("#score_detail").append("<li>" + pTitle + "</li>");
    $("#score_detail").append("<li>" + "id =" + pId + "</li>");
    $("#score_detail").append("<li>" + "filekey =" + pFileKey + "</li>");
    //$("#score_detail").append("<li>" + "<img width='300px' src='http://date.ict.miyagi.jp/wp-content/uploads/2017/03/02yuzuru_ishimori_main.jpg' />" + "</li>");


    var data = null;
    
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
            // console.log(this.responseText);
            var blob = new Blob([xhr.response],{type: 'image/jpeg'});
            console.log(blob.toString());
            var url = window.URL || window.webkitURL;
            var blobUrl = url.createObjectURL(blob);
            
            
            var img = document.createElement("img")  ;
            img.src = blobUrl;
            
            $("#score_detail").append(img);
      }
    });
    
    xhr.open("GET", "https://1cx5k.cybozu.com/k/v1/file.json?fileKey=20170814021734367201BA6973428F81C9E6666ACA9694064");
    xhr.setRequestHeader("x-cybozu-api-token", "am2FnNx5Mt6zfhJqdCQ1KI4PT9EfzSvZoZlaXN1S");
    xhr.setRequestHeader("responsetype", "blob");
    
    xhr.send(data);


}

function showScoreDetail2(pId,pTitle,pFileKey){
    
    console.log(pFileKey);
    //alert(pId);
    $("#score_detail").append("<li>" + pTitle + "</li>");
    $("#score_detail").append("<li>" + "id =" + pId + "</li>");
    $("#score_detail").append("<li>" + "filekey =" + pFileKey + "</li>");
    //$("#score_detail").append("<li>" + "<img width='300px' src='http://date.ict.miyagi.jp/wp-content/uploads/2017/03/02yuzuru_ishimori_main.jpg' />" + "</li>");

    $("#score_detail").append("<li>" + "<img width='300px' id='img" + pFileKey + "'  />" + "</li>");


    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://1cx5k.cybozu.com/k/v1/file.json?fileKey=20170814021734367201BA6973428F81C9E6666ACA9694064",
      "method": "GET",
      "headers": {
        "x-cybozu-api-token": "am2FnNx5Mt6zfhJqdCQ1KI4PT9EfzSvZoZlaXN1S",
        //"responsetype": "blob",
      }
    }
      
    $.ajax(settings).done(function (data) {
        var reader = new FileReader();
        reader.onloadend = function() {
            base64data = reader.result;                
            console.log(base64data );
            
            var img = document.createElement("img");
            img.src = base64data;
            //img.src = "http://date.ict.miyagi.jp/wp-content/uploads/2017/03/02yuzuru_ishimori_main.jpg"        
            img.style.width="300px";
            
            $("#score_detail").append(img);
        }
            
      // DataURLとして読み込む
      reader.readAsDataURL(data);
  

        
    });

return;
    // ファイルダウンロード
    $.ajax({
        url: "https://"+ getter('kintoneSubdomain') + ".cybozu.com/k/v1/file.json?fileKey="+pFileKey,
        method: 'GET',
        headers: {
            "X-Cybozu-API-Token":getter('kintoneToken')
        },
    }).done(function(data) {
        //alert('success');
        
        var blob = new Blob([data]);
        var url = window.URL || window.webkitURL;
        var blobUrl = url.createObjectURL(blob);
        //var blobUrl = url.createObjectURL(data);
        console.log(blobUrl);

        wImg = document.getElementById("img"+pFileKey);
        wImg.src = blobUrl;

        //$("#img"+pFileKey).attr("src",blobUrl);
            
        //$("#img"+pFileKey).attr("src",window.URL.createObjectURL(data));
console.log(2);    
    
    }).fail(function(XMLHttpRequest, textStatus, errorThrown) {

        alert(XMLHttpRequest.status);
        alert(textStatus);
        alert(errorThrown);
    });
    
    
    
}