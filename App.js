
import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import MainContainer from './navigation/MainContainer';



export default function App() {
  const [xp, setXP] = useState(0);

  const updateXP = (newXP) => {
    setXP(newXP);
  };

  return (
    <MainContainer xp={xp} updateXP={updateXP} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
