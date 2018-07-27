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
import { NavbarToggler, Collapse, Navbar, NavbarBrand, NavItem, NavbarNav, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact'
import { Col, Container, Row, Footer } from 'mdbreact';
import 'firebase/firestore';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import ScrollableAnchor from 'react-scrollable-anchor'
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

//ssh evanzhao@vergil.u.washington.edu

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
      user: '',
      collapse: false,
      isWideEnough: false,
      dropdownOpen: false
    };
    this.onClick = this.onClick.bind(this);
    this.toggle = this.toggle.bind(this);
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

  onClick() {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    return (
      <div className="parent" >
        <div id="content">
          <header>
            {/* <h1 className="display-4">Cytomegalovirus Drug Resistance Database</h1> */}
            <Navbar color="teal" dark expand="md" scrolling>
              <NavbarBrand href="/WelcomePage">
                <strong>Cytomegalovirus Drug Resistance Database</strong>
              </NavbarBrand>
              {!this.state.isWideEnough && <NavbarToggler onClick={this.onClick} />}
              <Collapse navbar>
                <NavbarNav left>
                  <NavItem>
                    <NavLink className="nav-link waves-effect waves-light" aria-haspopup="true" aria-expanded="false" to="/WelcomePage">Home</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className="nav-link waves-effect waves-light" to="/CMVdb">CMVdb</NavLink>
                  </NavItem>
                </NavbarNav>
                <NavbarNav right>
                  <NavItem>
                    <Dropdown toggle={this.toggle}>
                      <DropdownToggle nav caret><i className="fa fa-user" aria-hidden="true"></i></DropdownToggle>
                      <DropdownMenu right>
                        {this.state.user === '' ?
                          <div>
                            <DropdownItem>
                              {/* <NavLink className="nav-link waves-effect waves-light" to="#" disabled>Login to add Variants</NavLink> */}
                            </DropdownItem>
                            <DropdownItem>
                              <NavLink className="nav-link waves-effect waves-light" to="/login">Login</NavLink>
                            </DropdownItem>
                          </div>
                          :
                          <div>
                            <DropdownItem>
                              <NavLink className="nav-link waves-effect waves-light" to="/AddVariants">Add Variants</NavLink>
                            </DropdownItem>
                            <DropdownItem>
                              <NavLink className="logoutButton" onClick={this.handleLogout} to="/login">Logout</NavLink>
                            </DropdownItem>
                            {/* <button type='button' className="btn btn-danger btn-sm" onClick={this.handleLogout}>Logout</button> */}
                          </div>
                        }
                      </DropdownMenu>
                    </Dropdown>
                  </NavItem>
                </NavbarNav>
              </Collapse>
            </Navbar>
            <Route path="/WelcomePage" component={WelcomePage} />
            <Route path="/CMVdb" component={CMVdb} />
            <Route path="/AddVariants" component={AddVariants} />
            <Route path="/login" render={(props) => (
              <Login {...props} handlerFromParent={this.handleUser} />
            )} />
          </header>
        </div>
        <Footer id="footer" color="teal" className="font-small pt-4 mt-4" fixed="bottom">
          <Container className="text-left">
            <Row>
              <Col sm="6">
                <h5 className="title">Footer</h5>
                <p>Stuff in footer.</p>
              </Col>
              <Col sm="6">
                <h5 className="title">Links</h5>
                <ul>
                  <li className="list-unstyled"><a href="https://www.viracor-eurofins.com/media/1622/cmv-avr-mutations-references_1217_viracor-eurofins.pdf">Viracor</a></li>
                  <li className="list-unstyled"><a href="https://depts.washington.edu/uwviro/">UW Virology</a></li>
                </ul>
              </Col>
            </Row>
          </Container>
          <div className="footer-copyright text-center">
            <Container fluid>
              {(new Date().getFullYear())} <a href="#"> UW </a>
            </Container>
          </div>
        </Footer>
      </div >

    );
  }
}


class WelcomePage extends Component {
  render() {
    return (
      <div>
        <div className="welcomeContainer darken-pseudo darken-with-text">
          <div className="welcomeCover">
            <h3>
              <strong>Welcome!</strong>
            </h3>
            <strong>
              <p>This page looks for CMV drug resistance</p>
            </strong>
            <a className="ct-btn-scroll ct-js-btn-scroll" href="#section2"><img alt="Arrow Down Icon" src="https://www.solodev.com/assets/anchor/arrow-down.png" /></a>
          </div>
        </div>
        <div className="welcomeContent">
          <ScrollableAnchor id={'section2'}>
            <h3> About </h3>
          </ScrollableAnchor>
          <p>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          </p>
        </div>
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
  // M393R flag
  // M393K flag
  // L501F
  // Y(I)722V
  // H729Y
  // Y751H
  // V787I

  // R369G
  // R369S

  // Del591–594 3-10 range
  // A594P
  // G598S commented about clinical
  // C603R	3.6–8.3
  // M460L
  // A590T possibly clinical
  // del590 to 600 11158760 no fold ratio just ec50
  // del590 to 603 - ratio not there - jcv
  // A591D not in any of the papers
  // C592F can't open the reference from 72
  // L595T can't open 9207351
  // N597I can't open 9697738
  // del597 to 603 no data in the only reference https://academic.oup.com/view-large/figure/89851975/186-6-760-tab004.jpeg



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
                <h2 className="pageheader">Results:</h2>
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
          <table className="table">
            <thead>
              <tr>
                <th align="center" valign="top" rowSpan="1" colSpan="1">Drug</th>
                <th align="center" valign="top" rowSpan="1" colSpan="1">Fold Ratio</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.foldobj.map((drug) =>
                  <FoldCard key={drug.drug} obj={drug} drug={drug.drug} fold={drug.fold} />)
              }
            </tbody>
          </table>
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
          <TableHeaderColumn width='150' dataField='Reference' dataFormat={activeFormatter}>Reference</TableHeaderColumn>
          <TableHeaderColumn width='150' dataField='Comments'>Comments</TableHeaderColumn>
        </BootstrapTable>
        <h4>UL97 Phosphotransferase</h4>
        <BootstrapTable data={this.state.selected97phos} exportCSV>
          <TableHeaderColumn width='170' dataField='Variant' isKey>Variant</TableHeaderColumn>
          <TableHeaderColumn width='150' dataField='ganciclovirfold'> Ganciclovir (fold ratio)</TableHeaderColumn>
          <TableHeaderColumn width='150' dataField='cidofovirfold'> Cidofovir (fold ratio)</TableHeaderColumn>
          <TableHeaderColumn width='150' dataField='Reference' dataFormat={activeFormatter}>Reference</TableHeaderColumn>
          <TableHeaderColumn width='150' dataField='Comments'>Comments</TableHeaderColumn>
        </BootstrapTable>
        <h4>Epistatic Variants</h4>
        <BootstrapTable data={this.state.selectedepistasis} exportCSV>
          <TableHeaderColumn width='170' dataField='Variant' isKey >Variant</TableHeaderColumn>
          <TableHeaderColumn width='150' dataField='letermovirfold'> Letermovir (fold ratio)</TableHeaderColumn>
          <TableHeaderColumn width='150' dataField='Reference'>Reference</TableHeaderColumn>
          <TableHeaderColumn width='150' dataField='Comments' dataFormat={activeFormatter}>Comments</TableHeaderColumn>
        </BootstrapTable>
      </div>
    )
  }
}

class ActiveFormatter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authors: [],
      year: '',
      publication: '',
    }
  }
  componentWillMount() {
    let url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=" + this.props.enumObject[0] + "&retmode=json&tool=my_tool&email=my_email@example.com";
    fetch(url)
      .then((responseText) => responseText.json())
      .then((response) => {
        let results = response.result[this.props.enumObject[0]]
        let authors = results.authors
        let pubdate = results.pubdate
        let source = results.source
        this.setState({ authors: authors })
        this.setState({ year: pubdate })
        this.setState({ publication: source })
      })
  }

  render() {
    let link = "https://www.ncbi.nlm.nih.gov/pubmed/" + this.props.enumObject[0]
    return (
      <FormattedCitation authors={this.state.authors} year={this.state.year.substr(0, this.state.year.indexOf(" "))} publication={this.state.publication} link={link}></FormattedCitation>
      // <a href={link}>{this.state.lastnames} {this.state.year} {this.state.publication}</a>
    );
  }
}

class FormattedCitation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authors: this.props.authors,
      year: this.props.year,
      lastnames: ''
    }
  }

  render() {
    console.log(this.props.authors)
    let authors = this.props.authors.slice(0, 3)
    var lastnames = '';
    if (authors.length !== 0) {
      lastnames = authors[0].name.substr(0, authors[0].name.indexOf(" "));
      for (let i = 1; i < authors.length; i++) {
        lastnames += ", " + authors[i].name.substr(0, authors[i].name.indexOf(" "));
      }
    }
    if (this.props.authors.length > 3) {
      lastnames += ", et al."
    }
    return (
      <a href={this.props.link} > {lastnames}, {this.props.publication}, {this.props.year}</a>
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
    var fold = this.props.fold.toFixed(2)
    if (fold == 0) {
      fold = "No data"
    }
    return (
      < tr >
        <th align="center" valign="top" rowSpan="1" colSpan="1">{this.state.drug.replace("fold", "")}</th>
        <td align="left" valign="top" rowSpan="1" colSpan="1">{fold}</td>
      </tr >
    )
  }
}

class AddVariants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      gene: '',
      variant: '',
      fold: '',
      reference: '',
      comments: '',
      success: '',
      failure: '',
      selecteddrugs: [],
      drugs: []
    };
  }

  onChangeSelectionGene(value) {
    this.setState({
      gene: value
    });
  }

  onChangeSelectionDrug(value) {
    let drugsarr = value.split(',')
    this.setState({
      selecteddrugs: drugsarr
    });
  }

  handleVariant() {
    let data = {}
    for (let i = 0; i < this.state.selecteddrugs.length; i++) {
      let drug = this.state.selecteddrugs[i] + "fold";
      let _state = this.state.selecteddrugs[i]
      let fold = Number(this.state[_state])
      console.log(fold)
      data[drug] = fold
    }
    data["Variant"] = this.state.variant;
    data["Reference"] = this.state.reference;
    data["Comments"] = this.state.comments;
    db.collection(this.state.gene).doc(this.state.variant).set(data)
      .then(function () {
        this.setState({ success: "Document successfully written!" });
      })
      .catch(function () {
        console.log("Error writing document");
      });

  }

  handleChange(event) {
    let field = event.target.name; //which input
    let value = event.target.value; //what value
    let changes = {}; //object to hold changes
    changes[field] = value; //change this field
    this.setState(changes); //update state
  }

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
  }


  render() {
    console.log(this.state.adefovir)
    return (
      <div className="container">
        <h3 className='pageheader'>Add Variants to the Database</h3>
        <form>

          <p>Gene:</p>
          <GeneSelectField changeSelection={this.onChangeSelectionGene.bind(this)}></GeneSelectField>
          <hr />
          <label>
            Variant:
            <input type="variant" className="form-control"
              name="variant"
              value={this.state.variant}
              onChange={(event) => { this.handleChange(event) }}
            />
          </label>
          <hr />
          <MultiDrugSelectField changeSelection={this.onChangeSelectionDrug.bind(this)} input={this.state.drugs}></MultiDrugSelectField>
          {this.state.selecteddrugs.map(element => {
            return <div key={element}>
              <hr />
              <p>{element} fold:</p>
              <input type={element} className="form-control"
                name={element}
                value={this.state.element}
                onChange={(event) => { this.handleChange(event) }}
              />
            </div>
          })}
          <hr />
          <label>
            Reference (PMID):
            <input type="reference" className="form-control"
              name="reference"
              value={this.state.reference}
              onChange={(event) => { this.handleChange(event) }}
            />
          </label>
          <hr />
          <label>
            Comments:
          <input type="comments" className="form-control"
              name="comments"
              value={this.state.comments}
              onChange={(event) => { this.handleChange(event) }}
            />
          </label>
          <hr />
          <div className="form-group">
            <button type='button' className="btn btn-primary mr-2" onClick={() => this.handleVariant()}>
              Submit Variant
                 </button>
          </div>
          {this.state.failure &&
            <p className="alert alert-danger">{this.state.errorMessage}</p>
          }

          {this.state.success &&
            <div className="alert alert-success" id='loggedin'><h5>Logged in as {this.state.user.email}</h5></div>
          }
        </form>
      </div >
    )
  }
}

class FoldInput extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <p>{this.props.drug}</p>
    )
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      username: '',
      code: ''
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
          username: '',
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
    if (this.state.code === 'UW206') {
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
    } else {
      this.setState({ errorMessage: "Incorrect sign up code" })
    }
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

        <div className="form-group">
          <label>Sign Up Code (Ignore if signing in): </label>
          <input type="code" className="form-control"
            name="code"
            value={this.state.code}
            onChange={(event) => { this.handleChange(event) }}
          />
        </div>

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

var GeneSelectField = createClass({
  displayName: 'SingleSelectField',
  propTypes: {
    label: PropTypes.string,
  },
  getInitialState() {
    return {
      removeSelected: true,
      disabled: false,
      stayOpen: false,
      multi: false,
      value: undefined,
      rtl: false,
    };
  },
  handleSelectChange(value) {
    this.setState({ value });
    this.props.changeSelection(value);
  },

  render() {
    const { disabled, stayOpen, value } = this.state;
    const options = [
      { value: 'ul54polymerasevariance', label: 'UL54 Polymerase' },
      { value: 'ul56terminasevariants', label: 'UL56 Terminase' },
      { value: 'ul97phosphotrasferasevariants', label: 'UL97 Phosphotransferase' }
    ]
    return (
      <div className="section">
        <Select
          closeOnSelect={stayOpen}
          disabled={disabled}
          onChange={this.handleSelectChange}
          options={options}
          placeholder="Choose a gene"
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

