# About uwari.io

## Project Summary

This project is a web app that provides a search service for antiviral resistance in common antiviral agents in CMV, HSV-1, and HSV-2 using specific amino acid variants or FASTA or Sanger sequencing ABI files.

### Services and Languages used

The web app is a single page application built using the React.js web framework for the client side. This web framework uses JSX and Javascript. The webpage is styled using CSS. Google Firebase middleware and database products are used for most database operations. AWS S3 and Lambda are used for sequence file storage and processing. A Node.js server hosted on AWS EC2 is used to call all AWS operations and handlers.

## Systems Design

<image>

### Client Side application

 * React.js
 * React-router in App
 * React Material design
 * ES6 sometimes - needs improving
 * 

### Server Side application

### Hosting
Ec2 for server
Godaddy for domain registrar
github pages


### Databases

This application mainly uses Google Firebase services for data storage. Firebase provides a _working_ middleware suite and provides a very workable console interface. Data can be directly manipulated through the console interface, which may be useful if any data is unwanted, wrong, or missing.

* **Google Firebase Authentication** - user profile
* **Google Firebase Realtime Database** - profile specific data
* **Google Firebase Cloud Firestore** - Variant data
* **AWS S3** - temporary sequence file storage

Firebase configurations and initialization.

```javascript
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
```

Firebase request to call for drugs.

```javascript
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
```

## Client Side Classes Rundown

* App
* WelcomePage
* SavedSequences
* FileCardComplete
* Variant Input Classes
    * HSV1db
    * HSV2db
    * CMVdb
* File Input Classes
    * CMVFileInput
    * HSV1FileInput
    * HSV2FileInput
* Results Classes
    * Results
    * HSVResults
* Formatting Classes
    * ActiveFormatter
    * FormattedCitation
    * FoldCard
* User Classes
    * AddVariants
    * Login
    * PasswordChangeForm
    * PasswordForgetFormBase
    * SignUpFormBase
* Selection functions
    * MultiDrugSelectField
    * GeneSelectField
    * VirusSelectField

## Server Side Functions and Handlers

## AWS Utilization and Resources

