import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, StyleSheet, Text, Image, TouchableHighlight, ToastAndroid, Linking } from 'react-native';

import banks from '../database/banks';
import Header from '../components/Header';

export default class Setting extends React.Component {
    constructor() {
        super();

        this.state = {
            selected: -1
        }
    }

    async componentDidMount() {
        AsyncStorage.getItem('bank').then(index => {
            this.setState({ selected: parseInt(index) });
        })
    }

    select(index = -1) {
        this.setState({ selected: index });
        AsyncStorage.setItem('bank', index.toString());
    }

    renderItems() {
        return banks.map((item, index) => {
            return (
                <TouchableHighlight underlayColor="transparent" onPress={() => this.select(index)}>
                    <View style={[styles.row, styles.item, { borderColor: (this.state.selected == index) ? '#2B50ED' : 'rgba(0, 0, 0, 0.4)', }]}>
                        <Image style={styles.image} source={{ uri: item.image }} />
                        <View style={styles.column}>
                            <Text>{item.name}</Text>
                            <Text style={{ fontSize: 12 }}>{item.phone}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            )
        })
    }

    deleteAll() {
        AsyncStorage.removeItem("purposes");
        ToastAndroid.show("All your purposes deleted successfully !", ToastAndroid.SHORT);
    }

    render() {
        return (
            <View>
                <Header title="Settings" back={true} />
                <Text style={{ fontSize: 16, margin: 10, marginLeft: 25 }}>Select your bank</Text>
                <TouchableHighlight underlayColor="transparent" onPress={() => this.select(-1)}>
                    <View style={[styles.row, styles.item, { borderColor: (this.state.selected == -1) ? '#2B50ED' : 'rgba(0, 0, 0, 0.4)', }]}>
                        <Text>None of them</Text>
                    </View>
                </TouchableHighlight>
                {this.renderItems()}
                <View style={styles.line}></View>
                <View style={styles.column}>
                    <Text style={{ fontSize: 16, marginTop: 20, marginLeft: 25, marginBottom: 10 }}>Delete all data</Text>
                    <Text style={{ marginLeft: 25, marginRight: 20, color: '#666' }}>If you want delete all your purposes; press "Delete All" button bellow, to do this.</Text>
                    <TouchableHighlight underlayColor="#2B50ED" style={[styles.button, { width: 140, alignSelf: 'flex-end' }]} onPress={() => this.deleteAll()}>
                        <View style={[styles.row, { alignItems: 'center' }]}>
                            <Image style={{ width: 24, height: 24, marginLeft: 20 }} source={require('../../assets/delete.white.png')} />
                            <Text style={{ marginLeft: 10, color: '#fff' }}>Delete All</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={styles.line}></View>
                <View style={[styles.row, { padding: 20, paddingTop: 0 }]}>
                    <View style={styles.column}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17, marginBottom: 10 }}>How much money</Text>
                        <Text>Version 0.0.1</Text>
                        <Text>MIT License and free for every body</Text>
                    </View>
                    <TouchableHighlight onPress={() => Linking.openURL('https://github.com/jaypy-code/how-much-money')} style={{ position: 'absolute', right: 15, borderRadius: 100 }}>
                        <Image style={{ width: 28, height: 28 }} source={require('../../assets/github.png')} />
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

const styles = new StyleSheet.create({
    item: {
        margin: 10,
        marginLeft: 20,
        marginRight: 20,
        padding: 10,
        borderRadius: 6,
        borderWidth: 2,
        borderStyle: 'solid',
        alignItems: 'center'
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
    },
    column: {
        display: 'flex',
        flexDirection: 'column'
    },
    image: {
        width: 40,
        height: 40,
        marginRight: 10
    },
    button: {
        margin: 20,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#2B50ED',
        display: 'flex',
        justifyContent: 'center'
    },
    line: {
        height: 1,
        backgroundColor: 'rgba(0,0,0, 0.3)',
        margin: 10
    }
})