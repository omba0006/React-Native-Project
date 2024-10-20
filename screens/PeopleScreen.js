import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { GiftrContext } from '../context/GiftrContext';
import { Swipeable } from 'react-native-gesture-handler';
import { AntDesign, Entypo } from '@expo/vector-icons';

const PeopleScreen = ({ navigation }) => {
  const { people, deletePerson } = useContext(GiftrContext);

  const renderItem = ({ item }) => {
    // Function to confirm deletion
    const confirmDelete = () => {
      Alert.alert(
        'Delete Person',
        `Are you sure you want to delete ${item.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => deletePerson(item.id),
          },
        ]
      );
    };

    // Right action (Delete button)
    const renderRightActions = () => (
      <TouchableOpacity
        style={styles.deleteButton}
        onLongPress={confirmDelete}
      >
        <AntDesign name="delete" size={24} color="white" />
      </TouchableOpacity>
    );

    return (
      <Swipeable renderRightActions={renderRightActions}>
        <View style={styles.item}>
          <TouchableOpacity
            style={styles.personInfo}
            onPress={() =>
              navigation.navigate('AddPerson', { personId: item.id })
            }
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.birthday}>Birthday: {item.birthday}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.lightbulbIcon}
            onPress={() =>
              navigation.navigate('Ideas', { personId: item.id })
            }
          >
            <Entypo name="light-bulb" size={24} color="#6200ee" />
          </TouchableOpacity>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      {people.length === 0 ? (
        <Text style={styles.message}>No people added yet.</Text>
      ) : (
        <FlatList
          data={people.sort((a, b) => a.name.localeCompare(b.name))}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddPerson')}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  message: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  personInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
  },
  birthday: {
    color: 'gray',
  },
  lightbulbIcon: {
    paddingHorizontal: 10,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6200ee',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
});

export default PeopleScreen;
