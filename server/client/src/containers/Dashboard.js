import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import * as actions from "../actions"
import io from "socket.io-client"
import SidePanel from "../components/SidePanel"
import Uploader from "../components/uploadButton"
import WelcomePage from "../components/WelcomePage"
import PageHeader from "../components/Header"
import ChatSection from "../components/ChatSection"
import Footer from "../components/Footer"
import Settings from "./Settings"
import MessagesList from "../components/MessagesList"
import AvatarBlock from "../components/AvatarBlock"
import { Route, Switch } from "react-router-dom"
import Media from "react-media"

const sound = require("../sounds/msg.mp3")
const standartImage = require("../img/square-image.png")

const styles = {
  grid: {
    display: "grid",
    gridTemplateAreas: `'header header header header'
     'menu avatar avatar avatar'
     'menu main main main'
     'menu footer footer footer'`,
    gridTemplateColumns: "1fr 4fr 4fr 4fr",
    gridGap: "10px",
    gridAutoRows: "min-content",
    height: "fit-content"
  },
  sendButton: {
    display: "flex",
    flexDirection: "row"
  },
  dynamicImageStyle: {
    minHeight: "200px",
    maxWidth: "300px",
    maxHeight: "300px"
  },
  chatWindow: {
    height: "350px"
  },
  headerButtonJustify: {
    justifyContent: "flex-end"
  }
}

const mobileGrid = {
  grid: {
    display: "grid",
    gridTemplateAreas: `'header header header'
         'avatar avatar avatar'
         'main main main'
         'footer footer footer'`,
    gridTemplateColumns: "4fr 4fr 4fr",
    gridAutoRows: "min-content",
    gridGap: "10px",
    height: "fit-content"
  },
  dynamicImageStyle: {
    minHeight: "150px",
    maxWidth: "300px",
    maxHeight: "300px"
  },
  chatWindow: {
    height: "450px"
  },
  headerButtonJustify: {
    justifyContent: "center"
  }
}

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messageText: "",
      pictures: [],
      uploaderVisible: false,
      imagesWereUploaded: false,
      isTabActive: true
    }
    this.uploadNewTrigger = false
    this.uploadTriggerCount = 0
    this.handleRef = element => {
      this.dialog = element
    }
    this.eventName = null
    this.eventKey = null
    this.newMsgTabNotification = null
    this.normalTitle
    this.audio = new Audio(sound)
  }

  logout = () => {
    this.props.dashboard.socket.disconnect()
    this.props.logoutUser()
  }

  handleDialogScroll = async e => {
    const { haveAllMessagesBeenFetched } = this.props.dashboard
    if (this.uploadNewTrigger || haveAllMessagesBeenFetched) return
    const target = e.target
    const height =
      ((target.scrollHeight - target.scrollTop) / target.scrollHeight) * 100
    if (height > 50) {
      this.uploadNewTrigger = true
      const { activeDialogWith, messagesForEveryContact } = this.props.dashboard
      const skip =
        this.uploadTriggerCount +
        messagesForEveryContact[activeDialogWith].length
      await this.props.uploadMessagesOnScroll(activeDialogWith, skip)
      this.uploadNewTrigger = false
    }
  }

  handleOpenDialog = async id => {
    const { dashboard, openDialog } = this.props
    const { messagesForEveryContact, randomUsers } = dashboard
    let newContact = false
    let contact
    if (!messagesForEveryContact.hasOwnProperty(id)) {
      contact = randomUsers.find(i => i._id === id)
      newContact = true
    }
    this.uploadTriggerCount = 0
    this.uploadNewTrigger = false
    await openDialog(id, newContact, contact)
    if (!newContact) {
      const imgUrlArray = messagesForEveryContact[id]
        .filter(m => m.message.image.image)
        .map(m => m.message.text)
      if (imgUrlArray.length) {
        const promiseArray = imgUrlArray.map(url => {
          return new Promise(res => {
            const img = new Image()
            img.src = url
            img.onload = () => res()
          })
        })
        await Promise.all(promiseArray)
      }
      if (this.dialog) {
        this.dialog.scrollTop = this.dialog.scrollHeight
      }
    }
  }

  onDrop = pictures => {
    this.setState({ pictures })
  }

  sendImages = () => {
    const { pictures } = this.state
    const { sendImages, createNewConversation, dashboard } = this.props
    const { activeDialogWith, messagesForEveryContact } = dashboard

    if (!pictures.length || !activeDialogWith) return
    let formData = new FormData()
    pictures.forEach((file, i) => {
      formData.append(i, file)
    })
    formData.append("activeDialogWith", activeDialogWith)
    sendImages(formData)
    if (!messagesForEveryContact[activeDialogWith].length) {
      createNewConversation(activeDialogWith)
    }
    this.setState({ imagesWereUploaded: true, pictures: [] })
  }
  sendMessage = () => {
    const { messageText } = this.state
    const { createNewConversation, dashboard } = this.props
    const {
      activeDialogWith,
      messagesForEveryContact
    } = dashboard
    const { socket } = dashboard
    if (!messageText || !activeDialogWith) return
    const newMessage = {
      message: {
        text: messageText
      },
      recipient: activeDialogWith
    }
    socket.emit("outboundMessage", newMessage)
    if (!messagesForEveryContact[activeDialogWith].length) {
      createNewConversation(activeDialogWith)
    }
    this.setState({ messageText: "" })
  }

  handleTabVisibility = e => {
    const isTabActive = !e.target[this.eventKey]
    if (isTabActive) {
      clearInterval(this.newMsgTabNotification)
      document.title = this.normalTitle
    }
    this.setState({ isTabActive })
  }

  newMsgNewTitle = () => {
    if (document.title === this.normalTitle) {
      document.title = "You have new message(s)!"
    } else {
      document.title = this.normalTitle
    }
  }

  componentDidMount() {
    this.audio.load()
    this.normalTitle = document.title
    const socket = io("https://im-messenger.herokuapp.com");
    // const socket = io("localhost:5000")
    this.props.setSocket(socket)
    const keys = {
      hidden: "visibilitychange",
      webkitHidden: "webkitvisibilitychange",
      mozHidden: "mozvisibilitychange",
      msHidden: "msvisibilitychange"
    }

    for (let stateKey in keys) {
      if (stateKey in document) {
        this.eventKey = stateKey
        this.eventName = keys[stateKey]
        break
      }
    }

    document.addEventListener(this.eventName, this.handleTabVisibility)

    socket.on("userChangedStatus", message => {
      this.props.userChangedStatus(message)
    })
    socket.on("imageHasBeenUploaded", async message => {
      const dialog = this.dialog
      let scroll
      if (dialog) {
        if (dialog.scrollTop + dialog.clientHeight === dialog.scrollHeight) {
          scroll = true
        }
        let img = new Image()
        img.onload = () => {
          this.props.addImageUrl(message)
          if (scroll) {
            dialog.scrollTop = dialog.scrollHeight
          }
        }
        img.src = message.message.text
      }
    })
    socket.on("inboundMessage", async message => {
      const {
        dashboard,
        auth,
        newMessageForAnotherDialog,
        messageFromUnknown,
        addMessage,
        sortSidePanelDialogs
      } = this.props
      const { activeDialogWith, iHaveDialogWith } = dashboard
      const { user } = auth
      if (message.sender !== auth.user._id && !user.mute) {
        try {
          await this.audio.play()
        } catch (e) {
          // throw new Error(e);
        }
      }
      if (!this.state.isTabActive && message.sender !== auth.user._id) {
        this.newMsgTabNotification = setInterval(this.newMsgNewTitle, 500)
      }
      if (
        message.recipient !== activeDialogWith &&
        message.sender !== activeDialogWith
      ) {
        const sender = message.sender
        if (!iHaveDialogWith[sender]) {
          await messageFromUnknown(sender)
        } else {
          await newMessageForAnotherDialog(sender)
        }
      }
      const dialog = this.dialog
      let scroll
      if (dialog) {
        if (dialog.scrollTop + dialog.clientHeight === dialog.scrollHeight) {
          scroll = true
        }
      }
      await addMessage(message, activeDialogWith)

      if (scroll) {
        dialog.scrollTop = dialog.scrollHeight
      }

      sortSidePanelDialogs()
      this.uploadTriggerCount++
    })
    socket.on("msgHasBeenReadByPeer", async options => {
      const { ids, whose } = options
      const { msgReadByPeer } = this.props
      msgReadByPeer(ids, whose)
    })
    this.props.getPeers()
  }

  componentWillUnmount() {
    document.removeEventListener(this.eventName, this.handleTabVisibility)
    clearInterval(this.newMsgTabNotification)
    this.props.dashboard.socket.disconnect()
  }

  render() {
    const {
      auth,
      dashboard,
      removeNotifications,
      removeConversation,
      closeDialog,
      markMsgRead,
      match,
      location
    } = this.props
    const { activeDialogWith, randomUsers, iHaveDialogWith } = dashboard
    const { imagesWereUploaded, uploaderVisible, messageText } = this.state
    const WrappedMessageList = props => {
      return (
        <MessagesList
          dashboard={dashboard}
          removeConversation={removeConversation}
          openDialog={this.handleOpenDialog}
          {...props}
        />
      )
    }
    const welcomeSection = () => (
      <Fragment>
        <AvatarBlock
          auth={auth}
          randomUsers={randomUsers}
          iHaveDialogWith={iHaveDialogWith}
          activeDialogWith={activeDialogWith}
          standartImage={standartImage}
        />
        <WelcomePage
          randomUsers={randomUsers}
          activeDialogWith={activeDialogWith}
          iHaveDialogWith={iHaveDialogWith}
          openDialog={this.handleOpenDialog}
          standartImage={standartImage}
        />
      </Fragment>
    )

    const chattingSection = style => (
      <Fragment>
        <AvatarBlock
          auth={auth}
          randomUsers={randomUsers}
          iHaveDialogWith={iHaveDialogWith}
          activeDialogWith={activeDialogWith}
          standartImage={standartImage}
        />
        <ChatSection
          dashboard={dashboard}
          auth={auth}
          handleDialogScroll={this.handleDialogScroll}
          handleRef={this.handleRef}
          closeDialog={closeDialog}
          markMsgRead={markMsgRead}
          removeNotifications={removeNotifications}
          standartImage={standartImage}
          topStyle={style}
        />
        <Footer
          onSubmit={e => {
            e.preventDefault()
            this.sendMessage()
          }}
          messageText={messageText}
          onChange={e => this.setState({ messageText: e.target.value })}
          handleSendClick={this.sendMessage}
          handleImageSendClick={() =>
            this.setState({ uploaderVisible: true, imagesWereUploaded: false })
          }
        />
      </Fragment>
    )
    const content = style => (
      <div style={style.grid}>
        <SidePanel
          dashboard={dashboard}
          openDialog={id => this.handleOpenDialog(id)}
          standartImage={standartImage}
        />
        <PageHeader
          auth={auth}
          logout={this.logout}
          location={location}
          closeDialog={closeDialog}
          topStyle={style}
        />

        <Switch>
          <Route exact path={`${match.url}`} render={welcomeSection} />
          <Route
            path={`${match.url}/chat`}
            render={() => chattingSection(style)}
          />
          <Route
            path={`${match.url}/settings`}
            render={() => <Settings standartImage={standartImage} />}
          />
          <Route
            path={`${match.url}/messages`}
            render={() => <WrappedMessageList />}
          />
        </Switch>

        {imagesWereUploaded ? null : (
          <Uploader
            onClose={() => this.setState({ uploaderVisible: false })}
            onDrop={this.onDrop}
            visible={uploaderVisible}
            onUpload={this.sendImages}
          />
        )}
      </div>
    )

    return (
      <Media query="(max-width: 599px)">
        {matches => (matches ? content(mobileGrid) : content(styles))}
      </Media>
    )
  }
}

function mapStateToProps({ auth, dashboard }) {
  return { auth, dashboard }
}

export default connect(
  mapStateToProps,
  actions
)(Dashboard)
