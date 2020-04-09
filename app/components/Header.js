import React from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class Header extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <View style={styles.header}>
                {
                    (this.props.back == true) ?
                        <TouchableHighlight underlayColor="transparent" style={styles.button} onPress={() => Actions.pop()}>
                            <Image style={{ width: 20, height: 20 }} source={require('../../assets/back.png')} />
                        </TouchableHighlight>
                        : <></>
                }
                <Text style={styles.AppTitle}>{this.props.title || ''}</Text>
            </View>
        )
    }
}

const styles = new StyleSheet.create({
    header: {
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        margin: 20,
    },
    AppTitle: {
        fontSize: 17,
        color: '#707070'
    },
    button: {
        width: 30,
        height: 30,
        borderRadius: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    }
});