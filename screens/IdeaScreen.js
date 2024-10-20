import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { GiftrContext } from '../context/GiftrContext';
import { AntDesign } from '@expo/vector-icons';

const IdeaScreen = ({ route, navigation }) => {
  const { personId } = route.params;
  const { people, updatePerson } = useContext(GiftrContext);

  // Find the person by ID
  const person = people.find((p) => p.id === personId);

  useEffect(() => {
    // Set the header title to "Ideas of [Person's Name]"
    navigation.setOptions({ title: `Ideas of ${person.name}` });
  }, [navigation, person.name]);

  // Function to handle idea deletion
  const deleteIdea = (ideaId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this idea?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedIdeas = person.ideas.filter((idea) => idea.id !== ideaId);
            const updatedPerson = { ...person, ideas: updatedIdeas };
            updatePerson(updatedPerson);
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Function to render each idea item
  const renderItem = ({ item }) => {
    console.log('Rendering idea:', item);

    // Handle image URI based on platform
    const imageUri = item.image
      ? Platform.OS === 'android'
        ? `file://${item.image}` 
        : item.image 
      : null;

    return (
      <View style={styles.ideaItem}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.ideaImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <AntDesign name="picture" size={24} color="#ccc" />
          </View>
        )}

        
        <Text style={styles.ideaText}>{item.text}</Text>

        
        <TouchableOpacity onPress={() => deleteIdea(item.id)}>
          <AntDesign name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {}
      {person.ideas.length === 0 ? (
        <View style={styles.noIdeasContainer}>
          <AntDesign name="frowno" size={48} color="#ccc" />
          <Text style={styles.noIdeasText}>No ideas added yet.</Text>
        </View>
      ) : (
        /* List of ideas */
        <FlatList
          data={person.ideas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      {}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddIdea', { personId: person.id })}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

// Styles for the IdeaScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  noIdeasContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noIdeasText: {
    marginTop: 10,
    fontSize: 18,
    color: '#888',
  },
  listContent: {
    paddingVertical: 10,
  },
  ideaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 2, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Adds shadow for iOS
    shadowOpacity: 0.1, // Adds shadow for iOS
    shadowRadius: 4, // Adds shadow for iOS
  },
  ideaImage: {
    width: 50,
    height: 75, // Maintains 2:3 aspect ratio
    marginRight: 15,
    borderRadius: 5,
  },
  placeholderImage: {
    width: 50,
    height: 75,
    marginRight: 15,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ideaText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#6200ee',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Adds shadow for iOS
    shadowOpacity: 0.3, // Adds shadow for iOS
    shadowRadius: 4, // Adds shadow for iOS
  },
});

export default IdeaScreen;
