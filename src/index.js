import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { HashRouter as Router } from "react-router-dom"
import { UserProvider } from "./context/UserContext"
import { Provider } from "react-redux"
import  store from "./redux/redux"

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <UserProvider>
          <App />
        </UserProvider>
      </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
)
