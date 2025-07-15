import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, StyleSheet, Text, View } from 'react-native';

type BusinessUnit = {
  CODE: string;
  DESCRIPTION: string;
};

const App = () => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<BusinessUnit[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getBusinessUnits = async () => {
    try {
      const response = await fetch('http://192.168.99.230:8082/phpwebsite1/database_connection/database.php');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      if (!json.data) {
        throw new Error('Data format error: Missing "data" field');
      }
      setData(json.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Failed to fetch business units:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBusinessUnits();
  }, []);

  const ITEM_HEIGHT = 15;

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.CODE}
          renderItem={({ item }) => (
            <Text style={styles.itemText}>
              {item.CODE} - {item.DESCRIPTION}
            </Text>
          )}
          getItemLayout={(data, index) => (
            { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
          ios: {
            padding: 20,
          },
          android: {
            padding: 35,
          },
          default: {
            padding: 20,
          },
        }),
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 12,
    height: 15, // Ensure the item height matches the ITEM_HEIGHT constant
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default App;
