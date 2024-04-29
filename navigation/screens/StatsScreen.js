import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { ImageBackground } from 'react-native';
export default function StatsScreen({ navigation }) {

    const users = [
        { id: 1, name: 'Rudra', level: 1, image: require('../../assets/a.png'), icon: require('../../assets/1st.jpg') },
        
    ];

    const renderItem = ({ item }) => (
        <View style={styles.userContainer}>
            <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.userImage} />
            </View>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userLevel}>Level: {item.level}</Text>
            </View>
            <Image source={item.icon} style={styles.userIcon} />
        </View>
    );

    return (
        <ImageBackground
      source={require('../../assets/backgrnd.jpg')} // Replace with your image path
      style={styles.container}
      resizeMode="cover" // Adjust resizeMode as needed (e.g., "contain")
    >
            <View style={styles.header}>
                <Text onPress={() => navigation.navigate('Home')} style={styles.headerText}>Leaderboard</Text>
            </View>
            <View style={styles.leaderboard}>
                <FlatList
                    data={users}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                />
            </View>
            </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#26ccfc',
    },
    header: {
        backgroundColor: '#26ccfc',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerText: {
        fontSize: 26,
        fontWeight: 'bold',
        fontFamily: 'Cursive',
        color : '#fff'
        
    },
    leaderboard: {
        flex: 1,
        marginTop: 20,
        paddingHorizontal: 20,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderRadius: 10,
        elevation: 3,
    },
    imageContainer: {
        padding: 10,
        borderRadius: 50,
        backgroundColor: '#ee6c4d',
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    userInfo: {
        flex: 1,
        marginLeft: 10,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    userLevel: {
        fontSize: 16,
        color: '#555',
    },
    userIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
});