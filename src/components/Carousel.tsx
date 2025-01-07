import * as React from 'react';
import { Dimensions, Image, StyleSheet, Text, View, } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { carouselData } from '../data/data';

function CarouselComponent() {
    const width = Dimensions.get('window').width;
    return (
        <View style={styles.container}>
            <Carousel
                loop
                width={width}
                height={300}
                autoPlay                
                data={carouselData}
                style={styles.carosuelContainer}
                scrollAnimationDuration={3000}           
                renderItem={({ item, index }) => (
                    <View key={index}style={styles.itemContainer} >
                        <Image source={item.link} style={styles.image}/>
                        <Text style={styles.title}>{item.title}</Text>
                    </View>
                )}
            />
        </View>
    );
}

export default CarouselComponent;

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor:"#A7C8A9",
        marginLeft:"-5%",
        marginTop:"-5%",
         width:"110%", 
         elevation: 16, 
        borderRadius:12, 
        transform:[{rotate:'5deg'}] 
    },
    carosuelContainer:{
        alignSelf:"center",
        margin: 24,
        marginTop:48,
        transform:[{rotate:'-5deg'}]
    },
    itemContainer:{
        flex: 1,
        alignItems:'center',
        alignSelf:'center',
        justifyContent: 'center',        
    },
    image:{
        height:250,
        width:300,
        borderRadius:20
    },
    title: { 
        fontSize: 32,
        textAlign:"justify",
        width:300, 
        color:"#fff"
     }
})