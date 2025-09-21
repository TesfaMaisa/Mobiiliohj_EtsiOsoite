import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export default function App() {

  const [location, setLocation] = useState(null)
  const [lat, setLat] = useState(0)
  const [lon, setLon] = useState(0)
  const [name, setName] = useState("")
  const [repo, setRepo] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('No permission to get location')
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLat(location.coords.latitude);
      setLon(location.coords.longitude);
      setName("Olet täällä")
      console.log(location.coords.latitude)
    })();
  }, []);

  function searchAddress() {
    fetch(`https://geocode.maps.co/search?q=${location}&api_key=68cef4b8448c8051789049buib1c5f0`)
      .then(response => {
        if (!response.ok)
          throw new Error("Fetching error" + response.statusText)
        return response.json()
      })
      .then(data => {
        setRepo(data)
        setLat(data[1].lat)
        setLon(data[1].lon)
        setName(data[1].display_name)
        console.log(data[1].display_name.split(" "))
        console.log(name[3])
      })
      .catch(err => console.error(err))
  }


  return (
    <View style={styles.container}>
      <View style={{ marginTop: 60 }}>
        <TextInput style={{borderWidth:2, borderColor:"blue"}} placeholder='Kirjoita osoite' value={location} onChangeText={Text => setLocation(Text)}></TextInput>
        <Button title="Etsi osoite" onPress={() => searchAddress()} />
      </View>
      <View>
        <MapView style={{ width: 500, height: 700 }}><Marker
          coordinate={{
            latitude: lat,
            longitude: lon
          }}
          title={name}
        /></MapView>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
