
import { StyleSheet, Text, View } from 'react-native';

import { BottomTabBar } from '@react-navigation/bottom-tabs';
import MainContainer from './navigation/MainContainer';

export default function App() {
  return (
    <MainContainer />
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
