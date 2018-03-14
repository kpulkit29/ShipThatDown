import {Component} from '@angular/core';
import {canBeNumber} from '../util/validation';
import {NgForm,FormBuilder, FormGroup, Validators} from '@angular/forms';
const Web3 = require('web3');
const contract = require('truffle-contract');
const shipArtifacts = require('../../build/contracts/ship2.json');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  ship = contract(shipArtifacts);
 currentTab:string="product";
 products=[];
  account: any;
  accounts: any;
  web3: any;
  showPop="";
  balance: number;
  sendingAmount: number;
  recipientAddress: string;
  status: string;
  canBeNumber = canBeNumber;
  buyer:any;
  buyer2:any;
  buyer3:any;
  currState:string;
  newPr:FormGroup;
  newOrder:FormGroup;
  constructor(public fb:FormBuilder) {
    this.newPr = fb.group({
      'name' : [null, Validators.required],
      'price' : [null, Validators.required]
    });
    this.newOrder = fb.group({
      'address' : [null, Validators.required],
      'id' : [null, Validators.required]
    });
    this.checkAndInstantiateWeb3();
    this.onReady();
  }

  checkAndInstantiateWeb3() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof this.web3 !== 'undefined') {
      console.warn('Using web3 detected from external source. If you find that your accounts don\'t appear or you have ' +
        '0 ship, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel ' +
        'free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask');
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(this.web3.currentProvider);
    } else {
      console.warn('No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when ' +
        'you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info ' +
        'here: http://truffleframework.com/tutorials/truffle-and-metamask');
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    }
  }

  onReady() {
    // Bootstrap the ship abstraction for Use.
    this.ship.setProvider(this.web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        alert('There was an error fetching your accounts.');
        return;
      }

      if (accs.length === 0) {
        alert('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        return;
      }
      this.accounts = accs;
      this.account = this.accounts[0];
    });
    //this.addDefault();
  }
addDefault(){
  this.ship.deployed().then((ins)=>{
   return ins.addProduct(this.products[0].Name,this.products[0].price,{from:this.account,gas:500000})
  }).then(res=>{
    alert(JSON.stringify(res));
  });
}
addNew(val){
  console.log(val);
  this.ship.deployed().then((ins)=>{
    return ins.addProduct(val.name,val.price,{from:this.account,gas:500000})
   }).then(res=>{
     alert(JSON.stringify(res));
     this.products.push({"Name":val.name,"price":val.price});
   });
}
addOrder(val){
  this.ship.deployed().then((ins)=>{
    return ins.placeOrder(val.id,{from:val.address,gas:5000000})
   }).then(result=>{
    for (var i = 0; i < result.logs.length; i++) {
      
     var log = result.logs[i];
     console.log(log);
     confirm(JSON.stringify(log.args));
   }
   });
}
pay(){
  console.log(this.buyer);
  this.ship.deployed().then(ins=>{
    return ins.payToSeller(this.buyer,{gas:500000})
  }).then(res=>{
    console.log(res);
      this.buyer="";
  }).catch(e=>{
    alert(e);
   });
}
changeSt(){
  this.ship.deployed().then(ins=>{
    return ins.changeState(this.currState,{from:this.buyer,gas:500000})
  }).then(res=>{
    console.log(res);
    document.getElementById("pop").click();
  }).catch(e=>{
   alert(e);
  });
}
getState(){
  this.ship.deployed().then(ins=>{
    return ins.getStateOfProduct(this.buyer3)
  }).then(res=>{
    alert("Current Status of your product "+res);
    this.buyer3="";
  });
}
changeTab(str){
  this.currentTab=str;
}
 openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

 closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
}
}
