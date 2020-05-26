import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image,
        ActionSheetIOS,
        Alert,
        Animated,
        AppState,
        AsyncStorage,
        PermissionsAndroid,
        ImageEditor, //弃用了 使用react-native-image-editor，区别在于配置不同，代码部分相似



} from 'react-native';

//ImageEditor 裁剪数据
const cropData = {
  offset: {x: 10, y: 30},//从原图裁剪的起始坐标
  size: {width: 250, height: 250},//裁剪的宽高
  displaySize: {width: 250, height: 250},//裁剪后生成图片的大小
  resizeMode: 'contain', //缩放图像时使用的调整大小模式
  //cover模式只求在显示比例不失真的情况下填充整个显示区域。可以对图片进行放大或者缩小，超出显示区域的部分不显示， 也就是说，图片可能部分会显示不了。
  //contain模式是要求显示整张图片, 可以对它进行等比缩小, 图片会显示完整,可能会露出Image控件的底色。
  //stretch模式不考虑保持图片原来的宽,高比.填充整个Image定义的显示区域,这种模式显示的图片可能会畸形和失真。
};

// 只能用于远程图片
class ImageEditorAPI extends React.Component {
 
  state = {
      imgURI: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1551718648408&di=e5c78eb153cac2a1ec7a077f0df5190c&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F279759ee3d6d55fb567c04ef67224f4a21a4dd45.jpg',
      cropImgURI: null
  }

  componentDidMount(){
      ImageEditor.cropImage(this.state.imgURI, cropData, this.cropSuccess, this.cropFail);
  }

  cropSuccess = (corpImgURI) => {
      console.log('图片剪辑成功');
      this.setState({cropImgURI:corpImgURI});
  }

  cropFail = () => {
      console.log('图片剪辑失败');
  }

  render(){
      return(
          <View style={styles.viewStyle}>
              <Text>剪辑前：</Text>
              <Image 
                  source={{ uri: this.state.imgURI }} 
                  style={styles.imgStyle} 
              />
              <Text>剪辑后：</Text>
              <Image 
                  source={{ uri: this.state.cropImgURI }} 
                  style={styles.imgStyle}
                  resizeMode="contain" 
              />
          </View>
      );
  }
}


//动画组件
class FadeInView extends React.Component {
    state = {
      fadeAnim: new Animated.Value(0),  // 透明度初始值设为0
    }
  
    componentDidMount() {
      Animated.timing(                  // 随时间变化而执行动画
        this.state.fadeAnim,            // 动画中的变量值
        {
          toValue: 1,                   // 透明度最终变为1，即完全不透明
          duration: 10000,              // 让动画持续一段时间
        }
      ).start();                        // 开始执行动画
    }
  
    render() {
      let { fadeAnim } = this.state;
  
      return (
        <Animated.View                 // 使用专门的可动画化的View组件
          style={{
            ...this.props.style,
            opacity: fadeAnim,         // 将透明度指定为动画变量值
          }}
        >
          {this.props.children}
        </Animated.View>
      );
    }
}

//app状态
class AppStateExample extends Component {

    state = {
      appState: AppState.currentState
    }
  
    componentDidMount() {
      AppState.addEventListener('change', this._handleAppStateChange);
    }
  
    componentWillUnmount() {
      AppState.removeEventListener('change', this._handleAppStateChange);
    }
  
    _handleAppStateChange = (nextAppState) => {
      if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!')
      }
      this.setState({appState: nextAppState});
    }
  
    render() {
      return (
        <Text>Current state is: {this.state.appState}</Text>
      );
    }
  
}

class Common extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            fadeAnim: 0,
        }
    }
    componentDidMount() {
        // this._ActionSheetIOS();  //仅限iOS能用
    }

    _ActionSheetIOS = () => {
        ActionSheetIOS.showActionSheetWithOptions({
            options: ['取消', '删除'],
            destructiveButtonIndex: 1,
            cancelButtonIndex: 0,
          },
          (buttonIndex) => {
          if (buttonIndex === 1) { /* 当接收到的索引为1，即点击了删除按钮时，执行对应操作 */ }
          });
    }
    _Alert = () => {
        Alert.alert(
            'Alert Title',
            'My Alert Msg',
            [
              {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          )
    }
    _Animated = () => {
        Animated.timing(
            // timing方法使动画值随时间变化
            this.state.fadeAnim, // 要变化的动画值
            {
              toValue: 1, // 最终的动画值
              duration: 10000,
              useNativeDriver: false, 
            },
          ).start(); // 开始执行动画
          
          return (
              <Animated.View style={{opacity: this.state.fadeAnim}}>
                  <Text>我是动画</Text>
              </Animated.View>
          )
    }
    //地理位置
    requestCameraPermission = async() => {
      try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: '申请摄像头权限',
          message:
            '一个很牛逼的应用想借用你的摄像头，' +
            '然后你就可以拍出酷炫的皂片啦。',
          buttonNeutral: '等会再问我',
          buttonNegative: '不行',
          buttonPositive: '好吧',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('现在你获得摄像头权限了');
      } else {
        console.log('用户并不屌你');
      }
      } catch (err) {
      console.warn(err);
      }
    }
  
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => {this._Alert()}}>
                        <Text>_Alert</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => {this._Animated()}}>
                        <Text>_Animated</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => {this.requestCameraPermission()}}>
                        <Text>requestCameraPermission</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => {this._Alert()}}>
                        <Text>Alert</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => {this._Alert()}}>
                        <Text>Alert</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => {this._Alert()}}>
                        <Text>Alert</Text>
                </TouchableOpacity>
                {/*动画组件实现部分 */}
                <FadeInView style={{width: 200, height: 50, backgroundColor: 'powderblue'}}>
                    <Text style={{fontSize: 28, textAlign: 'center', margin: 10}}>
                        Fading in
                    </Text>
                 </FadeInView>
                 {/**获取当前状态 */}
                 <AppStateExample />
                 
                     
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    button: {
        width: 100,
        height: 50,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E4E4E4'
    },
    imgStyle: {
        width: 200,
        height: 200
    }
 });

export default Common;