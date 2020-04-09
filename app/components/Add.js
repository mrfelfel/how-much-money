import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Text, TextInput, TouchableHighlight } from 'react-native';

export default class Add extends React.Component {
    constructor() {
        super();
        this.state = {
            title: '',
            price: 0
        }
    }

    add() {
        if (this.state.title.length != 0) {
            AsyncStorage.getItem('purposes').then(items => {
                if (items && typeof items == 'string') {
                    items = JSON.parse(items);
                    items.push(this.state);
                    AsyncStorage.setItem('purposes', JSON.stringify(items));
                } else {
                    AsyncStorage.setItem('purposes', JSON.stringify([this.state]));
                }
                this.props.onAdd();
            })
        }
    }

    render() {
        return (
            <View style={{}}>
                <TextInput
                    style={{ borderRadius: 6, borderColor: '#909090', borderWidth: 1, borderStyle: 'solid', paddingLeft: 10, marginTop: 10 }} placeholder="Purpose title"
                    onChangeText={value => this.setState({ title: value })}
                    value={this.state.title}
                    returnKeyLabel="done"
                />
                <TextInput
                    style={{ borderRadius: 6, borderColor: '#909090', borderWidth: 1, borderStyle: 'solid', paddingLeft: 10, marginTop: 10 }} placeholder="Purpose price"
                    onChangeText={value => this.setState({ price: value })}
                    value={this.state.price}
                    keyboardType="numeric"
                    returnKeyLabel="done"
                />
                <TouchableHighlight style={{ margin: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end', width: 100, borderRadius: 6, backgroundColor: '#EA643A', height: 40 }} onPress={() => this.add()}>
                    <Text style={{ color: 'white' }}>Add purpose</Text>
                </TouchableHighlight>
            </View>
        )
    }
}