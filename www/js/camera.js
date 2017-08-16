// This is a JavaScript file
var g_lat;
var g_lon;
var g_address="現在地取得出来ませんでした。";
var g_smile;
var g_age;

function switch_btn(pType){
 
    switch (pType){
        // カメラ起動
        case 'camera':
            $("#btn_camera").show();
            $("#btn_emotion").hide();
            $("#btn_vision").hide();
            $("#btn_kintone").hide();
            break;
        // Azure
        case 'azure':
            $("#btn_camera").hide();
            $("#btn_emotion").show();
            $("#btn_vision").show();
            $("#btn_kintone").hide();
            break;
        // kintone
        case 'kintone':
            $("#btn_camera").hide();
            $("#btn_emotion").hide();
            $("#btn_vision").hide();
            $("#btn_kintone").show();
            break;
            
    }
}

// ------------------------------------
//   kintoneアプリにデータ登録
// ------------------------------------
function kintone_entry(){
    
    // カメラ画像をアップロードし、キーを取得する
    $.ajax(getUploadSettings()).done(function(data) {
        var key = JSON.parse(data).fileKey;

        // kintoneレコード登録
        create_new_record(key);

    }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
        alert(XMLHttpRequest.status + " " + textStatus + " " + errorThrown);
    });

}
// ------------------------------------
//      アプリに新規レコード登録
// ------------------------------------
function create_new_record(pFileKey){
    
    var body = JSON.stringify({
      "app": getter('kintoneAppId'),
      "record": {
        "register_person": {"value": getter('kintoneUserName')},
        "スマイル": {"value": g_smile},
        "年齢": {"value": g_age},
        "緯度": {"value": g_lat},
        "経度": {"value": g_lon},
        "住所": {"value": g_address},
        //file  : { value: [{ fileKey: pFileKey }]} 
      }
    });

    $.ajax({
        "url": "https://"+ getter('kintoneSubdomain') + ".cybozu.com/k/v1/record.json",
        "method": "POST",
        "headers": {
            "Content-Type"  : "application/json",
            "x-cybozu-api-token": getter('kintoneToken')
        },
        "data":body
    }).done(function(data) {
        //alert('success');
        console.log("id="+data["id"]+" revision="+data["revision"]);
        // 添付ファイルをレコードに関連付ける
        linkRecFile(data["id"], pFileKey);
    }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
        alert(XMLHttpRequest.status + " " + textStatus + " " + errorThrown);
    });
}
// ------------------------------------
// 事前にアップしたファイルとレコードを紐付け
// ------------------------------------
function linkRecFile(pId, pFileKey){
    var body = JSON.stringify({
      "app": getter('kintoneAppId'),
      "id" : pId,
      "record": {
        "顔写真"  : { value: [{ fileKey: pFileKey }]} 
      }
    });
    $.ajax({
        "url": "https://"+ getter('kintoneSubdomain') + ".cybozu.com/k/v1/record.json",
        "method": "PUT",
        "headers": {
            "Content-Type"  : "application/json",
            "x-cybozu-api-token": getter('kintoneToken')
        },
        "data":body
    }).done(function(data) {
        alert('レコード登録しました。');
        console.log('link success');
        console.log(data);
        
        // カメラボタンを表示
        switch_btn('camera');
        
    }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
        alert(XMLHttpRequest.status + " " + textStatus + " " + errorThrown);
    });
    
}

// ------------------------------------
//  添付ファイルアップロード用の前準備
// ------------------------------------
function getUploadSettings(){
    // カメラ画像を読込み
    var dataurl = $("#face_image").attr("src");

    //DataURLをBLOBに変換
    var mime_base64 = dataurl.split(',', 2);
    var mime = mime_base64[0].split(';');
    mime = mime[0].split(':');
	mime = mime[1]? mime[1]: mime[0];
	var base64 = window.atob(mime_base64[1]);
	var len = base64.length;
	var bin = new Uint8Array(len);
	for (var i=0; i<len; i++)
	{
	  bin[i] = base64.charCodeAt(i);
	}
	var blob = new Blob([bin], {type:mime});

    var formData = new FormData();
    formData.append("file", blob , "test.jpg"); 
    
    var settings = {
      "url": "https://"+ getter('kintoneSubdomain') + ".cybozu.com/k/v1/file.json",
      "method": "POST",
      "headers": {
        "x-cybozu-api-token": getter('kintoneToken'), 
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": formData
    }

    return settings;
}

// -----------------------------------------------------------------------------

function test_upload(){
    test_upload_2($("#face_image").attr("src"));
 
}
function test_upload_2(pResult){
    
    var dataurl = pResult;

    //DataURLをBLOBに変換
    var mime_base64 = dataurl.split(',', 2);
	var mime = mime_base64[0].split(';');
	mime = mime[0].split(':');
	mime = mime[1]? mime[1]: mime[0];
	var base64 = window.atob(mime_base64[1]);
	var len = base64.length;
	var bin = new Uint8Array(len);
	for (var i=0; i<len; i++)
	{
	  bin[i] = base64.charCodeAt(i);
	}
	var blob = new Blob([bin], {type:mime});

    var formData = new FormData();
    formData.append("file", blob , "test.jpg"); 
    
    var settings = {
      "url": "https://1cx5k.cybozu.com/k/v1/file.json",
      "method": "POST",
      "headers": {
        "x-cybozu-api-token": "am2FnNx5Mt6zfhJqdCQ1KI4PT9EfzSvZoZlaXN1S",
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": formData
    }
    
    $.ajax(settings).done(function(data) {
        var key = JSON.parse(data).fileKey;
        alert(key);
    }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
        alert('fail');
        alert(XMLHttpRequest.status);
        alert(textStatus);
        alert(errorThrown);
    });
}

function test_new_record(){
    var body = JSON.stringify({
      "app": 49,
      "record": {
        "register_person": {
          "value": "アンパンマン2"
        }
      }
    });

    $.ajax({
        "url": "https://1cx5k.cybozu.com/k/v1/record.json",
        "method": "POST",
        "headers": {
            "Content-Type"  : "application/json",
            "x-cybozu-api-token": "am2FnNx5Mt6zfhJqdCQ1KI4PT9EfzSvZoZlaXN1S"
        },
        "data":body
    }).done(function(data) {
        //alert('success');
        alert("id="+data["id"]+" revision="+data["revision"]);
    }).fail(function(XMLHttpRequest, textStatus, errorThrown) {

        alert(XMLHttpRequest.status);
        alert(textStatus);
        alert(errorThrown);
    });

}
function test_search(){

    // API トークン
    // Dj8UFFX5XQhurLCAXUi7JegAkkwZRJQmhxSt3P0g
    // 呼び方
    // curl -H "X-Cybozu-API-Token: YOUR_TOKEN" "https://1cx5k.cybozu.com/k/v1/record.json?app=49&id=1"

    $.ajax({
        //url: "https://1cx5k.cybozu.com/k/v1/records.json?app=49&id=1",
        url: "https://1cx5k.cybozu.com/k/v1/records.json",
        method: 'GET',
        headers: {
            //'Content-Type'  : "application/json",
            "X-Cybozu-API-Token":"Dj8UFFX5XQhurLCAXUi7JegAkkwZRJQmhxSt3P0g"
        },
        data:{
            "app":49,
            "query":"$id=1"
        }
    }).done(function(data) {
        //alert('success');
        for(var i=0;i<data.records.length;i++){
            //alert(data.records[i]);
            var wData = data.records[i];
            alert(wData["register_person"]["value"] + wData["スマイル"]["value"]);
        }
    
    }).fail(function(XMLHttpRequest, textStatus, errorThrown) {

        alert(XMLHttpRequest.status);
        alert(textStatus);
        alert(errorThrown);

    });

}


// ------------------------------------
//      AzureFaceAPI結果を表示
// ------------------------------------
function showResult(pData){
    // li 要素クリア    
    $("#face_result").empty();
    
    // 領域初期化
    var w_canvas = $('#canvas')[0];
    var context = w_canvas.getContext('2d');    
    context.strokeStyle = "rgb(0, 0, 255)";

    Object.keys(pData).forEach(function (key) {

        //var tab = $('<table id="table_id1">');

        var tr = "<tr><td width='50%'><ul id='face_result'></ul></td>";
        //tr = tr + "<td align='center'>実年齢<BR><input type='number' id='real_age' style='width:50px;height:40px; font-size:20px' /><BR>";
        //tr = tr + "<ons-button onclick='entry()'>エントリ</ons-button></td>";
        tr = tr + "</tr>"

        $(tr).appendTo($("#face_result_table"));

        var fa = pData[key]["faceAttributes"];
        $("#face_result").append("<li>" + "age =" + fa.age + "</li>");
        $("#face_result").append("<li>" + "gender =" + fa.gender + "</li>");
        $("#face_result").append("<li>" + "smile =" + String(fa.smile) + "</li>");
        
        
        var em = pData[key]["faceAttributes"]["emotion"];
        $("#face_result").append("<li>" + "anger =" + em.anger + "</li>");
        $("#face_result").append("<li>" + "contempt =" + em.contempt + "</li>");
        $("#face_result").append("<li>" + "disgust =" + em.disgust + "</li>");
        $("#face_result").append("<li>" + "fear =" + em.fear + "</li>");
        $("#face_result").append("<li>" + "happiness =" + em.happiness + "</li>");
        $("#face_result").append("<li>" + "neutral =" + em.neutral + "</li>");
        $("#face_result").append("<li>" + "sadness =" + em.sadness + "</li>");
        $("#face_result").append("<li>" + "surprise =" + em.surprise + "</li>");
        
        // kintone登録用
        g_smile = String(fa.smile*100);
        g_age   = fa.age;

/*        
        var rect = pData[key]["faceRectangle"];
        $("#face_result").append("<li>" + "top =" + String(rect.top) + "</li>");
        $("#face_result").append("<li>" + "left =" + String(rect.left) + "</li>");
        $("#face_result").append("<li>" + "width =" + String(rect.width) + "</li>");
        $("#face_result").append("<li>" + "height =" + String(rect.height) + "</li>");
*/        

        // 顔を線で囲う
        var rect = pData[key]["faceRectangle"];
        //top,left,width,height
        context.beginPath();
    
        context.moveTo(rect.left,rect.top);
        context.lineTo(rect.left+rect.width,rect.top);
        context.lineTo(rect.left+rect.width,rect.top+rect.height);
        context.lineTo(rect.left,rect.top+rect.height);
        
        context.closePath();
        context.stroke();

        context.fillStyle="rgb(0, 0, 255)"; // 青
        context.fillRect(rect.left-30, rect.top+rect.height+10, 120, 30  );


        // 顔に吹き出しを出力
        context.fillStyle = "yellow";
        context.font = "24px 'ＭＳ ゴシック'";
        context.textAlign = "left";
        context.textBaseline = "top";
        context.fillText(" " + fa.gender + " " + fa.age, rect.left-30, rect.top + rect.height + 10, 200);

//        context.stroke();
        //context.rect(rect.left-30, rect.top + rect.height + 10, 100, 20)
        
        // kintoneボタンを表示
        switch_btn('kintone');
    });    
    if (pData.length == 0){
        alert('顔認識が出来ませんでした。');
        // カメラボタンを表示
        switch_btn('camera');
    }



    
/*
    //パスの開始座標を指定する
    context.moveTo(100,20);
    //座標を指定してラインを引いていく
    context.lineTo(150,100);
    context.lineTo(50,100);
    //パスを閉じる（最後の座標から開始座標に向けてラインを引く）
    context.closePath();
    //現在のパスを輪郭表示する
    context.stroke();
*/    
/*    
    if (pData.length > 0){
    
        // 一人目のみ抽出
        var fa = pData[0]["faceAttributes"];
        
        $("#face_result").empty();
        $("#face_result").append("<li>" + "age =" + fa.age + "</li>");
        $("#face_result").append("<li>" + "gender =" + fa.gender + "</li>");
        $("#face_result").append("<li>" + "smile =" + String(fa.smile) + "</li>");
    }else{
        
        alert('顔認識が出来ませんでした。');
    }
*/
}


// ------------------------------------
//   Azureに渡した画像を表示
// ------------------------------------
/*
function show_face_image(pSrc){
    $("#face_image").attr("src",pSrc);
    $("#face_image").attr("height",350);
}
*/

// ------------------------------------
//   Web上の画像を読み込む
// ------------------------------------
/*
function reamote_file_read(){

    // 実機じゃないと動かない
    var sourceImageUrl = $("#web_image").val();
    compress_photo(sourceImageUrl);
}
*/
// ------------------------------------
//   スマホカメラ画像から呼び出し
// ------------------------------------
function camera_read () {
    
    // 前回結果を削除
    $("#face_result_table").empty();


    // カメラ起動
    navigator.camera.getPicture (onSuccess, onFail,
        { quality: 50, destinationType: Camera.DestinationType.DATA_URL});
    
// camera callback ----------------------
    //成功した際に呼ばれるコールバック関数
    function onSuccess (imageData) {
        
        // Azureボタンを表示
        switch_btn('azure');
        
        var dataUrl = "data:image/jpeg;base64," + imageData;
        
        // 画像圧縮して表示
        compress_photo(dataUrl);
        
    }

    //失敗した場合に呼ばれるコールバック関数
    function onFail (message) {
        alert ('スマホ画像呼び出し失敗です: ' + message);
        
        // カメラボタンを表示
        switch_btn('camera');
    }

}
// ------------------------------------
//   ライブラリから写真指定したら表示
// ------------------------------------
/*
function local_file_change(){

    var w_file=$('#local_image')[0].files[0]
    var reader = new FileReader();
    reader.onloadend = function(){
        // 画像圧縮して表示
        compress_photo(reader.result);
    }
    
    if (w_file) {
        // 結果表示エリアクリア
        $("#responseTextArea").val("");
        // 画像読み込み
        reader.readAsDataURL(w_file);
    }

}
*/
// ------------------------------------
//   指定された画像を圧縮
// ------------------------------------
function compress_photo(pReaderResult){

    if (pReaderResult == null){
        alert('ファイルサイズ大きすぎるのか、正しく読み込めませんでした。');
    }else{
        var w_image = new Image();
        w_image.onload = function(e){
            var cnvImage = document.createElement('img');
            var w_canvas = $('#canvas')[0];
            //w_canvas.width = $('#cvWidth')[0].value;     // ←画面で指定されたサイズ
            w_canvas.width = getter('cvWidth');     // ←横サイズ
            w_canvas.height = w_image.height * (w_canvas.width / w_image.width);;
            var w_ctx   = w_canvas.getContext('2d');
            w_ctx.clearRect(0, 0, w_canvas.width, w_canvas.height);
            w_ctx.drawImage(w_image, 0, 0, w_canvas.width, w_canvas.height);
    
            //var wQuality = Number($('#cvQuality')[0].value);
            var wQuality = Number(getter('cvQuality'));
            try{
                cnvImage = w_canvas.toDataURL("image/jpeg",wQuality);  // ←画面で指定されたクオリティ
            }catch(e){
                alert(e);
            }            

/*
            // 回転用変数初期化
            arryRad[pIndex] = 0;
            arryWidth[pIndex] = w_canvas.width;
            arryHeight[pIndex] = w_canvas.height;
    */
            // 変換後画像を表示
            $("#face_image").attr("src",cnvImage);
        }
        w_image.src = pReaderResult;
    }
}

function setLocation(){
// GPS callback ----------------------
    //位置情報取得に成功した場合のコールバック
    var onGPSSuccess = function(position){
        //alert("緯度:" + position.coords.latitude + ", 経度:" + position.coords.longitude);
        g_lat = position.coords.latitude;
        g_lon = position.coords.longitude;
        
        console.log('緯度経度取得完了')
        //逆ジオコード
        setGeoCodeAddress(g_lat,g_lon);
    };
    
    //位置情報取得に失敗した場合のコールバック
    var onGPSError = function(error){
        alert("現在位置を取得できませんでした");
    };
    
    //位置情報取得時に設定するオプション
    var GPSoption = {
        timeout: 6000   //タイムアウト値(ミリ秒)
    };
    
    // GPS起動
    navigator.geolocation.getCurrentPosition(onGPSSuccess, onGPSError, GPSoption);
    
}

function setGeoCodeAddress(pLat,pLon){
    geocoder = new google.maps.Geocoder();
    //var latlng = new google.maps.LatLng(gpsLat,gpsLng);
    var latlng = new google.maps.LatLng(pLat,pLon);
 
	geocoder.geocode({'latLng':latlng},function(results,status){
		if (status == google.maps.GeocoderStatus.OK) {
			console.log(results[1].formatted_address);
            g_address=results[1].formatted_address;
            console.log(g_address);
/*            
			result 	= '現在地の取得に成功<br>';
			result += '経度：' + gpsLat + '<br>';
			result += '緯度：' + gpsLng + '<br>';
			result += '住所：' + results[2].formatted_address + '<br>';
 
			document.getElementById('message').innerHTML = result;
*/ 
		} else {
			console.log(status);
		}
	});
    
}

// ------------------------------------
//   読込済み画像で顔認証API呼び出し
// ------------------------------------
function call_face_api(){

    local_process($("#face_image").attr('src'));

}
function local_process(pResult){

    var subscriptionKey = getter("ssKey");
    var uriBase = getter("uriBase");

    // Request parameters.
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
    };

    var dataurl = pResult;

    //DataURLをBLOBに変換
    var mime_base64 = dataurl.split(',', 2);
	var mime = mime_base64[0].split(';');
	mime = mime[0].split(':');
	mime = mime[1]? mime[1]: mime[0];
	var base64 = window.atob(mime_base64[1]);
	var len = base64.length;
	var bin = new Uint8Array(len);
	for (var i=0; i<len; i++)
	{
	  bin[i] = base64.charCodeAt(i);
	}
	var blob = new Blob([bin], {type:mime});

    $.ajax({
        url: uriBase + "?" + $.param(params),
        // Request headers.
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/octet-stream");  // ←ココ重要
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },
      type: 'POST',
      //processDataをfalseにして自動処理せずBLOBをPOSTする
      processData:false,
      data:blob
    })
    .done(function(data) {
        $("#responseTextArea").val(JSON.stringify(data, null, 2));
        // 結果表示
        showResult(data);
    })
    .fail(function() {
        $("#responseTextArea").val("error");
    });
}

