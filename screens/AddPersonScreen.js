import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { GiftrContext } from '../context/GiftrContext';
import DatePicker from 'react-native-modern-datepicker';
import * as Crypto from 'expo-crypto';

const AddPersonScreen = ({ navigation, route }) => {
  const { personId } = route.params || {};
  const isEditing = !!personId;

  const { people, addPerson, updatePerson, deletePerson } =
    useContext(GiftrContext);

  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');

  useEffect(() => {
    if (isEditing) {
      const person = people.find((p) => p.id === personId);
      if (person) {
        setName(person.name);
        setBirthday(person.birthday);
      }
    }
  }, [isEditing, personId, people]);

  const generateUUID = async () => {
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      new Date().toString() + Math.random().toString()
    );
    return digest;
  };

  const savePerson = async () => {
    if (name.trim() === '' || birthday.trim() === '') {
      Alert.alert('Error', 'Please enter a name and select a birthday.');
      return;
    }

    if (isEditing) {
      const updatedPerson = { id: personId, name, birthday, ideas: [] };
      updatePerson(updatedPerson);
    } else {
      const id = await generateUUID();
      const newPerson = { id, name, birthday, ideas: [] };
      addPerson(newPerson);
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <DatePicker
        onDateChange={setBirthday}
        mode="calendar"
        selected={birthday}
      />
      <Button title="Save" onPress={savePerson} />

      {isEditing && (
        <>
          <Button
            title="Delete"
            color="red"
            onPress={() => {
              Alert.alert(
                'Delete Person',
                'Are you sure you want to delete this person?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                      deletePerson(personId);
                      navigation.goBack();
                    },
                  },
                ]
              );
            }}
          />
          <Button title="Cancel" onPress={() => navigation.goBack()} />
        </>
      )}

      {!isEditing && (
        <Button title="Cancel" onPress={() => navigation.goBack()} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default AddPersonScreen;
