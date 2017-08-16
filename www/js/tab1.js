

ons.ready(function() {
    // ------------------------------------
    //   Filetransfer upload callback
    // ------------------------------------
    function win(r) {
        console.log('Success Callback -----');
        var tmp = JSON.parse(r.response);
        console.log(tmp);
        console.log(tmp.results[0]);
        console.log(tmp.results[0].alternatives);

        // 信頼度
        console.log(tmp.results[0].alternatives[0].confidence);
        // テキスト
        console.log(tmp.results[0].alternatives[0].transcript);
        
        $("#audio_result").val(tmp.results[0].alternatives[0].transcript + "\n" + "信頼度：" + tmp.results[0].alternatives[0].confidence);
        
        // 花火呼ぶ
        createFirework(25,187,5,1,null,null,null,null,false,true);
        createFirework(11,30,3,4,null,null,null,null,false,true);
        return false;
    }
    
    // ------------------------------------
    //   Filetransfer upload callback
    // ------------------------------------
    function fail(error) {
        console.log(error);
        alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }

    var app = {
        // ファイルを読み込むためのオブジェクトです
        reader: new FileReader(),
        
        // キャプチャ成功時のコールバックです
        success: function(files) {
            $("#audio_result").val("Watsonに問合せ中・・・");
            
            var uri = encodeURI("https://stream.watsonplatform.net/speech-to-text/api/v1/recognize?model=ja-JP_BroadbandModel");
            
            var options = new FileUploadOptions();
            options.mimeType="audio/wav";
            options.chunkedMode=false;
            var credentials = $("#ibm_user_id").val() + ":" + $("#ibm_password").val();
            options.headers = {'Authorization':'Basic ' + btoa(credentials),'Content-Type':'audio/wav'};
            
            var ft = new FileTransfer();
            
            ft.upload(files[0].fullPath, uri, win, fail, options);
  
        }
    };

    // ------------------------------------
    //   音声キャプチャ(iOS)ボタン
    // ------------------------------------
    $("#capture").on("click", function() {
        navigator.device.capture.captureAudio(app.success, app.error, {limit:5});
    });

});


// ------------------------------------
//   音声キャプチャ(Android)ボタン
// ------------------------------------
function call_watson_android(){

    $("#audio_result").val("Watsonに問合せ中・・・");
    
    var uri = encodeURI("https://stream.watsonplatform.net/speech-to-text/api/v1/recognize?model=ja-JP_BroadbandModel");
    var w_audio = $("#file_wav_android")[0].files[0];
    var credentials = $("#ibm_user_id").val() + ":" + $("#ibm_password").val();
    
    $.ajax({
        url: 'https://stream.watsonplatform.net/speech-to-text/api/v1/recognize?model=ja-JP_BroadbandModel',
        type: 'POST',
        headers: {
            'Content-Type'  : 'audio/wav',
			'Authorization' : 'Basic ' + btoa(credentials),
        },
		data : w_audio,
		processData: false,

    }).done(function(data) {
        console.log('success');
        //console.log(data);
        //console.log(data.results[0].alternatives[0].transcript);
        
        $("#audio_result").val(data.results[0].alternatives[0].transcript + "\n" + "信頼度：" + data.results[0].alternatives[0].confidence);
        // 花火呼ぶ
        createFirework(25,187,5,1,null,null,null,null,false,true);
        createFirework(11,30,3,4,null,null,null,null,false,true);
        return false;
    
    }).fail(function(error) {
        $("#audio_result").val("Watson呼び出しに失敗しました。");
    });


}
