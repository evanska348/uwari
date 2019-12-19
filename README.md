# About uwari.io

## Project Summary

This project is a web app that provides a search service for antiviral resistance in common antiviral agents in CMV, HSV-1, and HSV-2 using specific amino acid variants or FASTA or Sanger sequencing ABI files.
# About uwari.io

## Project Summary

This project is a web app that provides a search service for antiviral resistance in common antiviral agents in CMV, HSV-1, and HSV-2 using specific amino acid variants or FASTA or Sanger sequencing ABI files.

### Services and Languages used

The web app is a single page application built using the React.js web framework for the client side. This web framework uses JSX and Javascript. The webpage is styled using CSS. Google Firebase middleware and database products are used for most database operations. AWS S3 and Lambda are used for sequence file storage and processing. The Lambda environment runs python code for sequence conversion. A Node.js server hosted on AWS EC2 is used to call all AWS operations and handlers.

## Systems Design

![](2019-11-11-16-34-22.png)

### Client Side application

 * React.js
 * React Material design
 * ES6 sometimes - needs improving

### Server Side application

### Hosting

Ec2 for server
Godaddy for domain registrar
github pages


### Databases

This application mainly uses Google Firebase services for data storage. Firebase provides a _working_ middleware suite and provides a very workable console interface. This makes it very quick and easy to implement. Data can be directly manipulated through the console interface, which may be useful if any data is unwanted, wrong, or missing.

* **Google Firebase Authentication** - user profile
* **Google Firebase Realtime Database** - profile specific data
* **Google Firebase Cloud Firestore** - Variant data
* **AWS S3** - temporary sequence file storage

Firebase configurations and initialization:

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

### **App**

Sets up all the page routes in the navigation bar. The nav bar stylings use Material Design Bootstrap React (MBDReact), where navlinks are connected to routes and Home is the default route. Example:

```html
<NavItem>
  <NavLink exact className="nav-link waves-effect waves-light" aria-haspopup="true" aria-expanded="false" to="/WelcomePage">Home</NavLink>
</NavItem>
<Route path="/WelcomePage" component={WelcomePage} />
```

This is also the top of the tree where user information is brought to and then spread to components that need user information. Therefore an instance of user state is kept within this component. This instance of state is fed to all pertinent components in the form of the user ID and object through inline callback functions. Example:

```html
   <Route path="/HSV1db" render={(props) => (
              <HSV1db {...props} uid={this.state.user} user={this.state.user} />
            )} />
```

Lastly it handles the logout operation.

```Javascript
  handleLogout() {
    this.setState({
      user: ''
    });
    firebase.auth().signOut()
      .catch((err) => {
        console.log(err)
      })
  }
```

### **WelcomePage**

  This is the simplest example of a component in the entire web app. Purely JSX, it is the default page. 

### **Variant Input Classes**

Variant input class component names:

* HSV1db
* HSV2db
* CMVdb

There is one variant input class for each virus - HSV-1, HSV-2, and CMV. These area all almost identical in structure, however, they use different databases. Once clicked on, the component immediately starts to load data from Firebase Firestore, which stores all the drug names and variants. Before the data is returned and the component state is updated, a loading screen will be shown. This is data fetch is done with the generic docRef.get() callback function within componentWillMount as explained in the databases sections. All data is preloaded in this class working in three display stages through ternary operators in the JSX. While the drug data has not been loaded, a loading screen will show. Once the drug data has been loaded and the drug state has been updated, the dropdowns will show, allowing the user to input variant selections. Example dropdown:

```html
<MultiDrugSelectField changeSelection={this.onChangeSelectionDrug.bind(this)} input={this.state.drugs}></MultiDrugSelectField>
```

Once the analyze button is clicked, the results component will be shown (See 'Results Classes' below). Which will feed in components of the preloaded data to show just selected data. Example results container:

```html
<StickyContainer>
  <Sticky>{({ style }) => 
  <div style={{ zIndex: '1', position: 'absolute', right: '10vw' }} >
  <button style={style} onClick={this.handleSubmit.bind(this)} className="btn btn-primary" type="submit">Back to Saved Sequences</button>
  </div>
  }
  </Sticky>
    <div>
      <p>{this.state.mutation_list}</p>
        <Results saveButton={true} user={this.props.user} selecteddrugs={this.state.selecteddrugs} epistasis={this.state.epistasis} selected97phos={this.state.selected97phos} selected54poly={this.state.selected54poly} selected56term={this.state.selected56term} isClicked={this.state.submitClicked}></Results>
      </div>
</StickyContainer>
```

In terms of functions, this component mainly has two types repeated across all the genes. Within componentWillMount, the class preloads all data from Firebase Firestore and updates the component state (poly in example below). Example:

```javascript
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
```

Once the component data state is updated, the user can select certain options that change the component selected state (selected97phos in example below), which is given as a prop to the results page when the submit button is clicked. Example:

```javascript
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
```

The submit function is just there to make sure that the state remains consistent/properly resets when submit is clicked and results are shown. Example:

```javascript
  handleSubmit() {
    if (this.state.selected54poly === [] &&
      this.state.selected56term === [] &&
      this.state.selected96phos === []) {
      this.setState({ empty: true });
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
```

Possible Improvements:

* These classes could be combined into one componenet class that handles all three viruses.
* Since the drugs databases and variants dont change very often, they could be cached after the first load.
* The state management in handleSubmit is slighty buggy at times.

### **AB1/FASTA Input Classes**

File input class component names:

* CMVFileInput
* HSV1FileInput
* HSV2FileInput

Similar to the variant input classes, the file input classes are very similar between CMV, HSV-1, and HSV-2 in structure. 

#### CMVFileInput

#### HSV1FileInput

#### HSV2FileInput

### **Results Classes**

#### Results

#### HSVResults

Possible Impovements:

* Epistasis is found at a worst case runtime of O(N^3), this could be improved.

### **Formatting Classes**

#### ActiveFormatter

#### FormattedCitation

#### FoldCard

### **User Classes**

#### Login

#### SavedSequences

#### AddVariants

#### PasswordChangeForm

#### PasswordForgetFormBase

#### SignUpFormBase

### **FileCardComplete**

### **Selection functions**

#### MultiDrugSelectField

#### GeneSelectField

#### VirusSelectField

## Server Side Functions and Handlers -- File Management

## EC2 Server Call to AWS S3

Simplified Client Side Submit file function example for HSV2:

```javascript
  //Submit file is a callback function that takes in the gene and file(event)
  submitFile = (gene) => (event) => {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    formData.append('string', gene)
    if (gene === 'hsv2tk') {
      this.setState({ txt23: 'loading...', ul23filename: event.target.files[0].name });
    } else if (gene === 'hsv2pol') {
      this.setState({ txt30: 'loading...', ul30filename: event.target.files[0].name });
    }
    //using regex to find the extension
    let extension = event.target.files[0].name.match(/\.[0-9a-z]+$/i)[0];
    //checking extension for fasta
    if (extension === '.fasta' || extension === '.fa') {
      let reader = new FileReader();
      reader.onload = function (e) {
        let result = reader.result;
        // break the textblock into an array of lines
        var lines = result.split('\n');
        //removing the header line in the fasta file
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
    //checking for ab1
    } else if (extension === '.ab1' || extension === '.abi') {
      //posting to server through route 'test-upload'
      axios.post(`http://ec2-52-41-160-246.us-west-2.compute.amazonaws.com:3000/test-upload`, formData, {
        headers: corsheaders
      }).then(response => {
        if (gene === 'hsv2tk') {
          this.updateInput23({ target: { value: response.data } });
        } else if (gene === 'hsv2pol') {
          this.updateInput30({ target: { value: response.data } });
        }
        //printing error from server post
      }).catch(error => {
        toast.error(error)
      });
      //returning a client side error -- wrong file type
    } else {
      toast.error("File extension must be .ab1 .abi .fasta .fa")
      });
      if (gene === 'hsv2tk') {
        this.setState({ txt23: 'Improper File Type' });
      } else if (gene === 'hsv2pol') {
        this.setState({ txt30: 'Improper File Type' });
      }
    }
  }
```

In the case of a Fasta file input, file management can be down on the client browser by simply removing the header line and returning the protein sequence of the gene without spaces or line changes. This operation can be found inside the if statement checking for the fasta extension in the above code.

In the caase of an AB1 file input, **the file needs to be sent to server side operations** in order to be converted into a properly aligned sequence of proteins, which presents a much longer process. The client side acheives this by using the package 'axios', to post to an Ubuntu EC2 server hosted at *http://ec2-52-41-160-246.us-west-2.compute.amazonaws.com:3000*. Simply, this server is an Ubuntu configured machine hosted on EC2 that is configured to constantly run a Node.js server at the previous url. This Node.js code has one function at route /test-upload as seen in the above code prepending the url.

Improvement notes:

* a noteable security deficiency of the server is that it is not hosted securely (https vs http), which makes it accessable by anyone

Simplified Node.js Server Example:

```javascript
//Callback function that takes in a request form and updates a response to client
app.post('/test-upload', (request, response) => {
  const form = new multiparty.Form();
  form.parse(request, async (error, fields, files) => {
    if (error) throw new Error(error);
    try {
      //reformatting the file in to a unique key using crypto hashing
      const path = files.file[0].path;
      const buffer = fs.readFileSync(path);
      const timestamp = Date.now().toString();
      const rand = Math.random().toString();
      const hash = crypto.createHash('sha1').update(timestamp + rand).digest('hex')
      ;
      const type = fields.string[0];
      const fileName = `${hash}--${type}--`;
      //uploading the file to s3
      const data = await uploadFile(buffer, fileName);
      while (!sequence) {
        await delay(2000);
        //waiting for a completed file to appear in s3 and getting it
        downloadFile(`${fileName}.txt`);
      }
      //deleting the completed file immediately to minimize conflicts and save s3 storage
      s3.deleteObjects(params, function (err, data) {
        if (err) console.log(err, err.stack);
        else console.log(data);
      })
      let dat = sequence;
      sequence = '';
      //returning status 200 function success with the data
      return response.status(200).send(dat);
    } catch (error) {
      //returning a status 400 with the error
      return response.status(400).send(error);
    }
  });
});
```

* functions to upload and download from s3 not shown
* delay function not shown
* AWS configuration and cors policies not shown

The above function is the main entrypoint to the server, with an opening at port 3000. With a request of a file, it cryptographically hashes the timestamp of the file and a random number to make it a uniquely identifiable filename in case there are multiple uploads of the same filename while the first file is being processed, removing the need for function locks. This unique filename is also appended with a gene type identifier needed later-on to align to the correct gene. This is file with new unique filename is uploaded to the S3 bucket to be processed. The server then waits for a new file under the correct identifyer in text format to appear in s3 and downloads it. To save storage, it then deletes immediately deletes the uploaded file and response file in the S3 bucket. This is then sent back to the client side with a response status 200 and the processed txt file. In the event that a server error or timeout occurs, a response 400 is returned.

Improvement Notes:

* The download function is on a 2 second cycle waiting for the response to be uploaded to s3. There is a way to post directly to the server, however, I was unable to figure this process out from the Lambda environment.
* The Lambda environment creates a small virtual environment which theoretically could post to the server address direction, but it is restricted to one language, and I was unable to do this within Python (needed for the Bio package). This is also difficult in that in needs to return to a specific client which would require logging in to use the file input feature.

## AWS S3 -> AWS Lambda Environment

Since an aligned protein sequence is needed for the client side to process and check with the database, AB1 files need to be aligned and converted to protein sequence in order to be usable. Unfortunately, there is no such javascript/node package that does this type of operation. However, Python's Bio package is able to do all these operations so a virtual machine is needed to run this code python code in the cloud. This machine is initialized within AWS Lambda and runs in response to S3 posts.

![](2019-11-11-15-46-22.png)

AWS S3 and AWS Lambda are set to post and receive to each other on the AWS console. Everytime a new file with extension .ab1 is posted to the S3 bucket, it posts a change to AWS Lambda which receives the new file. Lambda aligns the AB1 input file and changes it to a protein sequence, then reuploads the new file to a output bin in the text format with a .txt extension. Since this new file has a .txt extension, it does not trigger the lambda function again, which would result in an error loop.

Lambda python envirnoment main function:

```python
def lambda_handler(event, context):
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        #finding gene
        gene = key.split("--")[1]
        up = key.rsplit(".", 1)[0] + '.txt'
        #setting download and upload paths
        download_path = '/tmp/{}{}'.format(uuid.uuid4(), key)
        upload_path = '/tmp/txtformat-{}'.format(up)
        #download from s3
        s3_client.download_file(bucket, key, download_path)
        #sequence conversion method below
        seq_conversion(download_path, upload_path, gene)
        #uploading new file to S3 under same unique filename with extension .txt
        s3_client.upload_file(upload_path, bucket, up)
```

The main function lambda_handler is very simple and simply grabs the file, calls on a sequence conversion method, and then reuploads it.

```python
def seq_conversion(download_path, upload_path, gene):
    record = SeqIO.read(download_path, "abi")
    #Setting gene to be the correct reference genome
    if (gene == 'cmvphos'):
        gene = 'ATGTCCTCCGC ----'
    elif (gene == 'cmvterm'):
        gene = 'TTAACGCAGAC -----'
    elif (gene == 'cmvpol'):
        gene = 'TCAACAGCATT -----'
    elif (gene == 'hsv1tk'):
        gene = 'TTTATTCTGTC -----'
    elif (gene == 'hsv1pol'):
        gene = 'ATGTTTTCCGG ----- '
    elif (gene == 'hsv2tk'):
        gene = 'TTTATTCTGT -----'
    elif (gene == 'hsv2pol'):
        gene = 'ATGTTTTGT -----'
    else:
      #Something went wrong and the gene is incorrectly formatted by the server
        return {
            'statusCode': 400
        }
    #aligning the input gene to the reference sequence
    q = format(record.seq)
    alignments = pairwise2.align.globalms(q, gene, 2, -1, -6, -5)
    sequence = alignments[0][0]
    sequence = sequence.replace('-', 'n')
    my_seq = Seq(sequence)
    function_output = str(my_seq.translate())
    print(function_output)
    #writing to a text file to return
    txt = open(upload_path, "w")
    txt.write(function_output)
    txt.close()
    #Successful run status code 200
    return {
        'statusCode': 200
    }
```

The seq_conversion method gets the correct gene reference sequence according to the parameter input of gene and aligns it to the inputed AB1 file. This aligned sequence is then converted to a protein sequence and written to a text format. This txt file is then returned to the lambda_handler in final converted format. The lambda_handler will then post this text file to the correct AWS S3 bucket. 

Improvement Notes:

* The Lambda function initializes an environment to process the input file. Without constant use, this takes a while to start up a dedicated environment to processing the file, making the uploads slightly slower than comfortable sometimes.
* The Lambda function is not currently allocated maximum memory and CPU, at 832MB memory (CPU proportional), which can be scaled up considerably if needed.

## AWS Utilization and Resources


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
