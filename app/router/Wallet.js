import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, StyleSheet, Dimensions, TouchableHighlight, Text, TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';

import Header from '../components/Header';

export default class Wallet extends React.Component {
    constructor() {
        super();
        this.state = {
            tab: 0,
            price: 0,
            now: 0
        }
    }

    toPrice(amount) {
        let str = amount.toString();
        str = str.replace(/\,/g, '');
        var objRegex = new RegExp('(-?[0-9]+)([0-9]{3})');
        while (objRegex.test(str)) {
            str = str.replace(objRegex, '$1,$2');
        }
        return str;
    }

    done() {
        AsyncStorage.getItem('wallet').then(amount => {
            amount = parseInt(amount) || 0;

            AsyncStorage.setItem('wallet', (this.state.tab == 0 ? (parseInt(amount) + parseInt(this.state.price) || 0) : (amount - this.state.price)).toString());
            Actions.pop();
            Actions.refs.main.init();
        })
    }

    render() {
        return (
            <View>
                <Header title="Your wallet" back={true} />
                <View style={{ padding: 20 }}>
                    <View style={styles.tabs}>
                        <TouchableHighlight underlayColor="transparent" onPress={() => this.setState({ tab: 0 })} style={[styles.tab, { backgroundColor: (this.state.tab == 0) ? "#2B50ED" : "transparent" }]}>
                            <Text style={{ fontSize: 12, color: (this.state.tab == 0) ? "#fff" : "#000" }}>Add Money</Text>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="transparent" onPress={() => this.setState({ tab: 1 })} style={[styles.tab, { backgroundColor: (this.state.tab == 1) ? "#2B50ED" : "transparent" }]}>
                            <Text style={{ fontSize: 12, color: (this.state.tab == 1) ? "#fff" : "#000" }}>Lose Money</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={{ margin: 10 }}>
                        <Text style={{ margin: 10 }}>Your wallet amount will be {this.state.tab == 0 ? this.toPrice(parseInt(this.props.now) + parseInt(this.state.price) || 0) : this.toPrice(this.props.now - this.state.price)}T</Text>
                        <TextInput
                            style={{ borderRadius: 6, borderColor: '#909090', borderWidth: 1, borderStyle: 'solid', paddingLeft: 10, marginTop: 10 }} placeholder="Amount"
                            onChangeText={value => this.setState({ price: value || 0 })}
                            value={this.state.price}
                            keyboardType="numeric"
                            returnKeyLabel="done"
                        />
                        <TouchableHighlight underlayColor="#EA643A" style={{ margin: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end', width: 100, borderRadius: 6, backgroundColor: '#EA643A', height: 40 }} onPress={() => this.done()}>
                            <Text style={{ color: 'white' }}>Done</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = new StyleSheet.create({
    tabs: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        backgroundColor: '#e9edf5',
        padding: 2,
        marginTop: -20,
        borderRadius: 20
    },
    tab: {
        margin: 2,
        height: 30,
        width: (Dimensions.get('window').width / 2) - 27,
        borderRadius: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
})