import React, {Component} from 'react';
import {StyleSheet, FlatList, Text, View} from 'react-native';
import PubNubReact from 'pubnub-react';

type Props = {};
export default class App extends Component<Props> {
  
  constructor(props) {
    super(props);
    
    this.array = [],
 
    this.state = {
      arrayHolder: [],
    }

    this.pubnub = new PubNubReact({
        subscribeKey: 'YOUR_SUB_KEY_HERE' // YOUR PUBNUB SUBSCRIBE KEY HERE
    });

    this.pubnub.init(this);
  }

  componentDidMount() {
    // Subscribe to smart_buttons channel and get events.
    this.pubnub.subscribe({
        channels: ['smart_buttons']     
    });
    // Update when the button is pressed.
    this.pubnub.getMessage('smart_buttons', (msg) => {
        var messageTimestamp = new Date(parseInt(msg.timetoken.slice(0, 10))*1000);
        this.array.push({title : "Pushed: "+messageTimestamp.toLocaleString()});
        this.setState({ arrayHolder: [...this.array] })
    });
    // Get and display previous button events.
    this.pubnub.history(
      {
          channel: 'smart_buttons',
          count: 20,
      },
      function (status, response) {
        if (status.statusCode == 200) {
            for (var i=0; i < 20; i++) {
                var timestamp = new Date(parseInt(response.messages[i].timetoken.toString().slice(0, 10))*1000);
                this.array.push({title : "Pushed: "+timestamp.toLocaleString()});
                this.setState({ arrayHolder: [...this.array] })
            }            
        }
      }.bind(this)
    );
  }

  componentWillUnmount() {
    this.pubnub.unsubscribe({
        channels: ['smart_buttons']
    });
  }

  render() {
    return (
       <View style={styles.MainContainer}>

       <Text style={styles.item}> Doorbell Events: </Text>
 
        <FlatList
            inverted 

            ref={ref => this.flatList = ref}

            data={this.state.arrayHolder}
 
            width='100%'
 
            extraData={this.state.arrayHolder}
 
            keyExtractor={(item, index)=> { return item.title.toString()}}
 
            ItemSeparatorComponent={this.FlatListItemSeparator}
 
            renderItem={({ item }) => <Text style={styles.item}> {item.title} </Text>}

            onContentSizeChange={() => this.flatList.scrollToEnd({animated: true})}
   
            onLayout={() => this.flatList.scrollToEnd({animated: true})}
        />
 
      </View>
    );
  }
}

const styles = StyleSheet.create({
 
  MainContainer: {
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    margin: 2
 
  },
 
  item: {
    padding: 20,
    fontSize: 22,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
 
});