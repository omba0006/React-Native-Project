import React, { useState, useContext, useEffect, useRef } from 'react';
import { 
  ScrollView, 
  TextInput, 
  Button, 
  Image, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  Text, 
  Platform, 
  View 
} from 'react-native';
import { GiftrContext } from '../context/GiftrContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons'; 
import { Camera } from 'expo-camera'; 

const AddIdeaScreen = () => {
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const cameraRef = useRef(null);

  const { people, updatePerson } = useContext(GiftrContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { personId } = route.params;

  // Find the person by ID
  const person = people.find((p) => p.id === personId);

  // Request camera permissions on component mount
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Camera access is required to take pictures.',
          [{ text: 'OK' }]
        );
      }
    })();

    // Set navigation title
    navigation.setOptions({ title: `Add Idea for ${person.name}` });
  }, [navigation, person.name]);

  // Function to capture image
  const handleCapturePhoto = async () => {
    if (cameraRef.current) {
      const result = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      setImageUri(result.uri);
    }
  };

  // Function to toggle front/back camera
  const toggleCameraType = () => {
    setCameraType((prevType) =>
      prevType === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
    );
  };

  // Save idea
  const saveIdea = async () => {
    if (text.trim() === '') {
      Alert.alert('Error', 'Please enter an idea.');
      return;
    }

    let image = null;
    if (imageUri) {
      // Generate a unique file name using timestamp
      const timestamp = Date.now();
      const fileName = `idea_${timestamp}.jpg`;

      const newPath = `${FileSystem.documentDirectory}${fileName}`;

      try {
        // Copy the image to the app's document directory
        await FileSystem.copyAsync({
          from: imageUri,
          to: newPath,
        });
        image = Platform.OS === 'android' ? `${newPath}` : newPath;
      } catch (error) {
        console.error('Error saving image:', error);
        Alert.alert('Error', 'Failed to save the image. Please try again.');
        return;
      }

      // Verify that the image exists at the new path
      const fileInfo = await FileSystem.getInfoAsync(newPath);
      if (!fileInfo.exists) {
        Alert.alert('Error', 'Image was not saved correctly.');
        return;
      }
    } 

    try {
      // Generate a unique ID for the new idea
      const id = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        new Date().toString() + Math.random().toString()
      );

      const newIdea = {
        id,
        text,
        image,
      };

      const updatedPerson = {
        ...person,
        ideas: [...person.ideas, newIdea],
      };

      updatePerson(updatedPerson);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving idea:', error);
      Alert.alert('Error', 'Failed to save the idea. Please try again.');
    }
  };

  // Cancel adding an idea
  const cancel = () => {
    navigation.goBack();
  };

  if (!hasCameraPermission) {
    return <View><Text>Camera permissions are required to use this feature.</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.innerContainer}>
        {}
        <TextInput
          placeholder="Gift Idea"
          value={text}
          onChangeText={setText}
          style={styles.input}
        />

        {}
        <Camera
          style={styles.camera}
          type={cameraType}
          ref={cameraRef}
        />

        {}
        <TouchableOpacity onPress={handleCapturePhoto} style={styles.cameraButton}>
          <AntDesign name="camera" size={24} color="white" />
          <Text style={styles.cameraButtonText}>Take Picture</Text>
        </TouchableOpacity>

        {}
        <TouchableOpacity onPress={toggleCameraType} style={styles.cameraButton}>
          <Text style={styles.cameraButtonText}>Flip Camera</Text>
        </TouchableOpacity>

        {}
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

        {}
        <View style={styles.buttonContainer}>
          <Button title="Save" onPress={saveIdea} />
          <Button title="Cancel" onPress={cancel} color="red" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  camera: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    marginBottom: 20,
  },
  cameraButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default AddIdeaScreen;
