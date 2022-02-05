import firebase from 'firebase/app';
import 'firebase/storage';
import { upload } from './upload.js';

const firebaseConfig = {
  apiKey: 'AIzaSyB_EqZYglECVFwjxbErLUpf9MKaYtWmUzU',
  authDomain: 'frontend-upload-bc8bc.firebaseapp.com',
  projectId: 'frontend-upload-bc8bc',
  storageBucket: 'frontend-upload-bc8bc.appspot.com',
  messagingSenderId: '284770233336',
  appId: '1:284770233336:web:e28588a170746ddb2b040d',
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

upload('#file', {
  multi: true,
  accept: ['.png', '.jpg', '.jpeg', '.gif'],
  onUpload(files) {
    console.log('Files:', files);
  },
});
