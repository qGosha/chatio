const functions = require('firebase-functions-test');
const admin = require('firebase-admin');

const projectId = process.env.FIREBASE_PROJECT_ID;

const testEnv = functions(
  {
    databaseURL: `https://${projectId}.firebaseio.com`,
    projectId: projectId,
  },
  './service-account.json'
);

const {
  incrementTotalFlagsGiven,
  getLastOrderDate,
  getTotalSentScreeningRequests,
  getTotalSentScreeningRequestsApproved,
  getTotalFollowing,
  getTotalFlagsReceived,
  getFilmFlagsForUser
} = require('./index');

describe('incrementTotalFlagsGiven', () => {
  let user_id;
  let wrapped;
  // Applies only to tests in this describe block
  beforeAll(() => {
    require('../utils/initFirebaseAdmin')();
    wrapped = testEnv.wrap(incrementTotalFlagsGiven);
  });

  afterEach(() => {
    // testEnv.cleanup();
    // Reset the database.
    if (!user_id) return;

    return admin // eslint-disable-line consistent-return
      .firestore()
      .collection('users')
      .doc(String(user_id))
      .delete();
  });

  test('increments users flags_given count', async () => {
    // create user
    user_id = Date.now();

    const user = await admin
      .firestore()
      .doc(`users/${user_id}`)
      .set({
        flags: {
          flags_given: 0,
        },
      });

    // mock flag create part
    // 1. define doc path and snapshot data
    const docPath = 'flags/123';
    const data = { user_id };

    // 2. create a Firestore snapshot
    const snap = testEnv.firestore.makeDocumentSnapshot(data, docPath);

    // 3. execute it
    await wrapped(snap);

    // check user data after update
    const after = await admin
      .firestore()
      .doc(`users/${user_id}`)
      .get();

    expect(after.data().flags.flags_given).toBe(1);

    return;
  }, 30000);
});


describe('getLastOrderDate', () => {

  let user_id = (Math.random() * 10).toFixed(5);

    const order1 = {
      id: (Math.random() * 10).toFixed(5),
      created_at: new Date(0),
      user_id
    }

    const order2 = {
      id: (Math.random() * 10).toFixed(5),
      created_at: new Date(10000),
      user_id
    }

    const order3 = {
      id: (Math.random() * 10).toFixed(5),
      created_at: new Date(1000000),
      user_id
    }

  let wrapped;
  // Applies only to tests in this describe block
  beforeAll(() => {
    wrapped = testEnv.wrap(getLastOrderDate);
  });

  afterEach( async() => {

    try {
      await Promise.all([
        admin.firestore().collection('orders').doc(`${order1.id}`).delete(),
        admin.firestore().collection('orders').doc(`${order2.id}`).delete(),
        admin.firestore().collection('orders').doc(`${order3.id}`).delete()
      ])
      return true;
    } catch(e) {
      return e;
    }
  });

  test('returns correct order date', async () => {
    await Promise.all([
       admin.firestore().collection('orders').doc(`${order1.id}`).set(order1),
       admin.firestore().collection('orders').doc(`${order2.id}`).set(order2),
       admin.firestore().collection('orders').doc(`${order3.id}`).set(order3)
    ])
        const data = { user_id };
        const snap = testEnv.firestore.makeDocumentSnapshot(data);
        const result = await wrapped(snap);

        expect(result).toMatchObject(order3.created_at);
        return;
  });

});


describe('getTotalSentScreeningRequests', () => {

  let user_id1 = (Math.random() * 10).toFixed(5);
  let user_id2 = (Math.random() * 10).toFixed(5);

    const sreening_request1 = {
      id: (Math.random() * 10).toFixed(5),
      user_id: user_id1
    }

    const sreening_request2 = {
      id: (Math.random() * 10).toFixed(5),
      user_id: user_id1
    }

    const sreening_request3 = {
      id: (Math.random() * 10).toFixed(5),
      user_id: user_id2
    }

  let wrapped;
  // Applies only to tests in this describe block
  beforeAll(() => {
    wrapped = testEnv.wrap(getTotalSentScreeningRequests);
  });

  afterEach( async() => {
    try {
      await Promise.all([
         admin.firestore().collection('sreening_requests').doc(`${sreening_request1.id}`).delete(),
         admin.firestore().collection('sreening_requests').doc(`${sreening_request2.id}`).delete(),
         admin.firestore().collection('sreening_requests').doc(`${sreening_request3.id}`).delete()
      ])
      return true;
    } catch(e) {
      return e;
    }
  });

  test('returns sum of all sent requests for a user' , async () => {
    await Promise.all([
       admin.firestore().collection('sreening_requests').doc(`${sreening_request1.id}`).set(sreening_request1),
       admin.firestore().collection('sreening_requests').doc(`${sreening_request2.id}`).set(sreening_request2),
       admin.firestore().collection('sreening_requests').doc(`${sreening_request3.id}`).set(sreening_request3)
    ])
        const data = { user_id: user_id1 };
        const snap = testEnv.firestore.makeDocumentSnapshot(data);
        const result = await wrapped(snap);

        expect(result).toBe(2);
        return;
  });

});


describe('getTotalSentScreeningRequestsApproved', () => {

  let user_id1 = (Math.random() * 10).toFixed(5);
  let user_id2 = (Math.random() * 10).toFixed(5);

    const sreening_request1 = {
      id: (Math.random() * 10).toFixed(5),
      user_id: user_id1,
      status: 'pending'
    }

    const sreening_request2 = {
      id: (Math.random() * 10).toFixed(5),
      user_id: user_id1,
      status: 'approved'
    }

    const sreening_request3 = {
      id: (Math.random() * 10).toFixed(5),
      user_id: user_id2,
      status: 'pending'
    }

  let wrapped;
  // Applies only to tests in this describe block
  beforeAll(() => {
    wrapped = testEnv.wrap(getTotalSentScreeningRequestsApproved);
  });

  afterEach( async() => {
    try {
      await Promise.all([
         admin.firestore().collection('sreening_requests').doc(`${sreening_request1.id}`).delete(),
         admin.firestore().collection('sreening_requests').doc(`${sreening_request2.id}`).delete(),
         admin.firestore().collection('sreening_requests').doc(`${sreening_request3.id}`).delete()
      ])
      return true;
    } catch(e) {
      return e;
    }
  });

  test('returns sum of all sent requests for a user with approved status' , async () => {
    await Promise.all([
       admin.firestore().collection('sreening_requests').doc(`${sreening_request1.id}`).set(sreening_request1),
       admin.firestore().collection('sreening_requests').doc(`${sreening_request2.id}`).set(sreening_request2),
       admin.firestore().collection('sreening_requests').doc(`${sreening_request3.id}`).set(sreening_request3)
    ])
        const data = { user_id: user_id1 };
        const snap = testEnv.firestore.makeDocumentSnapshot(data);
        const result = await wrapped(snap);

        expect(result).toBe(1);
        return;
  });

});


describe('getTotalFollowing', () => {

  let user_id1 = (Math.random() * 10).toFixed(5);
  let user_id2 = (Math.random() * 10).toFixed(5);

    const follower1 = {
      id: (Math.random() * 10).toFixed(5),
      followerId: user_id1,
      followedId: (Math.random() * 10).toFixed(5)
    }

    const follower2 = {
      id: (Math.random() * 10).toFixed(5),
      followerId: user_id1,
      followedId: (Math.random() * 10).toFixed(5)
    }

    const follower3 = {
      id: (Math.random() * 10).toFixed(5),
      followerId: user_id2,
      followedId: (Math.random() * 10).toFixed(5)
    }

  let wrapped;
  // Applies only to tests in this describe block
  beforeAll(() => {
    wrapped = testEnv.wrap(getTotalFollowing);
  });

  afterEach( async() => {
    try {
      await Promise.all([
         admin.firestore().collection('followers').doc(`${follower1.id}`).delete(),
         admin.firestore().collection('followers').doc(`${follower2.id}`).delete(),
         admin.firestore().collection('followers').doc(`${follower3.id}`).delete()
      ])
      return true;
    } catch(e) {
      return e;
    }
  });

  test('returns total number of users this user is following' , async () => {
    await Promise.all([
       admin.firestore().collection('followers').doc(`${follower1.id}`).set(follower1),
       admin.firestore().collection('followers').doc(`${follower2.id}`).set(follower2),
       admin.firestore().collection('followers').doc(`${follower3.id}`).set(follower3)
    ])
        const data = { user_id: user_id1 };
        const snap = testEnv.firestore.makeDocumentSnapshot(data);
        const result = await wrapped(snap);

        expect(result).toBe(2);
        return;
  });

});

describe('getTotalFlagsReceived', () => {

  const user_id1 = (Math.random() * 10).toFixed(5);
  const user_id2 = (Math.random() * 10).toFixed(5);

    const film1 = {
      id: (Math.random() * 10).toFixed(5),
      user_id: user_id1
    }

    const film2 = {
      id: (Math.random() * 10).toFixed(5),
      user_id: user_id1
    }

    const film3 = {
      id: (Math.random() * 10).toFixed(5),
      user_id: user_id2
    }

    const flag1 = {
      id: (Math.random() * 10).toFixed(5),
      user_id: (Math.random() * 10).toFixed(5),
      item_id: user_id1
    }

    const flag2 = {
      id: (Math.random() * 10).toFixed(5),
      user_id: (Math.random() * 10).toFixed(5),
      item_id: film1.id
    }

    const flag3 = {
      id: (Math.random() * 10).toFixed(5),
      user_id: (Math.random() * 10).toFixed(5),
      item_id: film3.id
    }

  let wrapped;
  // Applies only to tests in this describe block
  beforeAll(() => {
    wrapped = testEnv.wrap(getTotalFlagsReceived);
  });

  afterEach( async() => {
    try {
      await Promise.all([
         admin.firestore().collection('films').doc(`${film1.id}`).delete(),
         admin.firestore().collection('films').doc(`${film2.id}`).delete(),
         admin.firestore().collection('films').doc(`${film3.id}`).delete(),
         admin.firestore().collection('flags').doc(`${flag1.id}`).delete(),
         admin.firestore().collection('flags').doc(`${flag2.id}`).delete(),
         admin.firestore().collection('flags').doc(`${flag3.id}`).delete()
      ])

      return true;
    } catch(e) {
      return e;
    }
  });

  test('returns total number of the user flags and his films flags' , async () => {
    await Promise.all([
       admin.firestore().collection('films').doc(`${film1.id}`).set(film1),
       admin.firestore().collection('films').doc(`${film2.id}`).set(film2),
       admin.firestore().collection('films').doc(`${film3.id}`).set(film3),
       admin.firestore().collection('flags').doc(`${flag1.id}`).set(flag1),
       admin.firestore().collection('flags').doc(`${flag2.id}`).set(flag2),
       admin.firestore().collection('flags').doc(`${flag3.id}`).set(flag3)
    ])

        const data = { user_id: user_id1 };
        const snap = testEnv.firestore.makeDocumentSnapshot(data);
        const result = await wrapped(snap);

        expect(result).toBe(2);
        return;
  });

});



describe('getFilmFlagsForUser', () => {

  const item_id = (Math.random() * 10).toFixed(5);

    const flag1 = {
      id: (Math.random() * 10).toFixed(5),
      item_id: item_id,
      type: 'film'
    }

    const flag2 = {
      id: (Math.random() * 10).toFixed(5),
      item_id: (Math.random() * 10).toFixed(5),
      type: 'film'
    }

    const flag3 = {
      id: (Math.random() * 10).toFixed(5),
      item_id: (Math.random() * 10).toFixed(5),
      type: 'user'
    }

  let wrapped;

  beforeAll(() => {
    wrapped = testEnv.wrap(getFilmFlagsForUser);
  });

  afterEach( async() => {
    testEnv.cleanup();
    try {
      await Promise.all([
         admin.firestore().collection('flags').doc(`${flag1.id}`).delete(),
         admin.firestore().collection('flags').doc(`${flag2.id}`).delete(),
         admin.firestore().collection('flags').doc(`${flag3.id}`).delete()
      ])
      return true;
    } catch(e) {
      return e;
    }
  });

  test('returns a user film flags' , async () => {
    await Promise.all([
       admin.firestore().collection('flags').doc(`${flag1.id}`).set(flag1),
       admin.firestore().collection('flags').doc(`${flag2.id}`).set(flag2),
       admin.firestore().collection('flags').doc(`${flag3.id}`).set(flag3)
    ])
        const data = { item_id };
        const snap = testEnv.firestore.makeDocumentSnapshot(data);
        const result = await wrapped(snap);

        expect(result).toEqual([flag1.id]);
        return;
  });

});
