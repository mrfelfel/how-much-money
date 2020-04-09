import React from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native';

class Item extends React.Component {
    constructor() {
        super();
    }

    getSub() {
        return this.props.sub || '';
    }

    getTitle() {
        return this.props.title || '';
    }

    render() {
        return (
            <TouchableHighlight underlayColor="transparent" onPress={() => (this.props.onPress) ? this.props.onPress() : false}>
                <View style={styles.item}>
                    <View style={[styles.dot, { backgroundColor: this.props.done ? '#2cca74' : '#ff2a2a' }]}></View>
                    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignSelf: 'flex-start', marginLeft: 15 }}>
                        <Text>{this.getTitle()}</Text>
                        <Text style={styles.sub, { display: this.getSub().length == 0 ? 'none' : 'flex' }}>{this.getSub()}</Text>
                    </View>
                    <TouchableHighlight underlayColor="#ddd" style={styles.button} onPress={() => (this.props.onButtonPress) ? this.props.onButtonPress() : false}>
                        <Image style={{ width: 24, height: 24 }} source={require('../../assets/delete.png')} />
                    </TouchableHighlight>
                </View>
            </TouchableHighlight>
        )
    }
}

const styles = new StyleSheet.create({
    item: {
        padding: 10,
        marginLeft: 30,
        marginRight: 30,
        borderBottomColor: '#707070',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        height: 60,
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'center'
    },
    sub: {
        fontSize: 14,
        color: '#4D4D4D'
    },
    button: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderRadius: 100,
        alignSelf: 'flex-end',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dot: {
        position: 'absolute',
        marginLeft: 5,
        width: 10,
        height: 10,
        borderRadius: 100,
        alignSelf: 'flex-start'
    }
})

export default Item;