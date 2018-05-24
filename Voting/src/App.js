import React, { Component } from 'react'
import VotingContract from '../build/contracts/Voting.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import './Try.css'


const contractAddress = "0x0b6d261eb8d621dd9cec23faa781f8e0e5b6fe3c";
var votingContractInstance;
var account;
var stuffs = [
              {       
              }
            ];


class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
     candidates: null,
      web3: null,
      done: false,
      already:false,
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3.then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const votingContract = contract(VotingContract)
    votingContract.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.


    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      votingContract.at(contractAddress).then((instance) => {
        account = accounts[0];
        votingContractInstance = instance;

            console.log(votingContractInstance);

            votingContractInstance.getLength().then(result => {
            let length = result;
	    console.log(length);
          });

        })
      })
  }

 refresh =( )=>{

   	votingContractInstance.getLength().then(result => {
               let length = result.c[0];
               var nextName;
   	    console.log(result);
   	    console.log(length);
   	    for(let i = 0 ; i < length ; i++){
   votingContractInstance.getInfo(i).then(result => {

   		nextName =result;

   		console.log(result);

   	              var nextOne = {       "name": nextName,
   		 	       		                      "total":0,
   			       		                      "up": 0,
                	     	       	        "down": 0,
   					                            "all":0

                			  };
   	 		 stuffs.push(nextOne);
             let number =0;
             for(let i = 0; i < stuffs.length; i++) {
               if (nextName === stuffs[i].name ) {
                 number = i;
                 break;
               }
             }
    votingContractInstance.totalUpFor(nextName).then(result => {
               stuffs[number].up = result.c[0];
   	    this.setState({done:true});
             });
   	 votingContractInstance.totalDownFor(nextName).then(result => {
               stuffs[number].down = result.c[0];
   	    this.setState({done:true});
             });
   	 votingContractInstance.totalAlllFor(nextName).then(result => {
               stuffs[number].all = result.c[0];
   	    this.setState({done:true});
             });
            votingContractInstance.totalVotesFor(nextName).then(result => {
               stuffs[number].total = result.c[0] * result.s;
               this.setState({done:true});
             });
         })}
       });
       alert("数据传输中...");

}


good = (stuffName)=>{

  votingContractInstance.ThumbupForStuff(stuffName,{from:account}).then((result => {
    console.log(result);
    console.log(stuffName);
    let number =0;
    for(let i = 0; i < stuffs.length; i++) {
      if (stuffName === stuffs[i].name ) {
        number = i;
        break;
      }
    }

    votingContractInstance.totalUpFor(stuffName).then(result => {

stuffs[number].up = result.c[0];

    });
votingContractInstance.totalAlllFor(stuffName).then(result => {

stuffs[number].all = result.c[0];

    });
   votingContractInstance.totalVotesFor(stuffName).then(result => {

stuffs[number].total = result.c[0] * result.s;

      this.setState({done:true});
    });
  }));
}

bad = (stuffName) => {
    votingContractInstance.ThumbdownForStuff(stuffName,{from:account}).then((result => {
    console.log(result);
    console.log(stuffName);
    let number =0;
    for(let i = 0; i < stuffs.length; i++) {
      if (stuffName === stuffs[i].name ) {
        number = i;
        break;
      }
    }


    votingContractInstance.totalDownFor(stuffName).then(result => {

stuffs[number].down = result.c[0];

    });
votingContractInstance.totalAlllFor(stuffName).then(result => {

stuffs[number].all = result.c[0];

    });
   votingContractInstance.totalVotesFor(stuffName).then(result => {
      stuffs[number].total = result.c[0] * result.s;

      this.setState({done:true});
    });
  }));
}

valid =(stuffName) =>{
  votingContractInstance.validStuff(stuffName).then(result=>{
    console.log(result);
    this.setState({already:result});
    if(this.state.already===true){
      alert("搜索成功，正在置顶")
      this.search(stuffName);
    }if(this.state.already===false){
      alert("搜索结果不存在，请添加");
    }
  })
}

valid2 =(stuffName) =>{
  votingContractInstance.validStuff(stuffName).then(result=>{
    console.log(result);
    this.setState({already:result});
  })
}

search =(stuffName) =>{
      let number =0;
      for(let i = 0; i < stuffs.length; i++) {
      if (stuffName === stuffs[i].name ) {
        number = i; var temp4 = stuffs[number];
          for(let j = number ; j > 1 ; j--){
              stuffs[j] = stuffs[j-1] ;}
              stuffs[1] = temp4 ;
            }this.setState({done:true});
    }
}

create =(stuffName)=>{
  votingContractInstance.createVoting(stuffName,{from:account}).then((result => {
    console.log(result);
    console.log(stuffName);
    var newOne = {       "name": stuffName,
                          "total":0,
                          "up":0,
                          "down":0,
                          "all":0
        };
          stuffs.push(newOne);

    votingContractInstance.validStuff(stuffName).then(result => {
      console.log("transction sending");
      this.setState({done:true});
    });
  }));
}



  render() {

    return (
      <div className="App">
      <h1>基于区块链技术的文化内容评价平台</h1>
      <h3>本合约地址为0x0b6d261eb8d621dd9cec23faa781f8e0e5b6fe3c</h3>
      <div className="abc">

            <button className="buttona" id = "btn"onClick={() => {

      	         this.refresh();
                 document.getElementById("btn").disabled=true;

            }}>从区块链中获取数据</button></div>


<div className="new">
      <input
            className="buttonb"
            placeholder="请输入想要添加的新内容"
            ref="stuffInput"
      />

      <button className="buttona" onClick={() => {
        let stuffName = this.refs.stuffInput.value;
        this.create(stuffName);
      }}>添加</button></div>




<div className="good">
      <input
            className="buttonb"
            placeholder="请发起好评"
            ref="stuffInput1"
      />

      <button className="buttona" onClick={() => {
        let stuffName = this.refs.stuffInput1.value;
        this.good(stuffName);
      }}>好评</button></div>

<div className="bad">
      <input
            className="buttonb"
            placeholder="请发起差评"
            ref="stuffInput2"
      />

      <button className="buttona" onClick={() => {
        let stuffName = this.refs.stuffInput2.value;
        this.bad(stuffName);
      }}>差评</button> </div>


<div className="search">
      <input
            className="buttonb"
            placeholder="请输入想要搜索的内容"
            ref="serach"
      />

      <button className="buttona" onClick={() => {
        let stuffName = this.refs.serach.value;
        this.valid(stuffName);



      }}>搜索</button></div>



<div className="rank">
      <input
            className="buttonb"
            placeholder="输入up,down,all获得排行"
            ref="getrank"
      />

      <button className="buttona" onClick={() => {
        console.log(this.refs.getrank);
        console.log(this.refs.getrank.value);
        let order = this.refs.getrank.value;
 if (order === "up"){
        for(let i = 0; i< stuffs.length;i++){

           var maxrank1 = i;

           for(let j = i+1;j<stuffs.length;j++){

           if(stuffs[j].up > stuffs[maxrank1].up){
           maxrank1 = j;
       }
       }
           if(maxrank1 !== i){
             var temp1 = stuffs[i];
 	     stuffs[i] = stuffs[maxrank1];
	     stuffs[maxrank1] = temp1 ;
		}
	}
       this.setState({done:true});
       }


  if (order === "down"){
        for(let i = 0; i< stuffs.length;i++){

           var maxrank2 = i;

           for(let j = i+1;j<stuffs.length;j++){

           if(stuffs[j].down > stuffs[maxrank2].down){
           maxrank2 = j;
       }
       }
           if(maxrank2 !== i){
             var temp2 = stuffs[i];
 	     stuffs[i] = stuffs[maxrank2];
	     stuffs[maxrank2] = temp2 ;
		}
	}
       this.setState({done:true});
       }

  if (order === "all"){
        for(let i = 0; i< stuffs.length;i++){

           var maxrank3 = i;

           for(let j = i+1;j<stuffs.length;j++){

           if(stuffs[j].all > stuffs[maxrank3].all){
           maxrank3 = j;
       }
       }
           if(maxrank3 !== i){
             var temp3 = stuffs[i];
 	     stuffs[i] = stuffs[maxrank3];
	     stuffs[maxrank3] = temp3 ;
		}
	}
       this.setState({done:true});
       }

       this.setState({done:false});

     }}>排行</button></div>





     <table width="100%" className="table">

            <tr>
              <th>名称</th>
              <th>好评数</th>
              <th>差评数</th>
              <th>净评价</th>
              <th>总评价</th>
              </tr>
       {


        stuffs.map((object) => {
          return (

              <tr>

               <td>{object.name}</td>
               <td>{object.up}</td>
               <td>{object.down}</td>
               <td>{object.total}</td>
               <td>{object.all}</td>

               </tr>
           )
        })
       }
     </table>





      </div>
    );
  }
}

export default App
