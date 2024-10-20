import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GiftrContext = createContext();

export const GiftrProvider = ({ children }) => {
  const [people, setPeople] = useState([]);

  // Load people from AsyncStorage when the app starts
  useEffect(() => {
    const loadPeople = async () => {
      try {
        const peopleData = await AsyncStorage.getItem('people');
        if (peopleData !== null) {
          setPeople(JSON.parse(peopleData));
        }
      } catch (error) {
        console.error('Error loading people:', error);
      }
    };

    loadPeople();
  }, []);

  // Save people to AsyncStorage whenever it changes
  useEffect(() => {
    const savePeople = async () => {
      try {
        await AsyncStorage.setItem('people', JSON.stringify(people));
      } catch (error) {
        console.error('Error saving people:', error);
      }
    };

    savePeople();
  }, [people]);

  // Function to add a new person
  const addPerson = (person) => {
    setPeople((prevPeople) => [...prevPeople, person]);
  };

  // Function to update a person
  const updatePerson = (updatedPerson) => {
    setPeople((prevPeople) =>
      prevPeople.map((person) =>
        person.id === updatedPerson.id ? updatedPerson : person
      )
    );
  };

  // Function to delete a person
  const deletePerson = (id) => {
    setPeople((prevPeople) => prevPeople.filter((person) => person.id !== id));
  };

  return (
    <GiftrContext.Provider
      value={{ people, addPerson, updatePerson, deletePerson }}
    >
      {children}
    </GiftrContext.Provider>
  );
};
