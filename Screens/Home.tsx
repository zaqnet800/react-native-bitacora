import { View, FlatList, StyleSheet, Pressable, Keyboard } from 'react-native'
import { Button, Layout, Text } from '@ui-kitten/components';
import React, { useState, useEffect, useMemo } from 'react'
import { firebase } from '../config';
import { FontAwesome } from "@expo/vector-icons";
import { Item, ItemToShow, ItemWithId } from '../types/item';
import ImageItem from '../Components/ImageItem';
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const [data, setData] = useState([]);
  const dataRef = firebase.firestore().collection('bitacora');

  const navigation = useNavigation();

  const pressHandler = async () => {
    try {
      LocalAuthentication.authenticateAsync({
        promptMessage: 'Face ID'
      }).then(({ success }) => {
        console.log('then');
        console.log('success: ', success);
      }).catch(() => {
        console.log('catch');
      });
    } catch(e) {
      console.log('e: ', e);
    }
  }

  let date: Date = new Date();

  // fetch or read the data from firestore
  useEffect(() => {
    dataRef
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        querySnapshot => {
          const initialData = [];
          querySnapshot.forEach((doc) => {
            const item = doc.data()
            initialData.push({ id: doc.id, ...item})
          });
          setData(initialData);
        })
  }, []);

  // delete an item from firestore db
  const deleteItem = (item) => {
    dataRef
      .doc(item.id)
      .delete()
      .then(() => {
        // alert("Deleted successfully");
      })
      .catch(error => {
        alert(error);
      })
  }

  // add a todo
  const addItem = (dataPressed?: Item) => {
    dataRef
      .add(data)
      .then(() => {
        // release keyboard
        Keyboard.dismiss();
      })
      .catch((error) => {
        // show an alert in case of error
        alert(error);
      });
  }

  const updateItem = (id, newProps) => {
    dataRef
      .doc(id)
      .update(newProps).then(() => {
        alert('Updated successfully')
    }).catch((error) => {
      alert(error.message)
    })

  }

  const dataToShow = useMemo(() => {
    const result: ItemToShow[] = [];
    data.forEach((item: ItemWithId) => {
      const indexItemResult = result.findIndex((itemResult: ItemToShow) => itemResult.tag === item.tag);
      if (indexItemResult >= 0) result[indexItemResult].count += 1;
      else {
        result.push({ ...item, count: 1 });
      }
    });
    return result;
  }, [data]);

  return (
    <Layout style={{ flex: 1, paddingHorizontal: 10 }}>
      <FontAwesome name="user-o" onPress={pressHandler} style={{ margin: 15 }} />
      <Button
        onPress={() => {
          navigation.navigate('NewItem');
        }}
        style={{ marginLeft: 15 }}
      >
        Add Item
      </Button>
      <Layout>
        <Layout style={styles.titleSection}>
          <Text category='h5'>LIST</Text>
        </Layout>
        <FlatList
          style={{}}
          data={dataToShow}
          numColumns={1}
          renderItem={({ item }: { item: ItemToShow }) => {
            return (
              <View>
                <Pressable
                  style={styles.container}
                  // @ts-ignore
                  onPress={() => {
                    // addItem({ createdAt: new Date(), tag: item.tag, ...CONSTANT_ITEM });
                    navigation.navigate('NewItem', {data: item});
                  }}
                >
                  <FontAwesome name="trash-o"
                               color="red"
                               onPress={() => deleteItem(item)}
                               style={styles.trashIcon} />
                  <View style={styles.innerContainer}>
                    <Text style={styles.itemHeading}>
                      ({item.count})
                    </Text>
                    {(item.images && item.images.length) ? (
                      <ImageItem
                        image={item.images[0]}
                        onRemoveImage={() => {
                          const nextImages = item.images.filter((imageItem) => imageItem !== item.images[0]);
                          updateItem(item.id, { ...item, images: nextImages });
                        }}
                      />
                    ) : <Text></Text>}
                    <Text style={styles.itemHeading}>
                      {item.title && ` - ${item.title}`}
                    </Text>
                  </View>
                </Pressable>
              </View>
            )
          }}
        />
      </Layout>
    </Layout>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: '#e5e5e5',
    padding: 15,
    borderRadius: 15,
    margin:5,
    marginHorizontal: 10,
    flexDirection:'row',
    alignItems:'center'
  },
  inputClue: {
    marginBottom: 10,
    height: 30,
  },
  formLayout: {
    height: '100%',
  },
  innerContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginLeft:45,
  },
  itemHeading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginHorizontal: 5,
  },
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft:10,
    marginRight: 10,
    marginTop:100
  },
  modal: {
    minHeight: '100%',
    width: '90%',
  },
  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: '#788eec',
    marginVertical: 15,
    width: '80%',
    alignSelf: 'center',
    alignItems: "center",
    justifyContent: 'center'
  },
  buttonDisabled: {
    backgroundColor: 'grey',
    opacity: 0.4,
  },
  buttonText: {
    color: 'white',
    fontSize: 20
  },
  cluesText: {
    color: '#8f9cb4',
    fontWeight: '800',
    fontSize: 12,
    margin: 2,
  },
  cluesWrapper: {
    marginLeft: 15,
  },
  titleSection: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trashIcon:{
    marginTop:5,
    fontSize:20,
    marginLeft:14,
  }
});

export default Home

