pragma solidity ^0.4.17;
contract ship1{
    address  trader;
    struct products{
        address trader;
        string name;
        uint price;
        string state;
    }
    modifier onlyTrader{
        require(msg.sender==trader);
        _;
    }
    
    uint[] public uniqueId;
    //events
    event oredrPlaced(address _from,string product,string state);
    mapping(address=>products) orders;
    modifier valid(address add){
        products obj=orders[add];
       require(obj.price!=0||add==trader);
       _;
    }
    products[] public pr;
    function ship1(){
        trader=msg.sender;
    }
    function placeOrder(uint ind) public {
    products obj;
    obj.trader=trader;
    obj.name=pr[ind].name;
    obj.price=pr[ind].price;
    obj.state=pr[ind].state;
    orders[msg.sender]=obj;
    oredrPlaced(msg.sender,obj.name,obj.state);
    uniqueId.push(uint(keccak256(msg.sender)));
    }
    function addProduct(string names,uint prices) public onlyTrader {
        pr.push(products(trader,names,prices,"order placed"));
    }

    function getPendingTransactions() view external returns(uint[]) {
        return uniqueId;
    }
}