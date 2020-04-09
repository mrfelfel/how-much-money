import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Text, StyleSheet, ScrollView, TouchableHighlight, Image, ToastAndroid } from 'react-native';
import { Actions } from 'react-native-router-flux';
import SmsAndroid from 'react-native-get-sms-android';

import Header from '../components/Header';
import Add from '../components/Add';
import Item from '../components/Item';

console.disableYellowBox = true;

export default class Main extends React.Component {
    constructor() {
        super();
        this.state = {
            items: null,
            now: 0,
            has: 0,
            percent: 0
        }
    }

    componentDidMount() {
        this.init();
    }

    init() {
        AsyncStorage.getItem('purposes').then(items => {
            items = JSON.parse(items) || [];
            let has = 0;
            if (items.length != 0) {
                items.map(item => {
                    has += Number(item.price);
                });
            }

            this.getWallet();
            this.setState({
                items, has, now: 0, percent: this.getPercent()
            })
        })
    }

    getWallet() {
        SmsAndroid.list(JSON.stringify({
            address: '9830009417',
            maxCount: 1,
        }), (error) => { }, (count, items) => {
            items = JSON.parse(items);
            if(items.length == 1){
                let body = items[0].body;
                body = body.split('\n')[3].split(':')[1].split(',').join('');
                body = Number(body) / 10;
                this.setState({ now: body });
            }

        })
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

    getPercent() {
        let res = (100 * this.state.now) / this.state.has;
        res = Number.isNaN(res) ? 0 : res;
        if (res > 100) res = 100;
        return Math.round(res);
    }

    renderItems() {
        let items = this.state.items;
        if (items && Array.isArray(items)) {
            return items.map((item, index) => {
                return (
                    <Item title={item.title} sub={this.toPrice(item.price) + 'T'} onButtonPress={() => { this.deleteItem(index); this.init() }} />
                )
            })
        } else {
            return (<></>)
        }
    }

    deleteItem(index = -1) {
        let items = this.state.items;
        items.splice(index, 1);
        AsyncStorage.setItem('purposes', JSON.stringify(items));
        this.setState({ items });
    }

    render() {
        return (
            <View style={styles.main}>
                <Header title="How much money" />
                {
                    (this.state.items && this.state.items.length == 0) ?
                        <View style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 20 }}>
                            <Text style={{ fontSize: 20 }}>No financial purpose</Text>
                            <Text style={{ marginTop: 10, marginBottom: 10, color: '#505050' }}>You haven't added any financial purpose, yet. Please add a new financial purpose.</Text>
                            <Add onAdd={() => this.componentWillMount()} />
                        </View> :
                        <View style={styles.container}>
                            <View style={{ flex: 1 }}>
                                <View style={styles.purpose}>
                                    <Text style={styles.purposeNow}>{this.state.percent}%</Text>
                                    <Text style={styles.purposePoint}>{this.toPrice(this.state.has) + 'T'} / {this.toPrice(this.state.now) + 'T'}</Text>
                                </View>
                                <ScrollView>
                                    {this.renderItems()}
                                </ScrollView>
                                <View style={{ position: 'absolute', left: 0, right: 0, bottom: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <TouchableHighlight style={styles.button} onPress={() => Actions.push('add')}>
                                        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <Image style={{ width: 24, height: 24, marginLeft: 15, marginRight: 5 }} source={require('../../assets/add.png')} />
                                            <Text style={{ color: 'white' }}>Add purpose</Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                }
            </View>
        )
    }
}

const styles = new StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
        backgroundColor: '#F3F5F8',
        borderTopLeftRadius: 40,
        shadowColor: '#E4E7EB',
        shadowOffset: {
            width: 0,
            height: -5,
        },
        shadowOpacity: 1,
        elevation: 15,
    },
    purpose: {
        borderRadius: 20,
        height: 175,
        margin: 20,
        backgroundColor: '#2B50ED',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#2B50ED',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.5,
        elevation: 10,
    },
    purposeNow: {
        color: 'white',
        fontSize: 50
    },
    purposePoint: {
        color: 'white',
        fontSize: 15,
        marginTop: 20
    },
    button: {
        borderRadius: 12,
        backgroundColor: '#EA643A',
        height: 40,
        width: 150
    }
})