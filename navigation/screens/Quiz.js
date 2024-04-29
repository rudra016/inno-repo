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
      options: [ 'An extreme dislike of something', 'A deviation from what is normal or expected', 'A fast and intense movement', 'A small creature that feeds on blood'],
      answer: 'A deviation from what is normal or expected',
    },
    {
      question: 'What is the meaning of "cacophony"?',
      options: [ 'A sudden, violent, and illegal seizure of power from a government', 'A state of being unable to remember what happened or of being unable to think clearly', 'A mixture of various sounds, especially harsh and unpleasant ones', 'A small, decorative box, typically made of metal or wood, in which you keep jewellery or other valuable objects'],
      answer: 'A mixture of various sounds, especially harsh and unpleasant ones',
    },
    {
      question: 'What is the meaning of "ephemeral"?',
      options: [ 'Having a harmful effect, especially in a gradual or subtle way', 'Lasting for a very short time','Lacking energy or enthusiasm', 'Deep, resonant sound'],
      answer: 'Lasting for a very short time',
    },
    {
      question: 'What is the meaning of "gregarious"?',
      options: [ 'Concerned with or relating to the soul', 'Continuing or occurring again and again', 'Fond of company; sociable', 'Feeling or expressing pain or sorrow for sins or offenses'],
      answer: 'Fond of company; sociable',
    },
    {
      question: 'What is the meaning of "eloquent"?',
      options: ['Fluent or persuasive in speaking or writing', 'Showing a lack of respect or seriousness', 'Very obvious and intentional; not hidden', 'Pleasing and satisfactory'],
      answer: 'Fluent or persuasive in speaking or writing',
    },
    {
      question: 'What is the meaning of "serendipity"?',
      options: ['The occurrence and development of events by chance in a happy or beneficial way', 'A state of being calm, peaceful, and untroubled', 'The ability to find something nice in every situation', 'A feeling of uncertainty or lack of confidence'],
      answer: 'The occurrence and development of events by chance in a happy or beneficial way',
    },
    {
      question: 'What is the meaning of "ubiquitous"?',
      options: [ 'Highly concerned with material values and comfortable living', 'Present, appearing, or found everywhere', 'Easily frightened or alarmed', 'Producing a lot of something in a small space'],
      answer: 'Present, appearing, or found everywhere',
    },
    {
      question: 'What is the meaning of "quixotic"?',
      options: ['Exceedingly idealistic; unrealistic and impractical', 'Feeling or showing sorrow and regret for having done wrong; repentant', 'Relating to or involving an activity done for enjoyment when not working', 'Having or showing a great desire to possess something, typically something belonging to someone else'],
      answer: 'Exceedingly idealistic; unrealistic and impractical',
    },
    {
      question: 'What is the meaning of "zenith"?',
      options: ['The time at which something is most powerful or successful', 'The point in the sky or celestial sphere directly above an observer', 'The highest point reached by a celestial or other object', 'The action or fact of setting someone free from imprisonment, slavery, or oppression; release'],
      answer: 'The highest point reached by a celestial or other object',
    },
    {
      question: 'What is the meaning of "quagmire"?',
      options: [ 'A large, hairy spider with a venomous bite', 'A soft boggy area of land that gives way underfoot', 'A small, fast mammal that feeds on insects', 'A feeling of worry or nervousness, especially about something that may happen'],
      answer: 'A soft boggy area of land that gives way underfoot',
    },
    {
      question: 'What is the meaning of "zenith"?',
      options: ['The highest point reached by a celestial or other object', 'The point in the sky or celestial sphere directly above an observer', 'The time at which something is most powerful or successful', 'The action or fact of setting someone free from imprisonment, slavery, or oppression; release'],
      answer: 'The highest point reached by a celestial or other object',
    },
    {
      question: 'What is the meaning of "quagmire"?',
      options: ['A soft boggy area of land that gives way underfoot', 'A large, hairy spider with a venomous bite', 'A small, fast mammal that feeds on insects', 'A feeling of worry or nervousness, especially about something that may happen'],
      answer: 'A soft boggy area of land that gives way underfoot',
    },
    {
      question: 'What is the meaning of "ubiquitous"?',
      options: ['Present, appearing, or found everywhere', 'Highly concerned with material values and comfortable living', 'Easily frightened or alarmed', 'Producing a lot of something in a small space'],
      answer: 'Present, appearing, or found everywhere',
    },
    {
      question: 'What is the meaning of "eloquent"?',
      options: ['Fluent or persuasive in speaking or writing', 'Showing a lack of respect or seriousness', 'Very obvious and intentional; not hidden', 'Pleasing and satisfactory'],
      answer: 'Fluent or persuasive in speaking or writing',
    },
    {
      question: 'What is the meaning of "serendipity"?',
      options: ['The occurrence and development of events by chance in a happy or beneficial way', 'A state of being calm, peaceful, and untroubled', 'The ability to find something nice in every situation', 'A feeling of uncertainty or lack of confidence'],
      answer: 'The occurrence and development of events by chance in a happy or beneficial way',
    },
    {
      question: 'What is the meaning of "quixotic"?',
      options: ['Exceedingly idealistic; unrealistic and impractical', 'Feeling or showing sorrow and regret for having done wrong; repentant', 'Relating to or involving an activity done for enjoyment when not working', 'Having or showing a great desire to possess something, typically something belonging to someone else'],
      answer: 'Exceedingly idealistic; unrealistic and impractical',
    },
  ];

  useEffect(() => {
    const fetchGeminiResponse = async () => {
      try {
        const genAI = new GoogleGenerativeAI.GoogleGenerativeAI();
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
        const genAI = new GoogleGenerativeAI.GoogleGenerativeAI();
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

