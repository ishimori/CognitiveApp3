// This is a JavaScript file

function call_visual_api(){
    
    visual_local_process($("#visual_image").attr('src'));

}

// ------------------------------------
//      AzureFaceAPI結果を表示
// ------------------------------------
function showResultVis(pData){
    // li 要素クリア    
    $("#visual_result").empty();
    
    console.log('test1');
    var captions = pData["description"]["captions"];
    console.log('test2');
    console.log(captions[0].text);    
    console.log('test3');
    
    $("#visual_result").append("<li>" + captions[0].text + "</li>");
    // 翻訳テキストをセット
    setTranslatedText(captions[0].text);
    $("#visual_result").append("<li>" + "信頼度 =" + captions[0].confidence + "</li>");


}

function visual_local_process(pResult){

    var subscriptionKey = $("#ssKeyVis").val();
    var uriBase = $("#uriBaseVis").val();

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
        $("#responseTextAreaVis").val(JSON.stringify(data, null, 2));
        // 結果表示
        showResultVis(data);
    })
    .fail(function() {
        $("#responseTextAreaVis").val("error");
    });
}

function visual_camera_read(){
    
    navigator.camera.getPicture (onSuccessVis, onFailVis,
        { quality: 50, destinationType: Camera.DestinationType.DATA_URL});
    
    //成功した際に呼ばれるコールバック関数
    function onSuccessVis (imageData) {
        
        var dataUrl = "data:image/jpeg;base64," + imageData;
        
        // 画像圧縮して表示
        compress_photoVis(dataUrl);
        
    }

    //失敗した場合に呼ばれるコールバック関数
    function onFailVis (message) {
        alert ('スマホ画像呼び出し失敗です: ' + message);
    }    
}

function setVisTarget(pThis){
    // li 要素クリア    
    $("#visual_result").empty();
    
    // 実機じゃないと動かない
    compress_photoVis(pThis.src);
    
    // 顔認証にも画像渡しておく
    compress_photo(pThis.src);

}

// ------------------------------------
//   指定された画像を圧縮
// ------------------------------------
function compress_photoVis(pReaderResult){

    if (pReaderResult == null){
        alert('ファイルサイズ大きすぎるのか、正しく読み込めませんでした。');
    }else{
        var w_image = new Image();
        w_image.onload = function(e){
            var cnvImage = document.createElement('img');
            var w_canvas = $('#visual_canvas')[0];
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

            // 変換後画像を表示
            $("#visual_image").attr("src",cnvImage);
        }
        w_image.src = pReaderResult;
    }
}



function setTranslatedText(pText){
// 認証トークンを取得するための関数 [getToken] を定義
// http://docs.microsofttranslator.com/oauth-token.html
      const getToken = function() {
        const defer = $.Deferred();
        $.ajax({
          url: 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken',
          type: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/jwt',
            'Ocp-Apim-Subscription-Key': '5cc9742e779147b89c0a3abf418d7e80',
          },
        }).done(function(data) {

            const token = data;
            defer.resolve(token);

        });
            return defer.promise();
      };

// 関数 [getToken] 実行後、取得したトークンを 引き渡す
// フォームから入力したデータとともに、 Microsoft Translator テキストAPIへ送信

      $.when(getToken()).done(function(token) {
        const key = 'Bearer ' + token;
        const text = pText;   // $("#word").val();
        const response = $.ajax({
          url: 'https://api.microsofttranslator.com/v2/http.svc/Translate',
          type: 'GET',
          data: {
            'appid': key,
            'Accept': 'application/xml',
            'text': text,
            'to': 'ja',
          },
        async: false,
        })

// Translator テキスト APIを通じて取得したデータから、翻訳語が含まれるプロパティを取得
// replace関数でタグを除去し、翻訳データのみを抽出して表示する

        const data = response.responseText;

        const translation = data.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');

        $("#visual_result").append("<li>" + translation + "</li>");

      })
      
}