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
console.log(storage);

upload('#file', {
  multi: true,
  accept: ['.png', '.jpg', '.jpeg', '.gif'],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      // создаем ref для конкретно загружаемого файла
      const ref = storage.ref(`images/${file.name}`);
      // Сохранение ref на бэк
      const task = ref.put(file);

      // Прослушиваем процесс загрузки файла
      task.on(
        'state_changed',
        (snapshot) => {
          const percentage =
            ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(
              0,
            ) + '%';
          const block = blocks[index].querySelector('.preview-info-progress');
          block.textContent = percentage;
          block.style.width = percentage;
        },
        (error) => {
          console.log(error);
        },
        // Вызывается, когда загрузка была завершена
        () => {
          // получить ссылку на конкретную картинку
          task.snapshot.ref.getDownloadURL().then((url) => {
            console.log('Download URL', url);
          });
          console.log('Complete');
        },
      );
    });
  },
});
