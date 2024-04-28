import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
  const [name, setName] = useState('Your Name');
  const [email, setEmail] = useState('Your Email');
  const [phone, setPhone] = useState('Your Phone Number');
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

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image source={profilePic ? { uri: profilePic } : require('../../user8.png')} style={styles.profilePic} />
        <Button title="Change Picture" onPress={pickImage} />
      </View>
      <View style={styles.details}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Text style={styles.label}>Phone:</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <Button title="Save" onPress={() => console.log('Saving profile...')} />
      </View>
    </View>
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
      profilePic: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
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
});

export default ProfileScreen;
