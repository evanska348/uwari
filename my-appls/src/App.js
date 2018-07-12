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
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

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
      selected97phos: [],
      epistasis: [],
      poly: [],
      term: [],
      phos: [],
      drugs: [],
      submitClicked: false,
      empty: false,
      selecteddrugs: []
    }
  }

  //NA found clinically but not phenotyped
  //lobucavir (LBV) 
  //adefovir (ADV)
  //valganciclovir (valGCV)
  //V781I 110397!!
  //M393R flag
  //M393K flag
  //L501F
  //Y(I)722V
  //H729Y
  //Y751H
  //V787I

  //R369G
  //R369S

  //Del591–594 3-10 range
  //A594P
  //G598S commented about clinical
  //C603R	3.6–8.3
  //M460L
  //A590T possibly clinical
  //del590 to 600 11158760 no fold ratio just ec50
  //del590 to 603 - ratio not there - jcv
  //A591D not in any of the papers
  //C592F can't open the reference from 72
  //L595T can't open 9207351
  //N597I can't open 9697738
  //del597 to 603 no data in only reference https://academic.oup.com/view-large/figure/89851975/186-6-760-tab004.jpeg



  componentWillMount() {
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
    var epistasis = []
    db
      .collection('epistaticvariants')
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            var object = doc.data()
            epistasis.push(object)
            this.setState({ epistasis: epistasis });
          });
      });
  }

  componentDidMount() {
    var ul54polymerasevariants = []
    db
      .collection('ul54polymerasevariance')
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            var object = doc.data().Variant
            ul54polymerasevariants.push({ label: object, value: object })
            this.setState({ poly: ul54polymerasevariants })
          });
      });

    var UL56terminase = []
    db
      .collection('ul56terminasevariants')
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            var object = doc.data().Variant
            UL56terminase.push({ label: object, value: object })
            this.setState({ term: UL56terminase })
          });
      });

    var UL97phosphotransferase = []
    db
      .collection('ul97phosphotransferasevariants')
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            var object = doc.data().Variant
            UL97phosphotransferase.push({ label: object, value: object })
            this.setState({ phos: UL97phosphotransferase })
          });
      });
  }

  onChangeSelectionDrug(value) {
    let drugsarr = value.split(',')
    this.setState({
      selecteddrugs: drugsarr
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
        let docRef = db.collection("ul56terminasevariants").doc(termstate[i]);
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
    var data = [];
    if (value !== '') {
      var phosstate = value.split(',');
      for (let i = 0; i < phosstate.length; i++) {
        let docRef = db.collection("ul97phosphotransferasevariants").doc(phosstate[i]);
        docRef.get().then(function (doc) {
          if (doc.exists) {
            data.push(doc.data());
          }
        }).catch(function (error) {
          console.log("Error getting document:", error);
        });
      }
    }
    this.setState({ selected97phos: data })
  }
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
          selected56term: [],
          selected97phos: []
        })
      }
      this.setState({ submitClicked: !this.state.submitClicked })
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
                <Results selecteddrugs={this.state.selecteddrugs} epistasis={this.state.epistasis} selected97phos={this.state.selected97phos} selected54poly={this.state.selected54poly} selected56term={this.state.selected56term} isClicked={this.state.submitClicked}></Results>
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
              <MultiVarianceSelectField changeSelection={this.onChangeSelection97phos.bind(this)} input={this.state.phos}></MultiVarianceSelectField>
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
      selected97phos: this.props.selected97phos,
      selecteddrugs: this.props.selecteddrugs,
      selectedepistasis: [],
      epistasis: this.props.epistasis,
      allvars: [],
      polyvarname: [],
      polyvarreference: [],
      termvarname: [],
      termvarreference: []
    };
  }

  componentWillMount() {
    var selected54poly = this.state.selected54poly;
    var selected56term = this.state.selected56term;
    var selected97phos = this.state.selected97phos;
    var variants = this.state.selected54poly.concat(this.state.selected56term);
    variants = variants.concat(this.state.selected97phos)
    for (let i = 0; i < this.state.epistasis.length; i++) {
      let total = this.state.epistasis[i].Variant.length
      let match = [];
      for (let j = 0; j < this.state.epistasis[i].Variant.length; j++) {
        for (let k = 0; k < variants.length; k++) {
          if (variants[k].Variant === this.state.epistasis[i].Variant[j]) {
            match.push(variants[k].Variant);
          }
        }
      }
      if (match.length === total) {
        for (let i = 0; i < match.length; i++) {
          variants = variants.filter(function (variant) {
            return variant.Variant !== match[i];
          });
          selected54poly = selected54poly.filter(function (variant) {
            return variant.Variant !== match[i];
          });
          selected56term = selected56term.filter(function (variant) {
            return variant.Variant !== match[i];
          });
          console.log(selected56term)
          selected97phos = selected97phos.filter(function (variant) {
            return variant.Variant !== match[i];
          });
        }
        variants.push(this.state.epistasis[i])
        let curepi = this.state.selectedepistasis;
        curepi.push(this.state.epistasis[i]);
        this.setState({ selectedepistasis: curepi });
        this.setState({ selected56term: selected56term })
        this.setState({ selected97phos: selected97phos })
        this.setState({ selected54poly: selected54poly })
      }
    }
    this.setState({ selected54poly: selected54poly });
    this.setState({ allvars: variants });
    console.log(variants)
    var drugs = this.state.selecteddrugs;
    var folddata = [];
    for (let i = 0; i < drugs.length; i++) {
      var drugobj = {};
      let drug = drugs[i]
      drugs[i] = drug + "fold";
      drugobj["drug"] = drug + "fold";
      drugobj["fold"] = 0;
      folddata.push(drugobj)
    }
    for (let i = 0; i < variants.length; i++) {
      for (let j = 0; j < folddata.length; j++) {
        if (folddata[j].drug in variants[i]) {
          folddata[j].fold = folddata[j].fold + Number(variants[i][folddata[j].drug]);
        }
      }
    }
    this.setState({ foldobj: folddata })
  }

  render() {
    return (
      <div>
        <h5>Drug Resistance Profile</h5>
        <p>Fold change by drug</p>
        <div className="drugProfile">
          {
            this.state.foldobj.map((drug) =>
              <FoldCard key={drug.drug} obj={drug} drug={drug.drug} fold={drug.fold} />)
          }
        </div>
        {/* {this.props.selected54poly && */}
        <div>
          <h4>UL54 Polymerase</h4>
          <BootstrapTable data={this.state.selected54poly} exportCSV>
            <TableHeaderColumn width='170' dataField='Variant' isKey >Variant</TableHeaderColumn>
            <TableHeaderColumn width='150' dataField='ganciclovirfold'>Ganciclovir-GCV (fold ratio)</TableHeaderColumn>
            <TableHeaderColumn width='150' dataField='foscarnetfold'>Foscarnet-FOS/PFA (fold ratio)</TableHeaderColumn>
            <TableHeaderColumn width='150' dataField='cidofovirfold'>Cidofovir-CDV (fold ratio)</TableHeaderColumn>
            <TableHeaderColumn width='150' dataField='lobucavirfold'>Lobucavir-LBV (fold ratio)</TableHeaderColumn>
            <TableHeaderColumn width='150' dataField='adefovirfold'>Adefovir-ADV (fold ratio)</TableHeaderColumn>
            <TableHeaderColumn width='150' dataField='Reference' dataFormat={activeFormatter}>Reference (PMID)</TableHeaderColumn>
            <TableHeaderColumn width='150' dataField='Comments'>Comments</TableHeaderColumn>
          </BootstrapTable>
        </div>
        {/* } */}
        <h4>UL56 Terminase</h4>
        <BootstrapTable data={this.state.selected56term} exportCSV>
          <TableHeaderColumn width='170' dataField='Variant' isKey >Variant</TableHeaderColumn>
          <TableHeaderColumn width='150' dataField='letermovirfold'> Letermovir (fold ratio)</TableHeaderColumn>
          <TableHeaderColumn width='150' dataField='tomeglovirfold'> Tomeglovir (fold ratio)</TableHeaderColumn>
          <TableHeaderColumn width='150' dataField='GW275175Xfold'> GW275175X (fold ratio)</TableHeaderColumn>
          <TableHeaderColumn width='150' dataField='Reference'>Reference</TableHeaderColumn>
          <TableHeaderColumn width='150' dataField='Comments'>Comments</TableHeaderColumn>
        </BootstrapTable>
        <h4>UL97 Phosphotransferase</h4>
        <BootstrapTable data={this.state.selected97phos} exportCSV>
          <TableHeaderColumn width='170' dataField='Variant' isKey>Variant</TableHeaderColumn>
          <TableHeaderColumn width='150' dataField='ganciclovirfold'> Ganciclovir (fold ratio)</TableHeaderColumn>
          <TableHeaderColumn width='150' dataField='cidofovirfold'> Cidofovir (fold ratio)</TableHeaderColumn>
          <TableHeaderColumn width='150' dataField='Reference'>Reference</TableHeaderColumn>
          <TableHeaderColumn width='150' dataField='Comments'>Comments</TableHeaderColumn>
        </BootstrapTable>
        <h4>Epistatic Variants</h4>
        <BootstrapTable data={this.state.selectedepistasis} exportCSV>
          <TableHeaderColumn width='170' dataField='Variant' isKey >Variant</TableHeaderColumn>
          <TableHeaderColumn width='150' dataField='letermovirfold'> Letermovir (fold ratio)</TableHeaderColumn>
          <TableHeaderColumn width='150' dataField='Comments'>Comments</TableHeaderColumn>
        </BootstrapTable>
      </div>
    )
  }
}

class ActiveFormatter extends React.Component {
  render() {
    let link = "https://www.ncbi.nlm.nih.gov/pubmed/" + this.props.enumObject[0]
    return (
      //    this.props.enumObject.forEach((link) => {
      <a href={link}>{this.props.enumObject[0]}</a>
      //   })
    );
  }
}

function activeFormatter(cell, row, enumObject, index) {
  console.log(`The row index: ${index}`);
  //  console.log(enumObject)
  console.log(cell)
  // for (let i = 0; i < cell.length; i++) {
  //   cell[i] = "https://www.ncbi.nlm.nih.gov/pubmed/" + cell[i];
  // }
  return (
    <ActiveFormatter enumObject={cell} />
  );
}


class FoldCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      drug: this.props.drug,
      fold: this.props.fold
    }
  }
  render() {
    return (
      <div>
        {/* <table>
          <tr>
            <th>{this.state.drug.replace("fold", "")}</th>
            <td>{this.state.fold}</td>
          </tr>
        </table> */}
        <table className="table">
          <tbody>
            <tr>
              <th>{this.state.drug.replace("fold", "")}</th>
              <td>{this.state.fold.toFixed(2)}</td>
            </tr>
            {/* <tr>
              <td>{this.state.fold}</td>
            </tr> */}
          </tbody>
        </table>
        {/* <h6>{this.state.drug.replace("fold", "")} = {this.state.fold}</h6> */}
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
