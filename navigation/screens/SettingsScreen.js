import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ImageBackground } from 'react-native';


const ProfileScreen = ({ xp, updateXP }) => {
  const [name, setName] = useState('Your Name');
  const [email, setEmail] = useState('Your Email');
  const [phone, setPhone] = useState('');
  const [profilePic, setProfilePic] = useState(null);
 

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };
 
  // Dummy level progress
  const level = 0.1; // Example level progress

  return (
    <ImageBackground
      source={require('../../assets/backgrnd.jpg')} // Replace with your image path
      style={styles.container}
      resizeMode="cover" // Adjust resizeMode as needed (e.g., "contain")
    >
      <View style={styles.profile}>
        <View style={styles.imageContainer}>
        
          <Image source={profilePic ? { uri: profilePic } : require('../../user8.png')} style={styles.profilePic} />
          
        </View>
        <Button title="Change Picture" onPress={pickImage} />
      </View>
      <View style={styles.details}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your Name"
        />
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Your Email"
        />
        <Text style={styles.label}>Phone:</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="Your Phone Number"
        />
        <Button title="Save" onPress={() => console.log('Saving profile...')} />
        <View style={styles.levelContainer}>
          <View style={styles.levelBar}>
            <View style={[styles.levelProgress, { width: `${(xp / 100) * 100}%` }]} />
          </View>
          <View style={styles.levelLabels}>
            <Text style={styles.levelLabel}>Lvl 0</Text>
            <Text style={styles.levelLabel}>Lvl 1</Text>
          </View>
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>XP: {xp}</Text>
            
          </View>
        </View>
      </View>
     
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 80,
    overflow: 'hidden',
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  xpBadge: {
    position: 'absolute',
    top: 30,
    right: 110,
    backgroundColor: 'tomato',
    borderRadius: 20,
    width: 80,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  xpText: {
    color: 'white',
    fontWeight: 'bold',
  },
  details: {
    width: '80%',
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  levelContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  levelBar: {
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  levelProgress: {
    height: '100%',
    backgroundColor: 'tomato',
  },
  levelLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  levelLabel: {
    fontSize: 12,
    color: 'gray',
  },
});

export default ProfileScreen;