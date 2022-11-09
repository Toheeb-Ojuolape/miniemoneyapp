import React, { Component } from 'react';
import { BackHandler, AppState, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';



export default class tellbooks extends Component {
  constructor(props) {
    super(props);
    this.WEBVIEW_REF = React.createRef();
  }

  state = {
    appState: AppState.currentState
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  handleBackButton = () => {
    this.WEBVIEW_REF.current.goBack();
    return true;
  }

  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack
    });
  }

  _handleAppStateChange = nextAppState => {

    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {

    }
    this.setState({ appState: nextAppState });
  };


  render() {
    return (
      <>
        <WebView
          source={{ uri: "https://app.miniemoney.com/app" }}
          ref={this.WEBVIEW_REF}
          onNavigationStateChange={this.onNavigationStateChange.bind(this)}
          startInLoadingState={true}
          renderLoading={() => <ActivityIndicator size="large" color="#f66c1f" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, }} />}
          style={{ marginTop: 40 }}
          pullToRefreshEnabled={true}
          onContentProcessDidTerminate={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('Content process terminated, reloading', nativeEvent);
            this.WEBVIEW_REF.current.reload()
            Alert.alert('App went offline. Reloading...')
            this.WEBVIEW_REF.current.reload()
          }}
          onRenderProcessGone={syntheticEvent => {
            const { nativeEvent } = syntheticEvent;
            console.warn(
              'WebView Crashed: ',
              nativeEvent.didCrash,
            );
            this.WEBVIEW_REF.current.reload()
            window.alert('App went offline. Reloading...')
            this.WEBVIEW_REF.current.reload()
          }}
        />
      </>
    );
  }
}
