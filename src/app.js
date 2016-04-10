import React from 'react';
class App extends React.Component {
  constructor() {
    super();
    this.postMessage = this.postMessage.bind(this);
    this.retrieveAllMessages = this.retrieveAllMessages.bind(this);
    this.API_ROOT = "http://localhost:3001";
  }

  // Send input's value as message, through post method,
  // as long as the message is not empty
  postMessage() {
    let message = this.refs.input.value;
    console.log("----------------");
    console.log("from postMessage(): message = ", message);

    if(message != "") {
      // disable button and change its text
      this.refs.postBtn.disabled = true;
      this.refs.postBtn.innerHTML = "Posting message ...";
      // make the request
      var request = new Request(this.API_ROOT+"/messages", {
      	method: 'POST',
      	mode: 'cors',
        body: JSON.stringify({message: message}),
      	headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      	})
      });
      fetch(request).then(response => {
        console.log("post's response = ", response);
        // always set the button back to its original state
        this.refs.postBtn.disabled = false;
        this.refs.postBtn.innerHTML = "Post message";
      })
      .catch(error => {
        console.log("post's error = ", error);
        // always set the button back to its original state
        this.refs.postBtn.disabled = false;
        this.refs.postBtn.innerHTML = "Post message";
      });
    }
  }

  retrieveAllMessages() {
    // disable button and change its text
    this.refs.retrieveBtn.disabled = true;
    this.refs.retrieveBtn.innerHTML  = "Retrieving messages ..." ;

    // make the request
    var request = new Request(this.API_ROOT+"/messages", {
    	method: 'GET',
    	mode: 'cors',
    	headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    	})
    });
    fetch(request).then(response => {
      return response.json();
    })
    .then(jsonData => { //update message list
      this.refs.messageList.updateMessages(jsonData.messages);
      // always reset the button back to its original state
      this.refs.retrieveBtn.disabled = false;
      this.refs.retrieveBtn.innerHTML  = "Retrieve all messages" ;
    })
    .catch(error => {
      console.log("get's error = ", error);
      // always reset the button back to its original state
      this.refs.retrieveBtn.disabled = false;
      this.refs.retrieveBtn.innerHTML  = "Retrieve all messages" ;
    });
  }

  render() {
    return (
      <div>
        <button ref ="retrieveBtn" onClick={this.retrieveAllMessages}>Retrieve all messages</button>
        <br/>
        <input ref="input" type="text"/>
        <button ref="postBtn" onClick={this.postMessage}>Post message</button>
        <br/>
        <MessageList ref="messageList"/>
      </div>
    );
  }
}

// component to render a single message
class MessageItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <li>
        Date: <span>{this.props.date}</span>
         | content: <span>{this.props.content}</span>
      </li>
    );
  }
}
MessageItem.propTypes = {
  date: React.PropTypes.string,
  content: React.PropTypes.string
}
MessageItem.defaultProps = {
  date: "<none>",
  content: "<empty>"
}

// component to render a list of messages
class MessageList extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: []
    };
  }
  updateMessages(messages) {
    this.setState({messages: messages});
  }
  render() {
    let messageItems = this.state.messages.map(
       message => <MessageItem key={message._id}
      date={message.date} content={message.content} />);
    return <ul>{messageItems}</ul>;
  }
}
MessageList.propTypes = {
  messages: React.PropTypes.array
}
MessageList.defaultProps = {
  messages: []
}

export default App;
