import React, { useState, useEffect } from "react";
import { Camera } from "expo-camera";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import Example from "./Example";

export default App = () => {
  const [permissionState, setPermissionState] = useState(false);
  useEffect(() => {
    const fn = async () => {
      //카메라 권한 체크(check camera permission) : expo
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log(status);
      if (status === "granted") {
        setPermissionState(true);
      }
    };

    fn();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {permissionState && <Example />}
      {!permissionState && (
        <View>
          <Text>
            카메라/갤러리 접근 권한이 없습니다. 권한 허용 후 이용해주세요. no
            access permission for camera and gallery.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
