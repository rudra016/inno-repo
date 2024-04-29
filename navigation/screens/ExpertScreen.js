import React, { useState, useEffect } from "react";
import * as GoogleGenerativeAI from "@google/generative-ai";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as Speech from "expo-speech";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import FlashMessage, { showMessage } from "react-native-flash-message";

const GeminiChat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showStopIcon, setShowStopIcon] = useState(false);

  useEffect(() => {
    const startChat = async () => {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI('AIzaSyDxTSw2W6OMQAQZxIhkk4WvCMpcToEejTw');
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = "Give 5 Vocabulary words. Only words no definition. If asked any other question, only answer in 2 lines.You never answer in bullet points.";
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      console.log(text);
      showMessage({
        message: "Welcome to Gemini Chat 🤖",
        description: text,
        type: "info",
        icon: "info",
        duration: 2000,
      });
      setMessages([
        {
          text,
          user: false,
        },
      ]);
    };
    //function call
    startChat();
  }, []);

  const sendMessage = async () => {
    setLoading(true);
    const userMessage = { text: userInput, user: true };
    setMessages([...messages, userMessage]);

    const genAI = new GoogleGenerativeAI.GoogleGenerativeAI('AIzaSyDxTSw2W6OMQAQZxIhkk4WvCMpcToEejTw');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = userMessage.text;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    setMessages([...messages, { text, user: false }]);
    setLoading(false);
    setUserInput("");

    if (text && !isSpeaking) {
      Speech.speak(text);
      setIsSpeaking(true);
      setShowStopIcon(true);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      setShowStopIcon(false); // Hiding the stop icon when speech is stopped
    } else {
      Speech.speak(messages[messages.length - 1].text);
      setIsSpeaking(true);
      setShowStopIcon(true); // Showing the stop icon when speech starts
    }
  };

  const ClearMessage = () => {
    setMessages([]);
    setIsSpeaking(false);
    setShowStopIcon(false); // Hiding the stop icon when messages are cleared
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.user ? styles.userMessage : styles.botMessage]}>
      <Text style={[styles.messageText, item.user && styles.userMessageText]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        inverted
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.micIcon} onPress={toggleSpeech}>
          {isSpeaking ? (
            <FontAwesome
              name="microphone-slash"
              size={24}
              color="black"
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          ) : (
            <FontAwesome
              name="microphone"
              size={24}
              color="black"
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          )}
        </TouchableOpacity>
        <TextInput
          placeholder="I can help you with English :)"
          onChangeText={setUserInput}
          value={userInput}
          onSubmitEditing={sendMessage}
          style={styles.input}
          placeholderTextColor="black"
        />
        {
          //show stop icon only when speaking
          showStopIcon && (
            <TouchableOpacity style={styles.stopIcon} onPress={ClearMessage}>
              <Entypo name="controller-stop" size={24} color="black" />
            </TouchableOpacity>
          )
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F0F0" },
  messageContainer: { padding: 15, marginVertical: 5, maxWidth: "80%" },
  messageText: { fontSize: 16, color: "black" },
  userMessage: { alignSelf: "flex-end", backgroundColor: "#DCF8C6" },
  botMessage: { alignSelf: "flex-start", backgroundColor: "#E5E5EA" },
  userMessageText: { color: "black" },
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 10 },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#EEEAEF",
    borderRadius: 10,
    height: 50,
    color: "black",
  },
  micIcon: {
    padding: 10,
    backgroundColor: "#EEEAEF",
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  stopIcon: {
    padding: 10,
    backgroundColor: "#EEEAEF",
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 3,
  },
});

export default GeminiChat;