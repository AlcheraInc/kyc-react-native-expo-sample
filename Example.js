import React, { useState, useEffect } from "react";
import { WebView } from "react-native-webview";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  ScrollView,
} from "react-native";

export default Example = () => {
  const uri = "https://kyc.useb.co.kr/auth";

  let webViewRef = null;

  const [isFormFilled, setIsFormFilled] = useState(false);
  // "toDo", "inProgress", "done"
  const [progress, setProgress] = useState("toDo");

  const [formData, setFormData] = useState({
    name: "",
    birthdayDay: "",
    birthdayMonth: "",
    birthdayYear: "",
    phoneNumber: "",
    email: "",
  });

  const [kycResult, setKycResult] = useState({
    rsp_result: "",
    rsp_review_result: "",
    evt_result: "",
  });

  const [userInfo, setUserInfo] = useState({
    name: "홍길동",
    birthday: "2000-12-25",
    phone_number: "01000000000",
    email: "debug@debug.com",
  });

  useEffect(() => {}, [formData]);

  const handleSetRef = (_ref) => {
    webViewRef = _ref;
  };

  const startButtonClick = () => {
    setUserInfo({
      name: formData.name,
      birthday: `${formData.birthdayYear}-${formData.birthdayMonth}-${formData.birthdayDay}`,
      phone_number: formData.phoneNumber,
      email: formData.email,
    });
    setProgress("inProgress");
  };

  const restartButtonHandler = () => {
    setFormData({
      name: "",
      birthdayDay: "",
      birthdayMonth: "",
      birthdayYear: "",
      phoneNumber: "",
      email: "",
    });
    setKycResult({ rsp_result: "", rsp_review_result: "", evt_result: "" });
    setProgress("toDo");
    setIsFormFilled(false);
  };

  const startButtonHandler = () => {
    if (
      formData.name &&
      formData.birthdayDay &&
      formData.birthdayMonth &&
      formData.birthdayYear &&
      formData.phoneNumber &&
      formData.email
    ) {
      setIsFormFilled(true);
    }
  };

  const doneProcessHandler = (msgData) => {
    if (msgData?.review_result) {
      if (msgData?.review_result?.id_card?.id_card_image) {
        msgData.review_result.id_card.id_card_image =
          msgData.review_result.id_card.id_card_image.substring(0, 20) +
          "...생략...";
      }
      if (msgData?.review_result?.id_card?.id_card_origin) {
        msgData.review_result.id_card.id_card_origin =
          msgData.review_result.id_card.id_card_origin.substring(0, 20) +
          "...생략...";
      }
      if (msgData?.review_result?.id_card?.id_crop_image) {
        msgData.review_result.id_card.id_crop_image =
          msgData.review_result.id_card.id_crop_image.substring(0, 20) +
          "...생략...";
      }
      if (msgData?.review_result?.face_check?.selfie_image) {
        msgData.review_result.face_check.selfie_image =
          msgData.review_result.face_check.selfie_image.substring(0, 20) +
          "...생략...";
      }

      setKycResult({
        ...kycResult,
        rsp_result: JSON.stringify(msgData.result),
        rsp_review_result: JSON.stringify(msgData.review_result),
      });
    } else if (msgData?.result) {
      setKycResult({
        ...kycResult,
        evt_result: JSON.stringify(msgData.result),
      });
      setProgress("done");
    }
  };

  //결과를 반환 받습니다. (get result back)
  const onMessage = (e) => {
    const decodedMsg = decodeURIComponent(Base64.atob(e.nativeEvent.data));

    let msgData;
    try {
      msgData = JSON.parse(decodedMsg);
      doneProcessHandler(msgData);
    } catch (error) {
      console.error(error);
      return;
    }
  };

  //PostMessage로 사용자 정보를 보냅니다. (send user info through postMessage)
  const sendMessage = (e) => {
    //기존 고객 정보를 가지고 있을 경우 : 사전 정의된 사용자의 정보를 보냅니다. (pre-given information of end user)
    var userPreDefined = {
      ...userInfo,
    };

    //고객사에 부여된 User 계정 정보 (account information of client such as customer id, id and key)
    var requestData = JSON.stringify({
      customer_id: "12",
      id: "demoUser",
      key: "demoUser0000!",
      ...userPreDefined,
    });

    if (webViewRef) {
      webViewRef.postMessage(Base64.btoa(encodeURIComponent(requestData)));
    }
  };

  return (
    <View style={styles.container}>
      {progress === "inProgress" && (
        <WebView
          style={{ flex: 1 }}
          source={{ uri }}
          originWhitelist={["*"]}
          ref={(webview) => (webViewRef = webview)}
          javaScriptEnabled={true}
          useWebKit={true}
          mediaPlaybackRequiresUserAction={false}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          startInLoadingState={true}
          allowUniversalAccessFromFileURLs={true}
          onMessage={onMessage}
          onLoadEnd={sendMessage}
        />
      )}
      {progress === "toDo" && (
        <View style={styles.userInfoInput}>
          <Text style={styles.label}>이름(name)</Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="홍길동"
            placeholderTextColor="gray"
            autoCapitalize="none"
            onChangeText={(text) => {
              setFormData({ ...formData, name: text });
              startButtonHandler();
            }}
          />

          <Text style={styles.label}>생년월일(YYYY-MM-DD)</Text>
          <View style={styles.birthdayContainer}>
            <TextInput
              style={styles.birthdayInput}
              underlineColorAndroid="transparent"
              placeholder="YYYY"
              placeholderTextColor="gray"
              autoCapitalize="none"
              onChangeText={(text) => {
                setFormData({ ...formData, birthdayYear: text });
                startButtonHandler();
              }}
              keyboardType="number-pad"
              maxLength={4}
            />
            <Text> - </Text>
            <TextInput
              style={styles.birthdayInput}
              underlineColorAndroid="transparent"
              placeholder="MM"
              placeholderTextColor="gray"
              autoCapitalize="none"
              onChangeText={(text) => {
                setFormData({ ...formData, birthdayMonth: text });
                startButtonHandler();
              }}
              keyboardType="number-pad"
              maxLength={2}
            />
            <Text> - </Text>
            <TextInput
              style={styles.birthdayInput}
              underlineColorAndroid="transparent"
              placeholder="DD"
              placeholderTextColor="gray"
              autoCapitalize="none"
              onChangeText={(text) => {
                setFormData({ ...formData, birthdayDay: text });
                startButtonHandler();
              }}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
          <Text style={styles.label}>전화번호 ("-" 없이 입력)</Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="01012345678"
            placeholderTextColor="gray"
            autoCapitalize="none"
            onChangeText={(text) => {
              setFormData({ ...formData, phoneNumber: text });
              startButtonHandler();
            }}
            keyboardType="numeric"
            maxLength={11}
          />
          <Text style={styles.label}>이메일(email)</Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="email@address.com"
            placeholderTextColor="gray"
            autoCapitalize="none"
            onChangeText={(text) => {
              setFormData({ ...formData, email: text });
              startButtonHandler();
            }}
            keyboardType="email-address"
          />
          <Button
            title="Start"
            color="blue"
            disabled={!isFormFilled}
            onPress={startButtonClick}
            style={styles.submitBtn}
          />
        </View>
      )}
      {progress === "done" && (
        <View>
          <Button onPress={restartButtonHandler} title="Restart" color="blue" />
          <Text>이벤트(event)</Text>
          <ScrollView
            style={{
              minHeight: 100,
              maxHeight: "20%",
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "blue",
            }}
          >
            <Text>result : {kycResult.evt_result}</Text>
          </ScrollView>
          <Text>상세결과(result detail)</Text>
          <ScrollView
            style={{
              minHeight: 300,
              maxHeight: "60%",
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "blue",
            }}
          >
            <Text>result : {kycResult.rsp_result}</Text>
            <Text>review_result : {kycResult.rsp_review_result}</Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    marginTop: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  userInfoInput: {
    padding: "10%",
    paddingTop: "20%",
  },
  submitBtn: {
    backgroundColor: "black",
  },
  submit: {
    padding: "10%",
    backgroundColor: "white",
  },
  birthdayContainer: {
    flexDirection: "row",
    minHeight: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  birthdayInput: {
    width: "30.5%",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
});
//ios -> onLoaddProgress
//android -> onload

const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const Base64 = {
  btoa: (input = "") => {
    let str = input;
    let output = "";

    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = "="), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));

      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
        );
      }

      block = (block << 8) | charCode;
    }

    return output;
  },

  atob: (input = "") => {
    let str = input.replace(/[=]+$/, "");
    let output = "";

    if (str.length % 4 == 1) {
      throw new Error(
        "'atob' failed: The string to be decoded is not correctly encoded."
      );
    }
    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = str.charAt(i++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  },
};
