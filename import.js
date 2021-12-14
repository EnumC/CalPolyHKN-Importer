const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require('./serviceAccountKey.json');
const CSVFILEPATH = 'memberlist.csv';
const PLANDOCID = "kcMGkvA2vr5MsHa1YRGH";

async function upload(newList) {
    const db = getFirestore();

    const docRef = db.collection('plans').doc(PLANDOCID);

    await docRef.update({
        allowList: newList,
        // allowList: ["hi", "hi2"],
        lastAllowListUpdate: FieldValue.serverTimestamp()
    });
}

const csv=require('csvtojson')
csv({
    delimiter:',',
    noheader:true,
	trim:true,
    flatKeys:true,
    ignoreEmpty:true
}).fromFile(CSVFILEPATH)
    .then((jsonObj)=>{
        let memberEmail = [];
        jsonObj.forEach(function(memberElm) {
            let memberEmailRaw = memberElm.field1 || memberElm.field2;
            memberEmailRaw = memberEmailRaw.toLowerCase();
            
            memberEmail.indexOf(memberEmailRaw) === -1 ? memberEmail.push(memberEmailRaw) : console.warn("Duplicate email", memberEmailRaw);
        });
        console.log(memberEmail);
        upload(memberEmail).then("Upload completed.");
	/**
	 * [
	 * 	{a:"1", b:"2", c:"3"},
	 * 	{a:"4", b:"5". c:"6"}
	 * ]
	 */ 
})

initializeApp({
  credential: cert(serviceAccount)
});





