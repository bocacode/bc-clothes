const admin = require('firebase-admin')
const creds = require('./credentials.json')

admin.initializeApp({
  credential: admin.credential.cert(creds)
})

const db = admin.firestore()
const clothesRef = db.collection('clothes')
const handleErr = (err) => console.error(err)
const remapDoc = (doc) => {
  let item = doc.data()
  item.id = doc.id
  return item
}

function createClothes() {
  const newClothes = {
    sku: 'SBGU09',
    type: 'shirt',
    style: 'blouse',
    brand: 'Guess',
    color: 'white',
    graphic: false,
    price: 79.99,
    sizes: ['XS', 'S', 'M', 'XL']
  }
  
  clothesRef.add(newClothes)
    .then(docRef => {
      console.log(docRef.id)
    })
    .catch(handleErr)
}

// delete 'STRM04'

// clothesRef.doc('STRM04').delete()
//   .then(() => {
//     clothesRef.get()
//       .then(collection => {
//         let clothes = []
//         collection.docs.forEach(doc => clothes.push(doc.data()))
//         console.log(clothes)
//       })
//   })
//   .catch(handleErr)

// clothesRef.where('price', '>', 9.99).get()
//   .then(collection => {
//     const clothes = collection.docs.map(remapDoc)
//     console.log(clothes)
//   })
//   .catch(handleErr)


// Get all shirts where price < 30
clothesRef
  // .where('type', '==', 'shirt')
  .where('price', '<', 30)
  .get()
  .then(collection => {
    collection.docs.forEach(doc => {
      console.log('Updating price on', doc.id)
      // update price = price * 1.25
      const oldPrice = doc.data().price
      const newPrice = oldPrice * 1.25

      clothesRef.doc(doc.id)
        .update({ price: newPrice, updated: true })
        .then(() => console.log('Updated!'))

    })
  })
  .catch(handleErr)