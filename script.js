const a1 = new simpleNN(1);
a1.add(16, 'relu');
a1.add(10, 'linear');

const a2 = new simpleNN(1);
a2.add(16, 'relu');
a2.add(2, 'linear');

let gamma = 0.9;
let epsilon = 0.1;

function actionC(x) {
    if(epsilon > Math.random()) {
        return Math.floor(Math.random() * x.length)
    } else {
        let max = Math.max(...x);
        let id = x.indexOf(max);
        return id;
    }
}

function train() {
    let state1 = [1];
    let deci = a1.predict(state1);
    let money = actionC(deci) + 1;
    let offer = money / 10;

    let state2 = [offer];
    let ac2 = a2.predict(state2);
    let action = actionC(ac2);
    
    let rA;
    let rB; 
    if(action == 1) {
        if((1 - offer) > 0.5) {
            rA = (1 - offer)+0.3;
        } else {
            rA = 1 - offer;
        }
        if((offer - 0.3) > 0.2) {
            rB = (offer - 0.3) + 0.5;
        } else {
            rB = offer - 0.3
        }
    } else {
        rA = -0.2;
        rB = 0;
    }

    let nextstate1 = [1];

    let next1 = a1.predict(nextstate1);
    let next2 = a2.predict([offer]);

    let target1 = deci.slice();
    let target2 = ac2.slice();

    target1[money-1] = rA + gamma * Math.max(...next1);
    target2[action] = rB + gamma * Math.max(...next2);

    a1.train(state1, target1);
    a2.train(state2, target2);

    epsilon = Math.max(0.05, epsilon * 0.9995);
    return {money, money2: 10 - money, action}
}

function step(){
  for(let i=0;i<20;i++) train(); // fast training

  let data = train(); // one visible step

  document.getElementById("money").innerHTML = data.money;
  document.getElementById("money2").innerText = data.money2;
  document.getElementById("action").innerText = data.action == 1 ? "accepted" : "rejected";
  document.getElementById("logs").innerHTML += ` ₹${data.money2} ⇄ ₹${data.money} ${data.action == 1 ? "✅" : "❌"} <br>`
}

setInterval(step, 100);