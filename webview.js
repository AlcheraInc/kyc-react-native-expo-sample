import { WebView } from "react-native-webview";
import React, { useState, useEffect } from "react";
import { Camera } from "expo-camera";
import { Text, View } from "react-native";
export const RefinedWebView = ({ handleSetRef, sendMessage, onMessage }) => {
  const uri = "https://kyc.useb.co.kr/auth";
  const [webViewState, setwebViewState] = useState(false);
  useEffect(() => {
    const fn = async () => {
      //카메라 권한 체크(check camera permission) : expo
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log(status);
      if (status === "granted") {
        setwebViewState(true);
      }
    };

    fn();
  }, []);

  if (!webViewState) {
    return (
      <View>
        <Text>
          카메라/갤러리 접근 권한이 없습니다. 권한 허용 후 이용해주세요. no
          access permission for camera and gallery.
        </Text>
      </View>
    );
  }

  return (
    <WebView
      ref={handleSetRef}
      style={{ flex: 1 }}
      onLoadEnd={sendMessage}
      onMessage={onMessage}
      mediaPlaybackRequiresUserAction={false}
      originWhitelist={["*"]}
      domStorageEnabled={true}
      allowsInlineMediaPlayback={true}
      javaScriptEnabled={true}
      source={{ uri }}
      startInLoadingState={true}
      allowUniversalAccessFromFileURLs={true}
    />
  );
};
