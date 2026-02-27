let balance = Number(localStorage.getItem("balance")) || 5000;
let transactions = JSON.parse(localStorage.getItem("tx")) || [];

function save(){
localStorage.setItem("balance",balance);
localStorage.setItem("tx",JSON.stringify(transactions));
}

function addTransaction(amount,type="Sent"){
amount=Number(amount);
if(isNaN(amount)) return;

if(type==="Sent") balance-=amount;
else balance+=amount;

transactions.push({amount,type});
save();
updateUI();
}

function getHistory(){
return transactions;
}