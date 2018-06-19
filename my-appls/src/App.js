import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import Select from 'react-select';
import createClass from 'create-react-class';
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

var config = {
  apiKey: "AIzaSyBGflsX38vQ4SVYcsPDXySUmIWZFnbIwao",
  authDomain: "cmvdb-555bc.firebaseapp.com",
  databaseURL: "https://cmvdb-555bc.firebaseio.com",
  projectId: "cmvdb-555bc",
  storageBucket: "cmvdb-555bc.appspot.com",
  messagingSenderId: "869787015915"
};
firebase.initializeApp(config);
const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true };
firestore.settings(settings);
const db = firebase.firestore();

class App extends Component {
  constructor() {
    super();
    this.handleLogout = this.handleLogout.bind(this);
    this.handleUser = this.handleUser.bind(this);
    this.state = {
      user: ''
    };
  }

  //Handles Logout
  handleLogout() {
    this.setState({
      user: ''
    });
    firebase.auth().signOut()
      .catch((err) => {
        console.log(err)
      })
  }

  toggle(event) {
    this.setState({
      checkboxState: !this.state.checkboxState
    });
  }

  handleUser(data) {
    this.setState({
      user: data
    });
  }
  render() {
    return (
      <div>
        <header>
          <h1 className="App-title">Cytomegalovirus Drug Resistance Database</h1>
          <Router>
            <div className="nav">
              <NavLink activeClassName="active" activeStyle={{ color: 'grey', borderBottom: '1px solid grey' }} style={{ color: 'black' }} to="/WelcomePage">
                <div className="pageslabel">Welcome</div>
              </NavLink>
              <NavLink activeClassName="active" activeStyle={{ color: 'grey', borderBottom: '1px solid grey' }} style={{ color: 'black' }} to="/CMVdb">
                <div className="pageslabel">CMVdb Program</div>
              </NavLink>
              {this.state.user === '' ?
                <NavLink activeClassName="active" activeStyle={{ color: 'black', borderBottom: '1px solid grey' }} style={{ color: 'black' }} to="/login">
                  <div className="pageslabel">Login</div>
                </NavLink>
                :
                <button type='button' className="btn btn-danger btn-xs" onClick={this.handleLogout}>Logout</button>
              }
              {/* <NavLink activeClassName="active" activeStyle={{ color: 'grey', borderBottom: '1px solid grey' }} style={{ color: 'black' }} to="/login">
                <div className="pageslabel">Login</div>
              </NavLink> */}
              <Route path="/WelcomePage" component={WelcomePage} />
              <Route path="/CMVdb" component={CMVdb} />
              <Route path="/login" render={(props) => (
                <Login {...props} handlerFromParent={this.handleUser} />
              )} />
              {/* <Route path="/login" component={Login} /> */}
            </div>
          </Router>
        </header>
      </div>

    );
  }
}



class WelcomePage extends Component {
  render() {
    return (
      <div className="container">
        <h3 className='pageheader'>
          Welcome!
        </h3>
        <p>This page looks for CMV drug resistance</p>
      </div>
    );
  }
}


// const todos = new Collection('todos');

// const Todos = observer(class Todos extends Component {
//   render() {
//     return <div>
//       {todos.docs.map((doc) => (
//         <TodoItem
//           key={todos.id}
//           doc={doc} />
//       ))}
//     </div>;
//   }
// });

// const TodoItem = observer(({ doc }) => {
//   const { finished, text } = doc.data;
//   return <div>
//     <input type='checkbox' checked={finished} />
//     <input type='text' value={text} />
//   </div>;
// });

class CMVdb extends Component {

  constructor() {
    super();
    this.state = {
      selected54poly: [],
      selected54term: [],
      selected96phos: [],
      poly: [],
      term: [],
      phos: [],
      drugs: []
    }
  }

  componentDidMount() {
    var drugarray = []
    db
      .collection('drug')
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            var object = JSON.parse(doc._document.data)
            var keys = Object.keys(object);
            var i;
            for (i = 0; i < keys.length; i++) {
              drugarray.push({
                label: keys[i],
                value: keys[i]
              })
            }
            this.setState({ drugs: drugarray })
          });
      });
    var ul54polymerasevariance = []
    db
      .collection('ul54polymerasevariance')
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            var object = JSON.parse(doc._document.data)
            var keys = Object.keys(object);
            var i;
            for (i = 0; i < keys.length; i++) {
              ul54polymerasevariance.push({
                label: keys[i],
                value: keys[i]
              })
            }
            this.setState({ poly: ul54polymerasevariance })
          });
      });
    var UL54terminase = []
    db
      .collection('UL54terminase')
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            var object = JSON.parse(doc._document.data)
            var keys = Object.keys(object);
            var i;
            for (i = 0; i < keys.length; i++) {
              UL54terminase.push({
                label: keys[i],
                value: keys[i]
              })
            }
            this.setState({ term: UL54terminase })
          });
      });

    var UL97phosphotransferase = []
    db
      .collection('UL97phosphotransferase')
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            var object = JSON.parse(doc._document.data)
            var keys = Object.keys(object);
            var i;
            for (i = 0; i < keys.length; i++) {
              UL54terminase.push({
                label: keys[i],
                value: keys[i]
              })
            }
            this.setState({ phos: UL97phosphotransferase })
          });
      });
  }

  onChangeSelection54poly(value) {
    this.setState({
      selected54poly: value
    });
    console.log(value)
  }

  onChangeSelection54term(value) {
    this.setState({
      selected54term: value
    });
    console.log(value)
  }

  onChangeSelection97phos(value) {
    this.setState({
      selected96phos: value
    });
    console.log(value)
  }

  handleSubmit() {
    var variances = db.collection("ul54polymerasevariance");
    var data = []
    for (var i; i < this.state.selected54poly.length; i++) {
      data.push(variances.where("variance", "==", this.state.selected54poly[i]))
    }
    console.log(data)
  }

  // fold increase
  // reference
  // comments

  render() {
    return (
      <div className="container" >
        <h3 className='pageheader'>Genotypic Resistance Interpretation Algorithm</h3>
        <p className='druglabel'>Drug Selection</p>
        <MultiDrugSelectField input={this.state.drugs}></MultiDrugSelectField>
        <h3 className='druglabel'>Mutation Selection</h3>
        <h4>UL54 - DNA Polymerase</h4>
        <MultiVarianceSelectField changeSelection={this.onChangeSelection54poly.bind(this)} input={this.state.poly}></MultiVarianceSelectField>
        <h4>UL54 - Terminase</h4>
        <MultiVarianceSelectField changeSelection={this.onChangeSelection54term.bind(this)} input={ul54terminase}></MultiVarianceSelectField>
        <h4>UL97 - Phosphotransferase</h4>
        <MultiVarianceSelectField changeSelection={this.onChangeSelection97phos.bind(this)} input={UL97Phosphotransferase}></MultiVarianceSelectField>
        <button onClick={this.handleSubmit} className="btn btn-primary" type="submit">Analyze</button>
      </div>
    );
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      username: ''
    };
  }
  componentDidMount() {
    this.stopWatchingAuth = firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        //    this.props.history.push("/routes");
        this.setState({
          user: firebaseUser,
          errorMessage: '',
          email: '',
          password: '',
          username: ''
        });
        this.props.handlerFromParent(this.state.user);
      }
      else {
        this.setState({ user: null }); //null out the saved state
      }
    })
  }
  componentWillUnmount() {
    this.stopWatchingAuth();
  }

  //Function that signs user up and stores their data in firebase
  handleSignUp() {

    /* Create a new user and save their information */
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(firebaseUser => {
        //include information (for app-level content)
        let profilePromise = firebaseUser.updateProfile({
          displayName: this.state.email,
        }); //return promise for chaining

        return profilePromise;
      })
      .then(firebaseUser => {
        this.setState({
          user: firebase.auth().currentUser
        })
      })
      .catch((err) => {
        console.log(err);
        this.setState({ errorMessage: err.message })
      })
  }


  handleSignIn() {
    //A callback function for logging in existing users

    /* Sign in the user */
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        this.setState({
          user: user
        })
      })
      .catch((err) => {
        console.log(err.message)
        this.setState({ errorMessage: err.message })
      });
  }

  handleChange(event) {
    let field = event.target.name; //which input
    let value = event.target.value; //what value
    let changes = {}; //object to hold changes
    changes[field] = value; //change this field
    this.setState(changes); //update state
  }


  render() {
    return (
      <div className="container">
        {this.state.errorMessage &&
          <p className="alert alert-danger">{this.state.errorMessage}</p>
        }

        {this.state.user &&
          <div className="alert alert-success" id='loggedin'><h5>Logged in as {this.state.user.email}</h5></div>
        }

        <div className="form-group">
          <label>Email: </label>
          <input className="form-control"
            name="email"
            value={this.state.email}
            onChange={(event) => { this.handleChange(event) }}
          />
        </div>

        <div className="form-group">
          <label>Password: </label>
          <input type="password" className="form-control"
            name="password"
            value={this.state.password}
            onChange={(event) => { this.handleChange(event) }}
          />
        </div>

        {/* <div className="form-group">
          <label>Username: </label>
          <input className="form-control"
            name="username"
            value={this.state.username}
            onChange={(event) => { this.handleChange(event) }}
          />
        </div> */}

        <div className="form-group">
          <button className="btn btn-primary mr-2" onClick={() => this.handleSignUp()}>
            Sign Up
                 </button>
          <button className="btn btn-success mr-2" onClick={() => this.handleSignIn()}>
            Sign In
                </button>
        </div>
      </div>
    );
  }
}

const CMVDRUGS = [
  { label: 'ganciclovir', value: 'ganciclovir' },
  { label: 'foscarnet', value: 'foscarnet' },
  { label: 'letermovir', value: 'letermovir' },
  { label: 'marabavir', value: 'marabavir' },
  { label: 'cidofovir', value: 'cidofovir' },
  { label: 'brincidofovir', value: 'brincidofovir' },
];

const ul54polymerase = [
  { label: 'D301N', value: 'D301N' },
  { label: 'N408D', value: 'N408D' },
  { label: 'N408K', value: 'N408K' },
  { label: 'N408S', value: 'N408S' },
  { label: 'N410K', value: 'N410K' },
  { label: 'F412C', value: 'F412C' },
  { label: 'F412L', value: 'F412L' },
  { label: 'F412S', value: 'F412S' },
  { label: 'F412V', value: 'F412V' },
  { label: 'D413A', value: 'D413A' },
  { label: 'D413E', value: 'D413E' },
  { label: 'D413N', value: 'D413N' },
  { label: 'P488R', value: 'P488R' },
  { label: 'N495K', value: 'N495K' },
  { label: 'K500N', value: 'K500N' },
  { label: 'L501I', value: 'L501I' },
  { label: 'T503I', value: 'T503I' },
  { label: 'K513N', value: 'K513N' },
  { label: 'K513E', value: 'K513E' },
  { label: 'K513R', value: 'K513R' },
  { label: 'D515E', value: 'D515E' },
  { label: 'D515Y', value: 'D515Y' },
  { label: 'L516R', value: 'L516R' },
  { label: 'I521T', value: 'I521T' },
  { label: 'P522A', value: 'P522A' },
  { label: 'P522S', value: 'P522S' },
  { label: 'del524', value: 'del524' },
  { label: 'V526L', value: 'V526L' },
  { label: 'C539G', value: 'C539G' },
  { label: 'C539R', value: 'C539R' },
];

const ul54terminase = [
  { label: 'S229F', value: 'S229F' },
  { label: 'V231A', value: 'V231A' },
  { label: 'V231L', value: 'V231L' },
  { label: 'N232Y', value: 'N232Y' },
  { label: 'V236L', value: 'V236L' },
  { label: 'V236M', value: 'V236M' },
  { label: 'E237D', value: 'E237D' },
  { label: 'L241P', value: 'L241P' },
  { label: 'T244K', value: 'T244K' },
  { label: 'L254F', value: 'L254F' },
  { label: 'L257F', value: 'L257F' },
  { label: 'L257I', value: 'L257I' },
  { label: 'K258E', value: 'K258E' },
  { label: 'F261L', value: 'F261L' },
  { label: 'Y321C', value: 'Y321C' },
  { label: 'C325F', value: 'C325F' },
  { label: 'C325R', value: 'C325R' },
  { label: 'C325Y', value: 'C325Y' },
  { label: 'M329T', value: 'M329T' },
  { label: 'N368D', value: 'N368D' },
  { label: 'R369G', value: 'R369G' },
  { label: 'R369M', value: 'R369M' },
  { label: 'R369S', value: 'R369S' },
  { label: 'E237D', value: 'E237D' },
];

const UL97Phosphotransferase = [
  { label: 'L405P', value: 'L405P' },
  { label: 'M460I', value: 'M460I' },
  { label: 'M460T', value: 'M460T' },
  { label: 'M460V', value: 'M460V' },
  { label: 'V466G', value: 'V466G' },
  { label: 'C518Y', value: 'C518Y' },
  { label: 'H520Q', value: 'H520Q' },
  { label: 'C592G', value: 'C592G' },
  { label: 'A594E', value: 'A594E' },
  { label: 'A594G', value: 'A594G' },
  { label: 'A594P', value: 'A594P' },
  { label: 'A594T', value: 'A594T' },
  { label: 'A594V', value: 'A594V' },
  { label: 'L595F', value: 'L595F' },
  { label: 'L595S', value: 'L595S' },
  { label: 'L595W', value: 'L595W' },
  { label: 'del595', value: 'del595' },
  { label: 'del595', value: 'del595' },
  { label: 'E596G', value: 'E596G' },
  { label: 'E596Y', value: 'E596Y' },
  { label: 'G598S', value: 'G598S' },
  { label: 'K599T', value: 'K599T' },
  { label: 'del600', value: 'del600' },
  { label: 'del601', value: 'del601' },
  { label: 'C603R', value: 'C603R' },
  { label: 'C603W', value: 'C603W' },
  { label: 'C607F', value: 'C607F' },
  { label: 'C607Y', value: 'C607Y' },
  { label: 'I610T', value: 'I610T' },
  { label: 'A613V', value: 'A613V' },
  { label: 'M460L', value: 'M460L' },
  { label: 'A590T', value: 'A590T' },
  { label: 'del590', value: 'del590' },
  { label: 'del590', value: 'del590' },
  { label: 'A591D', value: 'A591D' },
  { label: 'C592F', value: 'C592F' },
  { label: 'L595T', value: 'L595T' },
  { label: 'N597I', value: 'N597I' },
  { label: 'del597', value: 'del597' },
  { label: 'G598V', value: 'G598V' },
  { label: 'K599M', value: 'K599M' },
  { label: 'del600', value: 'del600' },
  { label: 'del601', value: 'del601' },
  { label: 'del601', value: 'del601' },
  { label: 'C603Y', value: 'C603Y' },
  { label: 'A606D', value: 'A606D' }
];
const WHY_WOULD_YOU = [
  { label: 'Chocolate (are you crazy?)', value: 'chocolate', disabled: true },
].concat(CMVDRUGS.slice(1))


var MultiDrugSelectField = createClass({
  displayName: 'MultiSelectField',
  propTypes: {
    label: PropTypes.string,
  },
  getInitialState() {
    return {
      removeSelected: true,
      disabled: false,
      crazy: false,
      stayOpen: false,
      value: this.props.input,
      rtl: false,
    };
  },

  // componentDidMount() {
  //   this.setState({ value: this.props.input })
  // },

  handleSelectChange(value) {
    console.log('You\'ve selected:', value);
    this.setState({ value });
  },
  toggleCheckbox(e) {
    this.setState({
      [e.target.name]: e.target.checked,
    });
  },
  toggleRtl(e) {
    let rtl = e.target.checked;
    this.setState({ rtl });
  },

  render() {
    const { crazy, disabled, stayOpen, value } = this.state;
    const options = crazy ? WHY_WOULD_YOU : this.props.input;
    return (
      <div className="section">
        <Select
          closeOnSelect={stayOpen}
          disabled={disabled}
          multi
          onChange={this.handleSelectChange}
          options={options}
          placeholder="Drug display options"
          removeSelected={this.state.removeSelected}
          rtl={this.state.rtl}
          simpleValue
          value={value}
        />

        {/* <div className="checkbox-list">
          <label className="checkbox">
            <input type="checkbox" className="checkbox-control" name="removeSelected" checked={this.state.removeSelected} onChange={this.toggleCheckbox} />
            <span className="checkbox-label">Remove selected options</span>
          </label>
          <label className="checkbox">
            <input type="checkbox" className="checkbox-control" name="disabled" checked={this.state.disabled} onChange={this.toggleCheckbox} />
            <span className="checkbox-label">Disable the control</span>
          </label>
          <label className="checkbox">
            <input type="checkbox" className="checkbox-control" name="crazy" checked={crazy} onChange={this.toggleCheckbox} />
            <span className="checkbox-label">I don't like Chocolate (disabled the option)</span>
          </label>
          <label className="checkbox">
            <input type="checkbox" className="checkbox-control" name="stayOpen" checked={stayOpen} onChange={this.toggleCheckbox} />
            <span className="checkbox-label">Stay open when an Option is selected</span>
          </label>
          <label className="checkbox">
            <input type="checkbox" className="checkbox-control" name="rtl" checked={this.state.rtl} onChange={this.toggleCheckbox} />
            <span className="checkbox-label">rtl</span>
          </label>
        </div> */}
      </div>
    );
  }
});

var MultiVarianceSelectField = createClass({
  displayName: 'MultiSelectField',
  propTypes: {
    label: PropTypes.string,
  },
  getInitialState() {
    return {
      removeSelected: true,
      disabled: false,
      stayOpen: false,
      value: [],
      rtl: false,
    };
  },
  handleSelectChange(value) {
    this.setState({ value });
    this.props.changeSelection(value);
  },

  render() {
    const { disabled, stayOpen, value } = this.state;
    const options = this.props.input;
    return (
      <div className="section">
        <Select
          closeOnSelect={stayOpen}
          disabled={disabled}
          multi
          onChange={this.handleSelectChange}
          options={options}
          placeholder="Drug display options"
          removeSelected={this.state.removeSelected}
          rtl={this.state.rtl}
          simpleValue
          value={value}
        />
      </div>
    );
  }
});

export default App;
