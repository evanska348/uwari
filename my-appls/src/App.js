import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Route } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import Select from 'react-select';
import createClass from 'create-react-class';
import { withRouter } from "react-router";
import firebase from 'firebase';
import Modal from 'react-modal';
import 'firebase/auth';
import { NavbarToggler, MDBCollapse, Navbar, NavbarBrand, NavItem, NavbarNav, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact'
import { Col, Container, Row, Footer, Input } from 'mdbreact';
import 'firebase/firestore';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import ScrollableAnchor from 'react-scrollable-anchor'
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import aws_exports from './aws-exports';
import { withAuthenticator, S3Album } from 'aws-amplify-react';
import Amplify, { Analytics, Storage } from 'aws-amplify';
import AWS from 'aws-sdk';
import axios from 'axios';
import Tooltip from "react-simple-tooltip"
import { css } from "styled-components"
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { StickyContainer, Sticky } from 'react-sticky';
import { isUsernamePasswordOpts } from '@aws-amplify/auth/lib/types';
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from 'mdbreact';
import { Redirect, Link } from 'react-router-dom'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import ReactLoading from 'react-loading';
import { truncateSync } from 'fs';

var config = {
  apiKey: "AIzaSyBGflsX38vQ4SVYcsPDXySUmIWZFnbIwao",
  authDomain: "cmvdb-555bc.firebaseapp.com",
  databaseURL: "https://cmvdb-555bc.firebaseio.com",
  projectId: "cmvdb-555bc",
  storageBucket: "cmvdb-555bc.appspot.com",
  messagingSenderId: "869787015915"
};

firebase.initializeApp(config);
const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();
const firestore = firebase.firestore();
const settings = {};
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
      dropdownOpen: false,
      drugs: [],
      collapseID: ''
    };
    this.onClick = this.onClick.bind(this);
    this.toggle = this.toggle.bind(this);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: user })
      } else {
        this.setState({ user: '' })
      }
    });
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
            let object = doc.data()
            // let object = JSON.parse(doc._document.data)
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


  //Handles Logout
  handleLogout() {
    this.setState({
      user: ''
    });
    firebase.auth().signOut()
      .catch((err) => {
        console.log(err)
      })

    // firebase.auth().signOut()
    // .then(() => {
    //   this.setState({
    //     user: null
    //   });
    // })
    // .catch((err) => {
    //   console.log(err)
    // });
  }



  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    console.log("ROUTE CHANGED");
  }

  // static propTypes = {
  //   location: React.PropTypes.object.isRequired
  // }

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

  toggleCollapse = collapseID => () => {
    this.setState(prevState => ({ collapseID: (prevState.collapseID !== collapseID ? collapseID : '') }));
  }

  render() {
    return (
      <div className="parent" >
        <div id="content">
          <header>
            {/* <h1 className="display-4">Cytomegalovirus Drug Resistance Database</h1> */}
            <Navbar color="teal" dark expand="md" scrolling>
              <NavbarBrand href="/WelcomePage">
                <strong>UW Antiviral Resistance Interpretation</strong>
              </NavbarBrand>
              {!this.state.isWideEnough && <NavbarToggler onClick={this.toggleCollapse('navbarCollapse1')} />}
              <MDBCollapse id="navbarCollapse1" isOpen={this.state.collapseID} navbar>
                <NavbarNav left>
                  <NavItem>
                    <NavLink exact className="nav-link waves-effect waves-light" aria-haspopup="true" aria-expanded="false" to="/WelcomePage">Home</NavLink>
                  </NavItem>

                  <NavItem>
                    <Dropdown>
                      <DropdownToggle nav caret>CMVdb</DropdownToggle>
                      <DropdownMenu basic>
                        <DropdownItem>
                          <NavLink className="nav-link waves-effect waves-light" to="/CMVdb">CMV Manual Input</NavLink>
                        </DropdownItem>
                        <DropdownItem>
                          <NavLink className="nav-link waves-effect waves-light dropdown" to="/CMVFileInput">CMV File Input</NavLink>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </NavItem>

                  <NavItem>
                    <Dropdown>
                      <DropdownToggle nav caret>HSV-1db</DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>
                          <NavLink className="nav-link waves-effect waves-light" to="/HSV1db">HSV-1 Manual Input</NavLink>
                        </DropdownItem>
                        <DropdownItem>
                          <NavLink className="nav-link waves-effect waves-light dropdown" to="/HSV1FileInput">HSV-1 File Input</NavLink>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </NavItem>

                  <NavItem>
                    <Dropdown>
                      <DropdownToggle nav caret>HSV-2db</DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>
                          <NavLink className="nav-link waves-effect waves-light" to="/HSV2db">HSV-2 Manual Input</NavLink>
                        </DropdownItem>
                        <DropdownItem>
                          <NavLink className="nav-link waves-effect waves-light dropdown" to="/HSV2FileInput">HSV-2 File Input</NavLink>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </NavItem>
                </NavbarNav>
                <NavbarNav right>
                  {/* <NavItem>
                    <NavLink className="nav-link waves-effect waves-light" to="/pending-files">File Library</NavLink>
                  </NavItem> */}
                  <NavItem>
                    <Dropdown toggle={this.toggle}>
                      <DropdownToggle nav caret><i className="fa fa-user" aria-hidden="true"></i></DropdownToggle>
                      <DropdownMenu right>
                        {this.state.user !== '' ?
                          <div>
                            <DropdownItem>
                              <NavLink className="nav-link waves-effect waves-light" to="/AddVariants">Add Variants</NavLink>
                            </DropdownItem>
                            <DropdownItem>
                              <NavLink className="nav-link waves-effect waves-light" to="/Saved-Sequences">Saved Sequences</NavLink>
                            </DropdownItem>
                            <DropdownItem>
                              <NavLink className="nav-link waves-effect waves-light" to="/ProfileActions">Profile Actions</NavLink>
                            </DropdownItem>
                            <DropdownItem>
                              <NavLink className="logoutButton" onClick={this.handleLogout} to="/login">Logout</NavLink>
                            </DropdownItem>
                            {/* <button type='button' className="btn btn-danger btn-sm" onClick={this.handleLogout}>Logout</button> */}
                          </div>
                          :
                          <div>
                            <DropdownItem>
                              {/* <NavLink className="nav-link waves-effect waves-light" to="#" disabled>Login to add Variants</NavLink> */}
                            </DropdownItem>
                            <DropdownItem>
                              <NavLink className="nav-link waves-effect waves-light" to="/login">Login</NavLink>
                            </DropdownItem>
                          </div>
                        }
                      </DropdownMenu>
                    </Dropdown>
                  </NavItem>
                </NavbarNav>
              </MDBCollapse>
            </Navbar>
            {/* <Route exact path="/evanzhao/uw/uwari/" component={WelcomePage} /> */}
            <Route exact path="/" component={WelcomePage} />
            <Route path="/ProfileActions" render={(props) => (
              <PasswordChangeForm {...props} uid={this.state.user.uid} user={this.state.user} />
            )} />

            <Route path="/Saved-Sequences" render={(props) => (
              <SavedSequences {...props} uid={this.state.user.uid} user={this.state.user} />
            )} />

            <Route path="/CMVdb" render={(props) => (
              <CMVdb {...props} uid={this.state.user} user={this.state.user} />
            )} />

            <Route path="/HSV1db" render={(props) => (
              <HSV1db {...props} uid={this.state.user} user={this.state.user} />
            )} />

            <Route path="/HSV2db" render={(props) => (
              <HSV2db {...props} uid={this.state.user} user={this.state.user} />
            )} />

            <Route path="/CMVFileInput" render={(props) => (
              <CMVFileInput {...props} uid={this.state.user} user={this.state.user} />
            )} />
            <Route path="/AddVariants" render={(props) => (
              <AddVariants {...props} uid={this.state.user} user={this.state.user} />
            )} />
            <Route path="/WelcomePage" component={WelcomePage} />
            {/* <Route path="/CMVdb" component={CMVdb} />
            <Route path="/HSV1db" component={HSV1db} />
            <Route path="/HSV2db" component={HSV2db} /> */}
            {/* <Route path="/AddVariants" component={AddVariants} /> */}
            {/* <Route path="/CMVFileInput" component={CMVFileInput} /> */}
            <Route path="/HSV1FileInput" component={HSV1FileInput} />
            <Route path="/PasswordForget" component={PasswordForgetFormBase} />
            <Route path="/SignUp" component={SignUpFormBase} />
            <Route path="/HSV2FileInput" component={HSV2FileInput} />
            <Route path="/Results" component={Results} />
            <Route path="/login" render={(props) => (
              <Login {...props} handlerFromParent={this.handleUser} />
            )} />
          </header>
        </div>
        <Footer id="footer" color="teal" className="font-small pt-4 mt-4" fixed="bottom">
          <Container className="text-left">
            <Row>
              <Col sm="6">
                <h5 className="title">Emails</h5>
                <p>evanzhao@uw.edu</p>
                <p>uwvirongs@gmail.com</p>
              </Col>
              <Col sm="6">
                <h5 className="title">Links</h5>
                <ul>
                  <li className="list-unstyled"><a href="https://www.viracor-eurofins.com/media/1622/cmv-avr-mutations-references_1217_viracor-eurofins.pdf">Viracor</a></li>
                  <li className="list-unstyled"><a href="https://depts.washington.edu/uwviro/">UW Virology</a></li>
                  <li className="list-unstyled"><a href="https://github.com/evanska348/uwari">GitHub</a></li>
                </ul>
              </Col>
            </Row>
          </Container>
          <div className="footer-copyright text-center">
            <Container fluid>
              {(new Date().getFullYear())} <a href="https://www.washington.edu/"> UW </a>
            </Container>
          </div>
        </Footer>
      </div >

    );
  }
}

{/* <div className="welcomeContainer darken-pseudo darken-with-text">
<div className="welcomeCover"> */}
class WelcomePage extends Component {
  render() {
    return (
      <div>
        <div className="welcomeContainer darken-pseudo darken-with-text">
          <div className="welcomeCover">
            <div style={{
              marginLeft: '4vw', width: '50vw', fontFamily: "Sans-serif, Times New Roman",
              fontSize: 'large', color: 'white'
            }}>
              <h1 id="title">
                {/* <strong> */}
                <p>Find Drug Resistance CMV - HSV1 - HSV2</p>
                {/* </strong> */}
              </h1>
            </div>
            <p style={{
              marginLeft: '4vw'
            }}> Use the navigation bar above to choose a virus and input type</p>
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

class SavedSequences extends Component {

  constructor() {
    super();

    this.state = {
      modalIsOpen: false,
      savedItems: '',
      databoolean: true,
      filtered: [],
      deleteCard: '',
      analyzeid: '',
      submitClickedHSV: false,
      submitClickedCMV: false,
      cmvdrugs: [],
      hsvdrugs: []
    };


    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.closeModalDelete = this.closeModalDelete.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.viewAnalysis = this.viewAnalysis.bind(this)
  }

  openModal(itemid) {
    this.setState({ modalIsOpen: true, deleteCard: itemid });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  closeModalDelete() {
    this.setState({
      modalIsOpen: false, savedItems: this.state.savedItems.filter(function (item) {
        return item.name !== itemid;
      })
    });
    let itemid = this.state.deleteCard;
    let uid = this.props.user.uid;
    firebase.database().ref('users/' + uid + '/' + itemid).remove();
  }

  handleFilterChange(e) {
    let currentList = this.state.savedItems;
    let newList = [];

    if (e.target.value !== "" && currentList.length !== 0) {
      newList = currentList.filter(item => {
        const lc = item.name.toLowerCase();
        const filter = e.target.value.toLowerCase();
        return lc.includes(filter);
      });
    } else {
      newList = this.state.savedItems;
    }
    this.setState({
      filtered: newList
    });
  }

  viewAnalysis(id) {
    console.log(id)
    if (id.virus === "CMV") {
      this.setState({ analyzeid: id, submitClickedCMV: true })
    } else {
      this.setState({ analyzeid: id, submitClickedHSV: true })
    }
  }

  filterCMV = (e) => {
    this.setState({ cmvfil: e.target.checked })
    if (this.state.hsv1fil === true || this.state.hsv2fil === true) {
      this.setState({
        hsv1fil: false,
        hsv2fil: false
      });
    }
    let currentList = this.state.savedItems;
    let newList = [];
    if (e.target.checked) {
      newList = currentList.filter(item => {
        if (item.virus === 'CMV') {
          return true;
        }
      });
    } else {
      newList = this.state.savedItems;
    }
    this.setState({
      filtered: newList
    });
  }

  filterHSV1 = (e) => {
    this.setState({ hsv1fil: e.target.checked })
    if (this.state.cmvfil === true || this.state.hsv2fil === true) {
      this.setState({
        cmvfil: false,
        hsv2fil: false
      });
    }
    let currentList = this.state.savedItems;
    let newList = [];
    if (e.target.checked) {
      newList = currentList.filter(item => {
        if (item.virus === 'HSV-1') {
          return true;
        }
      });
    } else {
      newList = this.state.savedItems;
    }
    this.setState({
      filtered: newList
    });
  }

  filterHSV2 = (e) => {
    this.setState({ hsv2fil: e.target.checked })
    if (this.state.hsv1fil === true || this.state.cmvfil === true) {
      this.setState({
        hsv1fil: false,
        cmvfil: false
      });
    }
    let currentList = this.state.savedItems;
    let newList = [];
    if (e.target.checked) {
      newList = currentList.filter(item => {
        if (item.virus === 'HSV-2') {
          return true;
        }
      });
    } else {
      newList = this.state.savedItems;
    }
    this.setState({
      filtered: newList
    });
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  componentDidMount() {
    this.setState({ loading: true });
    let user = this.props.user
    let uid = this.props.user.uid
    let ref = firebase.database().ref('users/' + uid);
    let data = [];
    ref.on('value', snapshot => {
      let savedItems = snapshot.val();
      if (savedItems !== null) {
        const object = snapshot.val();
        const list = Object.keys(object || {}).map(key => ({
          ...object[key],
          name: key,
        }));
        var drugarray = [];
        var drugobj = [];
        db
          .collection('drug')
          .get()
          .then(snapshot => {
            snapshot
              .docs
              .forEach(doc => {
                var object = doc.data()
                var keys = Object.keys(object);
                this.setState({
                  savedItems: list,
                  filtered: list,
                  loading: false,
                  cmvdrugs: keys
                });
              });
          });
        db
          .collection('HSVdrug')
          .get()
          .then(snapshot => {
            snapshot
              .docs
              .forEach(doc => {
                // var object = JSON.parse(doc._document.data)
                var object = doc.data();
                var keys = Object.keys(object);
                this.setState({ hsvdrugs: keys })
              });
          });
      } else {
        this.setState({
          databool: false,
        });
      }
    });
  }

  handleSubmit(virus) {
    if (virus === "HSV") {
      this.setState({ submitClickedHSV: !this.state.submitClickedHSV })
    } else if (virus === "CMV") {
      this.setState({ submitClickedCMV: !this.state.submitClickedCMV })
    }
  }


  render() {
    const customStyles = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
      }
    };
    return (
      <div className="container">
        {
          this.state.submitClickedHSV || this.state.submitClickedCMV ?
            (this.state.submitClickedCMV ?
              <div>
                <StickyContainer>
                  <Sticky>{({ style }) => <div style={{ zIndex: '1', position: 'absolute', right: '10vw' }} ><button style={style} onClick={this.handleSubmit.bind(this, "CMV")} className="btn btn-primary" type="submit">Back to Saved Sequences</button></div>}</Sticky>
                  <div>
                    <p>{this.state.mutation_list}</p>
                    <Results saveButton={false} selecteddrugs={this.state.cmvdrugs} epistasis={[]} selected97phos={this.state.analyzeid.phos97} selected54poly={this.state.analyzeid.poly54} selected56term={this.state.analyzeid.term56} isClicked={this.state.submitClickedCMV}></Results>
                  </div>
                </StickyContainer>
              </div>
              :
              <div>
                <StickyContainer>
                  <Sticky>{({ style }) => <div style={{ zIndex: '1', position: 'absolute', right: '10vw' }} ><button style={style} onClick={this.handleSubmit.bind(this, "HSV")} className="btn btn-primary" type="submit">Back to Saved Sequences</button></div>}</Sticky>
                  <div>
                    <p>{this.state.mutation_list}</p>
                    <HSVResults user={this.props.user} virus={"HSV-2"} saveButton={false} selecteddrugs={this.state.hsvdrugs} epistasis={[]} selectedThymidine={this.state.analyzeid.tk23} selectedPolymerase={this.state.analyzeid.poly30} isClicked={this.state.submitClickedHSV}></HSVResults>
                  </div>
                </StickyContainer>
              </div>
            )
            :
            <div>
              <h2 className="pageheader">
                File Library
              </h2>
              {this.props.user != 0 ?
                <div>
                  <p>{this.props.user.email}'s Library</p>
                </div>
                :
                <div>
                  <p>Current Session Library</p>
                </div>
              }
              <input type="text" className="input" onChange={(this.handleFilterChange)} placeholder="Search..." />
              <FormControlLabel style={{ marginLeft: "2vw" }}
                control={
                  <Switch
                    checked={this.state.cmvfil}
                    onChange={this.filterCMV}
                  />
                }
                label="Filter for CMV"
              />
              <FormControlLabel style={{}}
                control={
                  <Switch
                    checked={this.state.hsv1fil}
                    onChange={this.filterHSV1}
                  />
                }
                label="Filter for HSV-1"
              />
              <FormControlLabel style={{}}
                control={
                  <Switch
                    checked={this.state.hsv2fil}
                    onChange={this.filterHSV2}
                  />
                }
                label="Filter for HSV-2"
              />
              <div style={{ background: '#cbefec', border: '1px solid #009688', padding: '1rem', borderRadius: '5px', marginBottom: '1rem' }}>
                <div>
                  {this.state.loading === false ?
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                      {this.state.filtered.map(item => (
                        <FileCardComplete key={item.name} analyze={this.viewAnalysis} delete={this.openModal}
                          item={item}></FileCardComplete>
                      ))}
                    </div>
                    :
                    <div>
                      {this.state.databool === false ?
                        <p>No Saved Items</p>
                        :
                        <p>loading</p>
                      }
                    </div>
                  }
                </div>
              </div>

              <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                style={customStyles}
                contentLabel="Example Modal"
              >

                <h2 ref={subtitle => this.subtitle = subtitle}>Are you sure you want to delete this sequence?</h2>
                <form>
                  <button className='btn btn-danger' onClick={this.closeModalDelete}>yes</button>
                  <button className='btn btn-primary' onClick={this.closeModal}>no</button>
                </form>
              </Modal>
            </div>
        }
      </div>
    )
  }
}


class FileCardComplete extends Component {

  constructor() {
    super();
    this.state = {
      saved: false,
    }
  }

  click = () => {
    this.props.delete(this.props.item.name);
  }

  analyze = () => {
    this.props.analyze(this.props.item);
  }

  // handleSave = () => {
  //   this.setState({ saved: true })
  //   let UserRef = firebase.database().ref('Users');
  //   let foundKey = false;
  //   Object.keys(UserRef).forEach((key) => {
  //     if (key === this.props.uid) {
  //       foundKey = true;
  //       UserRef.child(key).child('SaveSeq').push({
  //         Name: this.props.filename + this.props.date + this.props.virus,
  //       }).catch(err => console.log(err));
  //     }
  //   }
  //   )
  //   if (!foundKey) {
  //     firebase.database().ref('Users/' + this.props.uid + '/SaveSeq/' + this.props.id + "/").set(
  //       {
  //         Name: this.props.filename + this.props.date + this.props.virus,
  //       }
  //     ).catch(err => console.log(err));
  //   }

  //   foundKey = false;
  // }

  render() {
    var item = this.props.item;
    var variants = [];
    if (item.virus === "CMV") {
      let phos = '';
      let poly = '';
      let term = '';
      if (item.phos97 !== undefined && item.phos97.length !== 0) {
        item.phos97.map(item => {
          phos += item.Variant + ' ';
        })
        variants.push(<div><strong>Phosphotransferase: </strong> {phos}</div>)
      } else {
        item.phos97 = [];
      }
      if (item.term56 !== undefined && item.term56.length !== 0) {
        item.term56.map(item => {
          term += item.Variant + ' ';
        })
        variants.push(<div><strong>Terminase: </strong> {term}</div>)
      } else {
        item.term56 = [];
      }
      if (item.poly54 !== undefined && item.poly54.length !== 0) {
        item.poly54.map(item => {
          poly += item.Variant + ' ';
        })
        variants.push(<div><strong>Polymerase: </strong> {poly}</div>)
      } else {
        item.poly54 = [];
      }
    } else {
      let tk = '';
      let poly = '';
      if (item.tk23 !== undefined && item.tk23.length !== 0) {
        item.tk23.map(item => {
          tk += item.Variant + ' ';
        })
        variants.push(<div><strong>Thymidine Kinase: </strong> {tk}</div>)
      } else {
        item.tk23 = [];
      }
      if (item.poly30 !== undefined && item.poly30.length !== 0) {
        item.poly30.map(item => {
          poly += item.Variant + ' ';
        })
        variants.push(<div><strong>Polymerase: </strong> {poly}</div>)
      } else {
        item.poly30 = [];
      }

    }
    return (
      <Card style={{ margin: '5px' }}>
        <CardContent style={{ paddingBottom: 0 }}>
          <button onClick={this.click} style={{
            background: "none", border: "none", float: "right"
          }}>
            <i className="fa fa-close"></i>
          </button>
          <Typography component="h2" style={{ fontSize: "1.5em" }}>
            <strong>{item.name}</strong>
          </Typography>
          <Typography component="p" color="textSecondary">
            {item.date}
          </Typography>
          <Typography component="p" color="textSecondary">
            {item.time}
          </Typography>
          <Typography component="p">
            Virus: {item.virus}
          </Typography>
          {
            variants.map(function (item, index) {
              return <Typography key={index} style={{ marginBottom: 0, maxWidth: '15vw' }} component="div">{item}</Typography>
            })}

        </CardContent>
        <CardActions>
          <Button onClick={this.analyze} size="small">Full Results</Button>
        </CardActions>
      </Card>
    )
  }
}

class FileCardIncomplete extends Component {
  constructor() {
    super();
    this.state = {
    }
  }

  click = () => {
    this.props.delete();
  }

  render() {
    return (
      <div style={{ border: '1px solid lightcoral' }} className='filecard'>
        <a style={{ float: 'right' }} onClick={this.click}><i className="fa fa-remove" aria-hidden="true" /></a>
        <h4 style={{ marginBottom: 0 }}><strong>{this.props.filename}</strong> - {this.props.date}</h4>
        <p style={{ marginBottom: 0 }}>Virus: {this.props.virustype}</p>
        <p style={{ marginBottom: 0 }}>Status: {this.props.status}</p>
      </div>
    )
  }
}

class HSV2FileInput extends Component {
  constructor() {
    super();
    this.updateInput23 = this.updateInput23.bind(this);
    this.updateInput30 = this.updateInput30.bind(this);
    this.state = {
      file: null,
      submitClicked: false,
      input: '',
      poly: [],
      tk: [],
      selecteddrugs: [],
      drugs: [],
      selectedPolymerase: [],
      selectedThymidine: [],
      loaded: false,
      ul23filename: 'Choose file',
      ul30filename: 'Choose file',
      txt30: '',
      txt23: ''
    }
  }

  componentWillMount() {
    var drugarray = [];
    var drugobj = [];
    db
      .collection('HSVdrug')
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            // var object = JSON.parse(doc._document.data)
            var object = doc.data();
            var keys = Object.keys(object);
            var i;
            for (i = 0; i < keys.length; i++) {
              drugarray.push(keys[i])
              drugobj.push({
                label: keys[i],
                value: keys[i]
              })
            }
            this.setState({ drugs: drugobj })
            this.setState({ selecteddrugs: drugarray })
            this.setState({
              loaded: true
            });
          });
      });
    var HSV2ThymidineKinase = [];
    db
      .collection('HSV2resistance')
      .doc("HSV2resistance")
      .collection("HSV2ThymidineKinase")
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            var object = doc.data().Variant
            HSV2ThymidineKinase.push({ label: object, value: object })
            this.setState({ poly: HSV2ThymidineKinase })
          });
      });

    var HSV2Polymerase = [];
    db
      .collection('HSV2resistance')
      .doc("HSV2resistance")
      .collection("HSV2Polymerase")
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            var object = doc.data().Variant
            HSV2Polymerase.push({ label: object, value: object })
            this.setState({ tk: HSV2Polymerase })
          });
      });
  }

  handleSubmit() {
    if (this.state.selectedPolymerase === [] &&
      this.state.selectedThymidine === []) {
      this.setState({ empty: true });
      console.log("YOOOO")
    } else {
      let drugarray = [];
      for (let i = 0; i < this.state.drugs.length; i++) {
        drugarray.push(this.state.drugs[i].label)
      }
      this.setState({ empty: false });
      if (this.state.submitClicked === true) {
        this.setState({
          selecteddrugs: drugarray,
          selectedPolymerase: [],
          selectedThymidine: [],
        })
      }
      this.setState({ submitClicked: !this.state.submitClicked })
    }
  }

  updateInput23(event) {
    this.setState({ input: event.target.value })
    this.setState({ txt23: event.target.value })
    let tkstate = [];
    let fasta_sequence = event.target.value;
    for (let i = 0; i < this.state.tk.length; i++) {
      let variant = this.state.tk[i].value;
      if (variant.match(/\d+/g) !== null) {
        let loc = variant.match(/\d+/g).map(Number)[0];
        if (fasta_sequence.charAt(loc - 1) === variant[variant.length - 1]) {
          tkstate.push(variant)
        }
      }
    }
    if (fasta_sequence.length > 30) {
      toast.success("UL23 sequence alignment finished!", {
        toastId: 13,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    let data = [];
    for (let i = 0; i < tkstate.length; i++) {
      let docRef = db.collection('HSV2resistance')
        .doc("HSV2resistance")
        .collection("HSV2ThymidineKinase").doc(tkstate[i]);
      docRef.get().then(function (doc) {
        if (doc.exists) {
          data.push(doc.data());
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
    }
    this.setState({ selectedThymidine: data })
  }

  updateInput30(event) {
    this.setState({ input: event.target.value })
    let polstate = [];
    let fasta_sequence = event.target.value;
    for (let i = 0; i < this.state.poly.length; i++) {
      let variant = this.state.poly[i].value;
      if (variant.match(/\d+/g) !== null) {
        let loc = variant.match(/\d+/g).map(Number)[0];
        if (fasta_sequence.charAt(loc - 1) === variant[variant.length - 1]) {
          polstate.push(variant)
        }
      }
    }
    if (fasta_sequence.length > 30) {
      toast.success("UL56 sequence alignment finished!", {
        toastId: 13,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    let data = [];
    for (let i = 0; i < polstate.length; i++) {
      let docRef = db.collection('HSV2resistance')
        .doc("HSV2resistance")
        .collection("HSV2Polymerase").doc(polstate[i]);
      docRef.get().then(function (doc) {
        if (doc.exists) {
          data.push(doc.data());
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
    }
    this.setState({ selectedPolymerase: data })
  }

  submitFile = (gene) => (event) => {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    formData.append('string', gene)
    var headers = {
      'Content-Type': 'multipart/form-data',
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Authorization, Origin"
    }
    if (gene === 'hsv2tk') {
      this.setState({ txt23: 'loading...', ul23filename: event.target.files[0].name });
    } else if (gene === 'hsv2pol') {
      this.setState({ txt30: 'loading...', ul30filename: event.target.files[0].name });
    }
    let extension = event.target.files[0].name.match(/\.[0-9a-z]+$/i)[0];
    console.log(extension)
    if (extension === '.fasta' || extension === '.fa') {
      let reader = new FileReader();
      reader.onload = function (e) {
        let result = reader.result;
        console.log(result.toString())
        // break the textblock into an array of lines
        var lines = result.split('\n');
        lines.splice(0, 1);
        var newtext = lines.join('\n');
        result = newtext.replace(/\n|\r/g, "");
        if (gene === 'hsv2tk') {
          this.setState({ txt23: result });
        } else if (gene === 'hsv2pol') {
          this.setState({ txt30: result });
        }
      }.bind(this)
      reader.readAsText(event.target.files[0]);
    } else if (extension === '.ab1' || extension === '.abi') {
      axios.post(`http://ec2-52-41-160-246.us-west-2.compute.amazonaws.com:3000/test-upload`, formData, {
        headers: headers
      }).then(response => {
        console.log(response.data)
        if (gene === 'hsv2tk') {
          this.updateInput23({ target: { value: response.data } });
          this.setState({ txt23: response.data });
        } else if (gene === 'hsv2pol') {
          this.updateInput30({ target: { value: response.data } });
          this.setState({ txt30: response.data });
        }
      }).catch(error => {
        console.log(error)
      });
      console.log("function start")
    } else {
      toast.error("File extension must be .ab1 .abi .fasta .fa", {
        toastId: 13,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      if (gene === 'hsv2tk') {
        this.setState({ txt23: 'Improper File Type' });
      } else if (gene === 'hsv2pol') {
        this.setState({ txt30: 'Improper File Type' });
      }
    }
  }

  onChangeSelectionDrug(value) {
    let drugsarr = value.split(',');
    this.setState({
      selecteddrugs: drugsarr
    });
  }

  clearTextArea = gene => {
    if (gene === 'hsv2tk') {
      this.setState({ txt23: '', ul23filename: 'Choose file' });
    } else if (gene === 'hsv2pol') {
      this.setState({ txt30: '', ul30filename: 'Choose file' });
    }
  }


  render() {
    var descriptionTool = <p>Choose an AB1 or FASTA file from your computer.<br /> Once a suitable alignment appears in the textbox below, click analyze.</p>;
    let invalid23 = false;
    if (this.state.txt23.trim() === '') {
      invalid23 = true;
    }
    let invalid30 = false;
    if (this.state.txt30.trim() === '') {
      invalid30 = true;
    }
    if (this.state.loaded) {
      return (
        <div className="container">
          {
            this.state.submitClicked ?
              <div>
                <StickyContainer>
                  <Sticky>{({ style }) => <div style={{ zIndex: '1', position: 'absolute', right: '10vw' }} ><button style={style} onClick={this.handleSubmit.bind(this)} className="btn btn-primary" type="submit">Resubmit</button></div>}</Sticky>
                  <div>
                    <p>{this.state.mutation_list}</p>
                    <HSVResults user={this.props.user} virus={"HSV-2"} saveButton={true} selecteddrugs={this.state.selecteddrugs} epistasis={[]} selectedThymidine={this.state.selectedThymidine} selectedPolymerase={this.state.selectedPolymerase}></HSVResults>
                  </div>
                </StickyContainer>
              </div>
              :
              <div>
                <h2 className="pageheader"> HSV-2 File Input</h2>
                <p className='druglabel'>Drug Selection</p>
                <MultiDrugSelectField changeSelection={this.onChangeSelectionDrug.bind(this)} input={this.state.drugs}></MultiDrugSelectField>

                <h3 style={{ display: 'inline-block' }} className='FileInput-headers'><strong>UL23 - Thymidine Kinase</strong></h3>
                <Tooltip
                  style={{ display: 'inline-block' }}
                  multiline='true'
                  content={descriptionTool}
                  customCss={css`white-space: nowrap;`}>
                  <button style={{ border: 0, background: 'none' }}><i className="fa fa-question-circle" /></button>
                </Tooltip>
                <div className="input-group">
                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="inputGroupFile01"
                      aria-describedby="inputGroupFile01"
                      label={'upload file'}
                      onChange={this.submitFile('hsv2tk')}
                    />
                    <label className="custom-file-label" htmlFor="inputGroupFileAddon01">
                      {this.state.ul23filename}
                    </label>
                  </div>
                  {/* <div className="input-group-prepend">
                    <button className="input-group-text" id="inputGroupFileAddon01">Remove</button>
                  </div> */}
                </div>
                {/* <input label='upload file' type='file' onChange={this.submitFile('hsv1tk')} /> */}
                {/* <textarea value={this.state.txt54} className="form-control z-depth-1" id="exampleFormControlTextarea6" rows="6" placeholder="UL56 FASTA Text Input" onChange={this.updateInput56}></textarea> */}
                <div style={{ position: 'relative' }}>
                  <button onClick={() => this.clearTextArea('hsv2tk')} style={{ background: "none", border: "none", position: "absolute", right: '0px', top: '0px' }}>
                    <i className="fa fa-close"></i>
                  </button>
                  <textarea value={this.state.txt23} className="form-control z-depth-1" id="exampleFormControlTextarea6" rows="6" placeholder="UL23 FASTA Text Input" onChange={this.updateInput56}></textarea>
                </div>

                <button disabled={invalid23} onClick={this.handleSubmit.bind(this)} className="btn btn-primary fileSubmit" type="submit">Analyze UL23</button>

                <h3 className='FileInput-headers' style={{ display: 'inline-block' }}><strong>UL30 - DNA Polymerase</strong></h3>
                <Tooltip
                  style={{ display: 'inline-block' }}
                  multiline='true'
                  content={descriptionTool}
                  customCss={css`white-space: nowrap;`}>
                  <button style={{ border: 0, background: 'none' }}><i className="fa fa-question-circle" /></button>
                </Tooltip>
                <div className="input-group">
                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="inputGroupFile01"
                      aria-describedby="inputGroupFile01"
                      label='upload file'
                      onChange={this.submitFile('hsv2pol')}
                    />
                    <label className="custom-file-label" htmlFor="inputGroupFileAddon01">
                      {this.state.ul30filename}
                    </label>
                  </div>
                </div>
                {/* <input label='upload file' type='file' onChange={this.submitFile('hsv1pol')} /> */}
                {/* <textarea value={this.state.txt56} className="form-control z-depth-1" id="exampleFormControlTextarea6" rows="6" placeholder="UL97 FASTA Text Input" onChange={this.updateInput97}></textarea> */}
                <div style={{ position: 'relative' }}>
                  <button onClick={() => this.clearTextArea('hsv2pol')} style={{ background: "none", border: "none", position: "absolute", right: '0px', top: '0px' }}>
                    <i className="fa fa-close"></i>
                  </button>
                  <textarea value={this.state.txt30} className="form-control z-depth-1" id="exampleFormControlTextarea6" rows="6" placeholder="UL30 FASTA Text Input" onChange={this.updateInput97}></textarea>
                </div>
                <button disabled={invalid30} onClick={this.handleSubmit.bind(this)} className="btn btn-primary fileSubmit" type="submit">Analyze UL30</button>
                <ToastContainer />
              </div>
          }
        </div>
      )
    } else {
      return (
        <div className="loaderContainer">
          <div className="loader"></div>
        </div>
      );
    }
  }
}

class HSV1FileInput extends Component {

  constructor() {
    super();
    this.updateInput23 = this.updateInput23.bind(this);
    this.updateInput30 = this.updateInput30.bind(this);
    this.state = {
      file: null,
      submitClicked: false,
      input: '',
      poly: [],
      tk: [],
      selecteddrugs: [],
      drugs: [],
      selectedPolymerase: [],
      selectedThymidine: [],
      loaded: false,
      ul23filename: 'Choose file',
      ul30filename: 'Choose file',
      txt23: '',
      txt30: ''
    }
  }

  // componentWillMount() {
  //   var epistasis = []
  //   db
  //     .collection('epistaticvariants')
  //     .get()
  //     .then(snapshot => {
  //       snapshot
  //         .docs
  //         .forEach(doc => {
  //           var object = doc.data()
  //           epistasis.push(object)
  //           this.setState({ epistasis: epistasis });
  //         });
  //     });



  componentWillMount() {
    var drugarray = [];
    var drugobj = [];
    db
      .collection('HSVdrug')
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            // var object = JSON.parse(doc._document.data)
            var object = doc.data();
            var keys = Object.keys(object);
            var i;
            for (i = 0; i < keys.length; i++) {
              drugarray.push(keys[i])
              drugobj.push({
                label: keys[i],
                value: keys[i]
              })
            }
            this.setState({ drugs: drugobj })
            this.setState({ selecteddrugs: drugarray })
            this.setState({
              loaded: true
            });
          });
      });

    var HSV1ThymidineKinase = []
    db
      .collection('HSV1resistance')
      .doc("HSV1resistance")
      .collection("HSV1ThymidineKinase")
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            var object = doc.data().Variant
            HSV1ThymidineKinase.push({ label: object, value: object })
            this.setState({ poly: HSV1ThymidineKinase })
          });
      });

    var HSV1Polymerase = []
    db
      .collection('HSV1resistance')
      .doc("HSV1resistance")
      .collection("HSV1Polymerase")
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            var object = doc.data().Variant
            HSV1Polymerase.push({ label: object, value: object })
            this.setState({ tk: HSV1Polymerase })
          });
      });
  }

  handleSubmit() {
    if (this.state.selectedPolymerase === [] &&
      this.state.selectedThymidine === []) {
      this.setState({ empty: true });
      console.log("YOOOO")
    } else {
      let drugarray = [];
      for (let i = 0; i < this.state.drugs.length; i++) {
        drugarray.push(this.state.drugs[i].label)
      }
      this.setState({ empty: false });
      if (this.state.submitClicked === true) {
        this.setState({
          selecteddrugs: drugarray,
          selectedPolymerase: [],
          selectedThymidine: [],
        })
      }
      this.setState({ submitClicked: !this.state.submitClicked })
    }
  }

  updateInput23(event) {
    this.setState({ input: event.target.value })
    this.setState({ txt23: event.target.value })
    console.log(event.target.value)
    let tkstate = [];
    let fasta_sequence = event.target.value;
    for (let i = 0; i < this.state.tk.length; i++) {
      let variant = this.state.tk[i].value;
      if (variant.match(/\d+/g) !== null) {
        let loc = variant.match(/\d+/g).map(Number)[0];
        if (fasta_sequence.charAt(loc - 1) === variant[variant.length - 1]) {
          tkstate.push(variant)
        }
      }
    }
    if (fasta_sequence.length > 30) {
      toast.success("UL23 sequence alignment finished!", {
        toastId: 13,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    let data = [];
    for (let i = 0; i < tkstate.length; i++) {
      let docRef = db.collection('HSV1resistance')
        .doc("HSV1resistance")
        .collection("HSV1ThymidineKinase").doc(tkstate[i]);
      docRef.get().then(function (doc) {
        if (doc.exists) {
          data.push(doc.data());
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
    }
    this.setState({ selectedThymadine: data })
  }

  updateInput30(event) {
    this.setState({ input: event.target.value });
    this.setState({ txt30: event.target.value });
    let polstate = [];
    let fasta_sequence = event.target.value;
    for (let i = 0; i < this.state.poly.length; i++) {
      let variant = this.state.poly[i].value;
      if (variant.match(/\d+/g) !== null) {
        let loc = variant.match(/\d+/g).map(Number)[0];
        if (fasta_sequence.charAt(loc - 1) === variant[variant.length - 1]) {
          polstate.push(variant)
        }
      }
    }
    if (fasta_sequence.length > 30) {
      toast.success("UL30 sequence alignment finished!", {
        toastId: 13,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    let data = [];
    for (let i = 0; i < polstate.length; i++) {
      let docRef = db.collection('HSV1resistance')
        .doc("HSV1resistance")
        .collection("HSV1Polymerase").doc(polstate[i]);
      docRef.get().then(function (doc) {
        if (doc.exists) {
          data.push(doc.data());
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
    }
    this.setState({ selectedPolymerase: data })
  }


  submitFile = (gene) => (event) => {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    formData.append('string', gene)
    var headers = {
      'Content-Type': 'multipart/form-data',
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Authorization, Origin"
    }
    if (gene === 'hsv1tk') {
      this.setState({ txt23: 'loading...', ul23filename: event.target.files[0].name });
    } else if (gene === 'hsv1pol') {
      this.setState({ txt30: 'loading...', ul30filename: event.target.files[0].name });
    }
    let extension = event.target.files[0].name.match(/\.[0-9a-z]+$/i)[0];
    console.log(extension)
    if (extension === '.fasta' || extension === '.fa') {
      let reader = new FileReader();
      reader.onload = function (e) {
        let result = reader.result;
        console.log(result.toString())
        // break the textblock into an array of lines
        var lines = result.split('\n');
        lines.splice(0, 1);
        var newtext = lines.join('\n');
        result = newtext.replace(/\n|\r/g, "");
        if (gene === 'hsv2tk') {
          this.setState({ txt23: result });
        } else if (gene === 'hsv2pol') {
          this.setState({ txt30: result });
        }
      }.bind(this)
      reader.readAsText(event.target.files[0]);
    } else if (extension === '.ab1' || extension === '.abi') {
      axios.post(`http://ec2-52-41-160-246.us-west-2.compute.amazonaws.com:3000/test-upload`, formData, {
        headers: headers
      }).then(response => {
        console.log(response.data)
        if (gene === 'hsv1tk') {
          this.updateInput23({ target: { value: response.data } });
          this.setState({ txt23: response.data });
        } else if (gene === 'hsv1pol') {
          this.updateInput30({ target: { value: response.data } });
          this.setState({ txt30: response.data });
        }
      }).catch(error => {
        console.log(error)
      });
    } else {
      toast.error("File extension must be .ab1 .abi .fasta .fa", {
        toastId: 13,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      if (gene === 'hsv1tk') {
        this.setState({ txt23: 'Improper File Type' });
      } else if (gene === 'hsv1pol') {
        this.setState({ txt30: 'Improper File Type' });
      }
    }
    console.log("file submitted")
  }

  onChangeSelectionDrug(value) {
    let drugsarr = value.split(',');
    this.setState({
      selecteddrugs: drugsarr
    });
  }

  clearTextArea = gene => {
    if (gene === 'hsv1tk') {
      this.setState({ txt23: '', ul23filename: 'Choose file' });
    } else if (gene === 'hsv1pol') {
      this.setState({ txt30: '', ul30filename: 'Choose file' });
    }
  }


  render() {
    var descriptionTool = <p>Choose an AB1 or FASTA file from your computer.<br /> Once a suitable alignment appears in the textbox below, click analyze.</p>;
    let invalid23 = false;
    if (this.state.txt23.trim() === '') {
      invalid23 = true;
    }
    let invalid30 = false;
    if (this.state.txt30.trim() === '') {
      invalid30 = true;
    }
    if (this.state.loaded) {
      return (
        <div className="container">
          {
            this.state.submitClicked ?
              <div>
                <div>

                  <StickyContainer>
                    <Sticky>{({ style }) => <div style={{ zIndex: '1', position: 'absolute', right: '10vw' }} ><button style={style} onClick={this.handleSubmit.bind(this)} className="btn btn-primary" type="submit">Resubmit</button></div>}</Sticky>
                    <div>
                      <p>{this.state.mutation_list}</p>
                      <HSVResults user={this.props.user} virus={"HSV-1"} saveButton={true} selecteddrugs={this.state.selecteddrugs} epistasis={[]} selectedThymidine={this.state.selectedThymidine} selectedPolymerase={this.state.selectedPolymerase}></HSVResults>
                    </div>
                  </StickyContainer>
                  <p>{this.state.mutation_list}</p>
                  {/* <HSVResults saveButton={true} selecteddrugs={this.state.selecteddrugs} epistasis={[]} selectedThymidine={this.state.selectedThymidine} selectedPolymerase={this.state.selectedPolymerase}></HSVResults>
                  <button onClick={this.handleSubmit.bind(this)} className="btn btn-primary" type="submit">Reset</button> */}
                </div>
              </div>
              :
              <div>
                <h2 className="pageheader"> HSV-1 File Input</h2>
                <p className='druglabel'>Drug Selection</p>
                <MultiDrugSelectField changeSelection={this.onChangeSelectionDrug.bind(this)} input={this.state.drugs}></MultiDrugSelectField>

                <h3 style={{ display: 'inline-block' }} className='FileInput-headers'><strong>UL23 - Thymidine Kinase</strong></h3>
                <Tooltip
                  style={{ display: 'inline-block' }}
                  multiline='true'
                  content={descriptionTool}
                  customCss={css`white-space: nowrap;`}>
                  <button style={{ border: 0, background: 'none' }}><i className="fa fa-question-circle" /></button>
                </Tooltip>
                <div className="input-group">
                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="inputGroupFile01"
                      aria-describedby="inputGroupFile01"
                      label='upload file'
                      onChange={this.submitFile('hsv1tk')}
                    />
                    <label className="custom-file-label" htmlFor="inputGroupFileAddon01">
                      {this.state.ul23filename}
                    </label>
                  </div>
                </div>
                {/* <input label='upload file' type='file' onChange={this.submitFile('hsv1tk')} /> */}
                {/* <textarea value={this.state.txt54} className="form-control z-depth-1" id="exampleFormControlTextarea6" rows="6" placeholder="UL56 FASTA Text Input" onChange={this.updateInput56}></textarea> */}
                <div style={{ position: 'relative' }}>
                  <button onClick={() => this.clearTextArea('hsv1tk')} style={{ background: "none", border: "none", position: "absolute", right: '0px', top: '0px' }}>
                    <i className="fa fa-close"></i>
                  </button>
                  <textarea value={this.state.txt23} className="form-control z-depth-1" id="exampleFormControlTextarea6" rows="6" placeholder="U23 FASTA Text Input" onChange={this.updateInput23}></textarea>
                </div>

                <button disabled={invalid23} onClick={this.handleSubmit.bind(this)} className="btn btn-primary fileSubmit" type="submit">Analyze UL23</button>

                <h3 className='FileInput-headers' style={{ display: 'inline-block' }}><strong>UL30 - DNA Polymerase</strong></h3>
                <Tooltip
                  style={{ display: 'inline-block' }}
                  multiline='true'
                  content={descriptionTool}
                  customCss={css`white-space: nowrap;`}>
                  <button style={{ border: 0, background: 'none' }}><i className="fa fa-question-circle" /></button>
                </Tooltip>
                <div className="input-group">
                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="inputGroupFile01"
                      aria-describedby="inputGroupFile01"
                      label='upload file'
                      onChange={this.submitFile('hsv1pol')}
                    />
                    <label className="custom-file-label" htmlFor="inputGroupFileAddon01">
                      {this.state.ul30filename}
                    </label>
                  </div>
                </div>
                {/* <input label='upload file' type='file' onChange={this.submitFile('hsv1pol')} /> */}
                {/* <textarea value={this.state.txt56} className="form-control z-depth-1" id="exampleFormControlTextarea6" rows="6" placeholder="UL97 FASTA Text Input" onChange={this.updateInput97}></textarea> */}
                <div style={{ position: 'relative' }}>
                  <button onClick={() => this.clearTextArea('hsv1pol')} style={{ background: "none", border: "none", position: "absolute", right: '0px', top: '0px' }}>
                    <i className="fa fa-close"></i>
                  </button>
                  <textarea value={this.state.txt30} className="form-control z-depth-1" id="exampleFormControlTextarea6" rows="6" placeholder="UL30 FASTA Text Input" onChange={this.updateInput30}></textarea>
                </div>
                <button disabled={invalid30} onClick={this.handleSubmit.bind(this)} className="btn btn-primary fileSubmit" type="submit">Analyze UL30</button>
                <ToastContainer />
              </div>
          }
        </div>
      )
    } else {
      return (
        <div className="loaderContainer">
          <div className="loader"></div>
        </div>
      );
    }
  }
}

class CMVFileInput extends Component {

  constructor() {
    super();
    this.updateInput54 = this.updateInput54.bind(this);
    this.updateInput56 = this.updateInput56.bind(this);
    this.updateInput97 = this.updateInput97.bind(this);
    this.state = {
      file: null,
      submitClicked: false,
      input: '',
      poly: [],
      term: [],
      phos: [],
      selecteddrugs: [],
      drugs: [],
      selected54poly: [],
      selected56term: [],
      selected97phos: [],
      loaded: false,
      ul54filename: 'Choose file',
      ul56filename: 'Choose file',
      ul97filename: 'Choose file',
      txt54: '',
      txt56: '',
      txt97: ''
    }
  }

  componentWillMount() {
    var drugarray = [];
    var drugobj = [];
    db
      .collection('drug')
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            // var object = JSON.parse(doc._document.data)
            var object = doc.data();
            var keys = Object.keys(object);
            var i;
            for (i = 0; i < keys.length; i++) {
              drugarray.push(keys[i])
              drugobj.push({
                label: keys[i],
                value: keys[i]
              })
            }
            this.setState({ drugs: drugobj })
            this.setState({ selecteddrugs: drugarray })
            this.setState({
              loaded: true
            });
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

  handleSubmit() {
    if (this.state.selected54poly === [] &&
      this.state.selected56term === [] &&
      this.state.selected96phos === []) {
      this.setState({ empty: true });
      console.log("YOOOO")
    } else {
      let drugarray = [];
      for (let i = 0; i < this.state.drugs.length; i++) {
        drugarray.push(this.state.drugs[i].label)
      }
      this.setState({ empty: false });
      if (this.state.submitClicked === true) {
        this.setState({
          selecteddrugs: drugarray,
          selected54poly: [],
          selected56term: [],
          selected97phos: []
        })
      }
      this.setState({ submitClicked: !this.state.submitClicked })
    }
  }

  updateInput54(event) {
    this.setState({ input: event.target.value })
    this.setState({ txt54: event.target.value })
    console.log(event.target.value)
    let polystate = [];
    let fasta_sequence = event.target.value;
    for (let i = 0; i < this.state.poly.length; i++) {
      let variant = this.state.poly[i].value;
      if (variant.match(/\d+/g) !== null) {
        let loc = variant.match(/\d+/g).map(Number)[0];
        if (fasta_sequence.charAt(loc - 1) === variant[variant.length - 1]) {
          polystate.push(variant)
        }
      }
    }
    if (fasta_sequence.length > 30) {
      toast.success("UL54 sequence is ready", {
        toastId: 13,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    let data = [];
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
    console.log(data)
    this.setState({ selected54poly: data })
  }

  onChangeSelectionDrug(value) {
    let drugsarr = value.split(',');
    this.setState({
      selecteddrugs: drugsarr
    });
  }

  updateInput97(event) {
    this.setState({ input: event.target.value })
    this.setState({ txt97: event.target.value })
    let phosstate = [];
    let fasta_sequence = event.target.value;
    for (let i = 0; i < this.state.phos.length; i++) {
      let variant = this.state.phos[i].value;
      if (variant.match(/\d+/g) !== null) {
        let loc = variant.match(/\d+/g).map(Number)[0];
        if (fasta_sequence.charAt(loc - 1) === variant[variant.length - 1]) {
          phosstate.push(variant)
        }
      }
    }
    if (fasta_sequence.length > 30) {
      toast.success("UL97 sequence is ready!", {
        toastId: 13,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    let data = [];
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
    this.setState({ selected97phos: data })
  }

  onChangeSelectionDrug(value) {
    let drugsarr = value.split(',');
    this.setState({
      selecteddrugs: drugsarr
    });
  }

  updateInput56(event) {
    this.setState({ input: event.target.value })
    this.setState({ txt56: event.target.value })
    let termstate = [];
    let fasta_sequence = event.target.value;
    for (let i = 0; i < this.state.term.length; i++) {
      let variant = this.state.term[i].value;
      if (variant.match(/\d+/g) !== null) {
        let loc = variant.match(/\d+/g).map(Number)[0];
        if (fasta_sequence.charAt(loc - 1) === variant[variant.length - 1]) {
          termstate.push(variant)
        }
      }
    }
    if (fasta_sequence.length > 30) {
      toast.success("Ready to analyze UL56", {
        toastId: 13,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    let data = [];
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
    this.setState({ selected56term: data })
  }

  onChangeSelectionDrug(value) {
    let drugsarr = value.split(',');
    this.setState({
      selecteddrugs: drugsarr
    });
  }

  submitFile = (gene) => (event) => {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    formData.append('string', gene)
    var headers = {
      'Content-Type': 'multipart/form-data',
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Authorization, Origin"
    }
    if (gene === 'cmvphos') {
      this.setState({ txt97: 'loading...', ul97filename: event.target.files[0].name });
    } else if (gene === 'cmvterm') {
      this.setState({ txt56: 'loading...', ul56filename: event.target.files[0].name });
    } else if (gene === 'cmvpol') {
      this.setState({ txt54: 'loading...', ul54filename: event.target.files[0].name });
    }
    let extension = event.target.files[0].name.match(/\.[0-9a-z]+$/i)[0];
    console.log(extension)
    if (extension === '.fasta' || extension === '.fa') {
      let reader = new FileReader();
      reader.onload = function (e) {
        let result = reader.result;
        // break the textblock into an array of lines
        var lines = result.split('\n');
        lines.splice(0, 1);
        var newtext = lines.join('\n');
        result = newtext.replace(/\n|\r/g, "");
        if (gene === 'cmvphos') {
          this.setState({ txt97: result });
        } else if (gene === 'cmvterm') {
          this.setState({ txt56: result });
        } else if (gene === 'cmvpol') {
          this.setState({ txt54: result });
        }
      }.bind(this)
      reader.readAsText(event.target.files[0]);
    } else if (extension === '.ab1' || extension === '.abi') {
      axios.post(`http://ec2-52-41-160-246.us-west-2.compute.amazonaws.com:3000/test-upload`, formData, {
        headers: headers
      }).then(response => {
        console.log(response.data)
        if (gene === 'cmvphos') {
          this.updateInput97({ target: { value: response.data } });
          this.setState({ txt97: response.data });
        } else if (gene === 'cmvterm') {
          this.updateInput56({ target: { value: response.data } });
          this.setState({ txt56: response.data });
        } else if (gene === 'cmvpol') {
          this.updateInput54({ target: { value: response.data } });
          this.setState({ txt54: response.data });
        }
      }).catch(error => {
        console.log(error)
      });
      console.log("requesting")
    } else {
      toast.error("File extension must be .ab1 .abi .fasta .fa", {
        toastId: 13,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      if (gene === 'cmvphos') {
        this.setState({ txt97: 'Improper File Type.' });
      } else if (gene === 'cmvterm') {
        this.setState({ txt56: 'Improper File Type.' });
      } else if (gene === 'cmvpol') {
        this.setState({ txt54: 'Improper File Type.' });
      }
    }
  }

  clearTextArea = gene => {
    if (gene === 'cmvphos') {
      this.setState({ txt97: '', ul97filename: 'Choose file' });
    } else if (gene === 'cmvterm') {
      this.setState({ txt56: '', ul56filename: 'Choose file' });
    } else if (gene === 'cmvpol') {
      this.setState({ txt54: '', ul54filename: 'Choose file' });
    }
  }

  render() {
    var descriptionTool = <p>Choose an AB1 or FASTA file from your computer.<br /> Once a suitable alignment appears in the textbox below, click analyze.</p>;
    let invalid54 = false;
    if (this.state.txt54.trim() === '') {
      invalid54 = true;
    }
    let invalid56 = false;
    if (this.state.txt56.trim() === '') {
      invalid56 = true;
    }
    let invalid97 = false;
    if (this.state.txt97.trim() === '') {
      invalid97 = true;
    }
    if (this.state.loaded) {
      return (
        <div className="container">
          {
            this.state.submitClicked ?
              <div>
                <div>
                  <StickyContainer>
                    <Sticky>{({ style }) => <div style={{ zIndex: '1', position: 'absolute', right: '10vw' }} ><button style={style} onClick={this.handleSubmit.bind(this)} className="btn btn-primary" type="submit">Back to Saved Sequences</button></div>}</Sticky>
                    <div>
                      <p>{this.state.mutation_list}</p>
                      <Results saveButton={true} user={this.props.user} selecteddrugs={this.state.selecteddrugs} epistasis={[]} selected97phos={this.state.selected97phos} selected54poly={this.state.selected54poly} selected56term={this.state.selected56term} isClicked={this.state.submitClicked}></Results>
                    </div>
                  </StickyContainer>
                  <p>{this.state.mutation_list}</p>
                  {/* <Results saveButton={true} user={this.props.user} selecteddrugs={this.state.selecteddrugs} epistasis={[]} selected97phos={this.state.selected97phos} selected54poly={this.state.selected54poly} selected56term={this.state.selected56term} isClicked={this.state.submitClicked}></Results>
                  <button onClick={this.handleSubmit.bind(this)} className="btn btn-primary" type="submit">Reset</button> */}
                </div>
              </div>
              :
              <div>
                <h2 className="pageheader"> CMV File Input</h2>
                {/* <input type="file"></input> */}
                <p className='druglabel'>Drug Selection</p>
                <MultiDrugSelectField changeSelection={this.onChangeSelectionDrug.bind(this)} input={this.state.drugs}></MultiDrugSelectField>


                <h3 style={{ display: 'inline-block' }} className='FileInput-headers'><strong>UL54 - DNA Polymerase</strong></h3>
                <Tooltip
                  style={{ display: 'inline-block' }}
                  multiline='true'
                  content={descriptionTool}
                  customCss={css`white-space: nowrap;`}
                >
                  <button style={{ border: 0, background: 'none' }}><i className="fa fa-question-circle" /></button>
                </Tooltip>
                <div className="input-group">
                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="inputGroupFile01"
                      aria-describedby="inputGroupFile01"
                      label='upload file'
                      onChange={this.submitFile('cmvpol')}
                    />
                    <label className="custom-file-label" htmlFor="inputGroupFileAddon01">
                      {this.state.ul54filename}
                    </label>
                  </div>
                </div>



                <div style={{ position: 'relative' }}>
                  <button onClick={() => this.clearTextArea('cmvpol')} style={{ background: "none", border: "none", position: "absolute", right: '0px', top: '0px' }}>
                    <i className="fa fa-close"></i>
                  </button>
                  <textarea value={this.state.txt54} className="form-control z-depth-1" id="exampleFormControlTextarea6" rows="6" placeholder="UL54 FASTA Text Input" onChange={this.updateInput54}></textarea>
                </div>
                <button disabled={invalid54} onClick={this.handleSubmit.bind(this)} className="btn btn-primary fileSubmit" type="submit">Analyze UL54</button>

                <h3 style={{ display: 'inline-block' }} className='FileInput-headers'><strong>UL56 - Terminase</strong></h3>
                <Tooltip
                  style={{ display: 'inline-block' }}
                  multiline='true'
                  content={descriptionTool}
                  customCss={css`white-space: nowrap;`}
                >
                  <button style={{ border: 0, background: 'none' }}><i className="fa fa-question-circle" /></button>
                </Tooltip>
                <div className="input-group">
                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="inputGroupFile01"
                      aria-describedby="inputGroupFile01"
                      label='upload file'
                      onChange={this.submitFile('cmvterm')}
                    />
                    <label className="custom-file-label" htmlFor="inputGroupFileAddon01">
                      {this.state.ul56filename}
                    </label>
                  </div>
                </div>
                {/* <input label='upload file' type='file' onChange={this.submitFile('cmvterm')} /> */}

                <div style={{ position: 'relative' }}>
                  <button onClick={() => this.clearTextArea('cmvterm')} style={{ background: "none", border: "none", position: "absolute", right: '0px', top: '0px' }}>
                    <i className="fa fa-close"></i>
                  </button>
                  <textarea value={this.state.txt56} className="form-control z-depth-1" id="exampleFormControlTextarea6" rows="6" placeholder="UL56 FASTA Text Input" onChange={this.updateInput56}></textarea>
                </div>

                <button disabled={invalid56} onClick={this.handleSubmit.bind(this)} className="btn btn-primary fileSubmit" type="submit">Analyze UL56</button>

                <h3 className='FileInput-headers' style={{ display: 'inline-block' }}><strong>UL97 - Phosphotransferase</strong></h3>
                <Tooltip
                  style={{ display: 'inline-block' }}
                  multiline='true'
                  content={descriptionTool}
                  customCss={css`white-space: nowrap;`}
                >
                  <button style={{ border: 0, background: 'none' }}><i className="fa fa-question-circle" /></button>
                </Tooltip>
                <div className="input-group">
                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="inputGroupFile01"
                      aria-describedby="inputGroupFile01"
                      label='upload file'
                      onChange={this.submitFile('cmvphos')}
                    />
                    <label className="custom-file-label" htmlFor="inputGroupFileAddon01">
                      {this.state.ul97filename}
                    </label>
                  </div>
                </div>
                {/* <input label='upload file' type='file' onChange={this.submitFile('cmvphos')} /> */}
                <div style={{ position: 'relative' }}>
                  <button onClick={() => this.clearTextArea('cmvphos')} style={{ background: "none", border: "none", position: "absolute", right: '0px', top: '0px' }}>
                    <i className="fa fa-close"></i>
                  </button>
                  <textarea value={this.state.txt97} className="form-control z-depth-1" id="exampleFormControlTextarea6" rows="6" placeholder="UL97 FASTA Text Input" onChange={this.updateInput97}></textarea>
                </div>
                <button disabled={invalid97} onClick={this.handleSubmit.bind(this)} className="btn btn-primary fileSubmit" type="submit">Analyze UL97</button>
                <ToastContainer />
              </div>
          }
        </div>
      )
    } else {
      return (
        <div className="loaderContainer">
          <div className="loader"></div>
        </div>
      );
    }
  }
}
// MEMNLLQKLCVVCSKCNEYAMELECLKYCDPNVLLAESTPFKRNAAAIVYLYRKIYPEVVAQNRTQSSLLTLYLEMLLKALHEDTALLDRALMAYSRQPDRAAFYRTVLRLDRCDRHHTVELQFTDNVRFSVSLATLNDIERFLCKMNYVYGILAPEAGLEVCAQLLELLRRLCGISPVARQEVYVEGTTCAQCYEELTIIPNQGRSLNKRLQGLLCNHIAVHRPSSQSDVNIQTVEQDLLDLTTRIPHLAGVLSALKSLFSSSSAYHSYIQEAEEALREYNLFTDIPERIYSLSDFTYWSRTSEVIVKRVGITIQQLNVYHQLCRALMNGISRHLYGEDVEDIFVLGEKALDGEERMFVGSVFAAPNRIIDLITSLSIQAFEDNPVFNKLHESNEMYTKIKHILEEIRRPLPDGTGGDGPEGEVIHLRGREAMSGTGTTLMTASNSSNSSTHSQRNNGGGGRARGGGKKAVGGGANGQDGDGSENGLRVRNCDEHEALDLVDARSRIHNVTREVNVRKRAYLQKVSEVGYGKVIRCIKTQERLTSKLIDVNLVGPLCLDFISKLMNGFLYRSQYHQDQDVVDVGNQFTYDEHLYVVNNLIHKSLPVESLPLLGQQIYELCNGPLFTHCTDRYPLSHNVDMAYACDNAGVLPHVKDDLVKCAEGTVYPSEWMVVKYMGFFNFSDCQDLNVLQKEMWMHVRELVLSVALYNETFGKQLSIACLRDELHPDRDVILTYNKEWPLLLRHEGSLYKSKDLYLLLYRHLSRPDESGDVPTAPVAKPSTLTAAAAVSGAFREPDRPWLPSPYPSSSTAGVSRRVRATRKRPRRASSLLDLARDEHGIQDLVPGSLR
class HSV1db extends Component {

  constructor() {
    super();
    this.state = {
      drugs: [],
      selecteddrugs: [],
      selectedPolymerase: [],
      selectedThymidine: [],
      epistasis: [],
      poly: [],
      thymid: [],
      loaded: false
    }
  }

  componentWillMount() {
    var drugarray = [];
    var drugobj = [];
    db
      .collection('HSVdrug')
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            // var object = JSON.parse(doc._document.data)
            var object = doc.data();
            var keys = Object.keys(object);
            var i;
            for (i = 0; i < keys.length; i++) {
              drugarray.push(keys[i])
              drugobj.push({
                label: keys[i],
                value: keys[i]
              })
            }
            this.setState({ drugs: drugobj })
            this.setState({ selecteddrugs: drugarray })
            this.setState({
              loaded: true
            });
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

  onChangeSelectionDrug(value) {
    let drugsarr = value.split(',');
    this.setState({
      selecteddrugs: drugsarr
    });
  }

  onChangeSelectionThymidine(value) {
    var data = [];
    if (value !== '') {
      var thymidinestate = value.split(',');
      for (let i = 0; i < thymidinestate.length; i++) {
        let docRef = db.collection("HSV1resistance").doc("HSV1resistance").collection("HSV1ThymidineKinase").doc(thymidinestate[i]);
        docRef.get().then(function (doc) {
          if (doc.exists) {
            data.push(doc.data());
          }
        }).catch(function (error) {
          console.log("Error getting document:", error);
        });
      }
    }
    this.setState({ selectedThymidine: data })
  }

  onChangeSelectionPolymerase(value) {
    var data = [];
    if (value !== '') {
      var polystate = value.split(',');
      for (let i = 0; i < polystate.length; i++) {
        let docRef = db.collection("HSV1resistance").doc("HSV1resistance").collection("HSV1Polymerase").doc(polystate[i]);
        docRef.get().then(function (doc) {
          if (doc.exists) {
            data.push(doc.data());
          }
        }).catch(function (error) {
          console.log("Error getting document:", error);
        });
      }
    }
    this.setState({ selectedPolymerase: data })
    console.log(this.state.selectedPolymerase)
  }

  componentDidMount() {
    var HSV1ThymidineKinase = []
    db
      .collection('HSV1resistance')
      .doc("HSV1resistance")
      .collection("HSV1ThymidineKinase")
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            var object = doc.data().Variant
            HSV1ThymidineKinase.push({ label: object, value: object })
            this.setState({ poly: HSV1ThymidineKinase })
          });
      });

    var HSV1Polymerase = []
    db
      .collection('HSV1resistance')
      .doc("HSV1resistance")
      .collection("HSV1Polymerase")
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            var object = doc.data().Variant
            HSV1Polymerase.push({ label: object, value: object })
            this.setState({ term: HSV1Polymerase })
          });
      });
  }

  handleSubmit() {
    // if (this.state.selectedPolymerase === [] &&
    //   this.state.selectedThymidine === []) {
    //   this.setState({ empty: true });
    // } else {
    // this.setState({ empty: false });
    let drugarray = [];
    for (let i = 0; i < this.state.drugs.length; i++) {
      drugarray.push(this.state.drugs[i].label)
    }
    console.log(drugarray)
    if (this.state.submitClicked === true) {
      this.setState({
        selecteddrugs: drugarray,
        selectedPolymerase: [],
        selectedThymidine: []
      })
    }
    this.setState({ submitClicked: !this.state.submitClicked })
    // }
  }

  render() {
    if (this.state.loaded) {

      return (
        <div className="container">
          {
            this.state.submitClicked ?
              <div>
                <StickyContainer>
                  <Sticky>{({ style }) => <div style={{ zIndex: '1', position: 'absolute', right: '10vw' }} ><button style={style} onClick={this.handleSubmit.bind(this)} className="btn btn-primary" type="submit">Back to Saved Sequences</button></div>}</Sticky>
                  <div>
                    <p>{this.state.mutation_list}</p>
                    <HSVResults virus={"HSV-1"} user={this.props.user} saveButton={true} selecteddrugs={this.state.selecteddrugs} epistasis={this.state.epistasis} selectedThymidine={this.state.selectedThymidine} selectedPolymerase={this.state.selectedPolymerase}></HSVResults>
                  </div>
                </StickyContainer>
                {/* <HSVResults saveButton={true} selecteddrugs={this.state.selecteddrugs} epistasis={this.state.epistasis} selectedThymidine={this.state.selectedThymidine} selectedPolymerase={this.state.selectedPolymerase}></HSVResults>
                <button onClick={this.handleSubmit.bind(this)} className="btn btn-primary" type="submit">Reset</button> */}
              </div>
              :
              <div>
                <h3 className='pageheader'><strong>Genotypic Resistance Interpretation Algorithm HSV-1</strong></h3>
                <p className='druglabel'>Drug Selection</p>
                <MultiDrugSelectField changeSelection={this.onChangeSelectionDrug.bind(this)} input={this.state.drugs}></MultiDrugSelectField>
                <h3 className='druglabel'><strong>Mutation Selection</strong></h3>
                <h3><strong>UL23 - Thymidine Kinase</strong></h3>
                <MultiVarianceSelectField changeSelection={this.onChangeSelectionThymidine.bind(this)} input={this.state.poly}></MultiVarianceSelectField>
                <h3><strong>UL30 - DNA Polymerase</strong></h3>
                <MultiVarianceSelectField changeSelection={this.onChangeSelectionPolymerase.bind(this)} input={this.state.term}></MultiVarianceSelectField>
                <button onClick={this.handleSubmit.bind(this)} className="btn btn-primary" type="submit">Analyze</button>
              </div>
          }
        </div>
      )
    } else {
      return (
        <div className="loaderContainer">
          <div className="loader"></div>
          {/* <ReactLoading type={"spin"} color={"#009688"} height={'10%'} width={'10%'} /> */}
        </div>
      )
    }
  }
}

class HSV2db extends Component {

  constructor() {
    super();
    this.state = {
      drugs: [],
      selecteddrugs: [],
      selectedPolymerase: [],
      selectedThymidine: [],
      submitClicked: false,
      epistasis: [],
      poly: [],
      thymid: [],
      loaded: false
    }
  }


  componentWillMount() {
    var drugarray = [];
    var drugobj = [];
    db
      .collection('HSVdrug')
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            // var object = JSON.parse(doc._document.data)
            var object = doc.data();
            var keys = Object.keys(object);
            var i;
            for (i = 0; i < keys.length; i++) {
              drugarray.push(keys[i])
              drugobj.push({
                label: keys[i],
                value: keys[i]
              })
            }
            this.setState({ drugs: drugobj })
            this.setState({ selecteddrugs: drugarray })
            this.setState({
              loaded: true
            });
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

  onChangeSelectionDrug(value) {
    let drugsarr = value.split(',');
    this.setState({
      selecteddrugs: drugsarr
    });
  }

  onChangeSelectionThymidine(value) {
    var data = [];
    if (value !== '') {
      var thymidinestate = value.split(',');
      for (let i = 0; i < thymidinestate.length; i++) {
        let docRef = db.collection("HSV2resistance").doc("HSV2resistance").collection("HSV2ThymidineKinase").doc(thymidinestate[i]);
        docRef.get().then(function (doc) {
          if (doc.exists) {
            data.push(doc.data());
          }
        }).catch(function (error) {
          console.log("Error getting document:", error);
        });
      }
    }
    this.setState({ selectedThymidine: data })
  }

  onChangeSelectionPolymerase(value) {
    var data = [];
    if (value !== '') {
      var polystate = value.split(',');
      for (let i = 0; i < polystate.length; i++) {
        let docRef = db.collection("HSV2resistance").doc("HSV2resistance").collection("HSV2Polymerase").doc(polystate[i]);
        docRef.get().then(function (doc) {
          if (doc.exists) {
            data.push(doc.data());
          }
        }).catch(function (error) {
          console.log("Error getting document:", error);
        });
      }
    }
    this.setState({ selectedPolymerase: data })
  }

  componentDidMount() {
    var HSV2ThymidineKinase = []
    db
      .collection('HSV2resistance')
      .doc("HSV2resistance")
      .collection("HSV2ThymidineKinase")
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            var object = doc.data().Variant
            HSV2ThymidineKinase.push({ label: object, value: object })
            this.setState({ poly: HSV2ThymidineKinase })
          });
      });

    var HSV2Polymerase = []
    db
      .collection('HSV2resistance')
      .doc("HSV2resistance")
      .collection("HSV2Polymerase")
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            var object = doc.data().Variant
            HSV2Polymerase.push({ label: object, value: object })
            this.setState({ term: HSV2Polymerase })
          });
      });
  }
  handleSubmit() {
    let drugarray = [];
    for (let i = 0; i < this.state.drugs.length; i++) {
      drugarray.push(this.state.drugs[i].label)
    }
    this.setState({ empty: false });
    if (this.state.submitClicked === true) {
      this.setState({
        selecteddrugs: drugarray,
        selectedPolymerase: [],
        selectedThymidine: []
      })
    }
    this.setState({ submitClicked: !this.state.submitClicked })
  }


  render() {
    if (this.state.loaded) {
      return (
        <div className="container">
          {
            this.state.submitClicked ?
              <div>
                <StickyContainer>
                  <Sticky>{({ style }) => <div style={{ zIndex: '1', position: 'absolute', right: '10vw' }} ><button style={style} onClick={this.handleSubmit.bind(this)} className="btn btn-primary" type="submit">Back to Saved Sequences</button></div>}</Sticky>
                  <div>
                    <p>{this.state.mutation_list}</p>
                    <HSVResults virus={"HSV-2"} saveButton={true} user={this.props.user} selecteddrugs={this.state.selecteddrugs} epistasis={this.state.epistasis} selectedThymidine={this.state.selectedThymidine} selectedPolymerase={this.state.selectedPolymerase} isClicked={this.state.submitClicked}></HSVResults>
                  </div>
                </StickyContainer>
                {/* <HSVResults saveButton={true} selecteddrugs={this.state.selecteddrugs} epistasis={this.state.epistasis} selectedThymidine={this.state.selectedThymidine} selectedPolymerase={this.state.selectedPolymerase} isClicked={this.state.submitClicked}></HSVResults>
                <button onClick={this.handleSubmit.bind(this)} className="btn btn-primary" type="submit">Reset</button> */}
              </div>
              :
              <div>
                <h3 className='pageheader'><strong>Genotypic Resistance Interpretation Algorithm HSV-2</strong></h3>
                <p className='druglabel'>Drug Selection</p>
                <MultiDrugSelectField changeSelection={this.onChangeSelectionDrug.bind(this)} input={this.state.drugs}></MultiDrugSelectField>
                <h3 className='druglabel'><strong>Mutation Selection</strong></h3>
                <h3><strong>UL23 - Thymidine Kinase</strong></h3>
                <MultiVarianceSelectField changeSelection={this.onChangeSelectionThymidine.bind(this)} input={this.state.poly}></MultiVarianceSelectField>
                <h3><strong>UL30 - DNA Polymerase</strong></h3>
                <MultiVarianceSelectField changeSelection={this.onChangeSelectionPolymerase.bind(this)} input={this.state.term}></MultiVarianceSelectField>
                <button onClick={this.handleSubmit.bind(this)} className="btn btn-primary" type="submit">Analyze</button>
              </div>
          }
        </div >
      )
    } else {
      return (
        <div className="loaderContainer">
          <div className="loader"></div>
        </div>
      );
    }
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
      empty: true,
      selecteddrugs: [],
      loaded: false
    }
  }

  componentWillMount() {
    var drugarray = [];
    var drugobj = [];
    db
      .collection('drug')
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            // var object = JSON.parse(doc._document.data)
            var object = doc.data()
            var keys = Object.keys(object);
            var i;
            for (i = 0; i < keys.length; i++) {
              drugarray.push(keys[i])
              drugobj.push({
                label: keys[i],
                value: keys[i]
              })
            }
            this.setState({ drugs: drugobj })
            this.setState({ selecteddrugs: drugarray })
            this.setState({
              loaded: true
            });
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
    let drugsarr = value.split(',');
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
      let drugarray = [];
      for (let i = 0; i < this.state.drugs.length; i++) {
        drugarray.push(this.state.drugs[i].label)
      }
      this.setState({ empty: false });
      if (this.state.submitClicked === true) {
        this.setState({
          selecteddrugs: drugarray,
          selected54poly: [],
          selected56term: [],
          selected97phos: []
        })
      }
      this.setState({ submitClicked: !this.state.submitClicked })
    }
  }

  render() {
    const { selected54poly, selected97phos, selected56term } = this.state
    let isInvalid = selected54poly === [] && selected56term === [] && selected97phos === [];
    console.log(selected54poly + selected56term + selected97phos)
    if (this.state.loaded) {
      return (
        <div className="container" >
          {
            this.state.submitClicked ?
              <div>
                <div>
                  <StickyContainer>
                    <Sticky>{({ style }) => <div style={{ zIndex: '1', position: 'absolute', right: '10vw' }} ><button style={style} onClick={this.handleSubmit.bind(this)} className="btn btn-primary" type="submit">Back to Saved Sequences</button></div>}</Sticky>
                    <div>
                      <p>{this.state.mutation_list}</p>
                      <Results saveButton={true} user={this.props.user} selecteddrugs={this.state.selecteddrugs} epistasis={this.state.epistasis} selected97phos={this.state.selected97phos} selected54poly={this.state.selected54poly} selected56term={this.state.selected56term} isClicked={this.state.submitClicked}></Results>
                    </div>
                  </StickyContainer>
                  {/* <Results saveButton={true} user={this.props.user} selecteddrugs={this.state.selecteddrugs} epistasis={this.state.epistasis} selected97phos={this.state.selected97phos} selected54poly={this.state.selected54poly} selected56term={this.state.selected56term} isClicked={this.state.submitClicked}></Results>
                  <button onClick={this.handleSubmit.bind(this)} className="btn btn-primary" type="submit">Reset</button> */}
                </div>
              </div>
              :
              <div>
                <h3 className='pageheader'><strong>Genotypic Resistance Interpretation Algorithm</strong></h3>
                <p className='druglabel'>Drug Selection</p>
                <MultiDrugSelectField changeSelection={this.onChangeSelectionDrug.bind(this)} input={this.state.drugs}></MultiDrugSelectField>
                <h3 className='druglabel'><strong>Mutation Selection</strong></h3>
                <h3><strong>UL54 - DNA Polymerase</strong></h3>
                <MultiVarianceSelectField changeSelection={this.onChangeSelection54poly.bind(this)} input={this.state.poly}></MultiVarianceSelectField>
                <h3><strong>UL56 - Terminase</strong></h3>
                <MultiVarianceSelectField changeSelection={this.onChangeSelection56term.bind(this)} input={this.state.term}></MultiVarianceSelectField>
                <h3><strong>UL97 - Phosphotransferase</strong></h3>
                <MultiVarianceSelectField changeSelection={this.onChangeSelection97phos.bind(this)} input={this.state.phos}></MultiVarianceSelectField>
                <button disabled={isInvalid} onClick={this.handleSubmit.bind(this)} className="btn btn-primary" type="submit">Analyze</button>
              </div>
          }
        </div>
      )
    } else {
      return (
        <div className="loaderContainer">
          <div className="loader"></div>
        </div>
      );
    }
  }
}
//316 - 415

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
      termvarreference: [],
      colheaders: ["Variant", "Reference", "Comments"],
      foldobj: [],
      headers: [],
      modalIsOpen: false,
      saved: false,
      saveName: '',
      savedItems: [],
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.closeModalSave = this.closeModalSave.bind(this);
  }

  componentWillMount() {
    Modal.setAppElement('body');
    var selected54poly = this.state.selected54poly;
    var selected56term = this.state.selected56term;
    var selected97phos = this.state.selected97phos;
    var headers = []
    if (selected54poly !== undefined && selected54poly.length !== 0) {
      headers.push("UL54 Polymerase")
    }
    if (selected97phos !== undefined && selected97phos.length !== 0) {
      headers.push("UL97 Phosphotransferase")
    }
    if (selected56term !== undefined && selected56term.length !== 0) {
      headers.push("UL56 Terminase")
    }

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
    var drugs = this.state.selecteddrugs;
    var folddata = [];
    for (let i = 0; i < drugs.length; i++) {
      var drugobj = {};
      let drug = drugs[i].replace('fold', '');
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
    console.log(folddata)
    this.setState({ foldobj: folddata })
    var columns54 = ["Variant"]
    for (let i = 0; i < selected54poly.length; i++) {
      let cur = selected54poly[i]
      for (let j = 0; j < Object.keys(cur).length; j++) {
        if (columns54.includes(Object.keys(cur)[j]) === false &&
          Object.keys(cur)[j] !== "Comments" &&
          Object.keys(cur)[j] !== "Reference") {
          columns54.push(Object.keys(cur)[j])
        }
      }
    }
    for (let i = 0; i < columns54.length; i++) {
      let newDrug = columns54[i];
      newDrug = newDrug.replace("fold", "");
      newDrug = newDrug.charAt(0).toUpperCase() + newDrug.substr(1);
      columns54[i] = newDrug
    }
    columns54.push("Comments")
    columns54.push("Reference")
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = 'black';
    this.subtitle.style.fontWeight = 'bold'
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  componentDidMount() {
    if (this.props.user) {
      let uid = this.props.user.uid
      let ref = firebase.database().ref('users/' + uid);
      let data = new Array();
      ref.on('value', snapshot => {
        const savedItems = snapshot.val();
        if (savedItems !== null) {
          Object.keys(savedItems).map(function (key, item) {
            data.push(key)
          })
          this.setState({
            savedItems: data,
          });
        }
      });
    }
  }

  closeModalSave() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    this.setState({ modalIsOpen: false, saved: true });
    firebase.database().ref('users/' + this.props.user.uid + '/' + this.state.saveName).set({
      name: this.state.saveName,
      virus: 'CMV',
      poly54: this.state.selected54poly,
      term56: this.state.selected56term,
      phos97: this.state.selected97phos,
      date: date,
      time: time
    });
  }
  onChangeSaveName = event => {
    this.setState({ saveName: event.target.value });
  }

  render() {
    let invalid = false;
    if (this.state.saveName.trim() === '' || this.state.savedItems.includes(this.state.saveName)) {
      invalid = true;
    }
    let labeltaken = false;
    if (this.state.savedItems.includes(this.state.saveName)) {
      labeltaken = true;
    }
    const customStyles = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
      }
    }
    var folddata = this.state.foldobj;
    var foldtotal = 0;
    for (let i = 0; i < folddata.length; i++) {
      foldtotal += folddata[i].fold
    }
    return (
      <div>
        <div>
          {this.props.selecteddrugs[0] === "fold" ?
            <div>
              <h1 className="pageheader">Results:</h1>
              <h2 style={{ textDecoration: 'underline' }}>Drug Resistance Profile</h2>
              <p>Fold change by drug</p>
              <div className="drugProfile">
                <p style={{ "color": "red", "fontWeight": "bold" }}>
                  No drugs selected.
                </p>
              </div>
            </div>
            :
            (foldtotal === 0 ?
              <div>
                <h1 className="pageheader">Results:</h1>
                <h2 style={{ textDecoration: 'underline' }}>Drug Resistance Profile</h2>
                <p>Fold change by drug</p>
                <div className="drugProfile">
                  <p style={{ "color": "red", "fontWeight": "bold" }}>
                    No fold data available for the selected drugs:
              {
                      this.props.selecteddrugs.map(function (drug, i) {
                        return <li key={i}>{drug.replace("fold", "").slice(0, 1).toUpperCase()
                          + drug.replace("fold", "").slice(1, drug.replace("fold", "").length)}</li>
                      }
                      )}
                  </p>
                </div>
              </div>
              :
              <div>
                <h1 className="pageheader" style={{ display: 'block', borderBottom: 'none' }}>Results:</h1>
                <h2 style={{ textDecoration: 'underline', display: 'inline-block' }}>Drug Resistance Profile</h2>
                {this.props.user === '' ?
                  <div style={{ display: 'inline' }}>
                    <button style={{ padding: '5px', display: 'inline', margin: '0px 0px 0px 10px' }} disabled className="btn btn-success">
                      Log in to Save
              <i style={{ marginLeft: '5px' }} className="fa fa-save"></i>
                    </button>
                  </div>
                  :
                  <div style={{ display: 'inline' }}>
                    {this.props.saveButton === true ? (this.state.saved === false && this.props.saveButton === true ?
                      <button style={{ padding: '5px', display: 'inline', margin: '0px 0px 0px 10px' }} onClick={this.openModal} className="btn btn-success">
                        Save to Profile
              <i style={{ marginLeft: '5px' }} className="fa fa-save"></i>
                      </button>
                      :
                      <div style={{ color: 'green', display: 'inline', margin: '0px 0px 0px 10px' }}>
                        <strong>Saved</strong>
                        <i style={{ marginLeft: '5px' }} className="fa fa-check" aria-hidden="true"></i>
                      </div>
                    ) : <div></div>}

                  </div>

                }


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
                        folddata.map((drug) =>
                          <FoldCard key={drug.drug} obj={drug} drug={drug.drug} fold={drug.fold} />)
                      }
                    </tbody>
                  </table>
                </div>
                <div>
                </div>
              </div>
            )
          }
          <h2 style={{ textDecoration: 'underline' }}>Individual Variant Resistance</h2>
          {
            this.state.selected54poly.length !== 0 ?
              <div>
                <h2>UL54 Polymerase</h2>
                <BootstrapTable data={this.state.selected54poly} bordered={false} striped hover exportCSV
                >
                  <TableHeaderColumn width='170' dataField='Variant' isKey >Variant</TableHeaderColumn>
                  <TableHeaderColumn width='150' dataField='ganciclovirfold'>Ganciclovir-GCV (fold ratio)</TableHeaderColumn>
                  <TableHeaderColumn width='150' dataField='foscarnetfold'>Foscarnet-FOS/PFA (fold ratio)</TableHeaderColumn>
                  <TableHeaderColumn width='150' dataField='cidofovirfold'>Cidofovir-CDV (fold ratio)</TableHeaderColumn>
                  {/* <TableHeaderColumn width='150' dataField='lobucavirfold'>Lobucavir-LBV (fold ratio)</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='adefovirfold'>Adefovir-ADV (fold ratio)</TableHeaderColumn> */}
                  <TableHeaderColumn width='150' dataField='Reference' dataFormat={activeFormatter}>Reference (PMID)</TableHeaderColumn>
                  <TableHeaderColumn width='150' dataField='Comments'>Comments</TableHeaderColumn>
                </BootstrapTable>
              </div>
              :
              <div></div>
          }
          {
            this.state.selected56term.length !== 0 ?
              <div>
                <h2>UL56 Terminase</h2>
                <BootstrapTable data={this.state.selected56term} bordered={false} striped hover exportCSV>
                  <TableHeaderColumn width='170' dataField='Variant' isKey >Variant</TableHeaderColumn>
                  <TableHeaderColumn width='150' dataField='letermovirfold'> Letermovir (fold ratio)</TableHeaderColumn>
                  {/* <TableHeaderColumn width='150' dataField='tomeglovirfold'> Tomeglovir (fold ratio)</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='GW275175Xfold'> GW275175X (fold ratio)</TableHeaderColumn> */}
                  <TableHeaderColumn width='150' dataField='Reference' dataFormat={activeFormatter}>Reference</TableHeaderColumn>
                  <TableHeaderColumn width='150' dataField='Comments'>Comments</TableHeaderColumn>
                </BootstrapTable>
              </div>
              :
              <div></div>
          }
          {
            this.state.selected97phos.length !== 0 ?
              <div>
                <h2>UL97 Phosphotransferase</h2>
                <BootstrapTable data={this.state.selected97phos} bordered={false} striped hover exportCSV>
                  <TableHeaderColumn width='170' dataField='Variant' isKey>Variant</TableHeaderColumn>
                  <TableHeaderColumn width='150' dataField='ganciclovirfold'> Ganciclovir (fold ratio)</TableHeaderColumn>
                  <TableHeaderColumn width='150' dataField='cidofovirfold'> Cidofovir (fold ratio)</TableHeaderColumn>
                  <TableHeaderColumn width='150' dataField='Reference' dataFormat={activeFormatter}>Reference</TableHeaderColumn>
                  <TableHeaderColumn width='150' dataField='Comments'>Comments</TableHeaderColumn>
                </BootstrapTable>
              </div>
              :
              <div></div>
          }
          {
            this.state.selectedepistasis.length !== 0 ?
              <div>
                <h2>Epistatic Variants</h2>
                <BootstrapTable data={this.state.selectedepistasis} bordered={false} striped hover exportCSV>
                  <TableHeaderColumn width='170' dataField='Variant' isKey >Variant</TableHeaderColumn>
                  <TableHeaderColumn width='150' dataField='letermovirfold'> Letermovir (fold ratio)</TableHeaderColumn>
                  <TableHeaderColumn width='150' dataField='Reference'>Reference</TableHeaderColumn>
                  <TableHeaderColumn width='150' dataField='Comments' dataFormat={activeFormatter}>Comments</TableHeaderColumn>
                </BootstrapTable>
              </div>
              :
              <div></div>
          }
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >

            <h2 ref={subtitle => this.subtitle = subtitle}>Save Sequence Results</h2>
            <form>
              <TextField
                error={labeltaken}
                style={{ display: 'block', margin: '10px', marginRight: 0 }}
                className='form-group col-md6'
                name="todo"
                id="outlined-with-placeholder"
                label={labeltaken ? "Name In Use" : "Enter Save Name"}
                placeholder="Enter Save Name"
                margin="normal"
                variant="outlined"
                name="todo"
                value={this.state.saveName}
                onChange={this.onChangeSaveName}
              />
              <button className='btn btn-danger' onClick={this.closeModal}>Exit</button>
              <button className='btn btn-primary' disabled={invalid} onClick={this.closeModalSave}>Save</button>
            </form>
          </Modal>
        </div>
      </div>
    )
  }
}

class HSVResults extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedThymidine: this.props.selectedThymidine,
      selectedPolymerase: this.props.selectedPolymerase,
      selecteddrugs: this.props.selecteddrugs,
      selectedepistasis: [],
      epistasis: this.props.epistasis,
      allvars: [],
      polyvarname: [],
      polyvarreference: [],
      termvarname: [],
      termvarreference: [],
      colheaders: ["Variant", "Reference", "Comments"],
      foldobj: [],
      headers: [],
      modalIsOpen: false,
      saved: false,
      saveName: '',
      savedItems: [],
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.closeModalSave = this.closeModalSave.bind(this);
  }

  componentWillMount() {
    var selectedThymidine = this.state.selectedThymidine;
    var selectedPolymerase = this.state.selectedPolymerase;
    var variants = this.state.selectedThymidine.concat(this.state.selectedPolymerase);
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
          selectedThymidine = selectedThymidine.filter(function (variant) {
            return variant.Variant !== match[i];
          });
          selectedPolymerase = selectedPolymerase.filter(function (variant) {
            return variant.Variant !== match[i];
          });
        }
        variants.push(this.state.epistasis[i])
        let curepi = this.state.selectedepistasis;
        curepi.push(this.state.epistasis[i]);
        this.setState({ selectedepistasis: curepi });
        this.setState({ selectedPolymerase: selectedPolymerase })
        this.setState({ selectedThymidine: selectedThymidine })
      }
    }
    this.setState({ allvars: variants });
    var variants = this.props.selectedThymidine.concat(this.props.selectedPolymerase);
    var drugs = this.props.selecteddrugs;
    var folddata = [];
    console.log(variants)
    for (let i = 0; i < drugs.length; i++) {
      var drugobj = {};
      let drug = drugs[i].replace('fold', '');
      drugs[i] = drug + "fold";
      drugobj["drug"] = drug + "fold";
      drugobj["fold"] = 0;
      folddata.push(drugobj)
    }
    for (let i = 0; i < variants.length; i++) {
      for (let j = 0; j < folddata.length; j++) {
        if (folddata[j].drug in variants[i]) {
          if (typeof variants[i][folddata[j].drug] === 'number') {
            folddata[j].fold = folddata[j].fold + Number(variants[i][folddata[j].drug]);
          }
        }
      }
    }
    this.setState({ foldobj: folddata });
  }

  commentFormatter(enumObject) {
    let comment = enumObject
    if (comment !== undefined && comment.includes("/n")) {
      let lines = comment.split("/n")
      let linesobj = []
      for (let i = 0; i < lines.length; i++) {
        let object = { value: lines[i], key: i }
        linesobj.push(object)
      }
      return linesobj.map(item => {
        return (
          `<li key=${item.key}>${item.value}</li>`
        );
      }).join('');
    } else {
      return enumObject
    }
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = 'black';
    this.subtitle.style.fontWeight = 'bold'
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  componentDidMount() {
    if (this.props.user) {
      let uid = this.props.user.uid
      let ref = firebase.database().ref('users/' + uid);
      let data = new Array();
      ref.on('value', snapshot => {
        const savedItems = snapshot.val();
        if (savedItems !== null) {
          Object.keys(savedItems).map(function (key, item) {
            data.push(key)
          })
          this.setState({
            savedItems: data,
          });
        }
      });
    }
  }

  closeModalSave() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    this.setState({ modalIsOpen: false, saved: true });
    firebase.database().ref('users/' + this.props.user.uid + '/' + this.state.saveName).set({
      name: this.state.saveName,
      virus: this.props.virus,
      poly30: this.state.selectedPolymerase,
      tk23: this.state.selectedThymidine,
      date: date,
      time: time
    });
  }
  onChangeSaveName = event => {
    this.setState({ saveName: event.target.value });
  }


  render() {
    let invalid = false;
    if (this.state.saveName.trim() === '' || this.state.savedItems.includes(this.state.saveName)) {
      invalid = true;
    }
    let labeltaken = false;
    if (this.state.savedItems.includes(this.state.saveName)) {
      labeltaken = true;
    }
    const customStyles = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
      }
    }
    // var variants = this.props.selectedThymidine.concat(this.props.selectedPolymerase);
    // var drugs = this.props.selecteddrugs;
    // var folddata = [];
    // console.log(variants)
    // for (let i = 0; i < drugs.length; i++) {
    //   var drugobj = {};
    //   let drug = drugs[i];
    //   drugs[i] = drug + "fold";
    //   drugobj["drug"] = drug + "fold";
    //   drugobj["fold"] = 0;
    //   folddata.push(drugobj)
    // }
    // for (let i = 0; i < variants.length; i++) {
    //   for (let j = 0; j < folddata.length; j++) {
    //     if (folddata[j].drug in variants[i]) {
    //       if (typeof variants[i][folddata[j].drug] === 'number') {
    //         folddata[j].fold = folddata[j].fold + Number(variants[i][folddata[j].drug]);
    //       }
    //     }
    //   }
    // }
    let folddata = this.state.foldobj;
    let foldtotal = 0;
    for (let i = 0; i < folddata.length; i++) {
      foldtotal += folddata[i].fold
    }
    let virus = this.props.virus
    let noData = this.state.selectedThymidine.length === 0 && this.state.selectedPolymerase.length === 0;
    return (
      <div>
        <div>
          {this.props.selecteddrugs[0] === "fold" ?
            <div>
              <h1 className="pageheader">Results:</h1>
              <h2 style={{ textDecoration: 'underline' }}>Drug Resistance Profile</h2>
              <p>Fold change by drug</p>
              <div className="drugProfile">
                <p style={{ "color": "red", "fontWeight": "bold" }}>
                  No drugs selected.
                </p>
              </div>
            </div>
            :
            (foldtotal === 0 ?
              <div>
                <h1 className="pageheader">Results:</h1>
                <h2 style={{ textDecoration: 'underline', display: 'inline-block' }}>Drug Resistance Profile</h2>
                {noData ?
                  <div></div>
                  :
                  (this.props.user === '' ?
                    <div style={{ display: 'inline' }}>
                      <button style={{ padding: '5px', display: 'inline', margin: '0px 0px 0px 10px' }} disabled className="btn btn-success">
                        Log in to Save
              <i style={{ marginLeft: '5px' }} className="fa fa-save"></i>
                      </button>
                    </div>
                    :
                    <div style={{ display: 'inline' }}>
                      {this.props.saveButton === true ? (this.state.saved === false && this.props.saveButton === true ?
                        <button style={{ padding: '5px', display: 'inline', margin: '0px 0px 0px 10px' }} onClick={this.openModal} className="btn btn-success">
                          Save to Profile
              <i style={{ marginLeft: '5px' }} className="fa fa-save"></i>
                        </button>
                        :
                        <div style={{ color: 'green', display: 'inline', margin: '0px 0px 0px 10px' }}>
                          <strong>Saved</strong>
                          <i style={{ marginLeft: '5px' }} className="fa fa-check" aria-hidden="true"></i>
                        </div>
                      ) : <div></div>}
                    </div>
                  )
                }
                <p>Fold change by drug</p>
                <div className="drugProfile">
                  <p style={{ "color": "red", "fontWeight": "bold" }}>
                    No fold data available for the selected drugs:
              {
                      this.props.selecteddrugs.map(function (drug, i) {
                        return <li key={i}>{drug.replace("fold", "").slice(0, 1).toUpperCase()
                          + drug.replace("fold", "").slice(1, drug.replace("fold", "").length)}</li>
                      }
                      )}
                  </p>
                </div>
              </div>
              :
              <div>
                <h1 className="pageheader" style={{ display: 'block', borderBottom: 'none' }}>Results:</h1>
                <h2 style={{ textDecoration: 'underline', display: 'inline-block' }}>Drug Resistance Profile</h2>
                {this.props.user === '' ?
                  <div style={{ display: 'inline' }}>
                    <button style={{ padding: '5px', display: 'inline', margin: '0px 0px 0px 10px' }} disabled className="btn btn-success">
                      Log in to Save
              <i style={{ marginLeft: '5px' }} className="fa fa-save"></i>
                    </button>
                  </div>
                  :
                  <div style={{ display: 'inline' }}>
                    {this.props.saveButton === true ? (this.state.saved === false && this.props.saveButton === true ?
                      <button style={{ padding: '5px', display: 'inline', margin: '0px 0px 0px 10px' }} onClick={this.openModal} className="btn btn-success">
                        Save to Profile
              <i style={{ marginLeft: '5px' }} className="fa fa-save"></i>
                      </button>
                      :
                      <div style={{ color: 'green', display: 'inline', margin: '0px 0px 0px 10px' }}>
                        <strong>Saved</strong>
                        <i style={{ marginLeft: '5px' }} className="fa fa-check" aria-hidden="true"></i>
                      </div>
                    ) : <div></div>}
                  </div>

                }
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
                        folddata.map((drug) =>
                          <FoldCard key={drug.drug} obj={drug} drug={drug.drug} fold={drug.fold} />)
                      }
                    </tbody>
                  </table>
                </div>
                <div>
                  {/* <p>Fold change by drug</p>
        <div>
          {this.props.selecteddrugs[0] === "fold" ?
            <div>
              <div className="drugProfile">
                <p style={{ "color": "red", "fontWeight": "bold" }}>
                  No drugs selected.
                </p>
              </div>
            </div>
            :
            (foldtotal === 0 ?
              <div className="drugProfile">
                <p style={{ "color": "red", "fontWeight": "bold" }}>
                  No fold data available for the selected drugs:
              {
                    this.props.selecteddrugs.map(function (drug, i) {
                      return <li key={i}>{drug.replace("fold", "").slice(0, 1).toUpperCase()
                        + drug.replace("fold", "").slice(1, drug.replace("fold", "").length)}</li>
                    }
                    )}
                </p>
              </div>
              :
              <div>
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
                        folddata.map((drug) =>
                          <FoldCard key={drug.drug} obj={drug} drug={drug.drug} fold={drug.fold} />)
                      }
                    </tbody>
                  </table>
                </div>

                <hr />
                <div style={{ display: 'block' }}> */}
                </div>
              </div>
            )
          }
          {!noData &&
            <h2>Individual Variant Resistance</h2>
          }
          {
            this.state.selectedThymidine.length !== 0 ?
              <div>
                <h3>UL23 Thymidine Kinase</h3>
                <BootstrapTable data={this.state.selectedThymidine} bordered={false} striped hover exportCSV>
                  <TableHeaderColumn width='130' dataField='Variant' isKey >Variant</TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='aciclovirfold'> Aciclovir-ACV (fold ratio)</TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='foscarnetfold'>Foscarnet-FOS/PFA (fold ratio)</TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='cidofovirfold'>Cidofovir-CDV (fold ratio)</TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='brivudinfold'>Brivudinfold-BVDU (fold ratio)</TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='penciclovirfold'>Penciclovir-PCV (fold ratio)</TableHeaderColumn>
                  <TableHeaderColumn width='150' dataField='Reference' dataFormat={activeFormatter}>Reference (PMID)</TableHeaderColumn>
                  <TableHeaderColumn width='200' dataField='Comments' dataFormat={this.commentFormatter}>Comments</TableHeaderColumn>
                </BootstrapTable>
              </div>
              :
              <div></div>
          }
          {
            this.state.selectedPolymerase.length !== 0 ?
              <div>
                <h3>UL30 Polymerase</h3>
                <BootstrapTable data={this.state.selectedPolymerase} bordered={false} striped hover exportCSV>
                  <TableHeaderColumn width='130' dataField='Variant' isKey >Variant</TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='aciclovirfold'> Aciclovir-ACV (fold ratio)</TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='foscarnetfold'>Foscarnet-FOS/PFA (fold ratio)</TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='cidofovirfold'>Cidofovir-CDV (fold ratio)</TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='brivudinfold'>Brivudinfold-BVDU (fold ratio)</TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='penciclovirfold'>Penciclovir-PCV (fold ratio)</TableHeaderColumn>
                  <TableHeaderColumn width='150' dataField='Reference' dataFormat={activeFormatter}>Reference</TableHeaderColumn>
                  <TableHeaderColumn width='200' dataField='Comments' dataFormat={this.commentFormatter}>Comments</TableHeaderColumn>
                </BootstrapTable>
              </div>
              :
              <div></div>
          }
          {
            this.state.selectedepistasis.length !== 0 ?
              <div>
                <h3>Epistatic Variants</h3>
                <BootstrapTable data={this.state.selectedepistasis} bordered={false} striped hover exportCSV>
                  <TableHeaderColumn width='130' dataField='Variant' isKey >Variant</TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='aciclovirfold'> Aciclovir-ACV (fold ratio)</TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='foscarnetfold'>Foscarnet-FOS/PFA (fold ratio)</TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='cidofovirfold'>Cidofovir-CDV (fold ratio)</TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='brivudinfold'>Brivudinfold-BVDU (fold ratio)</TableHeaderColumn>
                  <TableHeaderColumn width='100' dataField='penciclovirfold'>Penciclovir-PCV (fold ratio)</TableHeaderColumn>
                  <TableHeaderColumn width='150' dataField='Reference' dataFormat={activeFormatter}>Reference</TableHeaderColumn>
                  <TableHeaderColumn width='200' dataField='Comments' dataFormat={this.commentFormatter}>Comments</TableHeaderColumn>
                </BootstrapTable>
              </div>
              :
              <div></div>
          }
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >

            <h2 ref={subtitle => this.subtitle = subtitle}>Save Sequence Results</h2>
            <form>
              <TextField
                error={labeltaken}
                style={{ display: 'block', margin: '10px', marginRight: 0 }}
                className='form-group col-md6'
                name="todo"
                id="outlined-with-placeholder"
                label={labeltaken ? "Name In Use" : "Enter Save Name"}
                placeholder="Enter Save Name"
                margin="normal"
                variant="outlined"
                name="todo"
                value={this.state.saveName}
                onChange={this.onChangeSaveName}
              />
              <button className='btn btn-danger' onClick={this.closeModal}>Exit</button>
              <button className='btn btn-primary' disabled={invalid} onClick={this.closeModalSave}>Save</button>
            </form>
          </Modal>
        </div>
      </div>

    )
  }
}

// class commentFormatter extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       lines: []
//     }
//   }
//   componentWillMount() {
//     let comment = this.props.enumObject
//     let lines = comment.split("/n")
//     let linesobj = []
//     for (let i = 0; i < lines.length; i++) {
//       let object = { value: lines[i], key: i }
//       linesobj.push(object)
//     }
//     this.setState({ lines: linesobj })
//   }
//   render() {
//     return this.state.lines.map(item => {
//       return (
//         <li key={item.key}>
//           {item.value}
//         </li>
//       );
//     });
//   }
// }

class ActiveFormatter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authors: [],
      year: '',
      publication: '',
      id: ''
    }
  }
  componentWillMount() {
    let url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=" + this.props.enumObject[0] + "&retmode=json&tool=my_tool&email=my_email@example.com";
    if (this.props.enumObject[0] !== undefined) {
      fetch(url, { mode: 'cors' })
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
        .catch((error) => {
          this.setState({ id: this.props.enumObject[0] })
          console.log("Error getting citation: " + error);
        });
    }
  }

  render() {
    let link = "https://www.ncbi.nlm.nih.gov/pubmed/" + this.props.enumObject[0]
    return (
      <FormattedCitation id={this.state.id} authors={this.state.authors} year={this.state.year.substr(0, this.state.year.indexOf(" "))} publication={this.state.publication} link={link}></FormattedCitation>
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
    if (this.props.authors !== undefined) {
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
    }
    let apiRejection = this.props.id !== "";
    return (
      <div>
        {apiRejection ?
          <a href={this.props.link} > {this.props.id} </a>
          :
          <a href={this.props.link} > {lastnames}, {this.props.publication}, {this.props.year}</a>
        }
      </div>
    );
  }
}

function activeFormatter(cell, row, enumObject, index) {

  //  console.log(enumObject)
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
      return (null);
    } else {
      return (
        < tr >
          <th className="drugHeader" align="center" valign="top" rowSpan="1" colSpan="1">{this.state.drug.replace("fold", "")}</th>
          <td align="left" valign="top" rowSpan="1" colSpan="1">{fold}</td>
        </tr >
      )
    }
  }
}

const _ADD_VARIANT_INITIAL_STATE_ = {
  Virus: '',
  gene: '',
  variant: '',
  fold: '',
  reference: '',
  comments: '',
  success: '',
  failure: '',
  selecteddrugs: [""],
  HSVdrugs: [],
  CMVdrugs: [],
};

class AddVariants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      Virus: '',
      gene: '',
      variant: '',
      fold: '',
      reference: '',
      comments: '',
      success: '',
      failure: '',
      selecteddrugs: [""],
      HSVdrugs: [],
      CMVdrugs: [],
    };
  }

  onChangeSelectionVirus(value) {
    this.setState({
      Virus: value,
      selecteddrugs: [""]
    });
  }


  onChangeSelectionGene(value) {
    this.setState({
      gene: value,
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
      data[drug] = fold
    }
    data["Variant"] = this.state.variant;
    data["Reference"] = this.state.reference;
    data["Comments"] = this.state.comments;
    data["UserAdded"] = this.state.user.email;
    let virus = this.state.Virus;
    console.log(data)
    console.log(this.state.gene)
    if (virus === "CMV") {
      db.collection(this.state.gene).doc(this.state.variant).set(data)
        .then(function () {
          toast.success("Variant " + data["Variant"] + " has been added to the database", {
            toastId: 13,
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        })
        .catch((err) => {
          toast.error(err.message, {
            toastId: 13,
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        });
    } else if (virus === "HSV-1") {
      db.collection("HSV1resistance").doc("HSV1resistance").collection(this.state.gene).doc(this.state.variant).set(data)
        .then(function () {
          toast.success("Variant " + data["Variant"] + " has been added to the database", {
            toastId: 13,
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        })
        .catch((err) => {
          toast.error(err.message, {
            toastId: 13,
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        });
    } else if (virus === "HSV-2") {
      db.collection("HSV2resistance").doc("HSV2resistance").collection(this.state.gene).doc(this.state.variant).set(data)
        .then(function () {
          toast.success("Variant " + data["Variant"] + " has been added to the database", {
            toastId: 13,
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        })
        .catch((err) => {
          toast.error(err.message, {
            toastId: 13,
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        });
    }
    this.setState(_ADD_VARIANT_INITIAL_STATE_);
  }

  handleChange(event) {
    let field = event.target.name; //which input
    let value = event.target.value; //what value
    let changes = {}; //object to hold changes
    changes[field] = value; //change this field
    this.setState(changes); //update state
  }

  componentWillMount() {
    var CMVdrugarray = []
    db
      .collection('drug')
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            var object = doc.data();
            var keys = Object.keys(object);
            var i;
            for (i = 0; i < keys.length; i++) {
              CMVdrugarray.push({
                label: keys[i],
                value: keys[i]
              })
            }
            this.setState({ CMVdrugs: CMVdrugarray })
          });
      });

    var HSVdrugarray = [];
    db
      .collection('HSVdrug')
      .get()
      .then(snapshot => {
        snapshot
          .docs
          .forEach(doc => {
            // var object = JSON.parse(doc._document.data)
            var object = doc.data();
            var keys = Object.keys(object);
            var i;
            for (i = 0; i < keys.length; i++) {
              HSVdrugarray.push({
                label: keys[i],
                value: keys[i]
              })
            }
            this.setState({ HSVdrugs: HSVdrugarray })
          });
      });
  }


  render() {
    console.log(this.state.user.email)
    let { gene, variant, Virus, selecteddrugs } = this.state
    let drugs = '';
    if (Virus === "CMV") {
      drugs = this.state.CMVdrugs
    } else if (Virus === "HSV-1" || Virus === "HSV-2") {
      drugs = this.state.HSVdrugs
    }
    let isInvalid = gene === "" || variant === "" || Virus === "" || selecteddrugs[0] === "";
    return (
      <div className="container">
        <h3 className='pageheader'>Add Variants to the Database</h3>
        <div style={{ display: "flex", flexDirection: "flex-row", justifyContent: "space-around" }}>
          <form style={{ flexGrow: "1", marginRight: "5vw" }}>
            <div>
              <VirusSelectField changeSelection={this.onChangeSelectionVirus.bind(this)}></VirusSelectField>
              <GeneSelectField virus={this.state.Virus} changeSelection={this.onChangeSelectionGene.bind(this)}></GeneSelectField>
            </div>
          </form>
          <form style={{ flexGrow: "1" }}>

            <MultiDrugSelectField changeSelection={this.onChangeSelectionDrug.bind(this)} input={drugs}></MultiDrugSelectField>
            <Input label="Enter your variant" type="variant" className="form-control"
              name="variant"
              value={this.state.variant}
              onChange={(event) => { this.handleChange(event) }}
            />
          </form>
        </div>
        <div style={{ display: "flex", flexDirection: "flex-row", flexWrap: "wrap" }}>
          {selecteddrugs[0] === "" ?
            <div></div>
            :
            (this.state.selecteddrugs.map(element => {
              return <div key={element} style={{ marginRight: "1rem" }}>
                <label>
                  <Input label={"Enter " + element.charAt(0).toUpperCase() + element.slice(1) + " Fold"}
                    type="number" step=".01" className="form-control"
                    name={element}
                    value={this.state.element}
                    onChange={(event) => { this.handleChange(event) }}
                  />
                </label>
              </div>
            }))
          }
        </div>
        <form>
          <div style={{ display: "flex", flexDirection: "flex-row", alignContent: "space-between" }}>
            <div style={{ alignSelf: "flex-start", marginRight: "5vw" }}>
              <Input label="Enter PMID reference" type="reference" className="form-control"
                name="reference"
                value={this.state.reference}
                onChange={(event) => { this.handleChange(event) }}
              />
            </div>
            <div style={{ alignSelf: "flex-end", width: "60vw" }}>
              <Input label="Enter any additional comments" type="comments" className="form-control"
                name="comments"
                value={this.state.comments}
                onChange={(event) => { this.handleChange(event) }}
              />
            </div>
          </div>
          <div className="form-group">
            <button disabled={isInvalid} type='button' className="btn btn-primary mr-2" onClick={() => this.handleVariant()}>
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
        <ToastContainer />
      </div>
    )
  }
}

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  errorCur: null,
  errorChange: null,
  passworCur: '',
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  reauthenticate = (currentPassword) => {
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
      user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  }

  onSubmit = event => {
    event.preventDefault();
    console.log(this.state.passwordCur)
    this.reauthenticate(this.state.passwordCur).then(() => {
      var user = firebase.auth().currentUser;
      user.updatePassword(this.state.passwordTwo).then(() => {
        this.setState({ ...INITIAL_STATE });
        toast.success("Password updated!", {
          toastId: 13,
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }).catch((error) => {
        this.setState({ errorChange: error.message })
        toast.error(error.message, {
          toastId: 13,
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });;
      });
    }).catch((error) => {
      this.setState({ errorCur: error.message });
      toast.error(error.message, {
        toastId: 13,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { passwordOne, passwordTwo, error, passwordCur } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';
    console.log(this.props.user)
    return (
      <div className="container">
        <h3 className='pageheader'>Change your password</h3>
        <MDBContainer>
          <MDBRow>
            <MDBCol md="6">
              <form onSubmit={this.onSubmit}>
                <p className="h4 mb-4">Account Email: {this.props.user.email}</p>
                <label htmlFor="defaultFormLoginPasswordEx" className="grey-text">
                  Your current password
                </label>
                <input
                  name="passwordCur"
                  value={passwordCur}
                  onChange={this.onChange}
                  placeholder="Current Password"
                  type="password"
                  className="form-control"
                />
                <br />
                <label htmlFor="defaultFormLoginPasswordEx" className="grey-text">
                  Your new password
                </label>
                <input
                  name="passwordOne"
                  value={passwordOne}
                  onChange={this.onChange}
                  type="password"
                  placeholder="New Password"
                  type="password"
                  className="form-control"
                />
                <br />
                <label htmlFor="defaultFormLoginPasswordEx" className="grey-text">
                  Your new password
                </label>
                <input
                  name="passwordTwo"
                  value={passwordTwo}
                  onChange={this.onChange}
                  type="password"
                  placeholder="Confirm New Password"
                  type="password"
                  className="form-control"
                />
                <div className="mt-4">
                  <MDBBtn disabled={isInvalid} color="indigo" type="submit">Change Password</MDBBtn>
                </div>
              </form>
              <ToastContainer />
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}


class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    event.preventDefault();
    const { email } = this.state;
    if (email === undefined) {
      toast.error("No email provided", {
        toastId: 13,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        toast.success("Password reset email sent to " + email + "!", {
          toastId: 13,
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch(error => {
        toast.error(error.message, {
          toastId: 13,
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, error } = this.state;

    const isInvalid = email === '';

    return (
      <div className="container">
        <h3 className="pageheader">Password Reset Request</h3>
        <MDBContainer>
          <form onSubmit={this.onSubmit}>
            <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
              Your email
            </label>
            <input
              name="email"
              value={this.state.email}
              onChange={this.onChange}
              type="text"
              placeholder="Email Address"
              type="email"
              className="form-control"
            />
            <div className="text-center mt-4">
              <MDBBtn disabled={isInvalid} color="indigo" type="submit">Email Reset</MDBBtn>
              <Link to={"/login"}>
                <MDBBtn color="unique" type="submit">Back to Login</MDBBtn>
              </Link>
            </div>
          </form>
          <ToastContainer />
        </MDBContainer>
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
  // handleSignUp() {

  //   /* Create a new user and save their information */
  //   if (this.state.code === 'UW206') {
  //     firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
  //       .then(firebaseUser => {
  //         //include information (for app-level content)
  //         let profilePromise = firebaseUser.updateProfile({
  //           displayName: this.state.email,
  //         }); //return promise for chaining

  //         return profilePromise;
  //       })
  //       .then(firebaseUser => {
  //         this.setState({
  //           user: firebase.auth().currentUser
  //         })
  //       })
  //       .catch((err) => {
  //         toast.error(err.message, {
  //           toastId: 13,
  //           position: "top-right",
  //           autoClose: 5000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //         });
  //         this.setState({ errorMessage: err.message })
  //       })
  //   } else {
  //     this.setState({ errorMessage: "Incorrect sign up code" })
  //   }
  // }


  handleSignIn = e => {
    //A callback function for logging in existing users

    /* Sign in the user */
    e.preventDefault();
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        this.setState({
          user: user
        })
        toast.success("Logged in", {
          toastId: 13,
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        this.props.history.push("/WelcomePage");
      })
      .catch((err) => {
        toast.error(err.message, {
          toastId: 13,
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
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
        <form onSubmit={this.handleSignIn}>
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
            <button type="submit" className="btn btn-success mr-2">
              Sign In
                </button>
          </div>
        </form>
        <p>
          <Link to={"/PasswordForget"}>Forgot Password?</Link>
        </p>
        <p>
          Don't have an account? <Link to={"/SignUp"}>Sign Up</Link>
        </p>
        <ToastContainer />
      </div>
    );
  }
}

const SIGN_UP_INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
  code: '',
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...SIGN_UP_INITIAL_STATE };
  }

  onSubmit = event => {
    event.preventDefault();
    /* Create a new user and save their information */
    if (this.state.code === 'UW206') {
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.passwordOne)
        .then(firebaseUser => {
          //include information (for app-level content)
          // let profilePromise = firebaseUser.updateProfile({
          //   displayName: this.state.email,
          // }); //return promise for chaining
          toast.success("Account Created", {
            toastId: 13,
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          // return profilePromise;
        })
        .then(firebaseUser => {
          this.setState({
            user: firebase.auth().currentUser
          })
        })
        .catch((err) => {
          toast.error(err.message, {
            toastId: 13,
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          this.setState({ errorMessage: err.message })
        })
    } else {
      toast.error("Incorrect sign up code", {
        toastId: 13,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      this.setState({ errorMessage: "Incorrect sign up code" })
    }
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
      code
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '';

    return (
      <div className="container">
        <h3 className="pageheader">Sign up</h3>
        <form onSubmit={this.onSubmit}>
          <label htmlFor="defaultFormRegisterNameEx" className="grey-text">
            Sign up code
                </label>
          <input
            name="code"
            value={code}
            onChange={this.onChange}
            type="text"
            placeholder="Sign up code"
            className="form-control"
          />
          <br />
          <label htmlFor="defaultFormRegisterNameEx" className="grey-text">
            Your name
                </label>
          <input
            name="username"
            value={username}
            onChange={this.onChange}
            type="text"
            placeholder="Full Name"
            className="form-control"
          />
          <br />
          <label htmlFor="defaultFormRegisterEmailEx" className="grey-text">
            Your email
                </label>
          <input
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
            type="email"
            className="form-control"
          />
          <br />
          <label
            htmlFor="defaultFormRegisterPasswordEx"
            className="grey-text"
          >
            Your password
                </label>
          <input
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
            type="password"
            className="form-control"
          />
          <br />
          <label
            htmlFor="defaultFormRegisterPasswordEx"
            className="grey-text"
          >
            Confirm password
                </label>
          <input
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="Confirm Password"
            type="password"
            className="form-control"
          />
          <div className="text-center mt-4">
            <MDBBtn color="indigo" disabled={isInvalid} type="submit">
              Register
                  </MDBBtn>
            <Link style={{ color: "white" }} to={"/login"}>
              <MDBBtn color="unique">Back to log in</MDBBtn>
            </Link>
          </div>
          {error && <p>{error.message}</p>}
        </form>
        <ToastContainer />
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
      value: this.props.input,
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
    let isInvalid = false;
    if (options === '') {
      isInvalid = true;
    }
    return (
      <div className="section">
        <Select
          closeOnSelect={stayOpen}
          disabled={isInvalid}
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
      stayOpen: true,
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
    var options = [];
    let isInvalid = false;
    let virus = this.props.virus
    if (virus === "CMV") {
      options = [
        { value: 'ul54polymerasevariance', label: 'UL54 Polymerase' },
        { value: 'ul56terminasevariants', label: 'UL56 Terminase' },
        { value: 'ul97phosphotransferasevariants', label: 'UL97 Phosphotransferase' }
      ];
    } else if (virus === "HSV-1") {
      options = [
        { value: 'HSV1Polymerase', label: 'UL30 - DNA Polymerase' },
        { value: 'HSV1ThymidineKinase', label: 'UL23 - Thymidine Kinase' },
      ];
    } else if (virus === "HSV-2") {
      options = [
        { value: 'HSV2Polymerase', label: 'UL30 - DNA Polymerase' },
        { value: 'HSV2ThymidineKinase', label: 'UL23 - Thymidine Kinase' },
      ];
    } else {
      isInvalid = true;
    }
    return (
      <div className="section">
        <Select
          closeOnSelect={stayOpen}
          disabled={isInvalid}
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

var VirusSelectField = createClass({
  displayName: 'SingleSelectField',
  propTypes: {
    label: PropTypes.string,
  },
  getInitialState() {
    return {
      removeSelected: true,
      disabled: false,
      stayOpen: true,
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
      { value: 'CMV', label: 'CMV' },
      { value: 'HSV-1', label: 'HSV-1' },
      { value: 'HSV-2', label: 'HSV-2' }
    ]
    return (
      <div className="section">
        <Select
          closeOnSelect={stayOpen}
          disabled={disabled}
          onChange={this.handleSelectChange}
          options={options}
          placeholder="Choose a virus"
          removeSelected={this.state.removeSelected}
          rtl={this.state.rtl}
          simpleValue
          value={value}
        />
      </div>
    );
  }
});
//export default withAuthenticator(App, true);
export default withRouter(App);

