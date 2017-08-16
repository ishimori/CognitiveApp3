// This is a JavaScript file

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

        var fa = pData[key]["faceAttributes"];
        /*
        $("#face_result").append("<li>" + "age =" + fa.age + "</li>");
        $("#face_result").append("<li>" + "gender =" + fa.gender + "</li>");
        $("#face_result").append("<li>" + "smile =" + String(fa.smile) + "</li>");
        */
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
    });    
    if (pData.length == 0){
        alert('顔認識が出来ませんでした。');
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
function show_face_image(pSrc){
    $("#face_image").attr("src",pSrc);
    $("#face_image").attr("height",350);
}


// ------------------------------------
//   Web上の画像を読み込む
// ------------------------------------
function reamote_file_read(){

    // 実機じゃないと動かない
    var sourceImageUrl = $("#web_image").val();
    compress_photo(sourceImageUrl);
}
// ------------------------------------
//   スマホカメラ画像から呼び出し
// ------------------------------------
function camera_read () {
    navigator.camera.getPicture (onSuccess, onFail,
        { quality: 50, destinationType: Camera.DestinationType.DATA_URL});
    
    //成功した際に呼ばれるコールバック関数
    function onSuccess (imageData) {
        
        var dataUrl = "data:image/jpeg;base64," + imageData;
        
        // 画像圧縮して表示
        compress_photo(dataUrl);
        
    }

    //失敗した場合に呼ばれるコールバック関数
    function onFail (message) {
        alert ('スマホ画像呼び出し失敗です: ' + message);
    }
}
// ------------------------------------
//   ライブラリから写真指定したら表示
// ------------------------------------
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
            w_canvas.width = $('#cvWidth')[0].value;     // ←画面で指定されたサイズ
            w_canvas.height = w_image.height * (w_canvas.width / w_image.width);;
            var w_ctx   = w_canvas.getContext('2d');
            w_ctx.clearRect(0, 0, w_canvas.width, w_canvas.height);
            w_ctx.drawImage(w_image, 0, 0, w_canvas.width, w_canvas.height);
    
            var wQuality = Number($('#cvQuality')[0].value);
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

// ------------------------------------
//   リモートファイルでAPI呼び出し
// ------------------------------------
/*
function remote_file_api(){
    
    var subscriptionKey = $("#ssKey").val();
    var uriBase = $("#uriBase").val();

    // Request parameters.
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
    };

    // Display the image.
    var sourceImageUrl = $("#web_image").val();
    // 選択画像の表示    
    show_face_image(sourceImageUrl);
    
    // Perform the REST API call.
    $.ajax({
        url: uriBase + "?" + $.param(params),

        // Request headers.
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },
        type: "POST",
        // Request body.
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })

    .done(function(data) {
        // Show formatted JSON on webpage.
        $("#responseTextArea").val(JSON.stringify(data, null, 2));
        // 結果表示
        showResult(data);
    })

    .fail(function(jqXHR, textStatus, errorThrown) {
        // Display error message.
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ? 
            jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
        alert(errorString);
    });
}
*/


// ------------------------------------
//   読込済み画像で顔認証API呼び出し
// ------------------------------------
function call_face_api(){

    local_process($("#face_image").attr('src'));

}
function local_process(pResult){

    var subscriptionKey = $("#ssKey").val();
    var uriBase = $("#uriBase").val();

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

