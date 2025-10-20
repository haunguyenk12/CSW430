import React from 'react';
import { View, Text, Alert, Button } from 'react-native';
import styles from './style';

function Square({ text }) {
    const handlePress = () => Alert.alert(text);

    return (
        <View style={[styles.box, { backgroundColor: '#7ce0f9' }]}>
            <Text>{text}</Text>
            <Button title="Click" onPress={handlePress} />
        </View>
    );
}

export default Square;
