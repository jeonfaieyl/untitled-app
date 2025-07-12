import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

type BusinessUnit = {
  NAME: string;
};

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<BusinessUnit[]>([]);

  const getBusinessUnits = async () => {
    try {
      const response = await fetch('http://192.168.99.230:8082/phpwebsite1/database_connection/database.php');
      const json = await response.json();
      setData(json.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBusinessUnits();
  }, []);

  return (
    <View style={{flex: 1, padding: 24}}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <Text>
              {item.NAME}
            </Text>
          )}
        />
      )}
    </View>
  );
};

export default App;