pragma solidity ^0.4.17;
import "./ship1.sol";
contract ship2 is ship1{
    //to check wheteher product has been shipped or not
    event stateChange(string state,address _by);
    function changeState(string state) valid(msg.sender) {
      products obj=orders[msg.sender];
      obj.state=state;
      stateChange(state,msg.sender);
    }
    function payToSeller(address sender) valid(sender) {
        products obj=orders[msg.sender];
        trader.send(obj.price);
    }
    function getStateOfProduct(address _from) view returns(string) {
        products obj=orders[_from];
        return obj.state;
    }
}