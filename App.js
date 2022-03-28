import React, { useRef } from "react";
import { decode as atob, encode as btoa } from "base-64";
import { RefinedWebView } from "./webview";

export default App = () => {
  let webViewRef = useRef();
  const handleSetRef = (_ref) => {
    webViewRef = _ref;
  };

  //결과를 반환 받습니다.
  const onMessage = (e) => {
    var kyc_result = JSON.parse(decodeURIComponent(atob(e.nativeEvent.data)));
    console.log(kyc_result);
  };

  //PostMessage로 사용자 정보를 보냅니다.
  const sendMessage = (e) => {
    //기존 고객 정보를 가지고 있을 경우 : 사전 정의된 사용자의 정보를 보냅니다.
    var userPreDefined = {
      name: "홍길동",
      birthday: "2000-12-25",
      phone_number: "01000000000",
      email: "debug@debug.com",
    };

    //고객사에 부여된 User 계정 정보
    var requestData = JSON.stringify({
      customer_id: "12",
      id: "demoUser",
      key: "demoUser0000!",
      ...userPreDefined,
    });
    if (webViewRef) {
      webViewRef.postMessage(btoa(encodeURIComponent(requestData)));
    }
  };

  return (
    <RefinedWebView
      webViewRef={webViewRef}
      handleSetRef={handleSetRef}
      sendMessage={sendMessage}
      onMessage={onMessage}
    />
  );
};
//ios -> onLoaddProgress
//android -> onload
