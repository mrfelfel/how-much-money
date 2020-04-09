import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, StyleSheet, Text, Image, TouchableHighlight } from 'react-native';

import banks from '../database/banks';
import Header from '../components/Header';

export default class Setting extends React.Component {
    constructor() {
        super();

        this.state = {
            selected: -1
        }
    }

    componentDidMount() {
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
    }
})