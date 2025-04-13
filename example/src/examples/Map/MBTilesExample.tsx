import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Button,
  Platform,
} from 'react-native';
import Mapbox, {
  MapView,
  Camera,
  StyleURL,
  VectorSource,
  FillLayer,
} from '@rnmapbox/maps';
import MBTiles from '../../../../src/modules/MBTiles';
import type { ExampleWithMetadata } from '../common/ExampleMetadata';

/**
 * Example demonstrating how to use MBTiles files with the map
 */
const MBTilesExample = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //   const [mapStyle, setMapStyle] = useState<any>(null);
  const [sourceId] = useState('mbtiles-source');

  // This would be the path to your MBTiles file
  // For a real app, you might want to use ReactNative's DocumentPicker
  // to let users select their own MBTiles files
  const mbtilesPath =
    Platform.OS === 'android'
      ? 'file:///data/data/com.rnmapboxglexample/databases/ubombo.mbtiles'
      : '';

  //   useEffect(() => {
  //     const initMBTiles = async () => {
  //       try {
  //         if (Platform.OS !== 'android') {
  //           throw new Error(
  //             'MBTiles support is currently only available on Android',
  //           );
  //         }

  //         setLoading(true);
  //         setError(null);

  //         // Initialize MBTiles source
  //   const source = await MBTiles.initFromFile(mbtilesPath, sourceId);
  //   console.log('MBTiles source:', source);

  //   setLoading(false);
  //       } catch (err: any) {
  //         console.error('Failed to initialize MBTiles:', err);
  //         setError(err.message || 'Failed to initialize MBTiles');
  //         setLoading(false);
  //       }
  //     };

  //     initMBTiles();

  //     // Clean up the MBTiles source when unmounting
  //     return () => {
  //       if (Platform.OS === 'android') {
  //         MBTiles.remove(sourceId).catch(console.error);
  //       }
  //     };
  //   }, [sourceId, mbtilesPath]);

  //   if (loading) {
  //     return (
  //       <View style={styles.container}>
  //         <ActivityIndicator size="large" color="#0000ff" />
  //         <Text style={styles.text}>Loading MBTiles...</Text>
  //       </View>
  //     );
  //   }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.infoText}>
          This example requires:
          {'\n'}1. Android device
          {'\n'}2. A valid MBTiles file at {mbtilesPath}
          {'\n'}3. Storage permission granted to the app
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        styleURL={Mapbox.StyleURL.Dark}
        onDidFinishLoadingStyle={async () => {
          console.log('Called');
          const source = await MBTiles.initFromFile(mbtilesPath, sourceId);
          console.log('MBTiles source:', source);

          //   setLoading(false);
        }}
      >
        <VectorSource
          id="customTiles1"
          // url={"file:///data/data/com.sqrsoftware.mobilize/databases/ubombo.mbtiles"}
          // tileUrlTemplates={[`file:///data/data/com.sqrsoftware.mobilize/databases/ubombo.mbtiles/{z}/{x}/{y}.pbf`]}
          tileUrlTemplates={[
            `http://localhost:8888/${sourceId}/{z}/{x}/{y}.pbf`,
          ]}
        >
          <FillLayer
            id="fields"
            sourceLayerID="ubombo_fields"
            style={{ fillColor: 'blue' }}
          />
        </VectorSource>
      </MapView>

      <View style={styles.infoPanel}>
        <Text style={styles.infoText}>Using MBTiles file: {mbtilesPath}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 5,
  },
  infoPanel: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    width: '90%',
  },
});

export default MBTilesExample;

const metadata: ExampleWithMetadata['metadata'] = {
  title: 'MBTiles Example',
  tags: ['MBTiles', 'Offline'],
  docs: `This example demonstrates how to use local MBTiles files with the map.

It shows loading a vector MBTiles file from the device storage and displaying it on top of a base map.

The MBTiles file is served through a local HTTP server that runs on the device.

Note: This example requires an Android device and a valid MBTiles file at the specified path.`,
};

MBTilesExample.metadata = metadata;
