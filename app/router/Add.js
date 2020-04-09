import React from 'react';
import { View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';

import Header from '../components/Header';
import Add from '../components/Add';

export default class AddComponent extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <View>
                <Header title="Add new purpose" back={true} />
                <View style={{ padding: 20 }}>
                    <Add onAdd={() => {
                        Actions.pop();
                        Actions.refs.main.init();
                    }} />
                </View>
            </View>
        )
    }
}