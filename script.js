const btn=document.getElementById("mic");
const output=document.getElementById("output");

/* UI UPDATE */
function updateUI(){
document.getElementById("balanceDisplay").innerText="₹"+balance;

let list=document.getElementById("transactionList");
list.innerHTML="";

transactions.slice().reverse().forEach(t=>{
let li=document.createElement("li");
li.textContent=`${t.type} ₹${t.amount}`;
list.appendChild(li);
});
}
updateUI();

/* SPEECH */
const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
const recognition=new SpeechRecognition();
recognition.lang="en-IN";

btn.onclick=()=>{
speechSynthesis.cancel();
recognition.start();
};

recognition.onresult=(e)=>{
let speech=e.results[0][0].transcript.toLowerCase();
respond(speech);
};

function speak(msg){
output.innerHTML="Assistant: "+msg;
speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
}

/* TEXT INPUT */
function handleText(){
let text=document.getElementById("textInput").value.toLowerCase();
respond(text);
document.getElementById("textInput").value="";
}

/* AMOUNT PARSER */
function parseAmount(text){

text=text.toLowerCase();

const words={one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10};

for(let w in words){
text=text.replace(w,words[w]);
}

let num=text.match(/\d+/);
if(!num) return null;

let amount=Number(num[0]);

if(text.includes("crore")) amount*=10000000;
else if(text.includes("lakh")||text.includes("lac")) amount*=100000;
else if(text.includes("thousand")) amount*=1000;
else if(text.includes("k")) amount*=1000;

return amount;
}

/* PIN SYSTEM */
let pin="1234";
let waitingPin=false;
let pendingAmt=0;
let pendingType="";

/* COMMAND ENGINE */
function respond(input){

if(waitingPin){
if(input.includes(pin)){
waitingPin=false;
addTransaction(pendingAmt,pendingType);
speak("Transaction successful");
}else{
waitingPin=false;
speak("Incorrect PIN");
}
return;
}

if(/balance|money|funds/.test(input)){
speak("Your balance is "+balance+" rupees");
return;
}

if(/history/.test(input)){
toggleHistory();
speak("Showing transactions");
return;
}

if(/send|pay|transfer/.test(input)){
let amt=parseAmount(input);
if(!amt){speak("Say amount");return;}

if(amt>balance){
speak("Insufficient balance");
return;
}

if(amt>10000){
waitingPin=true;
pendingAmt=amt;
pendingType="Sent";
speak("Enter PIN to confirm");
return;
}

addTransaction(amt,"Sent");
speak("Sent "+amt+" rupees");
return;
}

if(/deposit|add/.test(input)){
let amt=parseAmount(input);
if(!amt){speak("Say amount");return;}

addTransaction(amt,"Deposited");
speak("Deposited "+amt);
return;
}

speak("Command not recognized");
}

/* BUTTONS */
function manualSend(){
let amt=prompt("Enter amount");
if(!amt) return;
respond("send "+amt);
}

function manualDeposit(){
let amt=prompt("Enter amount");
if(!amt) return;
respond("deposit "+amt);
}

function checkBalance(){
speak("Your balance is "+balance);
}

function toggleHistory(){
let p=document.getElementById("historyPanel");
p.style.display=p.style.display==="block"?"none":"block";
}

function resetAccount(){
balance=5000;
transactions=[];
save();
updateUI();
speak("Account reset");
}