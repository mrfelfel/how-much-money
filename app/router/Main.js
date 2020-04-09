import React from 'react';
import * as tmpl from 'reverse-string-template';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Text, StyleSheet, ScrollView, TouchableHighlight, Image, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';
import SmsAndroid from 'react-native-get-sms-android';
import permission from 'react-native-permissions';

import Header from '../components/Header';
import Add from '../components/Add';
import Item from '../components/Item';

import bank from '../database/banks';

console.disableYellowBox = true;

export default class Main extends React.Component {
    constructor() {
        super();
        this.state = {
            items: null,
            now: 0,
            has: 0,
            percent: 0,
            tab: 0,
            permission: null
        }
    }

    componentDidMount() {
        this.init();
    }

    init() {
        AsyncStorage.getItem('purposes').then(async items => {
            items = await JSON.parse(items) || [];
            let has = 0;
            if (items.length != 0) {
                await items.map(item => {
                    has += Number(item.price);
                });
            }

            this.readSMS()
                .then(async () => {
                    return await this.getWallet()
                })
                .then(() => {
                    this.setState({
                        items, has, percent: this.getPercent(has)
                    });
                })
                .catch(() => this.setState({ now: 0 }));
        })
    }

    readSMS() {
        return new Promise((resolve, reject) => {
            permission.check(permission.PERMISSIONS.ANDROID.READ_SMS)
                .then(result => {
                    this.setState({ permission: result == 'granted' })
                    if (result == 'granted') resolve();
                    else if (result == 'denied') {
                        permission.request(permission.PERMISSIONS.ANDROID.READ_SMS)
                            .then(result => {
                                this.setState({ permission: result == 'granted' })
                                if (result == 'granted') resolve();
                                else reject();
                            })
                    } else reject();
                })
        })
    }

    extractDataFromBankSMS(data) {
        const parsed = tmpl(data.data, data.template)

        const keys = Object.keys(parsed)

        keys.forEach((key) => {
            parsed[key] = parsed[key].replace(new RegExp(data.spacer, 'g'), '')
        })

        return parsed
    }
    getWallet() {
        return new Promise((resolve) => {
            AsyncStorage.getItem('bank').then(index => {
                if (index) {
                    index = parseInt(index);
                    if (index < 0) {
                        this.setState({ now: 0 })
                        resolve();
                    } else {
                        let address = bank[index]['phone'];
                        if (address) {
                            SmsAndroid.list(JSON.stringify({
                                address,
                                maxCount: 1,
                            }), (error) => {
                                this.setState({ now: 0 })
                                resolve();
                            }, (count, items) => {
                                items = JSON.parse(items);
                                if (items.length == 1) {
                                    let body = items[0].body;
                                    body = this.ExtractDataFromBankSms({
                                        spacer: bank[index]['spacer'],
                                        template: bank[index]['template'],
                                        data: body

                                    }).account
                                    body = Number(body) / 10;
                                    this.setState({ now: body });
                                } else {
                                    this.setState({ now: 0 })
                                }
                                resolve();
                            })
                        } else {
                            this.setState({ now: 0 })
                            resolve();
                        }
                    }
                } else {
                    this.setState({ now: 0 })
                    resolve();
                }
            })
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

    getPercent(has = this.state.has) {
        let res = (100 * this.state.now) / has;
        res = Number.isNaN(res) ? 0 : res;
        if (res > 100) res = 100;
        res = Math.round(res);
        return res;
    }

    renderItems() {
        let items = this.state.items;
        if (items && Array.isArray(items)) {
            return items.map((item, index) => {
                let done = parseInt(item.price) <= this.state.now;
                if (this.state.tab == 0 || (this.state.tab == 1 && done == true) || (this.state.tab == 2 && done == false)) {
                    return (
                        <Item done={done} title={item.title} sub={this.toPrice(item.price) + 'T'} onButtonPress={() => { this.deleteItem(index); this.init() }} />
                    )
                }
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
        if (this.state.permission == true) {
            return (
                <View style={styles.main}>
                    <Header title="How much money" setting={this.state.items && this.state.items.length != 0} />
                    {
                        (this.state.items && this.state.items.length == 0) ?
                            <View style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 20 }}>
                                <Text style={{ fontSize: 20 }}>No financial purpose</Text>
                                <Text style={{ marginTop: 10, marginBottom: 10, color: '#505050' }}>You haven't added any financial purpose, yet. Please add a new financial purpose.</Text>
                                <Add onAdd={() => this.init()} />
                            </View> :
                            (this.state.items) ?
                                <View style={styles.container}>
                                    <View style={{ flex: 1 }}>
                                        <View style={styles.purpose}>
                                            <Text style={styles.purposeNow}>{this.state.percent}%</Text>
                                            <Text style={styles.purposePoint}>{this.toPrice(this.state.now) + 'T'} / {this.toPrice(this.state.has) + 'T'}</Text>
                                        </View>
                                        <View style={styles.tabs}>
                                            <TouchableHighlight underlayColor="transparent" onPress={() => this.setState({ tab: 0 })} style={[styles.tab, { backgroundColor: (this.state.tab == 0) ? "#2B50ED" : "transparent" }]}>
                                                <Text style={{ fontSize: 12, color: (this.state.tab == 0) ? "#fff" : "#000" }}>All</Text>
                                            </TouchableHighlight>
                                            <TouchableHighlight underlayColor="transparent" onPress={() => this.setState({ tab: 1 })} style={[styles.tab, { backgroundColor: (this.state.tab == 1) ? "#2B50ED" : "transparent" }]}>
                                                <Text style={{ fontSize: 12, color: (this.state.tab == 1) ? "#fff" : "#000" }}>Finished</Text>
                                            </TouchableHighlight>
                                            <TouchableHighlight underlayColor="transparent" onPress={() => this.setState({ tab: 2 })} style={[styles.tab, { backgroundColor: (this.state.tab == 2) ? "#2B50ED" : "transparent" }]}>
                                                <Text style={{ fontSize: 12, color: (this.state.tab == 2) ? "#fff" : "#000" }}>Not Finished</Text>
                                            </TouchableHighlight>
                                        </View>
                                        <ScrollView>
                                            {this.renderItems()}
                                        </ScrollView>
                                        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <TouchableHighlight underlayColor="#EA643A" style={styles.button} onPress={() => Actions.push('add')}>
                                                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                                    <Image style={{ width: 24, height: 24, marginLeft: 15, marginRight: 5 }} source={require('../../assets/add.png')} />
                                                    <Text style={{ color: 'white' }}>Add purpose</Text>
                                                </View>
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                                </View> :
                                <View></View>
                    }
                </View>
            )
        } else if (this.state.permission == false) {
            return (
                <View style={styles.main}>
                    <Header title="How much money" />
                    <View style={{ flex: 1, marginTop: -100, padding: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../../assets/sms.png')} />
                        <Text style={{ fontSize: 20, margin: 10, }}>Access denied !</Text>
                        <Text style={{ textAlign: 'center', color: '#666' }}>We need access to read your bank sms. But you denied this permission !</Text>
                    </View>
                </View>
            )
        } else {
            return (
                <View></View>
            )
        }
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
    },
    tabs: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        backgroundColor: '#e9edf5',
        padding: 2,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 20
    },
    tab: {
        margin: 2,
        height: 30,
        width: (Dimensions.get('window').width / 3) - 19,
        borderRadius: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
})