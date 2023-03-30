import { Image, StyleSheet } from 'react-native'
import React from 'react';
import { Layout } from '@ui-kitten/components';
import { FontAwesome } from '@expo/vector-icons';
import { ITEM_MAX_HEIGHT, ITEM_MAX_WIDTH } from '../constants';

interface Props {
  image?: string;
  onRemoveImage?: (image: string) => void;
}

const ImageItem = ({ image, onRemoveImage }: Props) => (
  <Layout>
    <Image
      source={{ uri: image }}
      style={{ height: ITEM_MAX_HEIGHT, width: ITEM_MAX_WIDTH }}
    />
    <Layout style={styles.trashWrapper}>
      <FontAwesome
        name="trash"
        color="red"
        onPress={() => {
          if (onRemoveImage) onRemoveImage(image);
        }}
        style={styles.trashIcon}
      />
    </Layout>
  </Layout>
);

const styles = StyleSheet.create({
  trashIcon: {
    fontSize: 18,
  },
  trashWrapper: {
    alignItems: 'center',
    backgroundColor: '#e8e4e4',
    justifyContent: 'center',
    borderRadius: 25,
    width: 24,
    height: 24,
    left: -7,
    position: 'absolute',
    bottom: -7,
  }
});

export default ImageItem
