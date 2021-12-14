const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, FieldPath } = require('firebase-admin/firestore');
const admin = require("firebase-admin");

const serviceAccount = require('./serviceAccountKey.json');


initializeApp({
  credential: cert(serviceAccount)
});

const getDoc = (docPath) => {
    const docRef = admin.firestore().doc(docPath);
    return docRef.get().then((docSnapshot) => {
      if (docSnapshot.exists) {
        return docSnapshot;
      } else {
        throw new Error("The document " + docPath + " does not exist");
      }
    });
  };

const isInAllowList = (planID, accountID) => {
    return Promise.all([
      getDoc("accounts/" + accountID),
      getDoc("plans/" + planID),
    ])
      .then(([accountDoc, planDoc]) => {
        let account = accountDoc.data().name;
        if (typeof planDoc.data().allowList === "undefined") {
          console.log(
            "[No allowList info found. Default to ALLOW] " + planID,
            account
          );
          return true;
        }
        // else if (planDoc.data().allowList.indexOf(account) === -1) {
        //     //
        // }
        else {
          // found allowList for document.
          return admin
            .firestore()
            .collection("plans")
            .where(FieldPath.documentId(), '==', planID)
            .where("allowList", "array-contains", account)
            .get()
            .then((snapshot) => {
              if (snapshot.empty) {
                console.log("[Not in allowList. DENY] " + planID, account);
                return false;
              } else {
                snapshot.forEach((account) => {
                    console.log("account: ", account);
                    
                });
                console.log("[In allowList. ALLOW] " + planID, account);
                return true;
              }
            });
        }
      })
      .then((res) => {
          console.log(res);
        return res;
      });
  };

isInAllowList("ONUp2NfoRpr4nArNnATH", "s67lkPPOOosDTHWrwB26");
