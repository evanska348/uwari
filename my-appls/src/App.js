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
// import 'firebase/database';
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
          <h1 className="display-4">Cytomegalovirus Drug Resistance Database</h1>
          <Router>
            <div className="nav">
              <NavLink activeClassName="active" activeStyle={{ color: 'grey', borderBottom: '1px solid grey' }} style={{ color: 'black' }} to="/WelcomePage">
                <div className="pageslabel">Welcome</div>
              </NavLink>
              <NavLink activeClassName="active" activeStyle={{ color: 'grey', borderBottom: '1px solid grey' }} style={{ color: 'black' }} to="/CMVdb">
                <div className="pageslabel">CMVdb Program</div>
              </NavLink>
              {this.state.user === '' ?
                <div>
                  <NavLink activeClassName="active" activeStyle={{ color: 'black', borderBottom: '1px solid grey' }} style={{ color: 'black' }} to="/login">
                    <div className="pageslabel">Login</div>
                  </NavLink>
                </div>
                :
                <div>
                  <NavLink activeClassName="active" user={this.state.user} activeStyle={{ color: 'grey', borderBottom: '1px solid grey' }} style={{ color: 'black' }} to="/AddVariants">
                    <div className="pageslabel">Add Variants</div>
                  </NavLink>
                  <button type='button' className="btn btn-danger btn-sm" onClick={this.handleLogout}>Logout</button>
                </div>
              }
              <Route path="/WelcomePage" component={WelcomePage} />
              <Route path="/CMVdb" component={CMVdb} />
              <Route path="/AddVariants" component={AddVariants} />
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

class CMVdb extends Component {

  constructor() {
    super();
    this.state = {
      selected54poly: [],
      selected56term: [],
      selected96phos: [],
      poly: [],
      term: [],
      phos: [],
      drugs: [],
      submitClicked: false,
      empty: false,
      selecteddrugs: []
    }
  }
  //lobucavir (LBV) 
  //adefovir (ADV)
  //valganciclovir (valGCV)
  //f412s
  //D515E
  //C539R

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
    var ul54polymerasevariants = []
    db
      .collection('ul54polymerasevariance')
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            var object = doc.data().Variance
            ul54polymerasevariants.push({ label: object, value: object })
            this.setState({ poly: ul54polymerasevariants })
          });
      });

    var UL56terminase = []
    db
      .collection('ul54terminasevariance')
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            var object = doc.data().Variance
            UL56terminase.push({ label: object, value: object })
            this.setState({ term: UL56terminase })
          });
      });

    var UL97phosphotransferase = []
    db
      .collection('ul97phosphotransferasevariance')
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            var object = doc.data().Variance
            UL97phosphotransferase.push({ label: object, value: object })
            this.setState({ phos: UL97phosphotransferase })
          });
      });
  }

  onChangeSelectionDrug(value) {
    this.setState({
      selecteddrugs: value.split(',')
    });
  }

  onChangeSelection54poly(value) {
    var data = [];
    if (value !== '') {
      var polystate = value.split(',');
      for (let i = 0; i < polystate.length; i++) {
        let docRef = db.collection("ul54polymerasevariance").doc(polystate[i]);
        docRef.get().then(function (doc) {
          if (doc.exists) {
            data.push(doc.data());
          }
        }).catch(function (error) {
          console.log("Error getting document:", error);
        });
      }
    }
    this.setState({ selected54poly: data })
  }

  onChangeSelection56term(value) {
    var data = [];
    if (value !== '') {
      var termstate = value.split(',');
      for (let i = 0; i < termstate.length; i++) {
        let docRef = db.collection("ul54terminasevariance").doc(termstate[i]);
        docRef.get().then(function (doc) {
          if (doc.exists) {
            data.push(doc.data());
          }
        }).catch(function (error) {
          console.log("Error getting document:", error);
        });
      }
    }
    this.setState({ selected56term: data })
    //  console.log(value)
  }



  onChangeSelection97phos(value) {
    this.setState({
      selected96phos: value
    });
    //  console.log(value)
  }
  // setDataState(data) {
  //   var inf = this.state.data;
  //   inf.push(data);
  //   this.setState({ data: inf });
  // }

  handleSubmit() {
    if (this.state.selected54poly === [] &&
      this.state.selected56term === [] &&
      this.state.selected96phos === []) {
      this.setState({ empty: true });
      console.log("YOOOO")
    } else {
      this.setState({ empty: false });
      if (this.state.submitClicked === true) {
        this.setState({
          selecteddrugs: [],
          selected54poly: [],
          selected56term: []
        })
      }
      this.setState({ submitClicked: !this.state.submitClicked })
      // this.setState(prevState => ({
      //   submitClicked: !prevState.submitClicked
      // }));
    }
  }

  render() {

    return (
      <div className="container" >
        {
          this.state.submitClicked ?
            <div>
              <div>
                <h2>Results:</h2>
                <Results selecteddrugs={this.state.selecteddrugs} selected54poly={this.state.selected54poly} selected56term={this.state.selected56term} isClicked={this.state.submitClicked}></Results>
                <button onClick={this.handleSubmit.bind(this)} className="btn btn-primary" type="submit">Reset</button>
              </div>
            </div>
            :
            <div>
              <h3 className='pageheader'>Genotypic Resistance Interpretation Algorithm</h3>
              <p className='druglabel'>Drug Selection</p>
              <MultiDrugSelectField changeSelection={this.onChangeSelectionDrug.bind(this)} input={this.state.drugs}></MultiDrugSelectField>
              <h3 className='druglabel'>Mutation Selection</h3>
              <h4>UL54 - DNA Polymerase</h4>
              <MultiVarianceSelectField changeSelection={this.onChangeSelection54poly.bind(this)} input={this.state.poly}></MultiVarianceSelectField>
              <h4>UL56 - Terminase</h4>
              <MultiVarianceSelectField changeSelection={this.onChangeSelection56term.bind(this)} input={this.state.term}></MultiVarianceSelectField>
              <h4>UL97 - Phosphotransferase</h4>
              <MultiVarianceSelectField changeSelection={this.onChangeSelection97phos.bind(this)} input={UL97Phosphotransferase}></MultiVarianceSelectField>
              <button onClick={this.handleSubmit.bind(this)} className="btn btn-primary" type="submit">Analyze</button>
              {this.state.empty ?
                <div><p>please enter a variant</p></div>
                :
                <div></div>
              }
            </div>
        }
      </div>
    );
  }
}

class Results extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected54poly: this.props.selected54poly,
      selected56term: this.props.selected56term,
      selecteddrugs: this.props.selecteddrugs,
      allvars: [],
      polyvarname: [],
      polyvarreference: [],
      termvarname: [],
      termvarreference: []
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   this.setState({ data: nextProps.data });
  //   console.log(nextProps.data)
  // }

  componentDidMount() {
  }

  componentWillMount() {

    var polyvarname = []
    var polyvarreference = []
    for (let i = 0; i < this.state.selected54poly.length; i++) {
      polyvarname.push(this.state.selected54poly[i].Variance)
      polyvarreference.push(this.state.selected54poly[i].Reference)
    }
    this.setState({ polyvarname: polyvarname })
    this.setState({ polyvarreference: polyvarreference })
    var termvarname = []
    var termvarreference = []
    for (let i = 0; i < this.state.selected56term.length; i++) {
      termvarname.push(this.state.selected56term[i].Variance)
      termvarreference.push(this.state.selected56term[i].Reference)
    }
    console.log(this.state.selected54poly)
    this.setState({ termvarname: termvarname })
    this.setState({ termvarreference: termvarreference })

    var variants = this.state.selected54poly.concat(this.state.selected56term);
    this.setState({ allvars: variants });
    var drugobj = {};
    var drugs = this.state.selecteddrugs;
    for (let i = 0; i < drugs.length; i++) {
      let drug = drugs[i]
      drug = drug + "fold";
      drugobj[drug] = 0;
    }
    drugs = Object.keys(drugobj)
    for (let i = 0; i < variants.length; i++) {
      for (let j = 0; j < drugs.length; j++) {
        if (drugs[j] in variants[i]) {
          drugobj[drugs[j]] = drugobj[drugs[j]] + variants[i][drugs[j]];
        }
      }
    }
    this.setState({ foldobj: drugobj })
  }

  render() {
    // data = JSON.stringify(data
    // console.log(typeof this.state.data[0].Variance)
    //console.log(this.state.varname)
    return (
      <div>
        <h5>Polymerase</h5>
        <p>{this.state.polyvarname}</p>
        <p>{this.state.polyvarreference}</p>
        <h5>Terminase</h5>
        <p>{this.state.termvarname}</p>
        <p>{this.state.termvarreference}</p>
        <h5>Drug Resistance Profile</h5>
        <p>{JSON.stringify(this.state.foldobj)}</p>
        {
          this.state.allvars.map((variant) =>
            <VariantCard key={variant.Variance} obj={variant} variant={variant.Variance} drugs={this.state.selecteddrugs} comments={variant.Comments} reference={variant.Reference} />)
        }
      </div>

    )
  }
}

class VariantCard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isHidden: true,
      drugs: []
    }
  }

  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }

  componentDidMount() {
    let drugs = []
    for (let i = 0; i < this.props.drugs.length; i++) {
      let curdrug = this.props.drugs[i] + "fold"
      let curvar = this.props.obj
      if (curdrug in curvar) {
        let cur = this.props.drugs[i] + "fold";
        let drug = {};
        drug[this.props.drugs[i]] = this.props.obj[cur];
        drugs.push(drug);
      }
    }
    this.setState({ drugs: drugs })
  }

  render() {
    console.log(this.state.drugs)
    var reference = this.props.reference.toString()
    return (
      <div className="card">
        <h6 onClick={this.toggleHidden.bind(this)} className="card-title">{this.props.variant}</h6>
        {!this.state.isHidden &&
          <div className="card-body">
            <h7>Experimental Fold</h7>
            {
              this.state.drugs.map((drug, i) =>
                <p key={i}> {JSON.stringify(drug)} </p>)

            }
            <hr />
            <p className="card-text">Reference: {reference}</p>
            <hr />
            <p className="card-text">Comments: {this.props.comments}</p>
          </div>
        }
      </div>
    )
  }
}

class AddVariants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
    };
  }

  componentWillMount() {
    this.setState({ user: this.props.user });
  }

  render() {
    console.log(this.state.user)
    return (
      <div className="container">
        <h3 className='pageheader'>Add Variants to the Database</h3>
        <form>
          <label>
            Variant:
          <input className="form-control" type="text" name="Variant" />
          </label>
          <hr />
          <label>
            Fold:
          <input className="form-control" type="text" name="Fold" />
          </label>
          <hr />
          <label>
            Reference:
          <input className="form-control" type="text" name="Reference" />
          </label>
          <hr />
          <label>
            Comments:
          <input className="form-control" type="text" name="Comments" />
          </label>
          <hr />
          <input className="btn btn-primary" type="submit" value="Submit" />
        </form>
      </div>
    )
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
        <h3 className='pageheader'>Log in to Contribute</h3>
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

var MultiDrugSelectField = createClass({
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
          placeholder="Choose variants"
          removeSelected={this.state.removeSelected}
          rtl={this.state.rtl}
          simpleValue
          value={value}
        />
      </div>
    );
  }
});


const STATES = [
  { label: 'UL54-Polymerase', value: 'ul54polymerase' },
  { label: 'UL56-Terminase', value: 'ul56terminase' },
  { label: 'UL97-Phosphotransferase', value: 'ul97phosphotransferase' },
];

var StatesField = createClass({
  displayName: 'StatesField',
  propTypes: {
    label: PropTypes.string,
    searchable: PropTypes.bool,
  },
  getDefaultProps() {
    return {
      label: 'States:',
      searchable: true,
    };
  },
  getInitialState() {
    return {
      country: 'AU',
      disabled: false,
      searchable: this.props.searchable,
      selectValue: 'new-south-wales',
      clearable: true,
      rtl: false,
    };
  },
  clearValue(e) {
    this.select.setInputValue('');
  },
  switchCountry(e) {
    var newCountry = e.target.value;
    this.setState({
      country: newCountry,
      selectValue: null,
    });
  },
  updateValue(newValue) {
    this.setState({
      selectValue: newValue,
    });
  },
  focusStateSelect() {
    this.select.focus();
  },
  toggleCheckbox(e) {
    let newState = {};
    newState[e.target.name] = e.target.checked;
    this.setState(newState);
  },
  render() {
    var options = STATES[this.state.country];
    return (
      <div className="section">
        <h3 className="section-heading">{this.props.label} <a href="https://github.com/JedWatson/react-select/tree/master/examples/src/components/States.js">(Source)</a></h3>
        <Select
          id="state-select"
          ref={(ref) => { this.select = ref; }}
          onBlurResetsInput={false}
          onSelectResetsInput={false}
          autoFocus
          options={options}
          simpleValue
          clearable={this.state.clearable}
          name="selected-state"
          disabled={this.state.disabled}
          value={this.state.selectValue}
          onChange={this.updateValue}
          rtl={this.state.rtl}
          searchable={this.state.searchable}
        />
        <button style={{ marginTop: '15px' }} type="button" onClick={this.focusStateSelect}>Focus Select</button>
        <button style={{ marginTop: '15px' }} type="button" onClick={this.clearValue}>Clear Value</button>

        <div className="checkbox-list">

          <label className="checkbox">
            <input type="checkbox" className="checkbox-control" name="searchable" checked={this.state.searchable} onChange={this.toggleCheckbox} />
            <span className="checkbox-label">Searchable</span>
          </label>
          <label className="checkbox">
            <input type="checkbox" className="checkbox-control" name="disabled" checked={this.state.disabled} onChange={this.toggleCheckbox} />
            <span className="checkbox-label">Disabled</span>
          </label>
          <label className="checkbox">
            <input type="checkbox" className="checkbox-control" name="clearable" checked={this.state.clearable} onChange={this.toggleCheckbox} />
            <span className="checkbox-label">Clearable</span>
          </label>
          <label className="checkbox">
            <input type="checkbox" className="checkbox-control" name="rtl" checked={this.state.rtl} onChange={this.toggleCheckbox} />
            <span className="checkbox-label">rtl</span>
          </label>
        </div>
        <div className="checkbox-list">
          <label className="checkbox">
            <input type="radio" className="checkbox-control" checked={this.state.country === 'AU'} value="AU" onChange={this.switchCountry} />
            <span className="checkbox-label">Australia</span>
          </label>
          <label className="checkbox">
            <input type="radio" className="checkbox-control" checked={this.state.country === 'US'} value="US" onChange={this.switchCountry} />
            <span className="checkbox-label">United States</span>
          </label>
        </div>
      </div>
    );
  }
});

export default App;
