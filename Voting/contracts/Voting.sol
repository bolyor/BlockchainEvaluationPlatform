pragma solidity ^0.4.21;

contract Voting {

  //init stuct Stuff
struct Stuff{
  bytes32 name;
  int8  total;
  int8 up;
  int8 down;
  int8 alll;
}
  int listnumber = 0;
  mapping(bytes32 => Stuff)public stfs;
  //save stufflist
  
  Stuff[] public stuffList;
  
  function getInfo(uint a) public constant
  returns(string){
          bytes32 data = stuffList[a].name;
          return (bytes32ToString(data));
      
  }
  
  function getLength() public constant
  returns(int){
          
          return(listnumber);
      
  }
  //init stufflist
 function Voting(bytes32[]initoption) public{
    
    for(uint i=0; i<initoption.length; i++){
    
    listnumber += 1;
    
    stuffList.push(Stuff(initoption[i],0,0,0,0));
    
    stfs[initoption[i]] = Stuff(initoption[i],0,0,0,0);
    
    }
}

  //add votingstuff
  function createVoting(bytes32 stuffName) public{
   
        assert(validStuff(stuffName) == false);
    
        stuffList.push(Stuff(stuffName,0,0,0,0));
        
        stfs[stuffName]=Stuff(stuffName,0,0,0,0);
         
        listnumber += 1;

  }

  //get total votes of stuff
  function totalVotesFor(bytes32 stuff)  public constant returns (int8) {
      
   assert(validStuff(stuff) == true);

    return stfs[stuff].total;
  }
  
 function totalAlllFor(bytes32 stuff)  public constant returns (int8) {
      
   assert(validStuff(stuff) == true);

    return stfs[stuff].alll;
  }
  
  //get total thumbups for stuff
  function totalUpFor(bytes32 stuff)  public constant returns (int8) {
      
   assert(validStuff(stuff) == true);

    return stfs[stuff].up;
    
  }
  
  //get total thumbdowns for stuff
  function totalDownFor(bytes32 stuff)  public constant returns (int8) {
        
   assert(validStuff(stuff) == true);

    return stfs[stuff].down;
    
    
  }
  
  
  // 
  function ThumbupForStuff(bytes32 stuff) public{
      
   assert(validStuff(stuff) == true);
    
    stfs[stuff].up += 1;
    
    stfs[stuff].total += 1;
    
    stfs[stuff].alll += 1;
    
  }
    //
  function ThumbdownForStuff(bytes32 stuff) public{
      
   assert(validStuff(stuff) == true);
    
    stfs[stuff].down += 1;
    
    stfs[stuff].total -= 1;
    
    stfs[stuff].alll += 1;
    
    
  }
  

  

  // To check the stuff location in the list
  function validStuff(bytes32 stuff)public constant returns (bool) {
    for(uint v = 0; v < stuffList.length; v++) {
      if (stuffList[v].name == stuff) {
        return true;
      }
    }
    return false;
  }
  
    function bytes32ToString(bytes32 x) constant returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }

    function bytes32ArrayToString(bytes32[] data) constant returns (string) {
        bytes memory bytesString = new bytes(data.length * 32);
        uint urlLength;
        for (uint i = 0; i< data.length; i++) {
            for (uint j = 0; j < 32; j++) {
                byte char = byte(bytes32(uint(data[i]) * 2 ** (8 * j)));
                if (char != 0) {
                    bytesString[urlLength] = char;
                    urlLength += 1;
                }
            }
        }
        bytes memory bytesStringTrimmed = new bytes(urlLength);
        for (i = 0; i < urlLength; i++) {
            bytesStringTrimmed[i] = bytesString[i];
        }
        return string(bytesStringTrimmed);
    }    
  
}
