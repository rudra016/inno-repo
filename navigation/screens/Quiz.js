import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Speech from 'expo-speech';
import * as GoogleGenerativeAI from '@google/generative-ai';
import { ImageBackground } from 'react-native';

export default function Quiz ({ xp, updateXP }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState('');
  const [geminiSpeaking, setGeminiSpeaking] = useState(false);
  const [nextQuestionAuto, setNextQuestionAuto] = useState(false);
  
  

  const quizData = [
    {
      question: 'What is the meaning of "aberration"?',
      options: ['A deviation from what is normal or expected', 'An extreme dislike of something', 'A fast and intense movement', 'A small creature that feeds on blood'],
      answer: 'A deviation from what is normal or expected',
    },
    {
      question: 'What is the meaning of "cacophony"?',
      options: ['A mixture of various sounds, especially harsh and unpleasant ones', 'A sudden, violent, and illegal seizure of power from a government', 'A state of being unable to remember what happened or of being unable to think clearly', 'A small, decorative box, typically made of metal or wood, in which you keep jewellery or other valuable objects'],
      answer: 'A mixture of various sounds, especially harsh and unpleasant ones',
    },
    {
      question: 'What is the meaning of "ephemeral"?',
      options: ['Lasting for a very short time', 'Having a harmful effect, especially in a gradual or subtle way', 'Lacking energy or enthusiasm', 'Deep, resonant sound'],
      answer: 'Lasting for a very short time',
    },
    {
      question: 'What is the meaning of "gregarious"?',
      options: ['Fond of company; sociable', 'Concerned with or relating to the soul', 'Continuing or occurring again and again', 'Feeling or expressing pain or sorrow for sins or offenses'],
      answer: 'Fond of company; sociable',
    },
  ];

  useEffect(() => {
    const fetchGeminiResponse = async () => {
      try {
        const genAI = new GoogleGenerativeAI.GoogleGenerativeAI('');
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = `Explain in one line ${quizData[currentQuestion]?.answer}.`;
        const result = await model.generateContent(prompt);
        const response = result.response;
        setGeminiResponse(response.text());
        if (geminiSpeaking) {
          Speech.speak(response.text(), {
            onDone: () => setGeminiSpeaking(false),
            onStopped: () => setGeminiSpeaking(false),
            onError: () => setGeminiSpeaking(false),
          });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    if(geminiSpeaking){
      fetchGeminiResponse();    
    }
  }, [geminiSpeaking,currentQuestion]);

  const handleAnswer = async (selectedOption) => {
    const answer = quizData[currentQuestion]?.answer;
    if (answer === selectedOption) {
      setScore((prevScore) => prevScore + 1);
      updateXP((prevXP) => prevXP + 5);
      handleNextQuestion(); // Add this line to move to the next question when the correct option is selected
    } else { 
      try {
        const genAI = new GoogleGenerativeAI.GoogleGenerativeAI('');
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = `Explain in one line ${answer}.`;
        const result = await model.generateContent(prompt);
        const response = result.response;
        setGeminiResponse(response.text());
        setGeminiSpeaking(true);
        Speech.speak(response.text(), {
          onDone: () => setGeminiSpeaking(false),
          onStopped: () => setGeminiSpeaking(false),
          onError: () => setGeminiSpeaking(false),
        });
        updateXP((prevXP) => Math.max(0, prevXP - 2));
      } catch (error) {
        console.error('Error:', error);
      }
    }
  
  };

  const handleNextQuestion = () => {
    setGeminiSpeaking(false);
    if (nextQuestionAuto) {
      setCurrentQuestion(currentQuestion + 1);
      setNextQuestionAuto(false);
    } else {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < quizData.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowScore(true);
      }
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
   
  };

  return (
    <ImageBackground
      source={require('../../assets/backgrnd.jpg')} // Replace with your image path
      style={styles.container}
      resizeMode="cover" // Adjust resizeMode as needed (e.g., "contain")
    >
      {showScore ? (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Your score: {score} / {quizData.length}</Text>
          <Text style={styles.gained}>Xp Gained : {xp}</Text>
          <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
            <Text style={styles.resetBtnText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {quizData[currentQuestion]?.question}
          </Text>
          {quizData[currentQuestion]?.options.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleAnswer(item)}
                style={styles.optionContainer}>
                <Text style={styles.optionStyle}>{item}</Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity onPress={handleNextQuestion} style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>Next</Text>
          </TouchableOpacity>
          {geminiResponse !== '' && (
            <Text style={styles.geminiText}>{geminiResponse}</Text>
          )}
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resetBtn: {
    backgroundColor: '#3D6DCC',
    padding: 10,
    borderRadius: 5,
  },
  resetBtnText: {
    color: '#FFF',
    fontSize: 18,
  },
  gained : {
    color: 'green',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  questionContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  optionStyle: {
    color: '#3D6DCC',
    padding: 10,
    alignSelf: 'center',
    fontSize: 18,
  },
  optionContainer: {
    borderColor: '#3D6DCC',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  nextBtn: {
    backgroundColor: '#3D6DCC',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFF',
    fontSize: 18,
  },
  geminiText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: 'red',
  },
  xpText:{
    fontSize:14,
    marginBottom : 5,
    fontWeight : 'bold',
    color: 'green',

  }
});

